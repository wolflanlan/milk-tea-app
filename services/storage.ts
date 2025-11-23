
import { TeaRecord, BrandConfig } from '../types';
import { STORAGE_KEY, POPULAR_BRANDS } from '../constants';

const BRANDS_STORAGE_KEY = 'bubble_tea_brands_v2';

export const getRecords = (): TeaRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load records", e);
    return [];
  }
};

export const saveRecords = (records: TeaRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save records", e);
  }
};

export const getStoredBrands = (): BrandConfig[] => {
  try {
    const data = localStorage.getItem(BRANDS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Migration check: if it's an array of strings, convert to BrandConfig
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed.map((b: string) => ({ name: b, visible: true }));
      }
      return parsed;
    }
    // Default
    return POPULAR_BRANDS.map(b => ({ name: b, visible: true }));
  } catch (e) {
    return POPULAR_BRANDS.map(b => ({ name: b, visible: true }));
  }
};

export const saveStoredBrands = (brands: BrandConfig[]): void => {
  try {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
  } catch (e) {
    console.error("Failed to save brands", e);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
