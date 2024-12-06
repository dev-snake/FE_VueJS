const formatCurrencyVN = (number: number) => {
  return new Intl.NumberFormat('VN', { maximumSignificantDigits: 3 }).format(number) + ' VNĐ'
}
export default formatCurrencyVN
