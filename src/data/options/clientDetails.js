export const caregiverTypes = [
  { id: 1, label: 'Father', value: 'Father' },
  { id: 2, label: 'Mother', value: 'Mother' },
  { id: 3, label: 'Guardian', value: 'Guardian' },
]

export const caregiverRelationships = [
  { id: 1, label: 'Next of Kin', value: 'kin' },
  { id: 2, label: 'Parent/Guardian', value: 'parent'}
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

export const reasons = [
  {
    label: 'High Demand',
    value: 'High Demand',
  },
  {
    label: 'Stock Shortage',
    value: 'Stock Shortage',
  },
  {
    label: 'Inventory Discrepancy',
    value: 'Inventory Discrepancy',
  },
  {
    label: 'Cold Chain Failure',
    value: 'Cold Chain Failure',
  },
  {
    label: 'Supply Chain Delay',
    value: 'Supply Chain Delay',
  },
  {
    label: 'Emergency Situation',
    value: 'Emergency Situation',
  },
  {
    label: 'New Vaccination Campaign',
    value: 'New Vaccination Campaign',
  },
  {
    label: 'Expired Stock',
    value: 'Expired Stock',
  },
  {
    label: 'Vaccine Wastage',
    value: 'Vaccine Wastage',
  },
  {
    label: 'Population Growth',
    value: 'Population Growth',
  },
]
