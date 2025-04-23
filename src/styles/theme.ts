// Theme configuration
export const theme = {
  colors: {
    amazon: {
      orange: '#FF9900',
      orangeLight: '#FFAC31',
      orangeDark: '#E68A00',
      brown: '#232F3E',
      brownLight: '#374759',
      brownDark: '#131A22',
    },
    walmart: {
      blue: '#0071DC',
      blueLight: '#0084FF',
      blueDark: '#004F9A',
    },
    text: {
      primary: '#232F3E', // Amazon brown for primary text
      secondary: '#374759', // Lighter brown for secondary text
      muted: '#637381', // Muted text color
    },
    border: {
      primary: 'rgba(255, 153, 0, 0.3)', // amazon-orange with 30% opacity
      secondary: 'rgba(0, 113, 220, 0.2)', // walmart-blue with 20% opacity
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      elevated: '#FFFFFF',
      accent: '#FFF8E7', // Light orange background
    },
  },
  gradients: {
    primary: 'from-white to-gray-50',
    accent: 'from-amazon-orange/10 to-amazon-orange/5',
    header: 'from-amazon-brown to-amazon-brownDark',
  },
  spacing: {
    page: {
      x: '2rem',
      y: '1.5rem',
    },
    section: {
      x: '1.5rem',
      y: '1rem',
    },
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};