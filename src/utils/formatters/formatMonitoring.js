export const formatPopulation = (reports) => {
  return reports?.map((report) => ({
    month: report?.month?.substring(0, 3),
    'DPT-Hep B-Hib 1': report?.['DPT-HepB+Hib 1_cumulative'],
    'DPT-Hep B-Hib 3': report?.['DPT-HepB+Hib 3_cumulative'],
    'Measles Rubella 1': report?.['Measles-Rubella 1_cumulative'],
    '% DO DPT-Hep B-Hib': report?.['DPT_dropout_rate_cumulative'],
    '% DO Measles Rubella': report?.['Measles_dropout_rate_cumulative'],
  }))
}

const getMonthData = (month, reports, field) => {
  const report = reports?.find((r) => r.month.substring(0, 3) === month)

  return report ? report[field] : null
}

const getMonthlyData = (month, reports, field) => ({
  [month.toLowerCase()]: getMonthData(month, reports, `${field}_monthly`),
  [`${month.toLowerCase()}_cumulative`]: getMonthData(
    month,
    reports,
    `${field}_cumulative`
  ),
})

const createRow = (title, reports, field) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthlyData = months.reduce((acc, month) => {
    return { ...acc, ...getMonthlyData(month, reports, field) }
  }, {})
  return { title, ...monthlyData }
}

export const formatPopulationTable = (reports) => {
  if (!reports) return []

  const rows = [
    { title: 'Total Immunized DPT-Hep B-Hib 1', field: 'DPT-HepB+Hib 1' },
    { title: 'Total Immunized DPT-Hep B-Hib 3', field: 'DPT-HepB+Hib 3' },
    { title: 'Total Immunized Measles Rubella 1', field: 'Measles-Rubella 1' },
    {
      title: 'Drop Out (DO)= (DPT-Hep B-Hib 1 - DPT-Hep B-Hib 3)',
      field: 'DPT_dropout',
    },
    {
      title: 'Drop Out % (DO / DPT-Hep B-Hib 1) x 100',
      field: 'DPT_dropout_rate',
    },
    {
      title: 'Drop Out (DO)= (DPT-Hep B-Hib 1 - Measles Rubella 1)',
      field: 'Measles_dropout',
    },
    {
      title: 'Drop Out % (DO / DPT-Hep B-Hib 1) x 100',
      field: 'DPT_dropout_rate',
    },
  ]

  return rows.map(({ title, field }) => createRow(title, reports, field))
}
