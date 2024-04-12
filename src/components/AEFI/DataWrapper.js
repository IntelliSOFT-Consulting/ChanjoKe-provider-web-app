const createAEFI = (form, value, patient, immunizationID, encounterID) => {
  return {
    "resourceType": "Observation",
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                // "code": "882-22",
                "display": form
            }
        ],
        "text": form
    },
    "subject": {
        "reference": patient
    },
    "encounter": {
        "reference": `Encounter/${encounterID}`
    },
    "partOf": {
      "reference": `Immunization/${immunizationID}`
    },
    // "issued": "2024-02-27T11:26:05.497+03:00",
    "valueCodeableConcept": {
        "coding": [
            {
                "system": "http://loinc.org",
                // "code": "OA33-68",
                "display": value
            }
        ]
    }
  }
}

export {
  createAEFI,
}