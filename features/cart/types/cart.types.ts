export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: Record<string, number>;
  total: number;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  quantity: number;
  store?: {
    name: string;
    username: string;
  };
}

export interface CartState {
  items: Record<string, number>;
  total: number;
  isLoading: boolean;
}
