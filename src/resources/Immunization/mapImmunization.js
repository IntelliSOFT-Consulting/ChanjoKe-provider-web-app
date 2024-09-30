const postImmunization = (data, status) => {
  return {
    "resourceType" : "Immunization",
    "status" : status,
    "statusReason" : { CodeableConcept }, // Reason for current status
    "vaccineCode" : {
      "coding": [
        {
            "code": data?.vaccineCode,
            "display": data?.vaccineName,
        }
      ],
      "text": data?.vaccineName,
    },
    "patient" : { Reference(Patient) }, // R!  Who was immunized
    "encounter" : { Reference(Encounter) }, // Encounter immunization was part of
    // occurrence[x]: Vaccine administration date. One of these 2:
    "occurrenceDateTime" : "<dateTime>",
    "occurrenceString" : "<string>",
    "recorded" : "<dateTime>", // When the immunization was first captured in the subject's record
    "primarySource" : <boolean>, // Indicates context the data was recorded in
    // informationSource[x]: Indicates the source of a  reported record. One of these 2:
    "informationSourceCodeableConcept" : { CodeableConcept },
    "informationSourceReference" : { Reference(Organization|Patient|Practitioner|
     PractitionerRole|RelatedPerson) },
    "location" : { Reference(Location) }, // Where immunization occurred
    "manufacturer" : { Reference(Organization) }, // Vaccine manufacturer
    "lotNumber" : "<string>", // Vaccine lot number
    "expirationDate" : "<date>", // Vaccine expiration date
    "site" : { CodeableConcept }, // Body site vaccine  was administered
    "route" : { CodeableConcept }, // How vaccine entered body
    "doseQuantity" : { Quantity(SimpleQuantity) }, // Amount of vaccine administered
    "performer" : [{ // Who performed event
      "function" : { CodeableConcept }, // What type of performance was done
      "actor" : { Reference(Organization|Practitioner|PractitionerRole) } // R!  Individual or organization who was performing
    }],
    "note" : [{ Annotation }], // Additional immunization notes
    "reason" : [{ CodeableReference(Condition|DiagnosticReport|Observation) }], // Why immunization occurred
    "isSubpotent" : <boolean>, // Dose potency
    "subpotentReason" : [{ CodeableConcept }], // Reason for being subpotent
    "education" : [{ // Educational material presented to patient
      "documentType" : "<string>", // Educational material document identifier
      "reference" : "<uri>", // Educational material reference pointer
      "publicationDate" : "<dateTime>", // Educational material publication date
      "presentationDate" : "<dateTime>" // Educational material presentation date
    }],
    "programEligibility" : [{ CodeableConcept }], // Patient eligibility for a vaccination program
    "fundingSource" : { CodeableConcept }, // Funding source for the vaccine
    "reaction" : [{ // Details of a reaction that follows immunization
      "date" : "<dateTime>", // When reaction started
      "detail" : { Reference(Observation) }, // Additional information on reaction
      "reported" : <boolean> // Indicates self-reported reaction
    }],
    "protocolApplied" : [{ // Protocol followed by the provider
      "series" : "<string>", // Name of vaccine series
      "authority" : { Reference(Organization) }, // Who is responsible for publishing the recommendations
      "targetDisease" : [{ CodeableConcept }], // Vaccine preventatable disease being targetted
      // doseNumber[x]: Dose number within series. One of these 2:
      "doseNumberPositiveInt" : "<positiveInt>",
      "doseNumberString" : "<string>",
      // seriesDoses[x]: Recommended number of doses for immunity. One of these 2:
      "seriesDosesPositiveInt" : "<positiveInt>"
      "seriesDosesString" : "<string>"
    }]
  }
}