import { useEffect, useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { convertLocations } from '../utils/formatter'

const fhirRoute = '/hapi/fhir/Location'

export const useLocations = (form) => {
  const [locations, setLocations] = useState(null)
  const [counties, setCounties] = useState([])
  const [subCounties, setSubCounties] = useState([])
  const [wards, setWards] = useState([])
  const [facilities, setFacilities] = useState([])

  const { get } = useApiRequest()

  useEffect(() => {
    fetchCounties()
  }, [])

  const fetchLocations = async (partof = null, type = null) => {
    const typeQuery = type ? `&type=${type}` : ''
    // eslint-disable-next-line eqeqeq
    const partofQuery = partof || partof == 0 ? `partof=${partof}` : ''
    const url = `${fhirRoute}?${partofQuery}&_count=10000${typeQuery}`
    const response = await get(url)
    const convertedLocations = convertLocations(response)
    if (type) {
      setLocations(convertedLocations)
    }
    return convertedLocations
  }

  const getLocationByCode = async (code) => {
    const url = `${fhirRoute}?_id=${code}`
    const response = await get(url)
    return convertLocations(response)
  }

  const getLocationsBylevel = async (level) => {
    const url = `${fhirRoute}?type=${level}&_count=700`
    const response = await get(url)
    const data = convertLocations(response)
    setLocations(data)
    return data
  }

  const fetchCounties = async () => {
    const countiesData = await fetchLocations(0)
    setCounties(countiesData)
    return countiesData
  }

  const fetchSubCounties = async (county) => {
    return await fetchLocations(county)
  }

  const fetchWards = async (subCounty) => {
    return await fetchLocations(subCounty)
  }

  const fetchFacilities = async (ward) => {
    return await fetchLocations(ward)
  }

  const handleCountyChange = async (county) => {
    const subCounties = await fetchSubCounties(county)
    form.setFieldValue('subCounty', '')
    form.setFieldValue('ward', '')
    form.setFieldValue('facility', '')
    setSubCounties(subCounties)
    setWards([])
  }

  const handleSubCountyChange = async (subCounty) => {
    const wards = await fetchWards(subCounty)
    form.setFieldValue('ward', '')
    form.setFieldValue('facility', '')
    setWards(wards)
  }

  const handleWardChange = async (ward) => {
    const facilities = await fetchFacilities(ward)
    setFacilities(facilities)
    form.setFieldValue('facility', '')
  }

  const fetchLocationsByIds = async (ids) => {
    if (!ids?.length) return []
    const url = `${fhirRoute}?_id=${ids.join(',')}&_count=70`
    const response = await get(url)
    return convertLocations(response)
  }

  return {
    counties,
    subCounties,
    wards,
    facilities,
    locations,
    fetchLocations,
    getLocationByCode,
    fetchCounties,
    fetchSubCounties,
    fetchWards,
    fetchFacilities,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
    fetchLocationsByIds,
    getLocationsBylevel,
  }
}
