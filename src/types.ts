export interface Receipt {
  items: ReceiptItem[];
}

export interface ReceiptItem {
  name: string;
  buyer: string;
  price: number;
  discount: number;
}
