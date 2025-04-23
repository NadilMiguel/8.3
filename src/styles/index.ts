export * from './theme';
export * from './components';
export * from './utils';

// Re-export everything as a single styles object
import { theme } from './theme';
import { components } from './components';
import { createClassName, getGradient, getSpacing, getFontSize } from './utils';

export const styles = {
  theme,
  components,
  utils: {
    createClassName,
    getGradient,
    getSpacing,
    getFontSize,
  },
};