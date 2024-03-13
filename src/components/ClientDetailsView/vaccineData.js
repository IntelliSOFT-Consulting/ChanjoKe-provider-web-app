import moment from 'moment'
const routineVaccines = [
  {
    vaccineName: 'BCG',
    vaccineCode: 'IMBCG-I',
    diseaseTarget: 'Tuberculosis',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'at_birth',
    adminRange: { start: 0, end: 0 },
    dueDate: (dob, _) => moment(dob).format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'bOPV',
    vaccineCode: 'IMPO-bOPV',
    diseaseTarget: 'Polio',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'at_birth',
    adminRange: { start: 0, end: 0 },
    dueDate: (dob, _) => moment(dob).format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'OPV I',
    vaccineCode: 'IMPO-OPV-I',
    diseaseTarget: 'Polio',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: { start: 42, end: 42 },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'DPT-HepB+Hib 1',
    vaccineCode: 'IMDPT-1',
    diseaseTarget: 'DPT-HepB+Hib 1',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: { start: 42, end: 42 },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'PCV10 1',
    vaccineCode: 'IMPCV10-1',
    diseaseTarget: 'Pneumonia',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: {
      start: 42,
      end: 42,
    },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Rotavirus 1',
    vaccineCode: 'IMROTA-1',
    diseaseTarget: '',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    adminRange: {
      start: 42,
      end: 42,
    },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'OPV II',
    vaccineCode: 'IMPO-OPV-II',
    diseaseTarget: '',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
    dependentVaccine: 'IMPO-OPV-I',
    dueDate: (dob, opv1) => {
      const date =
        opv1?.status === 'completed'
          ? opv1.occurrenceDateTime
            ? moment(opv1.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(70, 'days')
          : moment(dob).add(70, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'DPT-HepB+Hib 2',
    vaccineCode: 'IMDPT-2',
    diseaseTarget: '',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
    dependentVaccine: 'IMDPT-1',
    dueDate: (dob, dpt1) => {
      const date =
        dpt1?.status === 'completed'
          ? dpt1.occurrenceDateTime
            ? moment(dpt1.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(70, 'days')
          : moment(dob).add(70, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'PCV10 2',
    vaccineCode: 'IMPCV10-2',
    diseaseTarget: '',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
    dependentVaccine: 'IMPCV10-1',
    dueDate: (dob, pcv1) => {
      const date =
        pcv1?.status === 'completed'
          ? pcv1.occurrenceDateTime
            ? moment(pcv1.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(70, 'days')
          : moment(dob).add(70, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'Rotavirus 2',
    vaccineCode: 'IMROTA-2',
    diseaseTarget: '',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    adminRange: {
      start: 70,
      end: 70,
    },
    dependentVaccine: 'IMROTA-1',
    dueDate: (dob, rota1) => {
      const date =
        rota1?.status === 'completed'
          ? rota1.occurrenceDateTime
            ? moment(rota1.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(70, 'days')
          : moment(dob).add(70, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'OPV III',
    vaccineCode: 'IMPO-OPV-III',
    diseaseTarget: 'Polio',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
    dependentVaccine: 'IMPO-OPV-II',
    dueDate: (dob, opv2) => {
      const date =
        opv2?.status === 'completed'
          ? opv2.occurrenceDateTime
            ? moment(opv2.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(98, 'days')
          : moment(dob).add(98, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'DPT-HepB+Hib 3',
    vaccineCode: 'IMDPT-3',
    diseaseTarget: '',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
    dependentVaccine: 'IMDPT-2',
    dueDate: (dob, dpt2) => {
      const date =
        dpt2?.status === 'completed'
          ? dpt2.occurrenceDateTime
            ? moment(dpt2.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(98, 'days')
          : moment(dob).add(98, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'PCV10 3',
    vaccineCode: 'IMPCV10-3',
    diseaseTarget: '',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
    dependentVaccine: 'IMPCV10-2',
    dueDate: (dob, pcv2) => {
      const date =
        pcv2?.status === 'completed'
          ? pcv2.occurrenceDateTime
            ? moment(pcv2.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(98, 'days')
          : moment(dob).add(98, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'IPV',
    vaccineCode: 'IMPO-IPV I',
    diseaseTarget: '',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
    dueDate: (dob, _) => moment(dob).add(98, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Rotavirus 3',
    vaccineCode: 'IMROTA-3',
    diseaseTarget: '',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    adminRange: {
      start: 98,
      end: 98,
    },
    dependentVaccine: 'IMROTA-2',
    dueDate: (dob, rota2) => {
      const date =
        rota2?.status === 'completed'
          ? rota2.occurrenceDateTime
            ? moment(rota2.occurrenceDateTime).add(28, 'days')
            : moment(dob).add(98, 'days')
          : moment(dob).add(98, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'Vitamin A 1st Dose',
    vaccineCode: 'IMVIT-1',
    diseaseTarget: '',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    adminRange: {
      start: 180,
      end: 180,
    },
    dueDate: (dob, _) => moment(dob).add(180, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Measles-Rubella',
    vaccineCode: 'IMMEAS-0',
    diseaseTarget: '',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    adminRange: {
      start: 180,
      end: 180,
    },
    dueDate: (dob, _) => moment(dob).add(180, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 1)',
    vaccineCode: 'IMMALA-1',
    diseaseTarget: '',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    adminRange: {
      start: 180,
      end: 180,
    },
    dueDate: (dob, _) => moment(dob).add(180, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 2)',
    vaccineCode: 'IMMALA-2',
    diseaseTarget: '',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '7_months',
    adminRange: {
      start: 210,
      end: 210,
    },
    dependentVaccine: 'IMMALA-1',
    dueDate: (dob, malaria1) => {
      const date =
        malaria1?.status === 'completed'
          ? malaria1.occurrenceDateTime
            ? moment(malaria1.occurrenceDateTime).add(30, 'days')
            : moment(dob).add(210, 'days')
          : moment(dob).add(210, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'Measles-Rubella 1st Dose',
    vaccineCode: 'IMMEAS-1',
    diseaseTarget: '',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    adminRange: {
      start: 270,
      end: 270,
    },
    dueDate: (dob, _) => moment(dob).add(270, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Yellow Fever',
    vaccineCode: 'IMYF-I',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    adminRange: {
      start: 270,
      end: 270,
    },
    dueDate: (dob, _) => moment(dob).add(270, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 3)',
    vaccineCode: 'IMMALA-3',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    adminRange: {
      start: 270,
      end: 270,
    },
    dependentVaccine: 'IMMALA-2',
    dueDate: (dob, malaria2) => {
      const date =
        malaria2?.status === 'completed'
          ? malaria2.occurrenceDateTime
            ? moment(malaria2.occurrenceDateTime).add(30, 'days')
            : moment(dob).add(270, 'days')
          : moment(dob).add(270, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'Vitamin A 2nd Dose',
    vaccineCode: 'IMVIT-2',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '12_months',
    adminRange: {
      start: 360,
      end: 360,
    },
    dependentVaccine: 'IMVIT-1',
    dueDate: (dob, vit1) => {
      const date =
        vit1?.status === 'completed'
          ? vit1.occurrenceDateTime
            ? moment(vit1.occurrenceDateTime).add(180, 'days')
            : moment(dob).add(360, 'days')
          : moment(dob).add(360, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'Measles-Rubella 2nd Dose',
    vaccineCode: 'IMMEAS-2',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '18_months',
    adminRange: {
      start: 540,
      end: 540,
    },
    dependentVaccine: 'IMMEAS-1',
    dueDate: (dob, measles1) => {
      const date =
        measles1?.status === 'completed'
          ? measles1.occurrenceDateTime
            ? moment(measles1.occurrenceDateTime).add(180, 'days')
            : moment(dob).add(540, 'days')
          : moment(dob).add(540, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'Vitamin A 3rd Dose',
    vaccineCode: 'IMVIT-3',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '18_months',
    adminRange: {
      start: 540,
      end: 540,
    },
    dependentVaccine: 'IMVIT-2',
    dueDate: (dob, vit2) => {
      const date =
        vit2?.status === 'completed'
          ? vit2.occurrenceDateTime
            ? moment(vit2.occurrenceDateTime).add(180, 'days')
            : moment(dob).add(540, 'days')
          : moment(dob).add(540, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 4)',
    vaccineCode: 'IMMALA-4',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '24_months',
    adminRange: {
      start: 720,
      end: 720,
    },
    dependentVaccine: 'IMMALA-3',
    dueDate: (dob, malaria3) => {
      const date =
        malaria3?.status === 'completed'
          ? malaria3.occurrenceDateTime
            ? moment(malaria3.occurrenceDateTime).add(180, 'days')
            : moment(dob).add(720, 'days')
          : moment(dob).add(720, 'days')

      return date.format('DD-MM-YYYY')
    },
  },
  {
    vaccineName: 'HPV Vaccine 1',
    vaccineCode: 'IMHPV-1',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10-14_years',
    adminRange: {
      start: 3650,
      end: 3650,
    },
    dueDate: (dob, _) => moment(dob).add(3650, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'HPV Vaccine 2',
    vaccineCode: 'IMHPV-2',
    diseaseTarget: '',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10-14_years',
    adminRange: {
      start: 3650,
      end: 3650,
    },
    dependentVaccine: 'IMHPV-1',
    dueDate: (dob, hpv1) => {
      const date =
        hpv1?.status === 'completed'
          ? hpv1.occurrenceDateTime
            ? moment(hpv1.occurrenceDateTime).add(180, 'days')
            : moment(dob).add(3650, 'days')
          : moment(dob).add(3650, 'days')

      return date.format('DD-MM-YYYY')
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
    vaccineCode: 'IMYF-I',
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
