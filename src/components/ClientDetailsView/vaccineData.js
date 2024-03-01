const routineVaccines = [
  {vaccineName: 'BCG', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'at_birth', adminRange: { start: 0, end: 1800 }},
  {vaccineName: 'BOPV', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'at_birth', adminRange: { start: 0, end: 14 }},

  {vaccineName: 'OPV 1', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_weeks'},
  {vaccineName: 'DPT 1', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_weeks'},
  {vaccineName: 'PCV 1', doseNumber: '2', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_weeks'},
  {vaccineName: 'Rota 1', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_weeks'},

  {vaccineName: 'OPV 2', doseNumber: '2', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '10_weeks'},
  {vaccineName: 'DPT 2', doseNumber: '2', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '10_weeks'},
  {vaccineName: 'PCV 2', doseNumber: '2', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '10_weeks'},
  {vaccineName: 'Rota 2', doseNumber: '2', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '10_weeks'},

  {vaccineName: 'OPV 3', doseNumber: '3', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'DPT 3', doseNumber: '3', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'PCV 3', doseNumber: '3', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'IPV', doseNumber: '3', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'Rota 3', doseNumber: '3', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '14_weeks'},

  {vaccineName: 'Vitamin A', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_months'},
  {vaccineName: 'Measles', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_months'},
  {vaccineName: 'Malaria 1', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '6_months'},

  {vaccineName: 'Malaria 2', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '7_months'},

  {vaccineName: 'Measles 1', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '9_months'},
  {vaccineName: 'Yellow Fever', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '9_months'},
  {vaccineName: 'Malaria 3', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '9_months'},

  {vaccineName: 'Vitamin A', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '12_months'},

  {vaccineName: 'Measles 2', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '18_months'},
  {vaccineName: 'Vitamin A', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '18_months'},

  {vaccineName: 'Malaria 4', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '24_months'},

  {vaccineName: 'HPV 1', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '10-14_years'},
  {vaccineName: 'HPV 2', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: '10-14_years'},
]

const nonRoutineVaccines = [
  {vaccineName: 'AstraZeneca', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Johnson & Johnson', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Pfizer/BioNTech', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Moderna', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Sinopharm', doseNumber: '0', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'covid_19'},

  {vaccineName: 'Tetanus 1', doseNumber: '1', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 2', doseNumber: '2', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 3', doseNumber: '3', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 4', doseNumber: '4', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 5', doseNumber: '5', dueDate: 'Jan 1 2020', dateAdministered: '', status: 'upcoming', category: 'tetanus'},
]

export { routineVaccines, nonRoutineVaccines }