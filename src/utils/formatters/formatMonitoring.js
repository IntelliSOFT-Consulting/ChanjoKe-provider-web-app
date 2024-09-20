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

    format to work with @ant-design/plots
    
    */
  const target =
    reports?.map((report) => {
      return [
        report.month?.toUpperCase()?.substring(0, 3),
        report['DO%_IMDPT1_IMDPT3_cumulative'],
        report['DO%_IMDPT1_IMMEAS0_cumulative'],
        report['DO%_IMDPT1_IMDPT3_cumulative'],
      ]
    }) || []

  return {
    targetPopulation: [
      ['Month', 'DPT-Hep B-Hib 1,', 'DPT-Hep B-Hib 3', 'Measles Rubella 1'],
      ...target,
    ],
  }
}
