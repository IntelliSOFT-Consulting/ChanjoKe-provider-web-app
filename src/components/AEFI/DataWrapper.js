const createAEFI = (data, patientID, status) => {
  return {
    "resourceType": "Observation",
    "partOf": {
      "reference": `Immunization/${data?.vaccinationID}`
    },
    "status": "final",
  }
}