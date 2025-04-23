import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'xlsx' | 'csv') => void;
}

function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-amazon-brown mb-4">
              Exportar Datos
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onExport('xlsx')}
                  className="p-4 border border-amazon-orange/20 rounded-lg hover:bg-amazon-orange/5 text-center"
                >
                  <span className="block text-amazon-brown font-medium mb-2">
                    Exportar como XLSX
                  </span>
                  <span className="text-sm text-amazon-brown/60">
                    Formato Microsoft Excel
                  </span>
                </button>
                <button
                  onClick={() => onExport('csv')}
                  className="p-4 border border-amazon-orange/20 rounded-lg hover:bg-amazon-orange/5 text-center"
                >
                  <span className="block text-amazon-brown font-medium mb-2">
                    Exportar como CSV
                  </span>
                  <span className="text-sm text-amazon-brown/60">
                    Valores separados por comas
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-amazon-brown hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function useTableExport() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const exportToFile = (
    data: any[],
    columns: { key: string; label: string }[],
    format: 'xlsx' | 'csv'
  ) => {
    // Preparar solo los datos visibles y filtrados para exportar
    const exportData = data.map(row => {
      const exportRow: { [key: string]: any } = {};
      columns.forEach(col => {
        // Usar la etiqueta de la columna como encabezado
        exportRow[col.label] = row[col.key];
      });
      return exportRow;
    });

    // Crear libro y hoja de trabajo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Ajustar el ancho de las columnas
    const columnWidths = columns.map(col => ({
      wch: Math.max(
        col.label.length,
        ...exportData.map(row => String(row[col.label]).length)
      ),
    }));
    ws['!cols'] = columnWidths;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `export_${timestamp}`;

    if (format === 'xlsx') {
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
    }
  };

  return {
    ExportModal,
    isExportModalOpen,
    setIsExportModalOpen,
    exportToFile,
  };
}