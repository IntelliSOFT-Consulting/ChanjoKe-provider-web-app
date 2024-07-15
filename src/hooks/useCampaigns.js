import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'
import dayjs from 'dayjs'

const fhirApi = '/hapi/fhir/CarePlan'

export default function useCampaign() {
  const { get, post } = useApiRequest()

  const [campaigns, setCampaigns] = useState([])
  const [campaign, setCampaign] = useState({})
  const [loading, setLoading]  = useState(false)

  const fetchCampaigns = async (title = '') => {
    setLoading(true)
    const response = await get(title ? `${fhirApi}` : `${fhirApi}?_count=10000000&_status:active`)

    const searchTitle = title.toLowerCase()

    if (response?.total > 0 && title) {
      const searchedCampaigns = response?.entry?.filter(campaign => {
        return campaign?.resource?.title.toLowerCase().includes(searchTitle);
      });
      setCampaigns((searchedCampaigns.map((value) => ({
        id: value?.resource?.id,
        campaignName: value?.resource?.title,
        dateCreated: dayjs(value?.resource?.created).format('DD-MM-YYYY'),
        campaignDuration: `${dayjs(value?.resource?.period?.start).format('DD-MM-YYYY')} - ${dayjs(value?.resource?.period?.end).format('DD-MM-YYYY')}`
      }))))
    }

    if (response?.total > 0 && title === '') setCampaigns(response?.entry.map((value) => ({
      id: value?.resource?.id,
      campaignName: value?.resource?.title,
      dateCreated: dayjs(value?.resource?.created).format('DD-MM-YYYY'),
      campaignDuration: `${dayjs(value?.resource?.period?.start).format('DD-MM-YYYY')} - ${dayjs(value?.resource?.period?.end).format('DD-MM-YYYY')}`
    })))
    setLoading(false)
    return response
  }

  const fetchCampaign = async(campaignID) => {
    setLoading(true)
    const response = await get(`${fhirApi}/${campaignID}`)
    setCampaign(response)
    setLoading(false)
  }

  const createPayload = (values) => {
    return {
      resourceType : "CarePlan",
      status: "active",
      intent: "plan",
      title: values.campaignName,
      identifier: [{
        value: values.campaignName,
      }],
      description: values.campaignName,
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
    campaign,
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
  }
}