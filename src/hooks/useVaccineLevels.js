import { useEffect, useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { setVaccineLevels } from '../redux/slices/vaccineSlice'

const endpoint = '/chanjo-hapi/fhir/Library'

export const useVaccineLevels = () => {
  const { get, post, put } = useApiRequest()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.userInfo)

  useEffect(() => {
    fetchVaccineLevels()
  }, [])

  const fetchVaccineLevels = async () => {
    const params = user?.orgUnit
      ? { identifier: user.orgUnit?.code, _count: 1000 }
      : { _count: 1000 }
    const response = await get(endpoint, {
      params,
    })

    const resources = response?.entry?.map((item) => item.resource)?.[0]
    dispatch(setVaccineLevels(resources))
    return resources
  }

  const createVaccineLevel = async (data) => {
    const response = await post(endpoint, data)
    await fetchVaccineLevels()
    return response
  }

  const updateVaccineLevel = async (id, data) => {
    const response = await put(`${endpoint}/${id}`, data)
    await fetchVaccineLevels()
    return response
  }

  return {
    createVaccineLevel,
    fetchVaccineLevels,
    updateVaccineLevel,
  }
}
