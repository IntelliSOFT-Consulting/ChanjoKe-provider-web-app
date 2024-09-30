const extensionParamsMap = {
  'types-of-aefi': 'aefiReportType',
  'past-medical-history': 'pastMedicalHistory',
  'treatment-given': 'treatmentGiven',
  'treatment-details': 'treatmentDetails',
  'specimen-collected': 'specimenCollected',
  'specimen-details': 'specimenDetails',
}

export const formatExtensions = (extensions) => {
  if (!extensions) return {}

  return extensions.reduce((acc, extension) => {
    const extensionKey = extension.url.split('/').pop()
    const mappedKey = extensionParamsMap[extensionKey]

    if (mappedKey) {
      acc[mappedKey] = extension.valueString || extension.valueCode
    }

    return acc
  }, {})
}
