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

export const manufacturerOptions = [
  { label: 'KEMRI', value: 'KEMRI' },
  { label: 'Kenya Biovax Institute', value: 'Kenya Biovax Institute' },
  { label: 'GlaxoSmithKline (GSK)', value: 'GlaxoSmithKline (GSK)' },
  { label: 'Pfizer', value: 'Pfizer' },
  { label: 'AstraZeneca', value: 'AstraZeneca' },
  { label: 'Sanofi Pasteur', value: 'Sanofi Pasteur' },
  { label: 'Serum Institute of India', value: 'Serum Institute of India' },
  { label: 'Moderna', value: 'Moderna' },
  { label: 'Johnson & Johnson', value: 'Johnson & Johnson' },
  { label: 'Bharat Biotech', value: 'Bharat Biotech' },
  { label: 'Sinovac Biotech', value: 'Sinovac Biotech' },
  { label: 'Biovac Institute', value: 'Biovac Institute' },
]
