import { DevicePreset } from '../types';

export const mobilePresets: DevicePreset[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, dpr: 2, category: 'mobile' },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, dpr: 3, category: 'mobile' },
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', width: 428, height: 926, dpr: 3, category: 'mobile' },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', width: 393, height: 852, dpr: 3, category: 'mobile' },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932, dpr: 3, category: 'mobile' },
  { id: 'pixel-5', name: 'Pixel 5', width: 393, height: 851, dpr: 3, category: 'mobile' },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, dpr: 2.63, category: 'mobile' },
  { id: 'galaxy-s20', name: 'Galaxy S20', width: 360, height: 800, dpr: 3, category: 'mobile' },
  { id: 'galaxy-s21', name: 'Galaxy S21', width: 360, height: 800, dpr: 3, category: 'mobile' },
  { id: 'galaxy-fold', name: 'Galaxy Fold', width: 280, height: 653, dpr: 3, category: 'mobile' },
];

export const tabletPresets: DevicePreset[] = [
  { id: 'ipad-mini', name: 'iPad Mini', width: 768, height: 1024, dpr: 2, category: 'tablet' },
  { id: 'ipad', name: 'iPad', width: 810, height: 1080, dpr: 2, category: 'tablet' },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 834, height: 1194, dpr: 2, category: 'tablet' },
  { id: 'ipad-pro-12-9', name: 'iPad Pro 12.9"', width: 1024, height: 1366, dpr: 2, category: 'tablet' },
  { id: 'surface-pro', name: 'Surface Pro', width: 912, height: 1368, dpr: 1.5, category: 'tablet' },
  { id: 'surface-duo', name: 'Surface Duo', width: 540, height: 720, dpr: 2.5, category: 'tablet' },
];

export const allPresets = [...mobilePresets, ...tabletPresets];
