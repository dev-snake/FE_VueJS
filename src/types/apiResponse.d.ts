export type ResponseStatus = 'success' | 'failure' | 'error'

export interface IAPI_Response<T = any> {
  message: string
  results: T
  status: ResponseStatus
}
