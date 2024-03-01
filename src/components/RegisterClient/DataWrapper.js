function createPatientData(data) {

  const careGivers = data.caregivers.map((item) => {
    return {
      "relationship": [
        {
          "coding": [
            {
              "system": "http://hl7.org/fhir/ValueSet/patient-contactrelationship",
              "code": "fatherId",
              "display": item.caregiverType,
            }
          ],
          "text": item.caregiverType,
        }
      ],
      "name": {
          "given": [
              item.caregiverName
          ]
      },
      "telecom": [
          {
              "system": "phone",
              "value": item.phoneNumber,
          }
      ]
    }
  })

  return {
    resourceType: "Patient",
    identifier: [
        {
            "type": {
                "coding": [
                    {
                        "system": "http://hl7.org/fhir/administrative-identifier",
                        "code": "nemis",
                        "display": "NEMIS No"
                    }
                ],
                "text": "NEMIS No"
            },
            "system": "identification",
            "value": "43545"
        },
        {
            "type": {
                "coding": [
                    {
                        "system": "http://hl7.org/fhir/administrative-identifier",
                        "code": "system_generated",
                        "display": "SYSTEM_GENERATED"
                    }
                ],
                "text": "SYSTEM_GENERATED"
            },
            "system": "identification",
            "value": data.idNumber,
        }
    ],
    name: [
        {
            family: data.firstName,
            middle: data.middleName,
            given: [data.lastName]
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "",
        }
    ],
    "gender": data.gender,
    "birthDate": data.dateOfBirth,
    "address": [
        {
            "estate": "Nai",
            "steeet": "Nai",
            "county": "Nairobi",
            "subCounty": "Kasarani",
            "ward": "Kahawa West"
        }
    ],
    "contact": careGivers,
}
}

function deconstructPatientData(data, searchType) {

  const idNumber =
  data?.resource?.identifier?.find(
    (item) => item.type?.text === 'SYSTEM_GENERATED'
  )?.value || null;

    let actions = [
        {
            title: 'view',
            url: `/client-details/${data?.resource?.id}`,
        }
    ];

    if (searchType === 'updateClient') {
        actions = [
            {
                title: 'update',
                btnAction: {
                    type: 'modal',
                    targetName: 'UpdateRecordsModal'
                },
            }
        ]
    }

    console.log({ constan: data?.resource })

    return {
        id: data?.resource?.id,
        clientName: `${data?.resource?.name?.[0]?.family ?? ""} ${data?.resource?.name?.[0]?.given[0] ?? ""}`,
        idNumber: idNumber,
        phoneNumber: data?.resource?.contact?.[0]?.telecom?.[0]?.value,
        actions,
    }
}

function deconstructLocationData(data) {
    return {
        id: data?.resource?.id,
        fullUrl: data?.fullUrl,
        name: data?.resource?.name,
        source: data?.resource?.meta?.source,
        partOf: data?.resource?.partOf
    }
}

export {
    createPatientData,
    deconstructPatientData,
    deconstructLocationData,
}