export type ResponseStatus = 'success' | 'failure' | 'error'
export type TFilterType =
  | 'QUANTITY_SOLD_BY_YEAR'
  | 'REVENUE_BY_YEAR'
  | 'REVENUE_BY_MONTH'
  | 'QUANTITY_SOLD_BY_MONTH'
  | ''
interface IPayload {
  type: TFilterType
  year: number
  month: number
}
export interface IAPI_Response<T = any> {
  message: string
  results: T
  status: ResponseStatus
  payload: IPayload
}
