import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'
import dayjs from 'dayjs'

const fhirApi = '/hapi/fhir/CarePlan'

export default function useCampaign() {
  const { get, post } = useApiRequest()

  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]  = useState(false)

  const fetchCampaigns = async () => {
    setLoading(true)
    const response = await get(`${fhirApi}`)

    if (response?.total > 0) setCampaigns(response?.entry.map((value) => ({
      campaignName: value?.resource?.title,
      dateCreated: dayjs(value?.resource?.created).format('DD-MM-YYYY'),
      campaignDuration: `${dayjs(value?.resource?.period?.start).format('DD-MM-YYYY')} - ${dayjs(value?.resource?.period?.end).format('DD-MM-YYYY')}`
    })))
    setLoading(false)
    return response
  }

  const createPayload = (values) => {
    return {
      resourceType : "CarePlan",
      status: "active",
      intent: "plan",
      title: values.campaignName,
      created: new Date().toISOString(),
      period: [
        {
          start: new Date(values.startDate).toISOString(),
          end: new Date(values.endDate).toISOString()
        },
      ],
      category: {
        coding: [
          {
            code: "county",
            display: values.county
          },
          {
            code: "subCounty",
            display: values.subCounty
          },
          {
            code: "ward",
            display: values.ward
          },
          {
            code: "facility",
            display: values.facility
          },
        ],
        text: "Address"
      }
    }
  }

  const createCampaign = async (payload) => {
    setLoading(true)
    const campaignPayload = createPayload(payload)
    await post(`${fhirApi}`, campaignPayload)
    setLoading(false)
  }

  return {
    loading,
    campaigns,
    fetchCampaigns,
    createCampaign,
  }
}