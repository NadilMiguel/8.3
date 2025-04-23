// Component-specific styles
export const components = {
  button: {
    base: 'rounded-lg transition-colors duration-200 font-medium',
    primary: 'bg-amazon-orange hover:bg-amazon-orangeLight text-white',
    secondary: 'bg-walmart-blue hover:bg-walmart-blueLight text-white',
    outline: 'border-2 border-amazon-orange text-amazon-orange hover:bg-amazon-orange/5',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },
  card: {
    base: 'rounded-xl shadow-md overflow-hidden bg-white',
    primary: 'border border-amazon-orange/20',
    elevated: 'shadow-lg',
  },
  input: {
    base: 'w-full rounded-lg transition-all duration-200',
    default: 'bg-white border-2 border-gray-200 text-amazon-brown placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-4 py-3 text-lg',
    },
  },
  table: {
    base: 'min-w-full divide-y divide-gray-200',
    header: 'bg-gray-50 text-amazon-brown font-semibold',
    cell: 'px-6 py-4 whitespace-nowrap text-amazon-brown',
    row: 'hover:bg-amazon-orange/5 transition-colors duration-200',
  },
  sidebar: {
    base: 'bg-white transition-all duration-300 ease-in-out border-r border-gray-200',
    item: {
      base: 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
      active: 'bg-amazon-orange text-white shadow-md',
      inactive: 'text-amazon-brown hover:bg-amazon-orange/10 hover:text-amazon-orange',
    },
  },
  header: {
    base: 'bg-amazon-brown text-white',
    nav: 'flex items-center space-x-4',
    link: 'text-white/80 hover:text-white transition-colors duration-200',
  },
};