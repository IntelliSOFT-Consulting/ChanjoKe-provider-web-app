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
        {
          code: values.deliverFrom?.reference,
          display: values.deliverFrom?.display,
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

export const inventoryItemBuilder = (values) => {
  return values.vaccines?.map((vaccine) => {
    const resource = {
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
      created:
        values.dateReceived instanceof dayjs
          ? values.dateReceived.toISOString()
          : dayjs(values.dateReceived).toISOString(),
      identifier: [
        {
          value: vaccine.vaccine,
        },
      ],
      extension: [
        {
          url: 'quantity',
          valueQuantity: {
            value: vaccine.quantity,
            unit: 'doses',
          },
        },
        {
          url: 'expiryDate',
          valueDateTime:
            vaccine.expiryDate instanceof dayjs
              ? vaccine.expiryDate.toISOString()
              : dayjs(vaccine.expiryDate, 'DD-MM-YYYY').toISOString(),
        },
        {
          url: 'batchNumber',
          valueString: vaccine.batchNumber,
        },
        {
          url: 'vvmStatus',
          valueString: vaccine.vvmStatus,
        },
        {
          url: 'manufacturerDetails',
          valueString: vaccine.manufacturerDetails,
        },
      ],
      subject: values.facility,
    }

    if (values.orderNumber) {
      resource.meta = {
        tag: [
          {
            code: values.orderNumber,
            display: values.orderNumber,
          },
        ],
      }
    }

    return resource
  })
}

export const inventoryReportBuilder = (items, facility) => {
  return {
    resourceType: 'Basic',
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
    extension: items?.map((value) => ({
      url: value.vaccine,
      valueInteger: value.quantity,
    })),
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

export const receiveAuditBuilder = (vaccines, values, type = 'count') => {
  const auditTypes = {
    count: 'Stock Count',
    receipt: 'Received from other facility',
    shared: 'Shared with other facility',
    wastage: 'Wastage',
  }
  const resource = {
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
      location: values.receiver || values.facility,
      name: values.agentName || values.facility?.display,
      requestor: true,
    },
    source: {
      observer: {
        reference: `Practitioner/${values.fhirPractitionerId}`,
      },
      site: `${values.facility?.reference}`,
    },
    entity: [
      {
        description: values.description || '',
        detail: {
          type: auditTypes[type],
          valueString: JSON.stringify(vaccines),
        },
      },
    ],
  }

  if (type === 'shared') {
    resource.extension = [
      {
        url: 'http://hl7.org/fhir/StructureDefinition/audit-event-receiver',
        valueReference: values.facility,
      },
    ]
  }

  return resource
}
