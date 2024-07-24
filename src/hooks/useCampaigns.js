import { useApiRequest } from '../api/useApiRequest'
import { useState } from 'react'
import dayjs from 'dayjs'

const fhirApi = '/hapi/fhir/CarePlan'

export default function useCampaign() {
  const { get, post, put } = useApiRequest()

  const [campaigns, setCampaigns] = useState([])
  const [campaign, setCampaign] = useState({})
  const [loading, setLoading]  = useState(false)
  const [campaignTotal, setCampaignTotal] = useState(0)

  const fetchCampaigns = async (title = '') => {
    setLoading(true)
    const response = await get(title ? `${fhirApi}` : `${fhirApi}?_count=10000000&_sort=-_lastUpdated`)

    const searchTitle = title.toLowerCase()

    setCampaignTotal(response?.total)

    if (response?.total > 0 && title) {
      const searchedCampaigns = response?.entry?.filter(campaign => {
        return campaign?.resource?.title.toLowerCase().includes(searchTitle);
      });
      setCampaigns((searchedCampaigns.map((value) => ({
        id: value?.resource?.id,
        campaignName: value?.resource?.title,
        status: value?.resource?.status,
        dateCreated: dayjs(value?.resource?.created).format('DD-MM-YYYY'),
        campaignDuration: `${dayjs(value?.resource?.period?.start).format('DD-MM-YYYY')} - ${dayjs(value?.resource?.period?.end).format('DD-MM-YYYY')}`,
        resource: value?.resource,
      }))))
    }

    if (response?.total > 0 && title === '') setCampaigns(response?.entry.map((value) => ({
      id: value?.resource?.id,
      campaignName: value?.resource?.title,
      status: value?.resource?.status,
      dateCreated: dayjs(value?.resource?.created).format('DD-MM-YYYY'),
      campaignDuration: `${dayjs(value?.resource?.period?.start).format('DD-MM-YYYY')} - ${dayjs(value?.resource?.period?.end).format('DD-MM-YYYY')}`,
      resource: value?.resource,
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

  const createPayload = (values, status = 'active') => {
    return {
      resourceType : "CarePlan",
      status: status,
      intent: "plan",
      title: values?.campaignName,
      identifier: [{
        value: values?.campaignName,
      }],
      id: values?.id,
      description: values?.campaignName,
      created: new Date().toISOString(),
      period: [
        {
          start: new Date(values?.startDate).toISOString() || '',
          end: new Date(values?.endDate).toISOString() || ''
        },
      ],
      category: {
        coding: [
          {
            code: "county",
            display: values?.county
          },
          {
            code: "subCounty",
            display: values?.subCounty
          },
          {
            code: "ward",
            display: values?.ward
          },
          {
            code: "facility",
            display: values?.facility
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

  const updateCampaign = async (id, payload, status) => {
    console.log({ payload })
    setLoading(true)
    const updatedCampaignPayload = createPayload(payload, status)
    await put(`${fhirApi}/${id}`, updatedCampaignPayload)
    fetchCampaigns()
    setLoading(false)
  }

  return {
    loading,
    campaigns,
    campaign,
    campaignTotal,
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
  }
}