import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

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

const recommendation = (recommendation) => {

    console.log({ recommendation })

    if (!recommendation) {

    } else {
        return {
            "vaccineCode": {
                "text": recommendation?.vaccineName,
                "code": recommendation?.vaccineCode,
            },
            "targetDisease": {
                "text": recommendation?.diseaseTarget,
            },
            "forecastStatus": {
                "text": recommendation?.forecastStatus,
            },
            "dateCriterion": [
                {
                    "code": {
                        "text": "Date vaccine due"
                    },
                    "value": dayjs(recommendation?.vaccineDueDate).format('YYYY-MM-DDTHH:mm:ssZ') !== 'Invalid Date' ? dayjs(recommendation?.vaccineDueDate).format('YYYY-MM-DDTHH:mm:ssZ') : ''
                }
            ],
            "description": `category: ${recommendation?.category}`,
            "doseNumberString": recommendation?.doseNumber.toString(),
            // "seriesDosesString": "5"
        }
    }
}

const createImmunizationRecommendation = (recommendations, patient) => {
    return {
        "resourceType": "ImmunizationRecommendation",
        "patient": {
            "reference": `Patient/${patient?.id}`
        },
        "date": dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
        "recommendation": recommendations
            .filter(recommendation => recommendation)
            .map((r) => recommendation(r)),
    }
}

const createAppointment = (data, patientID, status) => {
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
  createAppointment,
  createImmunizationRecommendation
}