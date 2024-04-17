import { useApiRequest } from '../api/useApiRequest'

const fhirApi = '/hapi/fhir/Encounter'

export default function useEncounter() {
  const { post } = useApiRequest()

  const createEncounter = async (patient, practitioner, location) => {
    const encounter = {
      resourceType: 'Encounter',
      status: 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'OBSENC',
        display: 'observation encounter',
      },
      type: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
              code: 'OBSENC',
              display: 'observation encounter',
            },
          ],
          text: 'observation encounter',
        },
      ],
      subject: {
        reference: `Patient/${patient}`,
      },
      participant: [
        {
          individual: {
            reference: `Practitioner/${practitioner}`,
          },
        },
      ],
      location: [
        {
          location: {
            reference: `Location/${location}`,
          },
        },
      ],
      period: {
        start: new Date().toISOString(),
      },
    }

    return await post(`${fhirApi}`, encounter)
  }

  return { createEncounter }
}
