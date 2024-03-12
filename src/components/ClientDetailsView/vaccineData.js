const routineVaccines = [
  {
    vaccineName: 'BCG',
    vaccineCode: 'IMBCG-I',
    diseaseTarget: 'Tuberculosis',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'at_birth',
    adminRange: { start: 0, end: 1800 },
  },
  {
    vaccineName: 'bOPV',
    vaccineCode: 'IMPO-bOPV',
    diseaseTarget: 'Polio',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'at_birth',
    adminRange: { start: 0, end: 14 },
  },
  {
    vaccineName: 'OPV I',
    vaccineCode: 'IMPO-OPV-I',
    diseaseTarget: 'Polio',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: {
      start: 42,
      end: 42,
    },
  },
  {
    vaccineName: 'DPT-HepB+Hib 1',
    vaccineCode: 'IMDPT-1',
    diseaseTarget: 'DPT-HepB+Hib 1',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: {
      start: 42,
      end: 42,
    },
  },
  {
    vaccineName: 'PCV10 1',
    vaccineCode: 'IMPCV10-1',
    diseaseTarget: 'Pneumonia',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: {
      start: 42,
      end: 42,
    },
  },
  {
    vaccineName: 'Rotavirus 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: {
      start: 42,
      end: 42,
    },
  },
  {
    vaccineName: 'OPV 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
  },
  {
    vaccineName: 'DPT 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
  },
  {
    vaccineName: 'PCV10 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
  },
  {
    vaccineName: 'Rotavirus 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
  },
  {
    vaccineName: 'OPV III',
    vaccineCode: 'IMPO-OPV-III',
    diseaseTarget: 'Polio',
    doseNumber: '3',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
  },
  {
    vaccineName: 'DPT 3',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '3',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
  },
  {
    vaccineName: 'PCV10 3',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '3',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
  },
  {
    vaccineName: 'IPV',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '3',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
  },
  {
    vaccineName: 'Rotavirus 3',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '3',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
  },
  {
    vaccineName: 'Vitamin A',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    adminRange: {
      start: 180,
      end: 180,
    },
  },
  {
    vaccineName: 'Measles',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    adminRange: {
      start: 180,
      end: 180,
    },
  },
  {
    vaccineName: 'Malaria 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    adminRange: {
      start: 180,
      end: 180,
    },
  },
  {
    vaccineName: 'Malaria 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '7_months',
    adminRange: {
      start: 210,
      end: 210,
    },
  },
  {
    vaccineName: 'Measles 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    adminRange: {
      start: 270,
      end: 270,
    },
  },
  {
    vaccineName: 'Yellow Fever',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    adminRange: {
      start: 270,
      end: 270,
    },
  },
  {
    vaccineName: 'Malaria 3',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    adminRange: {
      start: 270,
      end: 270,
    },
  },
  {
    vaccineName: 'Vitamin A',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '12_months',
    adminRange: {
      start: 360,
      end: 360,
    },
  },
  {
    vaccineName: 'Measles 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '18_months',
    adminRange: {
      start: 540,
      end: 540,
    },
  },
  {
    vaccineName: 'Vitamin A',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '18_months',
    adminRange: {
      start: 540,
      end: 540,
    },
  },
  {
    vaccineName: 'Malaria 4',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '24_months',
    adminRange: {
      start: 720,
      end: 720,
    },
  },
  {
    vaccineName: 'HPV 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10-14_years',
    adminRange: {
      start: 3650,
      end: 3650,
    },
  },
  {
    vaccineName: 'HPV 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10-14_years',
    adminRange: {
      start: 3650,
      end: 3650,
    },
  },
]

const nonRoutineVaccines = [
  {
    vaccineName: 'AstraZeneca',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
  },
  {
    vaccineName: 'Johnson & Johnson',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
  },
  {
    vaccineName: 'Pfizer/BioNTech',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
  },
  {
    vaccineName: 'Moderna',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
  },
  {
    vaccineName: 'Sinopharm',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '0',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
  },

  {
    vaccineName: 'Tetanus 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
  },
  {
    vaccineName: 'Tetanus 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
  },
  {
    vaccineName: 'Tetanus 3',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '3',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
  },
  {
    vaccineName: 'Tetanus 4',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '4',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
  },
  {
    vaccineName: 'Tetanus 5',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '5',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
  },

  {
    vaccineName: 'Yellow Fever',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'yellow_fever',
  },

  {
    vaccineName: 'Rabies 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
  },
  {
    vaccineName: 'Rabies 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
  },
  {
    vaccineName: 'Rabies 3',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
  },
  {
    vaccineName: 'Rabies 4',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
  },
  {
    vaccineName: 'Rabies 5',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
  },

  {
    vaccineName: 'Influenza 1',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '1',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'influenza',
  },
  {
    vaccineName: 'Influenza 2',
    vaccineCode: '',
    diseaseTarget: '',
    doseNumber: '2',
    dueDate: 'Jan 1 2020',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'influenza',
  },
]



export { routineVaccines, nonRoutineVaccines }
