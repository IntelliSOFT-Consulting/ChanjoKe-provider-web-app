// convert fhir location bundle to a format that can be used by the antd table
export const convertLocations = (bundle) => {
  return bundle?.entry
    ?.map((location) => {
      return {
        key: location.resource.id,
        name: toTitleCase(location.resource.name),
        parent: location.resource.partOf.reference?.split('/')[1],
      }
    })
    ?.sort((a, b) => a.name.localeCompare(b.name))
}

export const toTitleCase = (str) => {
  return str?.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  })
}

export const convertLocationToFhir = (data) => {
  return {
    resourceType: 'Location',
    name: data.name?.toUpperCase(),
    id: data.kmflCode,
    identifier: [
      {
        system: 'https://kmhfl.health.go.ke',
        value: data.kmflCode,
      },
    ],
    partOf: {
      reference: `Location/${data.ward.toUpperCase()}`,
      display: data.name?.toUpperCase(),
    },
    status: data.status || 'active',
    type: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
            code: 'FACILITY',
            display: 'Health Facility',
          },
        ],
        text: 'Health Facility',
      },
    ],
    managingOrganization: {
      display: data.ownership,
    },
    extension: [
      {
        url: 'http://example.org/fhir/StructureDefinition/facility-keph-level',
        valueCoding: {
          system: 'http://example.org/fhir/ValueSet/keph-level',
          code: data.level,
          display: data.level,
        },
      },
    ],
  }
}

export const formatFacilitiesToTable = (bundle) => {
  const counties = localStorage.getItem('counties')
    ? JSON.parse(localStorage.getItem('counties'))
    : []
  const subCounties = localStorage.getItem('subCounties')
    ? JSON.parse(localStorage.getItem('subCounties'))
    : []
  const wards = localStorage.getItem('wards')
    ? JSON.parse(localStorage.getItem('wards'))
    : []
  return bundle?.entry?.map((facility) => {
    const wardName = facility.resource.partOf.reference?.split('/')[1]
    const ward = wards.find(
      (ward) => ward.key?.toLowerCase() === wardName?.toLowerCase()
    )
    const subCounty = subCounties.find(
      (subCounty) =>
        subCounty.key?.toLowerCase() === ward?.parent?.toLowerCase()
    )
    const county = counties.find(
      (county) => county.key?.toLowerCase() === subCounty?.parent?.toLowerCase()
    )
    return {
      key: facility.resource.id,
      name: toTitleCase(facility.resource?.name),
      subCounty: toTitleCase(subCounty?.name),
      county: toTitleCase(county?.name),
      ward: toTitleCase(facility.resource.partOf.reference?.split('/')[1]),
      level: facility.resource?.extension?.[0]?.valueCoding?.display,
      kmflCode: facility.resource.id,
      ownership: facility.resource?.managingOrganization?.display,
      status: facility.resource?.status,
    }
  })
}

export const formatLocation = (location) => {
  return location
    ? location?.includes('Location/')
      ? location
      : `Location/${location}`
    : null
}

export const getLocationId = (location) => {
  return location?.replace('Location/', '')
}
