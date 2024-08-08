import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { routineVaccines, nonRoutineVaccines } from '../data/vaccineData'
import { useSelector } from 'react-redux'

const ENDPOINT = '/hapi/fhir/Basic'
const INVENTORY_IDENTIFIER = 'vaccine-inventory'
const INVENTORY_ITEMS_URL =
  'http://example.org/fhir/StructureDefinition/inventory-items'

const createVaccineExtension = (vaccine) => ({
  url: `https://example.org/fhir/StructureDefinition/${vaccine.vaccineCode}`,
  extension: [
    {
      url: `https://example.org/fhir/StructureDefinition/${vaccine.vaccineCode}`,
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://example.org/vaccine-codes',
            code: vaccine.vaccineCode,
          },
        ],
        text: vaccine.vaccineName,
      },
    },
    {
      url: 'quantity',
      valueQuantity: {
        value: 0,
        unit: 'doses',
        system: 'http://unitsofmeasure.org',
        code: 'dose',
      },
    },
    {
      url: 'http://example.org/fhir/StructureDefinition/dose-number',
      valueInteger: vaccine.doseNumber ? Number(vaccine.doseNumber) : 1,
    },
  ],
})

const createDefaultInventory = (facility) => ({
  resourceType: 'Basic',
  identifier: [
    {
      system: 'https://www.cdc.gov/vaccines/programs/iis/iis-standards.html',
      value: INVENTORY_IDENTIFIER,
    },
  ],
  extension: [
    {
      url: INVENTORY_ITEMS_URL,
      extension: [...routineVaccines, ...nonRoutineVaccines].map(
        createVaccineExtension
      ),
    },
  ],
  subject: {
    reference: facility,
  },
})

export default function useInventory() {
  const [inventory, setInventory] = useState(null)
  const { user } = useSelector((state) => state.userInfo)
  const { get, post, put } = useApiRequest()

  const createInventory = async () => {
    const response = await post(ENDPOINT, createDefaultInventory(user.facility))
    setInventory(response)
    return response
  }

  const getInventory = async (facility) => {
    const response = await get(ENDPOINT, { params: { subject: facility } })

    const inventoryData = response?.entry?.[0]?.resource
    setInventory(inventoryData)
    return inventoryData
  }

  const updateInventory = async (data) => {
    await put(`${ENDPOINT}/${data.id}`, data)
  }

  return { inventory, createInventory, getInventory, updateInventory }
}
