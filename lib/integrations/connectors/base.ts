export interface IConnector {
  name: string;
  type: string;
  provider: string;

  connect(config: any): Promise<boolean>;
  disconnect(): Promise<void>;
  testConnection(): Promise<boolean>;
  fetchData(params: any): Promise<any[]>;
  transformData(data: any[], mappings: any[]): any[];
  syncData(params: any): Promise<SyncResult>;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsFailed: number;
  errors?: string[];
  nextSyncToken?: string;
}

export abstract class BaseConnector implements IConnector {
  name: string;
  type: string;
  provider: string;
  protected config: any;
  protected isConnected: boolean = false;

  constructor(name: string, type: string, provider: string) {
    this.name = name;
    this.type = type;
    this.provider = provider;
  }

  abstract connect(config: any): Promise<boolean>;
  abstract disconnect(): Promise<void>;
  abstract testConnection(): Promise<boolean>;
  abstract fetchData(params: any): Promise<any[]>;

  transformData(data: any[], mappings: any[]): any[] {
    return data.map(record => {
      const transformed: any = {};

      mappings.forEach(mapping => {
        let value = this.getNestedValue(record, mapping.sourceField);

        if (mapping.transformation) {
          value = this.applyTransformation(value, mapping.transformation);
        }

        if (value === undefined && mapping.defaultValue !== undefined) {
          value = mapping.defaultValue;
        }

        this.setNestedValue(transformed, mapping.targetField, value);
      });

      return transformed;
    });
  }

  async syncData(params: any): Promise<SyncResult> {
    try {
      const data = await this.fetchData(params);
      const transformed = this.transformData(data, params.mappings || []);

      return {
        success: true,
        recordsProcessed: transformed.length,
        recordsFailed: 0
      };
    } catch (error: any) {
      return {
        success: false,
        recordsProcessed: 0,
        recordsFailed: 0,
        errors: [error.message]
      };
    }
  }

  protected getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  protected setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  protected applyTransformation(value: any, transformation: string): any {
    switch (transformation) {
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      case 'date':
        return new Date(value);
      case 'currency':
        return Math.round(Number(value) * 100) / 100;
      default:
        // Custom formula evaluation
        try {
          return eval(transformation.replace(/value/g, JSON.stringify(value)));
        } catch {
          return value;
        }
    }
  }
}