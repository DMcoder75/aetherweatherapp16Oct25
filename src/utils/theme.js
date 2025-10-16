import { Dimensions, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

// Device size categories
export const isSmallDevice = width < 375;
export const isMediumDevice = width >= 375 && width < 414;
export const isLargeDevice = width >= 414;
export const isTablet = width >= 768;

// Responsive spacing
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

// Responsive font sizes
export const fontSize = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  md: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  display: moderateScale(48),
  hero: moderateScale(64),
};

// Color palette
export const colors = {
  // Background colors
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
  },
  
  // Text colors
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b',
  },
  
  // Brand colors
  brand: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    accent: '#60a5fa',
  },
  
  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
  
  // Weather condition colors
  weather: {
    hot: '#ef4444',
    warm: '#f59e0b',
    mild: '#10b981',
    cool: '#06b6d4',
    cold: '#3b82f6',
  },
};

// Border radius
export const borderRadius = {
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  full: 9999,
};

// Shadows (platform-specific)
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 1,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    android: {
      elevation: 4,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 8,
    },
  }),
};

// Layout dimensions
export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
};

export default {
  spacing,
  fontSize,
  colors,
  borderRadius,
  shadows,
  layout,
};

