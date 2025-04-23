import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SortAsc, SortDesc, ExternalLink } from 'lucide-react';
import { FilterMenu } from './FilterMenu';
import type { FilterConfig, Column, TableData } from './types';

interface FilterableTableProps {
  data: TableData[];
  columns: Column[];
  searchTerm: string;
  isFilterMenuOpen?: boolean;
  onFilterMenuClose?: () => void;
  onFilteredDataChange?: (data: TableData[]) => void;
}

export function FilterableTable({ 
  data, 
  columns: initialColumns,
  searchTerm,
  isFilterMenuOpen = false,
  onFilterMenuClose,
  onFilteredDataChange
}: FilterableTableProps) {
  const columns = useMemo(() => {
    return initialColumns.filter(col => {
      const normalizedKey = col.key.replace(/\s+/g, '').toLowerCase();
      return normalizedKey !== '__empty_2' && normalizedKey !== '_empty_2';
    });
  }, [initialColumns]);

  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [hoveredImage, setHoveredImage] = useState<{ url: string; x: number; y: number } | null>(null);
  const [hoveredKeepa, setHoveredKeepa] = useState<string | null>(null);
  const lastSentDataRef = useRef<string>('[]');

  const handleFilterChange = (column: string, value: string, operator: FilterConfig['operator']) => {
    setFilters(prev => {
      const existing = prev.findIndex(f => f.column === column);
      if (existing !== -1) {
        const newFilters = [...prev];
        if (value === '') {
          newFilters.splice(existing, 1);
        } else {
          newFilters[existing] = { column, value, operator };
        }
        return newFilters;
      }
      return value ? [...prev, { column, value, operator }] : prev;
    });
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const parseNumericValue = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    const cleanValue = String(value).replace(/[$%"lbs\s,]/g, '');
    return parseFloat(cleanValue);
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' && value.includes(';')) {
      return value.split(';')[0];
    }
    return String(value);
  };

  const handleImageHover = (
    event: React.MouseEvent<HTMLDivElement>,
    imageUrl: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredImage({
      url: imageUrl,
      x: rect.right + 10,
      y: rect.top,
    });
  };

  const handleKeepaHover = (keepaUrl: string) => {
    const asinMatch = keepaUrl.match(/product\/\d-([A-Z0-9]+)/);
    if (asinMatch && asinMatch[1]) {
      const asin = asinMatch[1];
      const graphUrl = `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=com&salesrank=1&amazon=1&new=1&used=1&bb=1&fba=0&fbm=0&pe=0&ld=1&bbu=0&wd=1&range=365&width=500&height=200`;
      setHoveredKeepa(graphUrl);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    const lowerSearch = searchTerm.toLowerCase();
    result = result.filter(item =>
      columns.some(col => {
        const val = item[col.key];
        return val && String(val).toLowerCase().includes(lowerSearch);
      })
    );

    filters.forEach(filter => {
      const column = columns.find(col => col.key === filter.column);
      if (!column) return;

      result = result.filter(item => {
        const itemValue = item[filter.column];
        const filterValue = filter.value;

        if (itemValue === null || itemValue === undefined) {
          return filterValue === '';
        }

        if (column.type === 'number') {
          const numItem = parseNumericValue(itemValue);
          const numFilter = parseFloat(filterValue);
          if (isNaN(numFilter)) return true;

          switch (filter.operator) {
            case 'gte': return numItem >= numFilter;
            case 'lte': return numItem <= numFilter;
            case 'equals': return Math.abs(numItem - numFilter) < 0.01;
            default: return true;
          }
        } else {
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
        }
      });
    });

    if (sortConfig) {
      const column = columns.find(col => col.key === sortConfig.key);
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        if (column?.type === 'number') {
          aVal = parseNumericValue(aVal);
          bVal = parseNumericValue(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig, searchTerm, columns]);

  // ✅ Evita loop infinito comparando stringificada
  useEffect(() => {
    const current = JSON.stringify(filteredAndSortedData);
    if (lastSentDataRef.current !== current) {
      lastSentDataRef.current = current;
      onFilteredDataChange?.(filteredAndSortedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAndSortedData]);
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getColumnWidth = (columnKey: string): string => {
    const normalizedKey = columnKey.toLowerCase().replace(/\s+/g, '_');
    
    switch (normalizedKey) {
      case 'image':
        return 'w-16';
      case 'url_amazon':
      case 'urlamazon':
      case 'amazon_url':
      case 'u_r_l_amazon':
      case 'url_keepa':
        return 'w-24';
      case 'asin':
        return 'w-32';
      case 'id':
      case 'upc':
        return 'w-32';
      case 'price':
      case 'cost':
      case 'profit':
      case 'margin':
        return 'w-24';
      case 'status':
      case 'type':
        return 'w-28';
      case 'date':
      case 'created':
      case 'updated':
        return 'w-36';
      case 'description':
      case 'name':
      case 'title':
        return 'w-64';
      default:
        return 'w-40';
    }
  };

  const renderCell = (column: Column, value: any) => {
    if (!value) return '-';
    
    const formattedValue = formatCellValue(value);
    
    if (typeof value === 'string') {
      if (value.startsWith('https://www.amazon.com/dp/')) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amazon-brown hover:text-amazon-orange transition-colors"
            title={formattedValue}
          >
            <strong>AMAZON</strong>
            <ExternalLink size={14} className="flex-shrink-0" />
          </a>
        );
      }
      
      if (value.startsWith('https://keepa.com/')) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-walmart-blue hover:text-walmart-blueLight"
            title={formattedValue}
            onMouseEnter={() => handleKeepaHover(value)}
            onMouseLeave={() => setHoveredKeepa(null)}
          >
            <strong>KEEPA</strong>
            <ExternalLink size={14} className="flex-shrink-0" />
          </a>
        );
      }
    }

    const normalizedKey = column.key.toLowerCase().replace(/\s+/g, '_');

    switch (normalizedKey) {
      case 'image':
        return (
          <div
            className="relative cursor-zoom-in"
            onMouseEnter={(e) => handleImageHover(e, value)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <img
              src={value}
              alt="Product"
              className="w-12 h-12 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image';
              }}
            />
          </div>
        );

      case 'asin':
        return (
          <div className="w-full overflow-hidden">
            <span className="font-mono text-amazon-brown truncate block" title={formattedValue}>
              {formattedValue}
            </span>
          </div>
        );

      default:
        return (
          <div className="w-full overflow-hidden">
            <span 
              className="truncate block" 
              title={formattedValue}
            >
              {formattedValue}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto relative">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="bg-gray-50 border-y border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${getColumnWidth(column.key)} px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate">{column.label}</span>
                    <button
                      onClick={() => handleSort(column.key)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <SortAsc size={14} className="text-blue-500" />
                        ) : (
                          <SortDesc size={14} className="text-blue-500" />
                        )
                      ) : (
                        <SortAsc size={14} className="text-gray-300" />
                      )}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 text-sm"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`${getColumnWidth(column.key)} px-3 py-1.5 text-gray-900 overflow-hidden`}
                  >
                    {renderCell(column, row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {hoveredImage && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${hoveredImage.x}px`,
              top: `${hoveredImage.y}px`,
            }}
          >
            <img
              src={hoveredImage.url}
              alt="Preview"
              className="max-w-[300px] max-h-[300px] rounded-lg shadow-xl border-2 border-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
              }}
            />
          </div>
        )}

        {hoveredKeepa && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              right: '20px',
              bottom: '20px',
            }}
          >
            <img
              src={hoveredKeepa}
              alt="Keepa Graph"
              className="max-w-[500px] rounded-lg shadow-xl border-2 border-white bg-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x200?text=No+Graph+Available';
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border-gray-300 text-sm"
          >
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
            <option value={250}>250 rows</option>
          </select>
          <span>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <FilterMenu
        isOpen={isFilterMenuOpen}
        onClose={onFilterMenuClose}
        columns={columns}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
