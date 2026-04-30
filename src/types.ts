export interface Receipt {
  id: string;
  name: string;
  sourceFileName?: string;
  items: ReceiptItem[];
}

export interface ReceiptItem {
  name: string;
  buyer: string;
  price: number;
  discount: number;
}
