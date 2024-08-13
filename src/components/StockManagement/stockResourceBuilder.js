import moment from 'moment'
import { allVaccines } from '../../data/vaccineData'

export const supplyRequestBuilder = (values) => {
  const {
    tableData,
    level,
    supplierName,
    supplier,
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

  const resources = tableValues.map((tableValue) => {
    const { vaccine, batchNumber, quantity, vvmStatus } = tableValue

    const vaccineCode = allVaccines.find(
      (v) => v.vaccineName === vaccine
    )?.vaccineCode

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
      identifier: [],
      status: 'in-progress',
      type: {
        coding: [
          {
            system:
              'http://terminology.hl7.org/CodeSystem/supplydelivery-status',
            code: 'completed',
            display: 'Completed',
          },
        ],
      },
      suppliedItem: {
        quantity: {
          value: quantity,
          unit: 'doses',
        },
        itemCodeableConcept: {
          coding: [
            {
              system:
                'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts',
              code: vaccineCode,
              display: vaccine,
            },
          ],
          text: vaccine,
        },
        lotNumber: batchNumber,
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-vvmStatus',
            valueString: vvmStatus,
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-manufacturerDetails',
            valueString: tableValue.manufacturerDetails,
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-expiryDate',
            valueDateTime: tableValue.expiryDate?.toISOString(),
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-remainingQuantity',
            valueQuantity: {
              value: quantity,
              unit: 'doses',
            },
          },
        ],
      },
      occurrenceDateTime: moment().toISOString(),
      supplier: {
        reference: `Practitioner/${values.supplier}`,
      },
      destination: {
        reference: `Location/${tableValue.destination}`,
        display: tableValue.facilityName,
      },
      occurrencePeriod: {
        start: values.dateIssued?.toISOString(),
        end: moment().toISOString(),
      },
      basedOn: {
        reference: `SupplyRequest/${tableValue.supplyRequestId}`,
      },
      // receiver: [
      //   {
      //     reference: `Practitioner/${values.receiver}`,
      //     display: values.receiverName,
      //   },
      // ],
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-orderNumber',
          valueString: tableValue.orderNumber,
        },
      ],
    }
  })

  return resources
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
