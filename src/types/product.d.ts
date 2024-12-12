export interface IProduct {
  id: string
  productName: string
  productPrice: number
  imageUrl: string
  storage: number
  updated_at: string
  created_at: string
  quantity?: number;
}
export interface INewProduct {
  productName: string
  productPrice: number
  imageUrl: string
  storage: number
}
