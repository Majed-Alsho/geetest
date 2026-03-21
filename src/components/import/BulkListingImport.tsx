'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileSpreadsheet, Check, X, AlertCircle, 
  Download, Trash2, ChevronDown, ChevronUp, FileText,
  Building2, DollarSign, MapPin, Tag, Loader2
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CSVRow {
  id: string;
  title: string;
  category: string;
  region: string;
  location: string;
  price: number;
  revenue: number;
  description: string;
  status: 'valid' | 'invalid' | 'pending';
  errors: string[];
}

interface BulkImportProps {
  onImport: (listings: Partial<CSVRow>[]) => Promise<{ success: number; failed: number }>;
  categories: string[];
  regions: string[];
}

const REQUIRED_FIELDS = ['title', 'category', 'region', 'price'];
const SAMPLE_CSV = `title,category,region,location,price,revenue,description
"Tech Startup - SaaS Platform","Technology","North America","San Francisco, CA",500000,250000,"Fast-growing B2B SaaS company with 45% annual growth"
"E-commerce Business","E-commerce","Europe","London, UK",350000,180000,"Established online retail business with loyal customer base"
"Restaurant Chain","Food & Beverage","Asia","Tokyo, Japan",800000,450000,"Popular restaurant chain with 5 locations"`;

export function BulkListingImport({ onImport, categories, regions }: BulkImportProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const parsedRows: CSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const row: Partial<CSVRow> = { id: `row-${i}`, errors: [], status: 'pending' };
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'title':
            row.title = value;
            break;
          case 'category':
            row.category = value;
            break;
          case 'region':
            row.region = value;
            break;
          case 'location':
            row.location = value;
            break;
          case 'price':
            row.price = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
            break;
          case 'revenue':
            row.revenue = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
            break;
          case 'description':
            row.description = value;
            break;
        }
      });
      
      // Validate
      const errors: string[] = [];
      if (!row.title) errors.push('Title is required');
      if (!row.category) errors.push('Category is required');
      else if (!categories.includes(row.category)) errors.push(`Invalid category: ${row.category}`);
      if (!row.region) errors.push('Region is required');
      else if (!regions.includes(row.region)) errors.push(`Invalid region: ${row.region}`);
      if (!row.price || row.price <= 0) errors.push('Valid price is required');
      
      row.errors = errors;
      row.status = errors.length === 0 ? 'valid' : 'invalid';
      parsedRows.push(row as CSVRow);
    }
    
    return parsedRows;
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };
  
  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedRows = parseCSV(text);
      
      if (parsedRows.length === 0) {
        toast.error('No valid data found in CSV');
        return;
      }
      
      setRows(parsedRows);
      setStep('preview');
    };
    reader.readAsText(file);
  };
  
  const handleImport = async () => {
    const validRows = rows.filter(r => r.status === 'valid');
    if (validRows.length === 0) {
      toast.error('No valid rows to import');
      return;
    }
    
    setStep('importing');
    setImportProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const results = await onImport(validRows);
      clearInterval(interval);
      setImportProgress(100);
      setImportResults(results);
      setStep('complete');
    } catch (error) {
      clearInterval(interval);
      toast.error('Import failed');
      setStep('preview');
    }
  };
  
  const removeRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };
  
  const downloadSampleCSV = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const resetImport = () => {
    setStep('upload');
    setRows([]);
    setImportProgress(0);
    setImportResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Import Listings</h3>
          
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
              dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <FileSpreadsheet className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Drop your CSV file here</h4>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="btn-accent"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select CSV File
            </Button>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">CSV Format Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-secondary/30 rounded-xl">
                <p className="font-medium text-green-500 mb-2">Required Fields</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• title - Business name</li>
                  <li>• category - Business category</li>
                  <li>• region - Geographic region</li>
                  <li>• price - Asking price ($)</li>
                </ul>
              </div>
              <div className="p-3 bg-secondary/30 rounded-xl">
                <p className="font-medium text-blue-500 mb-2">Optional Fields</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• location - Specific location</li>
                  <li>• revenue - Annual revenue ($)</li>
                  <li>• description - Business description</li>
                </ul>
              </div>
            </div>
            
            <Button
              onClick={downloadSampleCSV}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample CSV Template
            </Button>
          </div>
        </GlassPanel>
      )}
      
      {step === 'preview' && (
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Preview Import</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-500">
                <Check className="w-4 h-4 inline mr-1" />
                {rows.filter(r => r.status === 'valid').length} valid
              </span>
              <span className="text-red-500">
                <X className="w-4 h-4 inline mr-1" />
                {rows.filter(r => r.status === 'invalid').length} invalid
              </span>
            </div>
          </div>
          
          {/* Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Region</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Revenue</th>
                    <th className="text-center p-3">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={row.id} className={cn(
                      row.status === 'invalid' && "bg-red-500/5"
                    )}>
                      <td className="p-3">{row.title || '-'}</td>
                      <td className="p-3">{row.category || '-'}</td>
                      <td className="p-3">{row.region || '-'}</td>
                      <td className="p-3 text-right">
                        {row.price ? `$${row.price.toLocaleString('en-US')}` : '-'}
                      </td>
                      <td className="p-3 text-right">
                        {row.revenue ? `$${row.revenue.toLocaleString('en-US')}` : '-'}
                      </td>
                      <td className="p-3 text-center">
                        {row.status === 'valid' ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="relative group">
                            <AlertCircle className="w-5 h-5 text-red-500 mx-auto cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-popover border border-border rounded-lg text-xs text-left w-48 z-10 hidden group-hover:block">
                              {row.errors.map((err, i) => (
                                <p key={i} className="text-red-500">{err}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeRow(row.id)}
                          className="p-1 hover:bg-secondary rounded"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between mt-6">
            <Button onClick={resetImport} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              className="btn-accent"
              disabled={rows.filter(r => r.status === 'valid').length === 0}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import {rows.filter(r => r.status === 'valid').length} Listings
            </Button>
          </div>
        </GlassPanel>
      )}
      
      {step === 'importing' && (
        <GlassPanel className="p-6">
          <div className="text-center py-8">
            <Loader2 className="w-16 h-16 text-accent mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-4">Importing Listings...</h3>
            <div className="w-full max-w-md mx-auto">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${importProgress}%` }}
                  className="h-full bg-accent"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{importProgress}% complete</p>
            </div>
          </div>
        </GlassPanel>
      )}
      
      {step === 'complete' && importResults && (
        <GlassPanel className="p-6">
          <div className="text-center py-8">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-4">Import Complete</h3>
            <div className="flex justify-center gap-8">
              <div>
                <p className="text-3xl font-bold text-green-500">{importResults.success}</p>
                <p className="text-sm text-muted-foreground">Successfully imported</p>
              </div>
              {importResults.failed > 0 && (
                <div>
                  <p className="text-3xl font-bold text-red-500">{importResults.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              )}
            </div>
            <Button onClick={resetImport} className="btn-accent mt-6">
              Import More Listings
            </Button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
