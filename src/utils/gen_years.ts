const GenYears = () => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = 2000; i <= currentYear; i++) {
    years.push(i)
  }

  return years
}
export default GenYears
