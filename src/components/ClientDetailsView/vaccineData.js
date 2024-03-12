const routineVaccines = [
  {vaccineName: 'BCG', vaccineCode: 'IMBCG-I', diseaseTarget: 'Tuberculosis', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'at_birth', adminRange: { start: 0, end: 1800 }},
  {vaccineName: 'bOPV', vaccineCode: 'IMPO-bOPV', diseaseTarget: 'Polio', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'at_birth', adminRange: { start: 0, end: 14 }},

  {vaccineName: 'OPV I', vaccineCode: 'IMPO-OPV-I', diseaseTarget: 'Polio', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_weeks'},
  {vaccineName: 'DPT-HepB+Hib 1', vaccineCode: 'IMDPT-1', diseaseTarget: 'DPT-HepB+Hib 1', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_weeks'},
  {vaccineName: 'PCV10 1', vaccineCode: 'IMPCV10-1', diseaseTarget: 'Pneumonia', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_weeks'},
  {vaccineName: 'Rotavirus 1', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_weeks'},

  {vaccineName: 'OPV 2', vaccineCode: '', diseaseTarget: '', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '10_weeks'},
  {vaccineName: 'DPT 2', vaccineCode: '', diseaseTarget: '', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '10_weeks'},
  {vaccineName: 'PCV10 2', vaccineCode: '', diseaseTarget: '', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '10_weeks'},
  {vaccineName: 'Rotavirus 2', vaccineCode: '', diseaseTarget: '', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '10_weeks'},

  {vaccineName: 'OPV III', vaccineCode: 'IMPO-OPV-III', diseaseTarget: 'Polio', doseNumber: '3', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'DPT 3', vaccineCode: '', diseaseTarget: '', doseNumber: '3', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'PCV10 3', vaccineCode: '', diseaseTarget: '', doseNumber: '3', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'IPV', vaccineCode: '', diseaseTarget: '', doseNumber: '3', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '14_weeks'},
  {vaccineName: 'Rotavirus 3', vaccineCode: '', diseaseTarget: '', doseNumber: '3', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '14_weeks'},

  {vaccineName: 'Vitamin A', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_months'},
  {vaccineName: 'Measles', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_months'},
  {vaccineName: 'Malaria 1', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '6_months'},

  {vaccineName: 'Malaria 2', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '7_months'},

  {vaccineName: 'Measles 1', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '9_months'},
  {vaccineName: 'Yellow Fever', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '9_months'},
  {vaccineName: 'Malaria 3', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '9_months'},

  {vaccineName: 'Vitamin A', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '12_months'},

  {vaccineName: 'Measles 2', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '18_months'},
  {vaccineName: 'Vitamin A', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '18_months'},

  {vaccineName: 'Malaria 4', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '24_months'},

  {vaccineName: 'HPV 1', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '10-14_years'},
  {vaccineName: 'HPV 2', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: '10-14_years'},
]

const nonRoutineVaccines = [
  {vaccineName: 'AstraZeneca', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Johnson & Johnson', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Pfizer/BioNTech', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Moderna', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'covid_19'},
  {vaccineName: 'Sinopharm', vaccineCode: '', diseaseTarget: '', doseNumber: '0', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'covid_19'},

  {vaccineName: 'Tetanus 1', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 2', vaccineCode: '', diseaseTarget: '', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 3', vaccineCode: '', diseaseTarget: '', doseNumber: '3', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 4', vaccineCode: '', diseaseTarget: '', doseNumber: '4', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'tetanus'},
  {vaccineName: 'Tetanus 5', vaccineCode: '', diseaseTarget: '', doseNumber: '5', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'tetanus'},

  {vaccineName: 'Yellow Fever', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'yellow_fever'},

  {vaccineName: 'Rabies 1', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'rabies'},
  {vaccineName: 'Rabies 2', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'rabies'},
  {vaccineName: 'Rabies 3', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'rabies'},
  {vaccineName: 'Rabies 4', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'rabies'},
  {vaccineName: 'Rabies 5', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'rabies'},

  {vaccineName: 'Influenza 1', vaccineCode: '', diseaseTarget: '', doseNumber: '1', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'influenza'},
  {vaccineName: 'Influenza 2', vaccineCode: '', diseaseTarget: '', doseNumber: '2', dueDate: 'Jan 1 2020', occurrenceDateTime: '', status: 'upcoming', category: 'influenza'},
]

export { routineVaccines, nonRoutineVaccines }