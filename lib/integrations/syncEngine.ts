import { QuickBooksConnector } from './connectors/quickbooks';
import { BaseConnector, SyncResult } from './connectors/base';
import Integration from '@/models/Integration';
import Transaction from '@/models/Transaction';
import AccountingRule from '@/models/AccountingRule';

export class SyncEngine {
  private connectors: Map<string, BaseConnector> = new Map();

  constructor() {
    this.registerConnectors();
  }

  private registerConnectors() {
    this.connectors.set('quickbooks', new QuickBooksConnector());
    // Add more connectors here
  }

  async syncIntegration(integrationId: string): Promise<SyncResult> {
    const integration = await Integration.findById(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const connector = this.connectors.get(integration.provider);
    if (!connector) {
      throw new Error(`Connector not found for provider: ${integration.provider}`);
    }

    try {
      // Update sync status
      integration.status = 'syncing';
      await integration.save();

      // Connect to the service
      await connector.connect(integration.config);

      // Fetch data
      const data = await connector.fetchData({
        dataType: 'transactions',
        startDate: integration.dataSync.lastSyncAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      });

      // Transform data
      const transformed = connector.transformData(data, integration.fieldMappings);

      // Apply accounting rules
      const processedData = await this.applyAccountingRules(transformed, integration.organization);

      // Save to database
      const savedCount = await this.saveTransactions(processedData, integration);

      // Update sync metadata
      integration.dataSync.lastSyncAt = new Date();
      integration.dataSync.nextSyncAt = this.calculateNextSyncTime(integration.dataSync.syncFrequency);
      integration.dataSync.recordsProcessed += savedCount;
      integration.status = 'connected';
      await integration.save();

      return {
        success: true,
        recordsProcessed: savedCount,
        recordsFailed: 0
      };
    } catch (error: any) {
      integration.status = 'error';
      integration.dataSync.syncStatus = 'error';
      integration.dataSync.errorMessage = error.message;
      await integration.save();

      return {
        success: false,
        recordsProcessed: 0,
        recordsFailed: 0,
        errors: [error.message]
      };
    }
  }

  private async applyAccountingRules(data: any[], organization: string): Promise<any[]> {
    const rules = await AccountingRule.find({
      organization,
      isActive: true
    }).sort({ priority: -1 });

    return data.map(record => {
      const appliedRules: string[] = [];

      for (const rule of rules) {
        if (this.evaluateConditions(record, rule.conditions)) {
          record = this.applyActions(record, rule.actions);
          appliedRules.push(rule._id.toString());

          // Update rule usage count
          rule.appliedCount++;
          rule.lastAppliedAt = new Date();
          rule.save();
        }
      }

      record.appliedRules = appliedRules;
      return record;
    });
  }

  private evaluateConditions(record: any, conditions: any[]): boolean {
    if (!conditions || conditions.length === 0) return true;

    let result = true;
    let currentOperator = 'AND';

    for (const condition of conditions) {
      const fieldValue = this.getFieldValue(record, condition.field);
      const conditionMet = this.evaluateCondition(fieldValue, condition.operator, condition.value);

      if (currentOperator === 'AND') {
        result = result && conditionMet;
      } else {
        result = result || conditionMet;
      }

      currentOperator = condition.logicalOperator || 'AND';
    }

    return result;
  }

  private evaluateCondition(fieldValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'notEquals':
        return fieldValue !== conditionValue;
      case 'contains':
        return String(fieldValue).includes(String(conditionValue));
      case 'startsWith':
        return String(fieldValue).startsWith(String(conditionValue));
      case 'endsWith':
        return String(fieldValue).endsWith(String(conditionValue));
      case 'greaterThan':
        return Number(fieldValue) > Number(conditionValue);
      case 'lessThan':
        return Number(fieldValue) < Number(conditionValue);
      default:
        return false;
    }
  }

  private applyActions(record: any, actions: any[]): any {
    const result = { ...record };

    for (const action of actions) {
      switch (action.type) {
        case 'categorize':
          result[action.targetField] = action.targetValue;
          break;
        case 'tag':
          if (!result.tags) result.tags = [];
          result.tags.push(action.targetValue);
          break;
        case 'allocate':
          result.allocations = action.allocationRules;
          break;
        case 'transform':
          if (action.formula) {
            try {
              result[action.targetField] = eval(action.formula.replace(/\{(\w+)\}/g, (_: string, field: string) => result[field]));
            } catch (error) {
              console.error('Formula evaluation error:', error);
            }
          }
          break;
        case 'reject':
          result._rejected = true;
          result._rejectionReason = action.targetValue;
          break;
      }
    }

    return result;
  }

  private getFieldValue(record: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], record);
  }

  private async saveTransactions(data: any[], integration: any): Promise<number> {
    let savedCount = 0;

    for (const record of data) {
      if (record._rejected) continue;

      try {
        await Transaction.findOneAndUpdate(
          {
            transactionId: record.id || record.transactionId,
            organization: integration.organization
          },
          {
            ...record,
            organization: integration.organization,
            entityId: integration.entityId || 'default',
            sourceIntegration: integration._id,
            updatedAt: new Date()
          },
          {
            upsert: true,
            new: true
          }
        );
        savedCount++;
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    }

    return savedCount;
  }

  private calculateNextSyncTime(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'realtime':
        return new Date(now.getTime() + 60 * 1000); // 1 minute
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}