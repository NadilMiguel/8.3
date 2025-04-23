import React from 'react';
import { X } from 'lucide-react';
import { FilterConfig, Column } from './types';
import { styles } from '../styles';

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  filters: FilterConfig[];
  onFilterChange: (column: string, value: string, operator: FilterConfig['operator']) => void;
}

const excludedColumns = [
  'title',
  'image',
  'url_amazon',
  'urlamazon',
  'amazon_url',
  'u_r_l_amazon',
  'url_keepa',
  'product_codes_upc',
  'upc',
  'asin',
];

export function FilterMenu({ 
  isOpen, 
  onClose, 
  columns, 
  filters, 
  onFilterChange,
}: FilterMenuProps) {
  // Filter out excluded columns
  const filterableColumns = columns.filter(column => {
    const normalizedKey = column.key.toLowerCase().replace(/[\s_]/g, '');
    return !excludedColumns.some(excluded => 
      normalizedKey.includes(excluded.toLowerCase().replace(/[\s_]/g, ''))
    );
  });

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed right-0 top-0 h-full w-80 shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        bg-white border-l border-amazon-orange/20
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex-none p-4 border-b border-amazon-orange/20">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-amazon-brown">
              Filters
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-amazon-orange/10 text-amazon-brown"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-6">
            {filterableColumns.map(column => {
              const currentFilter = filters.find(f => f.column === column.key);
              return (
                <div key={column.key} className="space-y-2">
                  <label className="block font-medium text-amazon-brown">
                    {column.label}
                  </label>
                  <select
                    className={`
                      w-full rounded-lg px-3 py-2 bg-white
                      border border-amazon-orange/30
                      text-amazon-brown placeholder-amazon-brown/50
                      focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent
                      transition-all duration-200
                    `}
                    value={currentFilter?.operator || 'equals'}
                    onChange={(e) => onFilterChange(
                      column.key,
                      currentFilter?.value || '',
                      e.target.value as FilterConfig['operator']
                    )}
                  >
                    <option value="equals">Equals</option>
                    <option value="gte">Greater than or equal to (≥)</option>
                    <option value="lte">Less than or equal to (≤)</option>
                  </select>
                  <input
                    type={column.type === 'number' ? 'number' : 'text'}
                    className={`
                      w-full rounded-lg px-3 py-2 bg-white
                      border border-amazon-orange/30
                      text-amazon-brown placeholder-amazon-brown/50
                      focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent
                      transition-all duration-200
                    `}
                    placeholder={`Filter by ${column.label.toLowerCase()}...`}
                    value={currentFilter?.value || ''}
                    onChange={(e) => onFilterChange(
                      column.key,
                      e.target.value,
                      currentFilter?.operator || 'equals'
                    )}
                  />
                  {currentFilter?.value && (
                    <div className="flex items-center gap-2 text-sm text-walmart-blue">
                      <span>Active filter</span>
                      <button
                        onClick={() => onFilterChange(column.key, '', currentFilter.operator)}
                        className="text-amazon-orange hover:text-amazon-orangeDark"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 border-t border-amazon-orange/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-amazon-brown">
              {filters.length} active filters
            </span>
            {filters.length > 0 && (
              <button
                onClick={() => filters.forEach(f => onFilterChange(f.column, '', f.operator))}
                className="text-sm text-walmart-blue hover:text-walmart-blueLight"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}