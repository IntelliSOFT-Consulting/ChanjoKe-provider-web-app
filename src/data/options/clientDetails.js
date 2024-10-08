export const caregiverTypes = [
  { id: 1, label: 'Father', value: 'Father' },
  { id: 2, label: 'Mother', value: 'Mother' },
  { id: 3, label: 'Guardian', value: 'Guardian' },
  { id: 4, label: 'Grandparent', value: 'Grandparent' },
  { id: 5, label: 'Foster Parent', value: 'Foster Parent' },
  { id: 6, label: 'Sibling', value: 'Sibling' },
  { id: 7, label: 'Aunt/Uncle', value: 'Aunt/Uncle' },
  { id: 8, label: 'Stepparent', value: 'Stepparent' },
  { id: 9, label: 'Cousin', value: 'Cousin' },
  { id: 10, label: 'Family Friend', value: 'Family Friend' },
  { id: 11, label: 'Neighbor', value: 'Neighbor' },
  { id: 12, label: 'Nanny/Babysitter', value: 'Nanny/Babysitter' },
  { id: 13, label: 'Social Worker', value: 'Social Worker' },
  { id: 14, label: 'Other', value: 'Other' },
]

export const caregiverRelationships = [
  { id: 1, label: 'Next of Kin', value: 'kin' },
  { id: 2, label: 'Parent/Guardian', value: 'parent' },
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
  { label: 'LG Chem', value: 'LG Chem' },
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

export const vvmStatuses = [
  { label: 'Stage 1', value: 'Stage 1' },
  { label: 'Stage 2', value: 'Stage 2' },
  { label: 'Stage 3', value: 'Stage 3' },
  { label: 'Stage 4', value: 'Stage 4' },
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

export const roleGroups = [
  {
    label: 'Administrator',
    value: 'ADMINISTRATOR',
    creators: ['ADMINISTRATOR'],
    locations: ['COUNTRY'],
  },
  {
    label: 'National System Administrator',
    value: 'NATIONAL_SYSTEM_ADMINISTRATOR',
    creators: ['ADMINISTRATOR'],
    locations: ['COUNTRY'],
  },
  {
    label: 'County System Administrator',
    value: 'COUNTY_SYSTEM_ADMINISTRATOR',
    creators: ['ADMINISTRATOR', 'NATIONAL_SYSTEM_ADMINISTRATOR'],
    locations: ['COUNTY'],
  },
  {
    label: 'Sub-County HRIO',
    value: 'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
    creators: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
    ],
    locations: ['SUB-COUNTY'],
  },
  {
    label: 'Sub-County EPI Manager',
    value: 'SUB_COUNTY_STORE_MANAGER',
    creators: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
    ],
    locations: ['SUB-COUNTY'],
  },
  {
    label: 'Facility System Administrator',
    value: 'FACILITY_SYSTEM_ADMINISTRATOR',
    creators: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
      'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
    ],
    locations: ['FACILITY'],
  },
  {
    label: 'Facility Store Manager',
    value: 'FACILITY_STORE_MANAGER',
    creators: [
      'ADMINISTRATOR',
      'NATIONAL_SYSTEM_ADMINISTRATOR',
      'COUNTY_SYSTEM_ADMINISTRATOR',
      'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
      'FACILITY_SYSTEM_ADMINISTRATOR',
    ],
    locations: ['FACILITY'],
  },
  {
    label: 'Clerk',
    value: 'CLERK',
    creators: ['ADMINISTRATOR', 'FACILITY_SYSTEM_ADMINISTRATOR'],
    locations: ['FACILITY'],
  },
  {
    label: 'Doctor',
    value: 'DOCTOR',
    creators: ['ADMINISTRATOR', 'FACILITY_SYSTEM_ADMINISTRATOR'],
    locations: ['FACILITY'],
  },
  {
    label: 'Nurse',
    value: 'NURSE',
    creators: [
      'ADMINISTRATOR',
      'FACILITY_SYSTEM_ADMINISTRATOR',
      'DOCTOR',
      'LAB_TECHNICIAN',
    ],
    locations: ['FACILITY'],
  },
]

export const caregiverIdentificationTypes = [
  { label: 'National ID', value: 'National ID' },
  { label: 'Passport', value: 'Passport' },
  { label: 'NEMIS', value: 'NEMIS' },
  { label: 'None', value: 'None' },
]

// the priority of identification types
export const identificationPriority = [
  'ID_number',
  'Passport',
  'Birth_Certificate',
  'NEMIS',
  'Birth_Notification_Number',
]
