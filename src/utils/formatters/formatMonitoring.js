export const formatPopulation = (reports) => {
  /*
    reports = [
          {
    "DO%_IMDPT1_IMDPT3_cumulative": 0,
    "DO%_IMDPT1_IMDPT3_monthly": 0,
    "DO%_IMDPT1_IMMEAS0_cumulative": 0,
    "DO%_IMDPT1_IMMEAS0_monthly": 0,
    "DO_IMDPT1_IMDPT3_cumulative": 0,
    "DO_IMDPT1_IMDPT3_monthly": 0,
    "DO_IMDPT1_IMMEAS0_cumulative": 0,
    "DO_IMDPT1_IMMEAS0_monthly": 0,
    "IMDPT-1_cumulative": 0,
    "IMDPT-1_monthly": 0,
    "IMDPT-3_cumulative": 0,
    "IMDPT-3_monthly": 0,
    "IMMEAS-0_cumulative": 0,
    "IMMEAS-0_monthly": 0,
    "month": "October",
    "year": 2024
  },
    ]

    format to work with @canvasjs/react-charts
    
    */

  const periods = reports?.map((report, index) => {
    return new Date(report?.year, index, 1)
  })
  const reportTypes = [
    { name: 'DPT-Hep B-Hib 1', key: 'IMDPT-1_cumulative' },
    { name: 'DPT-Hep B-Hib 3', key: 'IMDPT-3_cumulative' },
    { name: 'Measles Rubella 1', key: 'IMMEAS-0_cumulative' },
  ]

  const target =
    reportTypes?.map((reportType) => {
      return {
        type: 'line',
        name: reportType?.name,
        showInLegend: true,
        yValueFormatString: '#,###',
        dataPoints: periods?.map((period, index) => {
          return {
            x: period,
            y: reports[index][reportType?.key],
          }
        }),
      }
    }) || []
  return target
}
