const apiRoutes = {
  auth: {
    signIn: `/auth/login`,
    signUp: `/auth/register`,
    logOut: '/auth/logout',
  },
  revenueByMonth: {
    getAll: `/revenue_by_month/current-year`,
  },
  revenue: {
    getRevenueByYear: 'revenue/revenue_by_year/current-year',
    getRevenueByMonth: 'revenue/revenue_by_month/current-year',
    getRevenueAllMonthsOfCurrentYear: 'revenue/all-months/current-year',
    getRevenueByWeek: 'revenue/revenue_by_week/current-year',
    getRevenueByDate: 'revenue/revenue_by_day/current-year',
    years: 'revenue/years',
    filter: 'revenue/filter',
    overview: 'revenue/overview',
    search: 'revenue/search',
  },
  order: {
    getAll: `/order/getAll`,
    create: `/order/create`,
    getOne: (orderId: string) => `/order/getOne/${orderId}/`,
  },
  user: {
    getAll: `/user/getAll`,
    create: `/user/create`,
    delete: (userId: string) => `/user/${userId}/delete`,
    edit: (userId: string) => `/user/${userId}/edit`,
    getOne: (userId: string) => `/user/getOne/${userId}/`,
  },
  product: {
    getAll: '/product/getAll',
    create: '/product/create',
    delete: (productId: string) => `/product/${productId}/delete`,
    edit: (productId: string) => `/product/${productId}/edit`,
    getOne: (productId: string) => `/product/getOne/${productId}/`,
    inventory: '/product/inventory',
    getQuantitySold: `/product/get_quantity_sold`,
    getQuantitySoldCurrentYear: `/product/quantity-sold/current-year`,
  },
}
export default apiRoutes
