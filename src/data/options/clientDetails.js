export const caregiverTypes = [
  { id: 1, label: 'Father', value: 'Father' },
  { id: 2, label: 'Mother', value: 'Mother' },
  { id: 3, label: 'Guardian', value: 'Guardian' },
]

export const identificationOptions = [
  {
    label: 'Birth Notification Number',
    value: 'BIRTH_NOTIFICATION_NUMBER',
    minAge: 0,
    maxAge: 2.9,
  },
  {
    label: 'Birth Certificate',
    value: 'BIRTH_CERTIFICATE',
    minAge: 0,
    maxAge: Infinity,
  },
  { label: 'ID Number', value: 'ID_NUMBER', minAge: 18, maxAge: Infinity },
  { label: 'NEMIS Number', value: 'NEMIS_NUMBER', minAge: 3, maxAge: 17.9 },
  { label: 'Passport', value: 'PASSPORT', minAge: 3, maxAge: Infinity },
]
