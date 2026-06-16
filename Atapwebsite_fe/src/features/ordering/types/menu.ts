export type Category = string;

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  featured?: boolean;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  note: string;
};
