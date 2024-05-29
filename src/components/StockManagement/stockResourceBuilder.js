import moment from 'moment'
import vaccines from '../data/vaccines'

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
  const { supplyRequest, quantity, user, status } = values

  const resource = {
    resourceType: 'SupplyDelivery',
    status: status || 'in-progress',
    basedOn: {
      reference: supplyRequest,
    },
    occurrenceDateTime: moment().toISOString(),
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
            code: 'vaccine',
            display: 'Vaccine',
          },
        ],
        text: 'Vaccine',
      },
    },
    receiver: {
      reference: `Practitioner/${user?.fhirPractitionerId}`,
      text: `${user?.firstName} ${user?.lastName}`,
    },

    destination: {
      reference: user?.facility,
      text: user?.facilityName,
    },
  }

  return resource
}


export const inventoryItemBuilder = (values) => {}