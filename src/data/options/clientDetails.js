export const caregiverTypes = [
  { id: 1, label: 'Father', value: 'Father' },
  { id: 2, label: 'Mother', value: 'Mother' },
  { id: 3, label: 'Guardian', value: 'Guardian' },
]

export const identificationOptions = [
  {
    label: 'Birth Notification Number',
    value: 'Birth_Notification_Number',
    minAge: 0,
    maxAge: 2.9,
  },
  {
    label: 'Birth Certificate',
    value: 'Birth_Certificate',
    minAge: 0,
    maxAge: Infinity,
  },
  { label: 'National ID', value: 'ID_number', minAge: 18, maxAge: Infinity },
  { label: 'NEMIS Number', value: 'Nemis', minAge: 3, maxAge: 17.9 },
  { label: 'Passport', value: 'Passport', minAge: 0, maxAge: Infinity },
]
