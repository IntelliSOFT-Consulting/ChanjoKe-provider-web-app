import moment from 'moment'
import { routineVaccines, nonRoutineVaccines } from '../../data/vaccineData'

const vaccines = [...routineVaccines, ...nonRoutineVaccines]

export const supplyRequestBuilder = (values) => {
  const { vaccine, quantity } = values

  const vaccineCode = vaccines.find((v) => v.name === vaccine)?.code

  const category =
    values.category === 'central'
      ? {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/supplyrequest-category',
              code: 'central',
              display: 'Central Stock Request',
            },
          ],
        }
      : {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/supplyrequest-category',
              code: 'facility',
              display: 'Facility Stock Request',
            },
          ],
        }

  const resource = {
    resourceType: 'SupplyRequest',
    status: values.status || 'in-progress',
    category: category,
    requester: {
      reference: `Practitioner/${values.user?.fhirPractitionerId}`,
      text: `${values.user?.firstName} ${values.user?.lastName}`,
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
    quantity: {
      value: quantity,
      unit: 'doses',
    },
    occurrenceDateTime: moment(values.expectedDate).toISOString(),
    authoredOn: moment().toISOString(),
    reasonCode: values.reasonCode,
    // extension: [
    //   {
    //     url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-expectedNextOrder',
    //     valueDateTime: moment(values.expectedNextOrder).toISOString(),
    //   },
    //   {
    //     url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-totalPopulation',
    //     valueInteger: values.totalPopulation,
    //   },
    //   {
    //     url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-children',
    //     valueInteger: values.children,
    //   },
    //   {
    //     url: 'http://hl7.org/fhir/StructureDefinition/supplyrequest-pregnantWomen',
    //     valueInteger: values.pregnantWomen,
    //   },
    // ],
  }

  if (values.category === 'facility') {
    resource.deliverFrom = {
      reference: values.facilityFrom,
      text: values.facilityFromName,
    }

    resource.deliverTo = {
      reference: values.user?.facility,
      text: values.user?.facilityName,
    }
  }

  return resource
}

export const supplyDeliveryBuilder = (values) => {
  const { tableValues } = values

  const resources = tableValues.map((tableValue) => {
    const { vaccine, batchNumber, quantity, vvmStatus } = tableValue

    const vaccineCode = vaccines.find(
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
      status: 'completed',
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
            valueDateTime: moment(tableValue.expiryDate).toISOString(),
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
      occurrenceDateTime: moment(values.dateReceived).toISOString(),
      supplier: {
        reference: `Practitioner/${values.supplier}`,
      },
      destination: {
        reference: `Location/${values.origin}`,
        display: values.facilityName,
      },
      occurrencePeriod: {
        start: moment(values.dateReceived).toISOString(),
        end: moment(new Date()).toISOString(),
      },
      basedOn: {
        reference: `SupplyRequest/${values.supplyRequestId}`,
      },
      receiver: [
        {
          reference: `Practitioner/${values.receiver}`,
          display: values.receiverName,
        },
      ],
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/supplydelivery-orderNumber',
          valueString: values.orderNumber,
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
