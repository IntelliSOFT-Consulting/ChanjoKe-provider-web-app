import dayjs from "dayjs"

const createVaccineImmunization = (data, patientID, status) => {
  return {
    "resourceType": "Immunization",
    "status": status,
    "vaccineCode": {
        "coding": [
            {
                "code": data?.vaccineCode,
                "display": data?.vaccineName,
            }
        ],
        "text": data?.vaccineName,
    },
    "patient": {
        "reference": `Patient/${patientID}`
    },
    "encounter": {
        "reference": "Encounter/69ccb241-c809-4dfb-82d4-3e4b70d46dde"
    },
    "occurrenceDateTime": dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
    "doseQuantity": {
        "value": data?.doseNumber,
    },
    "note": [
        {
            "text": "Facility",
        },
        {
            "authorString": data?.contraindicationDetails
        }
    ],
    "education": data?.education,
    "protocolApplied": [
        {
            "series": "3",
                "targetDisease": [
                    {
                        "text": data?.diseaseTarget,
                    }
                ],
            "seriesDosesString": data?.doseNumber,
        }
    ]
}
}

export {
  createVaccineImmunization,
}