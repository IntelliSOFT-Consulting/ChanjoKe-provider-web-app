const createAEFI = (form, value, patientID, immunizationID) => {
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
        "reference": `Patient/${patientID}`
    },
    // "encounter": {
    //     // "reference": "Encounter/ae0cd8a7-174b-4c28-95ef-e70050275ea0"
    // },
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