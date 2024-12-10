interface IRevenueData {
  revenueByYear: RevenueByYear[]
  revenueByMonth: RevenueByMonth[]
  revenueByWeek: RevenueByWeek[]
  revenueByDay: RevenueByDay[]
  revenueAllYears: RevenueAllYear[]
  revenueAllMonths: RevenueAllMonth[]
}

interface RevenueByYear {
  day: number
  month: number
  year: number
  totalRevenue: number
}

interface RevenueByMonth {
  month: number
  totalRevenue: number
}

interface RevenueByWeek {
  week: number
  totalRevenue: number
}

interface RevenueByDay {
  day: number
  totalRevenue: number
}

interface RevenueAllYear {
  year: number
  totalRevenue: number
}

interface RevenueAllMonth {
  month: number
  totalRevenue: number
}
