type TOrderStatus = 'pending' | 'completed' | 'canceled'
type TMethodPayment = 'cash' | 'momo' | 'zalo' | 'visa'

interface IOrderItem {
    id: string
    customerId: string
    totalOrder: number
    products: IProduct[]
    orderStatus: TOrderStatus
    methodPayment: TMethodPayment
    created_at: string
    updated_at: string
}