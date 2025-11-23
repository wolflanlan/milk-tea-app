
export interface TeaRecord {
  id: string;
  brand: string;
  name: string;
  price: number;
  date: string; // ISO String YYYY-MM-DD
  sugar: string;
  ice: string;
  rating: number; // 1-5
  note?: string;
  createdAt: number;
}

export interface BrandConfig {
  name: string;
  visible: boolean;
}

export type ViewMode = 'list' | 'add' | 'edit' | 'stats' | 'brands';

export enum SugarLevel {
  Standard = '全糖',
  Seven = '七分糖',
  Five = '五分糖',
  Three = '三分糖',
  Zero = '不加糖'
}

export enum IceLevel {
  Regular = '正常冰',
  Less = '少冰',
  Little = '微冰',
  None = '去冰',
  Hot = '热饮'
}

export interface StatsData {
  brand: string;
  count: number;
  totalSpent: number;
}
