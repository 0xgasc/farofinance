'use client';

import { useState, useRef, useCallback, DragEvent } from 'react';
import { X, Upload, Download, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';

type ImportType = 'budgets' | 'metrics' | 'revenue' | 'hiring';

const TEMPLATES: Record<ImportType, { headers: string[]; example: string[][]; description: string }> = {
  budgets: {
    headers: ['category', 'subcategory', 'planned', 'actual', 'period'],
    example: [
      ['Engineering', 'Salaries', '350000', '325000', 'Q1 2024'],
      ['Marketing', 'Advertising', '50000', '58000', 'Q1 2024'],
      ['Sales', 'Commissions', '75000', '82000', 'Q1 2024'],
    ],
    description: 'Budget line items with planned vs actual spend by category and period.',
  },
  metrics: {
    headers: ['name', 'category', 'value', 'target', 'unit'],
    example: [
      ['Monthly Recurring Revenue', 'revenue', '125000', '150000', '$'],
      ['Customer Acquisition Cost', 'efficiency', '2500', '2000', '$'],
      ['Net Promoter Score', 'customer', '72', '80', ''],
    ],
    description: 'KPIs and business metrics with optional targets.',
  },
  revenue: {
    headers: ['period', 'customer', 'amount', 'type', 'product'],
    example: [
      ['2024-01', 'Acme Corp', '5000', 'new', 'Starter Plan'],
      ['2024-01', 'Beta Inc', '12000', 'expansion', 'Growth Plan'],
      ['2024-02', 'Gamma LLC', '8500', 'new', 'Starter Plan'],
    ],
    description: 'Revenue records by customer and period. Type: new, expansion, contraction, churn.',
  },
  hiring: {
    headers: ['title', 'department', 'salary', 'benefits', 'startDate'],
    example: [
      ['Senior Engineer', 'Engineering', '180000', '36000', '2024-03-01'],
      ['Product Designer', 'Product', '140000', '28000', '2024-04-01'],
      ['Account Executive', 'Sales', '90000', '18000', '2024-02-15'],
    ],
    description: 'Headcount plan with roles, compensation, and start dates.',
  },
};

const TYPE_LABELS: Record<ImportType, string> = {
  budgets: 'Budgets',
  metrics: 'Metrics',
  revenue: 'Revenue',
  hiring: 'Hiring Plan',
};

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
  return { headers, rows };
}

function generateCSV(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map((r) => r.join(',')).join('\n');
}

function downloadFile(filename: string, content: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ImportType;
}

export default function CSVImporter({ isOpen, onClose, initialType = 'budgets' }: Props) {
  const [activeType, setActiveType] = useState<ImportType>(initialType);
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
  const [parseError, setParseError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // All hooks must be declared before any early return
  const resetFile = useCallback(() => {
    setFile(null);
    setParsed(null);
    setParseError('');
    setResult(null);
  }, []);

  const processFile = useCallback((f: File) => {
    if (!f.name.endsWith('.csv') && f.type !== 'text/csv') {
      setParseError('Please upload a .csv file.');
      return;
    }
    setFile(f);
    setParseError('');
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const p = parseCSV(text);
      if (p.rows.length === 0) {
        setParseError('File appears empty or has no data rows.');
      } else {
        setParsed(p);
      }
    };
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  if (!isOpen) return null;

  const template = TEMPLATES[activeType];

  const handleTypeChange = (t: ImportType) => {
    setActiveType(t);
    resetFile();
  };

  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeType, rows: parsed.rows }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ imported: 0, errors: [data.error || 'Import failed'] });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ imported: 0, errors: ['Network error — please try again'] });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const content = generateCSV(template.headers, template.example);
    downloadFile(`faro-${activeType}-template.csv`, content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Import Data</h2>
            <p className="text-sm text-gray-500 mt-0.5">Upload a CSV file to add your data to Faro Finance</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex border-b border-gray-100 px-6 pt-4 gap-1 overflow-x-auto">
          {(Object.keys(TEMPLATES) as ImportType[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeType === t
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Description + template download */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
            >
              <Download size={14} />
              Template
            </button>
          </div>

          {/* Success state */}
          {result?.imported && result.imported > 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Import complete!</p>
              <p className="text-gray-500 mt-1">{result.imported} rows imported successfully.</p>
              {result.errors.length > 0 && (
                <p className="text-orange-600 text-sm mt-2">{result.errors.length} row(s) had errors and were skipped.</p>
              )}
              <button
                onClick={resetFile}
                className="mt-5 text-sm text-primary hover:underline"
              >
                Import another file
              </button>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              {!parsed ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <Upload size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Drop your CSV file here</p>
                  <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
                  />
                </div>
              ) : null}

              {parseError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {parseError}
                </div>
              )}

              {/* Preview */}
              {parsed && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={15} />
                      <span className="font-medium">{file?.name}</span>
                      <span className="text-gray-400">— {parsed.rows.length} rows</span>
                    </div>
                    <button onClick={resetFile} className="text-xs text-gray-400 hover:text-gray-600">
                      Remove
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          {parsed.headers.map((h) => (
                            <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.rows.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-t border-gray-50">
                            {parsed.headers.map((h) => (
                              <td key={h} className="px-3 py-2 text-gray-700">{row[h]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsed.rows.length > 5 && (
                      <p className="text-center text-xs text-gray-400 py-2">
                        + {parsed.rows.length - 5} more rows
                      </p>
                    )}
                  </div>

                  {result?.errors && result.errors.length > 0 && result.imported === 0 && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-700 mb-1">Import failed</p>
                      {result.errors.slice(0, 3).map((e, i) => (
                        <p key={i} className="text-xs text-red-600">{e}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {parsed && !result?.imported && (
          <div className="border-t border-gray-100 p-4 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              {parsed.rows.length} row{parsed.rows.length !== 1 ? 's' : ''} ready to import
            </p>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50"
            >
              {importing ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Importing…</>
              ) : (
                <>Import {parsed.rows.length} rows <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
