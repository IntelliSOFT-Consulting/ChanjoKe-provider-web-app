function organizeData(items) {
    if (Array.isArray(items)) {
        const filteredItems = items.filter(item => (item?.type?.text !== 'SYSTEM_GENERATED' || item.system !== 'system-creation'));

        const hierarchy = {
        'BIRTH_CERTIFICATE': null,
        'PASSPORT': null,
        'NATIONAL_ID': null,
        'NEMIS_NUMBER': null,
        };
    
        filteredItems.forEach(item => {
        if (item?.type?.text === 'NEMIS No' || item.system === 'NEMIS No') {
            hierarchy['NEMIS_NUMBER'] = item.value;
        } else if (item.system === 'Passport') {
            hierarchy['PASSPORT'] = item.value;
        } else if (item?.system === 'Birth Notification Number' || item?.system ==='Birth Certificate') {
            hierarchy['BIRTH_CERTIFICATE'] = item.value;
        } else if (item.system === 'National ID' || item.system === 'ID Number') {
            hierarchy['NATIONAL_ID'] = item.value;
        } else {
            hierarchy['DEFAULT'] = item.value;
        }
        });
    
        return hierarchy;
    }

    return {
        'BIRTH_CERTIFICATE': 'N/A',
        'PASSPORT': 'N/A',
        'NATIONAL_ID': 'N/A',
        'NEMIS_NUMBER': 'N/A',
        };
  }

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
    id: data.id,
    identifier: [
        {
            "type": {
                "coding": [
                    {
                        "system": "http://hl7.org/fhir/administrative-identifier",
                        "code": "nemis",
                        "display": data.identificationType
                    }
                ],
                "text": data.identificationNumber,
            },
            "system": "identification",
            "value": data.identificationNumber,
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
            given: [data.lastName, data.middleName]
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
            "city": data.residenceCounty,
            "district": data.subCounty,
            "state": data.ward,
            "line": [data.townCenter, data.estateOrHouseNo],
        }
    ],
    "contact": careGivers,
}
}

function extractNumberFromWeight(value) {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(numericValue) ? null : numericValue;
  }

function createObservationData(value, patient, encounter) {
    return {
        "resourceType": "Observation",
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "CURRENT_WEIGHT",
              "display": "Current Weight"
            }
          ],
          "text": extractNumberFromWeight(value)
        },
        "subject": {
          "reference": `Patient/${patient}`
        },
        "encounter": {
          "reference": "Encounter/220e5514-b005-4462-a047-9e9114228e46"
        },
        "valueQuantity": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "KGs",
              "value": extractNumberFromWeight(value)
            }
          ]
        }
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

    return {
        id: data?.resource?.id,
        clientName: `${data?.resource?.name?.[0]?.family ?? ""} ${data?.resource?.name?.[0]?.given[0] ?? ""} ${data?.resource?.name?.[0]?.given[1] ?? ""}`,
        idNumber: organizeData(data?.resource?.identifier).NATIONAL_ID || organizeData(data?.resource?.identifier).BIRTH_CERTIFICATE || organizeData(data?.resource?.identifier).NEMIS_NUMBER || organizeData(data?.resource?.identifier).PASSPORT,
        phoneNumber: `${data?.resource?.contact?.[0]?.telecom?.[0]?.value} (${data?.resource?.contact?.[0]?.relationship?.[0]?.text})`,
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
    createObservationData,
}