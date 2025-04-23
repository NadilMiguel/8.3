import React, { useState, useCallback } from 'react';
import { X, Upload, Check, ArrowRight, ArrowLeft, Scan } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createTable } from '../../services/api';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataImport: (data: Array<{ upc: string; price: string }>) => void;
}

interface ColumnMapping {
  [key: string]: string;
}

interface TableInfo {
  title: string;
  description: string;
}

export function ExcelUploadModal({ isOpen, onClose, onDataImport }: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [step, setStep] = useState<'upload' | 'mapping' | 'tableInfo'>('upload');
  const [tableInfo, setTableInfo] = useState<TableInfo>({ title: '', description: '' });
  const [formattedData, setFormattedData] = useState<Array<{ upc: string; price: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<any>(null);

  const requiredFields = [
    { key: 'upc', label: 'UPC' },
    { key: 'price', label: 'Price' }
  ];

  const resetForm = () => {
    setFile(null);
    setColumns([]);
    setPreviewData([]);
    setMapping({});
    setTableInfo({ title: '', description: '' });
    setFormattedData([]);
    setScanResult(null);
    setStep('upload');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      setPreviewData(jsonData.slice(0, 10));
      
      const headers = Object.keys(jsonData[0] || {});
      setColumns(headers);
      
      setStep('mapping');
    };
    
    reader.readAsArrayBuffer(file);
  }, []);

  const handleMapping = (field: string, column: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: column
    }));
  };

  const handleTableInfoChange = (field: keyof TableInfo, value: string) => {
    setTableInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToTableInfo = async () => {
    if (!file || !mapping.upc || !mapping.price) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const data_formatted = jsonData.map(row => ({
        upc: row[mapping.upc]?.toString() || "000000000000",
        price: row[mapping.price]?.toString() || "000000000000"
      }));

      setFormattedData(data_formatted);
      setStep('tableInfo');
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleStartScanner = async () => {
    if (formattedData.length === 0 || !tableInfo.title) return;

    try {
      setIsLoading(true);
      
      const finalData = {
        title: tableInfo.title,
        description: tableInfo.description,
        table: formattedData
      };

      const response = await createTable(finalData);
      setScanResult(response?.data);
      onDataImport(formattedData);
      handleClose();
    } catch (error) {
      console.error('Error sending data to API:', error);
      alert('Error sending data to API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg shadow-xl bg-white">
          <div className="flex justify-between items-center p-6 border-b border-amazon-orange/20">
            <div className="flex items-center gap-3">
              {step !== 'upload' && (
                <button
                  onClick={() => setStep(step === 'tableInfo' ? 'mapping' : 'upload')}
                  className="p-2 rounded-full hover:bg-amazon-orange/10 text-amazon-brown"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="text-xl font-semibold text-amazon-brown">
                {step === 'upload' ? 'Upload Excel File' : 
                 step === 'mapping' ? 'Map Columns' : 
                 'Table Information'}
              </h2>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-amazon-orange/10 text-amazon-brown"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-auto">
            {step === 'upload' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 border-amazon-orange/50 bg-amazon-orange/5">
                  <div className="flex flex-col items-center">
                    <Upload size={48} className="text-amazon-orange" />
                    <p className="text-sm mb-2 text-amazon-brown">
                      Drag and drop your Excel file here, or click to select
                    </p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-amazon-brown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amazon-orange file:text-white hover:file:bg-amazon-orangeLight"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 'mapping' && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-walmart-blue/10 border border-walmart-blue/20">
                  <h3 className="font-semibold mb-2 text-walmart-blue">
                    Column Mapping
                  </h3>
                  <p className="text-sm text-amazon-brown">
                    Select which columns from your Excel file correspond to the required fields.
                    Preview your data below to ensure correct mapping.
                  </p>
                </div>

                <div className="space-y-4">
                  {requiredFields.map(field => (
                    <div key={field.key} className="flex items-center gap-4">
                      <label className="w-24 font-medium text-amazon-brown">
                        {field.label}:
                      </label>
                      <select
                        value={mapping[field.key] || ''}
                        onChange={(e) => handleMapping(field.key, e.target.value)}
                        className="flex-1 rounded-md px-3 py-2 border border-amazon-orange/30 bg-white text-amazon-brown focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                      >
                        <option value="">Select column...</option>
                        {columns.map((column, index) => (
                          <option key={index} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                      {mapping[field.key] && (
                        <Check size={20} className="text-amazon-orange" />
                      )}
                    </div>
                  ))}
                </div>

                {previewData.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-amazon-brown">
                      Data Preview (First 10 Rows)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-walmart-blue/10">
                          <tr>
                            {columns.map((column, index) => (
                              <th
                                key={index}
                                className={`
                                  px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                                  text-walmart-blue
                                  ${Object.values(mapping).includes(column) 
                                    ? 'bg-walmart-blue/20' 
                                    : ''}
                                `}
                              >
                                {column}
                                {Object.entries(mapping).find(([_, val]) => val === column)?.[0] && (
                                  <span className="ml-2 text-amazon-orange">
                                    (Selected)
                                  </span>
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {columns.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  className={`
                                    px-6 py-4 whitespace-nowrap text-sm
                                    text-amazon-brown
                                    ${Object.values(mapping).includes(column) 
                                      ? 'bg-amazon-orange/5' 
                                      : ''}
                                  `}
                                >
                                  {row[column]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'tableInfo' && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-walmart-blue/10 border border-walmart-blue/20">
                  <h3 className="font-semibold mb-2 text-walmart-blue">
                    Table Information
                  </h3>
                  <p className="text-sm text-amazon-brown">
                    Please provide a title and description for your table.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-amazon-brown mb-2">
                      Table Title:
                    </label>
                    <input
                      type="text"
                      value={tableInfo.title}
                      onChange={(e) => handleTableInfoChange('title', e.target.value)}
                      placeholder="Enter a title for your table"
                      className="w-full rounded-md px-3 py-2 border border-amazon-orange/30 bg-white text-amazon-brown placeholder-amazon-brown/50 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium text-amazon-brown mb-2">
                      Description:
                    </label>
                    <textarea
                      value={tableInfo.description}
                      onChange={(e) => handleTableInfoChange('description', e.target.value)}
                      placeholder="Enter a description for your table"
                      rows={4}
                      className="w-full rounded-md px-3 py-2 border border-amazon-orange/30 bg-white text-amazon-brown placeholder-amazon-brown/50 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amazon-orange/10 border border-amazon-orange/20">
                  <h3 className="font-semibold mb-2 text-amazon-orange">
                    Data Summary
                  </h3>
                  <p className="text-sm text-amazon-brown mb-2">
                    Your file contains <span className="font-semibold">{formattedData.length}</span> records.
                  </p>
                  <p className="text-sm text-amazon-brown">
                    Click "Start Scanner" to process your data and retrieve detailed product information.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-amazon-orange/20">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-amazon-orange text-amazon-orange hover:bg-amazon-orange/10"
            >
              Cancel
            </button>
            
            {step === 'mapping' && (
              <button
                onClick={handleProceedToTableInfo}
                disabled={Object.keys(mapping).length < requiredFields.length}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-walmart-blue hover:bg-walmart-blueLight text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
            
            {step === 'tableInfo' && (
              <button
                onClick={handleStartScanner}
                disabled={!tableInfo.title || isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-orange hover:bg-amazon-orangeLight text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Scan size={18} />
                    Start Scanner
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}