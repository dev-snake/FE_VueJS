const GenYears = () => {
  const years = []
  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    years.push(i)
  }

  return years
}
export default GenYears
