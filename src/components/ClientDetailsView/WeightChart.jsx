import React from 'react'
import { Chart } from 'react-google-charts'

const getMaxViewWindow = (timeUnit) => {
  switch (timeUnit) {
    case 'months':
      return 13
    case 'years':
      return null
    case 'weeks':
      return 5
    default:
      return 8
  }
}

const WeightChart = ({ weights }) => {
  const timeUnit = weights?.[0]?.[0]
  const hAxisTitle = timeUnit ? `Age (${timeUnit})` : 'Age'
  const maxViewWindow = getMaxViewWindow(timeUnit)

  const chartOptions = {
    title: 'Growth Monitoring Chart',
    hAxis: {
      title: hAxisTitle,
      viewWindow: {
        min: 0,
        max: maxViewWindow,
      },
    },
    vAxis: {
      title: 'Weight (Kg)',
      viewWindow: { min: 0 },
    },
    legend: 'none',
    curveType: 'function',
    chartArea: { width: '80%', height: '60%' },
  }

  return (
    <Chart
      width={'100%'}
      height={'12rem'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={weights}
      options={chartOptions}
      legendToggle={false}
    />
  )
}

export default WeightChart
