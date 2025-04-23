import React, { useState, useEffect, useCallback } from 'react';
import { Search, Settings2, Filter, FileDown, Database } from 'lucide-react';
import { FilterableTable } from '../FilterableTable';
import type { Column } from '../types';
import { useTableExport } from '../TableExport';
import { useNavigate } from 'react-router-dom';

interface TableViewProps {
  products: any[];
}

const TableView = ({ products }: TableViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiData, setApiData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const navigate = useNavigate();

  const {
    ExportModal,
    isExportModalOpen,
    setIsExportModalOpen,
    exportToFile,
  } = useTableExport();

  useEffect(() => {
    if (products && products.length > 0) {
      const enrichedProducts = products.map((item) => ({
        ...item,
        ['pack of:']: Number(item['pack of:']) > 0 ? Math.floor(Number(item['pack of:'])) : 1, // Asegura un número natural positivo
      }));
      const extractedColumns = extractColumns(enrichedProducts);
      
      // Modificar la definición de la columna "pack of:" para hacerla editable
      const columnsWithEditable = extractedColumns.map(col => {
        if (col.key === 'pack of:') {
          return {
            ...col,
            editable: true,
            type: 'number',
            onEdit: (value, record, index) => {
              // Convertir a número y validar que sea un natural positivo
              const numValue = Number(value);
              if (numValue > 0 && Number.isInteger(numValue)) {
                return numValue;
              }
              return record['pack of:']; // Mantener el valor anterior si no es válido
            }
          };
        }
        return col;
      });
      
      setColumns(columnsWithEditable);
      setVisibleColumns(columnsWithEditable.map(col => col.key));
      setApiData(products);
      setFilteredData(products);
    }
  }, [products]);

  const extractColumns = (data: any[]): Column[] => {
    const allKeys = new Set<string>();
    data.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));

    return Array.from(allKeys).map(key => {
      let type: 'string' | 'number' | 'date' = 'string';
      for (const item of data) {
        const value = item[key];
        if (value !== undefined && value !== null && value !== '') {
          if (!isNaN(parseFloat(value))) {
            type = 'number';
          } else if (
            /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value) ||
            /^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(value)
          ) {
            type = 'date';
          }
          break;
        }
      }
      return {
        key,
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace(/:/g, '')
          .trim(),
        type,
      };
    });
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleExport = (format: 'xlsx' | 'csv') => {
    const visibleCols = columns
      .filter(col => visibleColumns.includes(col.key))
      .map(col => ({ key: col.key, label: col.label }));

    exportToFile(filteredData, visibleCols, format);
    setIsExportModalOpen(false);
  };

  // ✅ useCallback para evitar bucle infinito
  const handleFilteredDataChange = useCallback((data: any[]) => {
    setFilteredData(data);
  }, []);

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Database size={48} className="text-amazon-orange mb-4" />
        <h2 className="text-2xl font-semibold text-amazon-brown mb-2">
          No hay tabla seleccionada
        </h2>
        <p className="text-amazon-brown/70 text-center mb-6 max-w-md">
          Selecciona una tabla desde el panel de tablas guardadas o importa una nueva.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard/tables')}
            className="px-4 py-2 bg-amazon-brown text-white rounded-lg hover:bg-amazon-brownLight transition-colors"
          >
            Ver Tablas Guardadas
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openUploadModal'))}
            className="px-4 py-2 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orangeLight transition-colors"
          >
            Importar Nueva Tabla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col pl-4">
      <div className="flex justify-between items-center h-16 bg-white border-b border-amazon-orange/20 px-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amazon-orange"
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg w-64 bg-white border border-amazon-orange/30 text-amazon-brown placeholder-amazon-brown/50 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight transition-colors duration-200"
          >
            <FileDown size={20} />
            <span>Exportar</span>
          </button>

          <button
            onClick={() => setIsFilterMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-orange text-white hover:bg-amazon-orangeLight transition-colors duration-200"
          >
            <Filter size={20} />
            <span>Filtros</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight transition-colors duration-200"
            >
              <Settings2 size={20} />
              <span>Columnas</span>
            </button>

            {isColumnSelectorOpen && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setIsColumnSelectorOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg border border-amazon-orange/20 p-4 bg-white z-50">
                  <h3 className="font-semibold mb-3 text-amazon-brown">
                    Mostrar/Ocultar Columnas
                  </h3>
                  <div className="space-y-2">
                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-amazon-orange/5 p-2 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="rounded border-amazon-orange/30 text-amazon-orange focus:ring-amazon-orange"
                        />
                        <span className="text-amazon-brown">{column.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <FilterableTable
          columns={columns.filter((col) => visibleColumns.includes(col.key))}
          data={apiData}
          searchTerm={searchTerm}
          isFilterMenuOpen={isFilterMenuOpen}
          onFilterMenuClose={() => setIsFilterMenuOpen(false)}
          onFilteredDataChange={handleFilteredDataChange}
        />
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default TableView;
