import { SugarLevel, IceLevel } from './types';

export const POPULAR_BRANDS = [
  '喜茶',
  '奈雪的茶',
  '茶百道',
  '古茗',
  '一点点',
  '蜜雪冰城',
  'CoCo都可',
  '霸王茶姬',
  '益禾堂',
  '书亦烧仙草'
];

export const SUGAR_OPTIONS = Object.values(SugarLevel);
export const ICE_OPTIONS = Object.values(IceLevel);

export const STORAGE_KEY = 'bubble_tea_records_v1';

export const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/100/100?random=1',
  'https://picsum.photos/100/100?random=2',
  'https://picsum.photos/100/100?random=3',
  'https://picsum.photos/100/100?random=4',
];