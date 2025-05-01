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

  /** Enriquecemos los productos con la columna "pack of:" editable */
  useEffect(() => {
    if (products && products.length > 0) {
      const enrichedProducts = products.map((item) => ({
        ...item,
        ['pack of:']: Number(item['pack of:']) > 0
          ? Math.floor(Number(item['pack of:']))
          : 1,
      }));

      /* --------------------------------------
         Extraemos columnas dinámicamente
      -------------------------------------- */
      const extractColumns = (data: any[]): Column[] => {
        const allKeys = new Set<string>();
        data.forEach((row) => Object.keys(row).forEach((k) => allKeys.add(k)));

        return Array.from(allKeys).map((key) => {
          let type: 'string' | 'number' | 'date' = 'string';
          for (const row of data) {
            const value = row[key];
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
              .replace(/^./, (s) => s.toUpperCase())
              .replace(/:/g, '')
              .trim(),
            type,
          };
        });
      };

      const extractedColumns = extractColumns(enrichedProducts);

      const columnsWithEditable = extractedColumns.map((col) =>
        col.key === 'pack of:'
          ? {
              ...col,
              editable: true,
              type: 'number',
            }
          : col
      );

      setColumns(columnsWithEditable);
      setVisibleColumns(columnsWithEditable.map((c) => c.key));
      setApiData(enrichedProducts);
      setFilteredData(enrichedProducts);
    }
  }, [products]);

  /* ---------------------------------------
     Column toggle
  --------------------------------------- */
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((k) => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  /* ---------------------------------------
     Export handler
  --------------------------------------- */
  const handleExport = (format: 'xlsx' | 'csv') => {
    const visibleCols = columns
      .filter((col) => visibleColumns.includes(col.key))
      .map((col) => ({ key: col.key, label: col.label }));

    exportToFile(filteredData, visibleCols, format);
    setIsExportModalOpen(false);
  };

  /* Evita loop infinito al notificar cambios */
  const handleFilteredDataChange = useCallback((data: any[]) => {
    setFilteredData(data);
  }, []);

  /* ---------------------------------------
     Render
  --------------------------------------- */
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
            className="px-4 py-2 bg-amazon-brown text-white rounded-lg hover:bg-amazon-brownLight"
          >
            Ver Tablas Guardadas
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openUploadModal'))}
            className="px-4 py-2 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orangeLight"
          >
            Importar Nueva Tabla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col pl-4">
      {/* Barra superior */}
      <div className="flex justify-between items-center h-16 bg-white border-b border-amazon-orange/20 px-4">
        <div className="flex items-center gap-4">
          {/* Buscador */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-amazon-orange"
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg w-64 bg-white border border-amazon-orange/30 text-amazon-brown placeholder-amazon-brown/50 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            />
          </div>

          {/* Exportar */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight"
          >
            <FileDown size={20} />
            <span>Exportar</span>
          </button>

          {/* Filtros */}
          <button
            onClick={() => setIsFilterMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-orange text-white hover:bg-amazon-orangeLight"
          >
            <Filter size={20} />
            <span>Filtros</span>
          </button>

          {/* Mostrar/Ocultar columnas */}
          <div className="relative">
            <button
              onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amazon-brown text-white hover:bg-amazon-brownLight"
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

      {/* Tabla */}
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

      {/* Modal export */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default TableView;
