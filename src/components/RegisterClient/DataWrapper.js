function createPatientData(data) {

  return {
    resourceType: "Patient",
    id: "32800240-831a-4d5f-81ae-5c24de74d50e", // PS: How is this ID generated?
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
            "value": "EB047L8H"
        }
    ],
    name: [
        {
            family: data.firstName,
            given: [data.lastName]
        }
    ],
    "telecom": [
        {
            "system": "phone"
        }
    ],
    "gender": data.gender,
    "birthDate": data.dob,
    "address": [
        {
            "city": "Nai",
            "country": "Nai"
        }
    ],
    "contact": [
        {
            "relationship": [
                {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/ValueSet/patient-contactrelationship",
                            "code": "fatherId",
                            "display": "Father"
                        }
                    ],
                    "text": "Father"
                }
            ],
            "name": {
                "given": [
                    "Father"
                ]
            },
            "telecom": [
                {
                    "system": "phone",
                    "value": "969693"
                }
            ]
        }
    ]
}
}

function deconstructPatientData(data, searchType) {

    const idNumber = data?.resource?.identifier.find((item) => item.type.text === 'SYSTEM_GENERATED')
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

    return {
        id: data?.resource?.id,
        clientName: `${data?.resource?.name?.[0]?.family ?? ""} ${data?.resource?.name?.[0]?.given[0] ?? ""}`,
        idNumber: idNumber.value,
        phoneNumber: data?.resource?.telecom?.[1]?.value,
        actions,
    }
}

export {
    createPatientData,
    deconstructPatientData,
}