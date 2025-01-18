export interface Receipt {
  store: string;
  items: ReceiptItem[];
  total: number;
}

export interface ReceiptItem {
  name: string;
  buyer: string;
  price: number;
  discount: number;
}
