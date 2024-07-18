import { useEffect, useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { convertLocations } from '../utils/formatter'

const fhirRoute = '/hapi/fhir/Location'

export const useLocations = (form) => {
  const [counties, setCounties] = useState([])
  const [subCounties, setSubCounties] = useState([])
  const [wards, setWards] = useState([])
  const [facilities, setFacilities] = useState([])

  const { get } = useApiRequest()

  useEffect(() => {
    fetchCounties()
  }, [])

  const fetchLocations = async (partof) => {
    const url = `${fhirRoute}?partof=${partof}&_count=70`
    const response = await get(url)
    return convertLocations(response)
  }

  const getLocationByCode = async (code) => {
    const url = `${fhirRoute}?_id=${code}`
    const response = await get(url)
    return convertLocations(response)
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
    console.log(facilities)
  }

  return {
    counties,
    subCounties,
    wards,
    facilities,
    fetchLocations,
    getLocationByCode,
    fetchCounties,
    fetchSubCounties,
    fetchWards,
    fetchFacilities,
    handleCountyChange,
    handleSubCountyChange,
    handleWardChange,
  }
}
