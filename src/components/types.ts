export interface FilterConfig {
  column: string;
  value: string;
  operator: 'gte' | 'lte' | 'equals';
}

export interface Column {
  key: string;
  label: string;
  type: 'number' | 'string' | 'date';
}

export interface TableData {
  [key: string]: any;
}