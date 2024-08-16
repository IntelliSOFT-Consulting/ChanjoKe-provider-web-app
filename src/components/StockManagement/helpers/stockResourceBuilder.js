import moment from 'moment'
import dayjs from 'dayjs'
import { allVaccines, uniqueVaccines } from '../../../data/vaccineData'

export const supplyRequestBuilder = (values) => {
  const {
    tableData,
    level,
    lastOrderDate,
    authoredOn,
    preferredPickupDate,
    expectedDateOfNextOrder,
    totalPopulation,
    pregnantWomen,
  } = values

  const orderItems = tableData.map((tableValue) => {
    const {
      vaccine,
      dosesInStock,
      consumedLastMonth,
      minimum,
      maximum,
      recommendedStock,
      quantity,
    } = tableValue

    return {
      url: 'http://example.org/fhir/StructureDefinition/supplyrequest-vaccine',
      extension: [
        {
          url: 'vaccine',
          valueCodeableConcept: {
            coding: [
              {
                system: 'http://example.org/vaccine-codes',
                code: vaccine?.replace(/\s/g, '-'),
              },
            ],
            text: vaccine,
          },
        },
        {
          url: 'dosesInStock',
          valueQuantity: {
            value: dosesInStock,
            unit: 'doses',
          },
        },
        {
          url: 'consumedLastMonth',
          valueQuantity: {
            value: consumedLastMonth || 0,
            unit: 'doses',
          },
        },
        {
          url: 'minimum',
          valueQuantity: {
            value: minimum,
            unit: 'doses',
          },
        },
        {
          url: 'maximum',
          valueQuantity: {
            value: maximum,
            unit: 'doses',
          },
        },
        {
          url: 'recommendedStock',
          valueQuantity: {
            value: recommendedStock,
            unit: 'doses',
          },
        },
        {
          url: 'quantity',
          valueQuantity: {
            value: quantity,
            unit: 'doses',
          },
        },
      ],
    }
  })

  return {
    resourceType: 'SupplyRequest',
    status: 'active',
    meta: {
      tag: [
        {
          system:
            'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/tags',
          code: 'order',
          display: 'Order',
        },
      ],
    },
    occurrenceDateTime: moment().toISOString(),
    deliverFrom: values.deliverFrom,
    deliverTo: values.deliverTo,
    requester: values.requester,
    reasonCode: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '373066001',
            display: 'Vaccine Supply',
          },
        ],
        text: 'Vaccine Supply',
      },
    ],
    occurrencePeriod: {
      start: authoredOn?.toISOString(),
      end: moment().toISOString(),
    },
    authoredOn: authoredOn?.toISOString(),
    extension: [
      {
        url: 'http://example.org/fhir/StructureDefinition/supplyrequest-vaccine',
        extension: orderItems,
      },
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-level',
        valueString: level,
      },
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-lastOrderDate',
        valueDateTime: lastOrderDate?.toISOString(),
      },
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-preferredPickupDate',
        valueDateTime: preferredPickupDate?.toISOString(),
      },
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-expectedDateOfNextOrder',
        valueDateTime: expectedDateOfNextOrder?.toISOString(),
      },
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-totalPopulation',
        valueInteger: totalPopulation,
      },
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-pregnantWomen',
        valueInteger: pregnantWomen,
      },
    ],
  }
}

export const supplyDeliveryBuilder = (values) => {
  const { tableValues } = values

  const dispatchedItems = tableValues.map((tableValue) => {
    const {
      vaccine,
      batchNumber,
      expiryDate,
      quantity,
      vvmStatus,
      manufacturerDetails,
    } = tableValue

    const vaccineCode = allVaccines.find(
      (v) => v.vaccineName === vaccine
    )?.vaccineCode

    return {
      url: 'http://example.org/fhir/StructureDefinition/supplydelivery-vaccine',
      extension: [
        {
          url: 'vaccine',
          valueCodeableConcept: {
            coding: [
              {
                system: 'http://example.org/vaccine-codes',
                code: vaccineCode,
              },
            ],
            text: vaccine,
          },
        },
        {
          url: 'batchNumber',
          valueString: batchNumber,
        },
        {
          url: 'expiryDate',
          valueDateTime: expiryDate?.toISOString(),
        },
        {
          url: 'quantity',
          valueQuantity: {
            value: quantity,
            unit: 'doses',
          },
        },
        {
          url: 'vvmStatus',
          valueCodeableConcept: {
            coding: [
              {
                system: 'http://example.org/vvm-status',
                code: vvmStatus,
              },
            ],
            text: vvmStatus,
          },
        },
        {
          url: 'manufacturerDetails',
          valueString: manufacturerDetails,
        },
      ],
    }
  })

  return {
    resourceType: 'SupplyDelivery',
    meta: {
      tag: [
        {
          system:
            'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/tags',
          code: 'in-stock',
          display: 'In Stock',
        },
        {
          code: values.destination?.reference,
          display: values.destination?.display,
        },
      ],
    },
    identifier: values.identifier,
    status: 'in-progress',
    destination: values.destination,
    occurrenceDateTime: moment().toISOString(),
    basedOn: values.basedOn,
    occurrencePeriod: {
      start: values.dateIssued?.toISOString(),
      end: moment().toISOString(),
    },
    supplier: values.supplier,
    extension: [
      {
        url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-level',
        extension: dispatchedItems,
      },
    ],
  }
}

export const inventoryItemBuilder = (facility) => {
  return uniqueVaccines.map((vaccine) => {
    return {
      resourceType: 'Basic',
      code: [
        {
          coding: [
            {
              system: 'http://example.org/vaccine-codes',
              code: 'inventory-item',
              display: 'Inventory Item',
            },
          ],
          text: vaccine,
        },
      ],
      created: moment().toISOString(),
      identifier: [
        {
          value: vaccine,
        },
      ],
      extension: [
        {
          url: 'quantity',
          valueQuantity: {
            value: 0,
            unit: 'doses',
          },
        },
      ],
      subject: {
        reference: facility,
      },
    }
  })
}
const createBatchExtension = (vaccine) => {
  // Only create batch extension if quantity is provided and is a number
  if (vaccine.quantity === undefined || isNaN(vaccine.quantity)) {
    return null
  }

  return {
    url: 'batch',
    extension: [
      {
        url: 'batchNumber',
        valueString: vaccine.batchNumber,
      },
      {
        url: 'expiryDate',
        valueDateTime: dayjs(vaccine.expiryDate, 'DD-MM-YYYY').toISOString(),
      },
      {
        url: 'quantity',
        valueQuantity: {
          value: Number(vaccine.quantity),
          unit: 'vials',
        },
      },
      {
        url: 'vvmStatus',
        valueCodeableConcept: {
          coding: [
            {
              system: 'http://example.org/vvm-status',
              code: vaccine.vvmStatus,
            },
          ],
          text: vaccine.vvmStatus,
        },
      },
      {
        url: 'manufacturerDetails',
        valueString: vaccine.manufacturerDetails,
      },
    ],
  }
}

const updateOrCreateVaccineExtension = (vaccine, prevVaccines) => {
  const vaccineUrl = `https://example.org/fhir/StructureDefinition/${vaccine.vaccine.replace(
    /\s/g,
    '-'
  )}`

  let existingVaccine = prevVaccines?.find((pv) => pv.url === vaccineUrl)

  let batchExtensions =
    existingVaccine?.extension?.find((ext) => ext.url === 'batches')
      ?.extension || []

  // Filter out batches with quantity <= 0
  batchExtensions = batchExtensions.filter((batch) => {
    const quantity = batch.extension.find((ext) => ext.url === 'quantity')
    return quantity && quantity.valueQuantity.value > 0
  })

  const newBatchExtension = createBatchExtension(vaccine)

  if (newBatchExtension) {
    const existingBatchIndex = batchExtensions.findIndex((batch) =>
      batch.extension.some(
        (ext) =>
          ext.url === 'batchNumber' && ext.valueString === vaccine.batchNumber
      )
    )

    if (existingBatchIndex > -1) {
      // Update existing batch
      batchExtensions[existingBatchIndex] = newBatchExtension
    } else {
      // Add new batch
      batchExtensions.push(newBatchExtension)
    }
  }

  return {
    url: vaccineUrl,
    extension: [
      {
        url: vaccineUrl,
        valueCodeableConcept: {
          coding: [
            {
              system: 'http://example.org/vaccine-codes',
              code: vaccine.vaccine,
            },
          ],
          text: vaccine.vaccine,
        },
      },
      {
        url: 'batches',
        extension: batchExtensions,
      },
    ],
  }
}

export const inventoryReportBuilder = (
  newSupplies,
  prevInventoryReport,
  facility
) => {
  const inventoryItemsUrl =
    'http://example.org/fhir/StructureDefinition/inventory-items'

  let prevVaccines =
    prevInventoryReport?.extension?.find((ext) => ext.url === inventoryItemsUrl)
      ?.extension || []

  // Process new supplies
  newSupplies.forEach((supply) => {
    const vaccineIndex = prevVaccines.findIndex(
      (pv) =>
        pv.url ===
        `https://example.org/fhir/StructureDefinition/${supply.vaccine.replace(
          /\s/g,
          '-'
        )}`
    )

    if (vaccineIndex > -1) {
      // Update existing vaccine
      prevVaccines[vaccineIndex] = updateOrCreateVaccineExtension(supply, [
        prevVaccines[vaccineIndex],
      ])
    } else {
      // Add new vaccine
      prevVaccines.push(updateOrCreateVaccineExtension(supply, []))
    }
  })

  return {
    resourceType: 'Basic',
    id: prevInventoryReport?.id || undefined,
    meta: prevInventoryReport?.meta || undefined,
    identifier: [
      {
        value: 'inventory-report',
      },
    ],
    created: moment().toISOString(),
    code: {
      coding: [
        {
          system: 'http://example.org/vaccine-codes',
          code: 'inventory-report',
          display: 'Inventory Report',
        },
      ],
      text: 'Inventory Report',
    },
    extension: [
      {
        url: inventoryItemsUrl,
        extension: prevVaccines,
      },
    ],
    subject: {
      reference: facility,
    },
  }
}

export const inventoryItemUpdate = (
  suppliedVaccines,
  inventoryItems,
  type = 'add'
) => {
  return inventoryItems.map((inventoryItem) => {
    const getVaccine = suppliedVaccines.find(
      (vaccine) => vaccine.vaccine === inventoryItem.identifier[0].value
    )

    if (getVaccine && getVaccine.quantity >= 0) {
      return {
        ...inventoryItem,
        extension: [
          {
            url: 'quantity',
            valueQuantity: {
              value:
                type === 'add'
                  ? inventoryItem.extension[0].valueQuantity.value +
                    getVaccine.quantity
                  : getVaccine.quantity,
              unit: 'doses',
            },
          },
        ],
      }
    }
    return inventoryItem
  })
}

export const receiveAuditBuilder = (
  vaccines,
  inventoryReport,
  values,
  type = 'count'
) => {
  const auditTypes = {
    count: 'Stock Count',
    receipt: 'Received from other facility',
    shared: 'Shared with other facility',
    wastage: 'Wastage',
  }
  return {
    resourceType: 'AuditEvent',
    action: 'U',
    recorded: moment().toISOString(),
    outcomeDesc: auditTypes[type],
    type: {
      system: 'http://terminology.hl7.org/CodeSystem/audit-event-purpose',
      code: type,
      display: auditTypes[type],
    },
    agent: {
      type: {
        coding: [
          {
            system:
              'http://terminology.hl7.org/CodeSystem/audit-event-agent-type',
            code: 'humanuser',
            display: 'Human User',
          },
        ],
        text: 'Human User',
      },
      location: values.receiver || {
        reference: `Location/${values.facility}`,
        display: values.facilityName,
      },
      name: values.agentName || values.facilityName,
      requestor: true,
    },
    source: {
      observer: {
        reference: `Practitioner/${values.fhirPractitionerId}`,
      },
      site: {
        reference: `Location/${values.facility}`,
        display: values.facilityName,
      },
    },
    entity: [
      {
        description: values.description || '',
        what: {
          reference: `Basic/${inventoryReport.id}`,
          display: 'Inventory Report',
        },
        detail: {
          type: auditTypes[type],
          valueString: JSON.stringify(vaccines),
        },
      },
    ],
  }
}
