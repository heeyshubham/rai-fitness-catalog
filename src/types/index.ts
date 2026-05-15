export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Muscle {
  id: string;
  label: string;
}

export interface UseCase {
  id: string;
  label: string;
}

export interface ProductImage {
  silhouette: string;
  hue: number;
  label: string;
}

export interface ProductFeature {
  t: string;
  d: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  silhouette: string;
  code: string;
  series: string;
  hue: number;
  weightStack: string;
  capacity: string;
  footprint: string;
  weight: string;
  color: string;
  rating: number;
  description: string;
  images?: ProductImage[];
  features: ProductFeature[];
  use: string[];
}

export interface CatalogState {
  items: Record<string, number>;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  has: (id: string) => boolean;
  count: number;
  distinct: number;
}

export interface Filters {
  muscles: string[];
  useCases: string[];
  capacityMax: number;
  sort: string;
}

export type RouteName = 'browse' | 'detail' | 'catalog' | 'enquiry';

export interface Route {
  name: RouteName;
  id?: string;
}
