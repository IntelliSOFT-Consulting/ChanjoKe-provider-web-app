import moment from 'moment'
import dayjs from 'dayjs'
import { allVaccines, uniqueVaccines } from '../../data/vaccineData'

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
          code: values.user?.location,
          display: values.user?.location,
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
            unit: 'vials',
          },
        },
      ],
      subject: {
        reference: facility,
      },
    }
  })
}

const createVaccineExtension = (vaccine, prevVaccines) => {
  if (prevVaccines?.length > 0) {
    const prevVaccine = prevVaccines.find(
      (pv) =>
        pv.url ===
        `https://example.org/fhir/StructureDefinition/${vaccine.vaccine?.replace(
          /\s/g,
          '-'
        )}`
    )

    if (prevVaccine) {
      const batches = prevVaccine.extension.find((ext) => ext.url === 'batches')

      if (batches) {
        const updatedBatches = batches.extension.filter(
          (batch) => batch.extension[2].valueQuantity.value !== 0
        )

        updatedBatches.push({
          url: 'batch',
          extension: [
            {
              url: 'batchNumber',
              valueString: vaccine.batchNumber,
            },
            {
              url: 'expiryDate',
              valueDateTime: dayjs(
                vaccine.expiryDate,
                'DD-MM-YYYY'
              ).toISOString(),
            },
            {
              url: 'quantity',
              valueQuantity: {
                value: vaccine.quantity,
                unit: 'doses',
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
        })
        return {
          url: `https://example.org/fhir/StructureDefinition/${vaccine.vaccine}`,
          extension: [
            {
              url: `https://example.org/fhir/StructureDefinition/${vaccine.vaccine}`,
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
              extension: updatedBatches,
            },
          ],
        }
      }
    }
  }
  return {
    url: `https://example.org/fhir/StructureDefinition/${vaccine.vaccine}`,
    extension: [
      {
        url: `https://example.org/fhir/StructureDefinition/${vaccine.vaccine}`,
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
        extension: [
          {
            url: 'batches',
            extension: [
              {
                url: 'batch',
                extension: [
                  {
                    url: 'batchNumber',
                    valueString: vaccine.batchNumber,
                  },
                  {
                    url: 'expiryDate',
                    valueDateTime: dayjs(
                      vaccine.expiryDate,
                      'DD-MM-YYYY'
                    ).toISOString(),
                  },
                  {
                    url: 'quantity',
                    valueQuantity: {
                      value: vaccine.quantity,
                      unit: 'doses',
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
              },
            ],
          },
        ],
      },
    ],
  }
}

export const inventoryReportBuilder = (
  newSupplies,
  prevInventoryReport,
  facility
) => {
  const inventoryReport = {
    resourceType: 'Basic',
    identifier: [
      {
        value: 'inventory-report',
      },
    ],
    created: moment().toISOString(),
    code: [
      {
        coding: [
          {
            system: 'http://example.org/vaccine-codes',
            code: 'inventory-report',
            display: 'Inventory Report',
          },
        ],
        text: 'Inventory Report',
      },
    ],
    extension: [
      {
        url: 'http://example.org/fhir/StructureDefinition/inventory-items',
        extension: [
          ...newSupplies.map((supply) =>
            createVaccineExtension(
              supply,
              prevInventoryReport?.extension[0].extension
            )
          ),
        ],
      },
    ],
    subject: {
      reference: facility,
    },
  }

  return inventoryReport
}

export const inventoryItemUpdate = (suppliedVaccines, inventoryItems) => {
  return inventoryItems.map((inventoryItem) => {
    const getVaccine = suppliedVaccines.find(
      (vaccine) => vaccine.vaccine === inventoryItem.identifier[0].value
    )

    if (getVaccine) {
      return {
        ...inventoryItem,
        extension: [
          {
            url: 'quantity',
            valueQuantity: {
              value:
                inventoryItem.extension[0].valueQuantity.value +
                getVaccine.quantity,
              unit: 'vials',
            },
          },
        ],
      }
    }
    return inventoryItem
  })
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
