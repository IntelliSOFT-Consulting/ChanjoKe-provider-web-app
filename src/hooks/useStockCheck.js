// for each vaccine, check if the stock is less than the minimum stock
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useInventory from './useInventory'
import { useVaccineLevels } from './useVaccineLevels'
import { Alert } from 'antd'

export const useStockCheck = () => {
  const dispatch = useDispatch()
  const { getAggregateInventoryItems, inventoryItems } = useInventory()
  const { fetchVaccineLevels } = useVaccineLevels()
  const { vaccineLevels } = useSelector((state) => state.vaccineSchedules)
  const { user } = useSelector((state) => state.userInfo)

  useEffect(() => {
    const interval = setInterval(() => {
      fetchVaccineLevels()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (user?.orgUnit?.code && vaccineLevels?.id) {
      getAggregateInventoryItems()
    }
  }, [vaccineLevels])

  const stockCheck = () => {
    const parameter = vaccineLevels?.parameter
    const stockCheck = parameter?.map((item) => {
      const { name, min, max } = item
      const stock =
        inventoryItems?.find((item) => item.vaccine === name)?.quantity ?? 0
      return {
        vaccine: name,
        minimum: min,
        maximum: max,
        stock,
      }
    })

    return stockCheck
  }

  const belowMinimumStock = stockCheck()
    ?.filter((item) => item.stock && item.minimum && item.stock < item.minimum)
    ?.map((item) => item.vaccine)
    ?.join(', ')
  const aboveMaximumStock = stockCheck()
    ?.filter((item) => item.stock && item.maximum && item.stock > item.maximum)
    ?.map((item) => item.vaccine)
    ?.join(', ')

  return {
    belowMinimumStock,
    aboveMaximumStock,
  }
}
