import moment from 'moment'
import { allVaccines } from '../../data/vaccineData'

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

    const vaccineName = allVaccines.find(
      (v) => v.vaccineCode === vaccine
    )?.vaccineName

    return {
      url: 'http://example.org/fhir/StructureDefinition/supplyrequest-vaccine',
      extension: [
        {
          url: 'vaccine',
          valueCodeableConcept: {
            coding: [
              {
                system: 'http://example.org/vaccine-codes',
                code: vaccine,
              },
            ],
            text: vaccineName,
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
    const { vaccine, batchNumber, quantity, vvmStatus, manufacturerDetails } =
      tableValue

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
      ],
    },
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

export const inventoryItemUpdator = (supplyDeliveries, inventory) => {
  const updatedInventory = { ...inventory }
  const updatedItems = updatedInventory.extension[0].extension.map((item) => {
    const updatedItem = { ...item }
    const supplyDelivery = supplyDeliveries.find(
      (sd) =>
        sd.suppliedItem.itemCodeableConcept.text ===
        item.extension[0].valueCodeableConcept.text
    )
    if (supplyDelivery) {
      updatedItem.extension[1].valueQuantity.value +=
        supplyDelivery.suppliedItem.quantity.value
    }
    return updatedItem
  })

  updatedInventory.extension[0].extension = updatedItems

  return updatedInventory
}

export const receiveAuditBuilder = (values, supplyDeliveries) => {
  const { tableValues } = values

  const discrepancies = tableValues
    .map((tableValue) => {
      const supplyDelivery = supplyDeliveries.find(
        (sd) => sd.suppliedItem.itemCodeableConcept.text === tableValue.vaccine
      )

      if (supplyDelivery) {
        const quantityExpected = supplyDelivery.suppliedItem.quantity.value
        const quantityReceived = tableValue.quantity
        const discrepancy = quantityExpected - quantityReceived

        if (discrepancy !== 0) {
          const discrepancyType = discrepancy > 0 ? 'excess' : 'shortage'
          return {
            resourceType: 'AuditEvent',
            action: 'E',
            recorded: moment().toISOString(),
            outcomeDesc: `Vaccines received with ${discrepancyType} doses than expected`,
            purposeOfEvent: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/audit-event-purpose',
                    code: 'discrepancyType',
                    display: 'Discrepancy Type',
                  },
                ],
                text: discrepancyType,
              },
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/audit-event-purpose',
                    code: 'discrepancyValue',
                    display: 'Discrepancy Value',
                  },
                ],
                text: discrepancy,
              },
            ],
            actor: {
              reference: `Practitioner/${values.receiver}`,
              display: values.receiverName,
            },
            source: {
              observer: {
                reference: `Location/${values.origin}`,
                display: values.facilityName,
              },
            },
            entity: [
              {
                what: {
                  reference: `SupplyDelivery/${supplyDelivery.id}`,
                  display: supplyDelivery.suppliedItem.itemCodeableConcept.text,
                },
                detail: {
                  type: 'Quantity',
                  value: discrepancy,
                },
              },
            ],
          }
        }
      }
    })
    .filter(Boolean)

  return discrepancies
}
