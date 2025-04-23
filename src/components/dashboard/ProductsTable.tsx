import React from 'react';
import { FilterableTable } from '../FilterableTable';
import type { Column } from '../types';
import { sampleProducts } from '../../data/sampleProducts';

const columns: Column[] = [
  { key: 'upc', label: 'UPC', type: 'string' },
  { key: 'cost', label: 'Cost', type: 'number' },
  { key: 'price', label: 'Sale Price', type: 'number' },
  { key: 'profit', label: 'Net Profit', type: 'number' },
  { key: 'margin', label: 'Margin %', type: 'number' },
  { key: 'height', label: 'Height', type: 'number' },
  { key: 'width', label: 'Width', type: 'number' },
  { key: 'length', label: 'Length', type: 'number' },
  { key: 'weight', label: 'Weight', type: 'number' }
];

export function ProductsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
      <FilterableTable 
        columns={columns}
        data={sampleProducts}
      />
    </div>
  );
}