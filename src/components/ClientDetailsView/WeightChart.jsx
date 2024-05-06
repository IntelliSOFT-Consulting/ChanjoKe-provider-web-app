import React from 'react'
import { Chart } from 'react-google-charts'

export default function WeightChart({ weights }) {
  return (
      <Chart
        width={'100%'}
        height={'12rem'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={weights}
        options={{
          title: 'Growth Monitoring Chart',
          hAxis: {
            title: weights?.[0]?.[0] ? `Age (${weights?.[0]?.[0]})` : 'Age',
            viewWindow: {
              min: 0,
              max:
                weights?.[0]?.[0] === 'months'
                  ? 13
                  : weights?.[0]?.[0] === 'years'
                    ? null
                    : weights?.[0]?.[0] === 'weeks'
                      ? 5
                      : 8,
            },
          },
          vAxis: {
            title: 'Weight (Kg)',
            viewWindow: { min: 0 },
          },
          legend: 'none',
          curveType: 'function',
          chartArea: { width: '80%', height: '60%' },
        }}
        legendToggle={false}
        legend_toggle={false}
      />
  )
}
