import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Card, Spin } from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Table from '../components/DataTable'
import StatCard from '../components/StatCard'
import LoadingArrows from '../common/spinners/LoadingArrows'
import {
  useAppointment,
  useReferral,
  useVaccination,
  useReports,
} from '../hooks'
import {
  formatPopulation,
  formatPopulationTable,
} from '../utils/formatters/formatMonitoring'

const Home = () => {
  const { user } = useSelector((state) => state.userInfo)
  const { getFacilityImmunizations, immunizations } = useVaccination()
  const { getFacilityAppointments, facilityAppointments } = useAppointment()
  const { getReferralsToFacility, referrals } = useReferral()
  const { getMonitoring, monitoring } = useReports()

  const today = moment().format('YYYY-MM-DD')

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getFacilityImmunizations(
            user?.orgUnit?.code || '0',
            `&date=${today}`
          ),
          getFacilityAppointments(today),
          getReferralsToFacility(user?.orgUnit?.code || '0', 0, today),
          getMonitoring(),
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user?.orgUnit?.code])

  const stats = useMemo(
    () => [
      {
        id: 1,
        name: 'Appointments',
        stat: facilityAppointments?.length || 0,
        icon: 'AppointmentIcon',
      },
      {
        id: 2,
        name: 'Community Referrals',
        stat: referrals?.total || 0,
        icon: 'ReferralIcon',
      },
      {
        id: 3,
        name: 'Vaccines Administered',
        stat: immunizations?.length || 0,
        icon: 'AdministerVaccineIcon',
      },
    ],
    [facilityAppointments, referrals, immunizations]
  )

  const columns = useMemo(
    () => [
      {
        title: 'Fill in at the end of each month',
        key: 'title',
        dataIndex: 'title',
        width: '20%',
      },
      ...moment.months().flatMap((month) => [
        {
          title: month?.substring(0, 3),
          key: month?.substring(0, 3).toLowerCase(),
          dataIndex: month?.substring(0, 3).toLowerCase(),
          width: '15px',
          onCell: (_record, index) =>
            index > 2 ? { className: 'bg-blue-200' } : {},
          render: (text, _record, index) => (index > 2 ? null : text),
        },
        {
          title: 'Cum Total',
          key: `${month?.substring(0, 3).toLowerCase()}_cumulative`,
          dataIndex: `${month?.substring(0, 3).toLowerCase()}_cumulative`,
          width: '15px',
        },
      ]),
    ],
    []
  )

  if (!immunizations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingArrows size="large" />
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <section aria-labelledby="today-stats" className="mb-12">
          <h2
            id="today-stats"
            className="text-2xl font-semibold text-blue-800 mb-4"
          >
            Today's Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((item) => (
              <StatCard key={item.id} {...item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="monitoring-chart" className="mb-12">
          <h2
            id="monitoring-chart"
            className="text-2xl font-semibold text-blue-800 mb-4"
          >
            Immunization Monitoring Chart
          </h2>
          <Card className="mb-6">
            <Table
              columns={columns}
              dataSource={formatPopulationTable(monitoring)}
              loading={!monitoring}
              size="small"
              pagination={false}
              scroll={{ x: 'max-content' }}
              rowClassName="text-xs"
              onHeaderRow={() => ({
                style: {
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                  fontSize: '10px',
                },
              })}
              bordered
            />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Total Population" size="small" className="mb-6">
              {monitoring && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatPopulation(monitoring)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="DPT-Hep B-Hib 1"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="DPT-Hep B-Hib 3"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Measles Rubella 1"
                        stroke="#FF8042"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <Card title="Dropout Rate" size="small" className="mb-6">
              {monitoring && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatPopulation(monitoring)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="% DO DPT-Hep B-Hib"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="% DO Measles Rubella"
                        stroke="#FF8042"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
