import dayjs from 'dayjs'

export const formatInventoryToTable = (inventoryReport) => {
  const formattedReport = []

  const inventoryItems = inventoryReport.extension?.find((ext) =>
    ext.url.includes('inventory-items')
  )

  if (!inventoryItems || !inventoryItems.extension) {
    return formattedReport
  }

  inventoryItems.extension.forEach((vaccineExt) => {
    const vaccine = vaccineExt.extension?.find(
      (ext) =>
        ext.url ===
        `https://example.org/fhir/StructureDefinition/${ext.valueCodeableConcept?.text}`
    )?.valueCodeableConcept?.text

    if (!vaccine) return

    const batches = vaccineExt.extension?.find(
      (ext) => ext.url === 'batches'
    )?.extension

    if (!batches) return

    batches.forEach((batchExt) => {
      const batchData = {
        vaccine,
        batchNumber: '',
        quantity: 0,
        vvmStatus: '',
        manufacturerDetails: '',
        expiryDate: '',
      }

      batchExt.extension.forEach((detail) => {
        switch (detail.url) {
          case 'batchNumber':
            batchData.batchNumber = detail.valueString
            break
          case 'expiryDate':
            batchData.expiryDate = detail.valueDateTime
              ? dayjs(detail.valueDateTime).format('DD-MM-YYYY')
              : ''
            break
          case 'quantity':
            batchData.quantity = detail.valueQuantity.value
            break
          case 'vvmStatus':
            batchData.vvmStatus = detail.valueCodeableConcept.text
            break
          case 'manufacturerDetails':
            batchData.manufacturerDetails = detail.valueString
            break
          default:
            break
        }
      })

      formattedReport.push(batchData)
    })
  })

  return formattedReport
}

export const vaccineInventory = (vaccine, inventory) => {
  console.log({ vaccine, inventory })
  const data = inventory?.filter(
    (item) =>
      vaccine?.startsWith(item.vaccine[0]) && vaccine?.includes(item.vaccine)
  )
  return data?.sort((a, b) => {
    return dayjs(a.expiryDate, 'DD-MM-YYYY').diff(
      dayjs(b.expiryDate, 'DD-MM-YYYY')
    )
  })
}
