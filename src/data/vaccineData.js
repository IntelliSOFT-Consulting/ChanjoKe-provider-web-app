import moment from 'moment'

export const routineVaccines = [
  {
    vaccineName: 'BCG',
    vaccineCode: 'IMBCG-I',
    nhddCode: '10517',
    diseaseTarget: 'Tuberculosis',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'at_birth',
    description: 'routine',
    adminRange: { start: 0, end: 1794, unit: 'days' },
    dueDate: (dob, _) => moment(dob).format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'bOPV',
    vaccineCode: 'IMPO-bOPV',
    nhddCode: '54379',
    diseaseTarget: 'Polio',
    doseNumber: '0',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'at_birth',
    description: 'routine',
    adminRange: { start: 0, end: 1825, unit: 'days' },
    dueDate: (dob, _) => moment(dob).format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'OPV I',
    vaccineCode: 'IMPO-OPV-I',
    nhddCode: '54379',
    diseaseTarget: 'Polio',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    description: 'routine',
    adminRange: { start: 42, end: 42, unit: 'days' },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'DPT-HepB+Hib 1',
    vaccineCode: 'IMDPT-1',
    nhddCode: '50732',
    diseaseTarget: 'DPT-HepB+Hib 1',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    description: 'routine',
    adminRange: { start: 42, end: 1825, unit: 'days' },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'PCV10 1',
    vaccineCode: 'IMPCV10-1',
    nhddCode: '3573',
    diseaseTarget: 'Pneumonia',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    description: 'routine',
    adminRange: {
      start: 42,
      end: 1825,
      unit: 'days',
    },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Rotavirus 1',
    vaccineCode: 'IMROTA-1',
    nhddCode: '2763',
    diseaseTarget: 'Rotavirus',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_weeks',
    description: 'routine',
    adminRange: {
      start: 42,
      end: 365,
    },
    constraints: {
      gender: 'Female',
      HIVStatus: 'Positive',
    },
    dueDate: (dob, _) => moment(dob).add(42, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'OPV II',
    vaccineCode: 'IMPO-OPV-II',
    nhddCode: '54379',
    diseaseTarget: 'Polio',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    description: 'routine',
    adminRange: {
      start: 70,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMPO-OPV-I',
    dependencyPeriod: 28,
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
    nhddCode: '18035',
    diseaseTarget:
      'Diptheria, Pertussis, Tetanus, Hepatitis B, Influenza type B',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    description: 'routine',
    adminRange: {
      start: 70,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMDPT-1',
    dependencyPeriod: 28,
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
    nhddCode: '3573',
    diseaseTarget: 'Pneumonia',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    description: 'routine',
    adminRange: {
      start: 70,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMPCV10-1',
    dependencyPeriod: 28,
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
    nhddCode: '2763',
    diseaseTarget: 'Rotavirus',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10_weeks',
    description: 'routine',
    adminRange: {
      start: 70,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMROTA-1',
    dependencyPeriod: 28,
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
    nhddCode: '54379',
    diseaseTarget: 'Polio',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    description: 'routine',
    adminRange: {
      start: 98,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMPO-OPV-II',
    dependencyPeriod: 28,
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
    nhddCode: '50732',
    diseaseTarget:
      'Diptheria, Pertussis, Tetanus, Hepatitis B, Influenza type B',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    description: 'routine',
    adminRange: {
      start: 98,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMDPT-2',
    dependencyPeriod: 28,
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
    nhddCode: '3573',
    diseaseTarget: 'Pneumonia',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    description: 'routine',
    adminRange: {
      start: 98,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMPCV10-2',
    dependencyPeriod: 28,
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
    nhddCode: '3549',
    diseaseTarget: 'Polio',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    description: 'routine',
    adminRange: {
      start: 98,
      end: 1825,
      unit: 'days',
    },
    dueDate: (dob, _) => moment(dob).add(98, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Rotavirus 3',
    vaccineCode: 'IMROTA-3',
    nhddCode: '2763',
    diseaseTarget: 'Rotavirus',
    doseNumber: '3',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '14_weeks',
    description: 'routine',
    adminRange: {
      start: 98,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMROTA-2',
    dependencyPeriod: 28,
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
    nhddCode: '1107',
    diseaseTarget: 'Vitamin A Deficiency',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    description: 'routine',
    adminRange: {
      start: 180,
      end: 1825,
      unit: 'days',
    },
    dueDate: (dob, _) => moment(dob).add(180, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Measles-Rubella',
    vaccineCode: 'IMMEAS-0',
    nhddCode: '24014',
    diseaseTarget: 'Measles, Rubella',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    description: 'routine',
    adminRange: {
      start: 180,
      end: 183,
      unit: 'days',
    },
    constraints: {
      HIVStatus: 'Positive',
      outbreak: true,
    },
    dueDate: (dob, _) => moment(dob).add(180, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 1)',
    vaccineCode: 'IMMALA-1',
    nhddCode: '15846',
    diseaseTarget: 'Malaria',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '6_months',
    description: 'routine',
    adminRange: {
      start: 180,
      end: 1825,
      unit: 'days',
    },
    dueDate: (dob, _) => moment(dob).add(180, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 2)',
    vaccineCode: 'IMMALA-2',
    nhddCode: '15846',
    diseaseTarget: 'Malaria',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '7_months',
    description: 'routine',
    adminRange: {
      start: 210,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMMALA-1',
    dependencyPeriod: 30,
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
    nhddCode: '24014',
    diseaseTarget: 'Measles, Rubella',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    description: 'routine',
    adminRange: {
      start: 270,
      end: 5475,
      unit: 'days',
    },
    dueDate: (dob, _) => moment(dob).add(270, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'Yellow Fever',
    vaccineCode: 'IMYF-I',
    nhddCode: '1002',
    diseaseTarget: 'Yellow Fever',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    description: 'routine',
    adminRange: {
      start: 270,
      end: 5475,
      unit: 'days',
    },
    dueDate: (dob, _) => moment(dob).add(270, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'RTS/AS01 (Malaria Vaccine - 3)',
    vaccineCode: 'IMMALA-3',
    nhddCode: '15846',
    diseaseTarget: 'Malaria',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '9_months',
    description: 'routine',
    adminRange: {
      start: 270,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMMALA-2',
    dependencyPeriod: 30,
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
    nhddCode: '1107',
    diseaseTarget: 'Vitamin A Deficiency',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '12_months',
    description: 'routine',
    adminRange: {
      start: 360,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMVIT-1',
    dependencyPeriod: 180,
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
    nhddCode: '24014',
    diseaseTarget: 'Measles, Rubella',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '18_months',
    description: 'routine',
    adminRange: {
      start: 540,
      end: 5475,
      unit: 'days',
    },
    dependentVaccine: 'IMMEAS-1',
    dependencyPeriod: 180,
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
    nhddCode: '1107',
    diseaseTarget: 'Vitamin A Deficiency',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '18_months',
    adminRange: {
      start: 540,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMVIT-2',
    description: 'routine',
    dependencyPeriod: 180,
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
    nhddCode: '15846',
    diseaseTarget: 'Malaria',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '24_months',
    adminRange: {
      start: 720,
      end: 1825,
      unit: 'days',
    },
    dependentVaccine: 'IMMALA-3',
    description: 'routine',
    dependencyPeriod: 180,
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
    nhddCode: '29659',
    diseaseTarget: 'Human Papillomavirus',
    doseNumber: '1',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10-14_years',
    description: 'routine',
    adminRange: {
      start: 3650,
      end: 3650,
      unit: 'days',
    },
    constraints: {
      gender: 'Male',
    },
    dueDate: (dob, _) => moment(dob).add(3650, 'days').format('DD-MM-YYYY'),
  },
  {
    vaccineName: 'HPV Vaccine 2',
    vaccineCode: 'IMHPV-2',
    nhddCode: '29659',
    diseaseTarget: 'Human Papillomarivus',
    doseNumber: '2',
    occurrenceDateTime: '',
    status: 'upcoming',
    category: '10-14_years',
    description: 'routine',
    adminRange: {
      start: 3650,
      end: 3650,
      unit: 'days',
    },
    dependentVaccine: 'IMHPV-1',
    dependencyPeriod: 180,
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

export const nonRoutineVaccines = [
  {
    vaccineName: 'AstraZeneca',
    vaccineCode: 'IMCOV-ASTR-1',
    nhddCode: '16927',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    description: 'non-routine',
    adminRange: {
      start: 6570,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'AstraZeneca 2nd Dose',
    vaccineCode: 'IMCOV-ASTR-2',
    nhddCode: '16927',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    dependentVaccine: 'IMCOV-ASTR-1',
    description: 'non-routine',
    dependencyPeriod: 84,
    adminRange: {
      start: 6570,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Johnson & Johnson',
    vaccineCode: 'IMCOV-JnJ-0',
    nhddCode: '16927',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    description: 'non-routine',
    adminRange: {
      start: 6570,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Pfizer/BioNTech 1st Dose',
    vaccineCode: 'IMCOV-PFIZER-1',
    nhddCode: '16929',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    description: 'non-routine',
    adminRange: {
      start: 4380,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Pfizer/BioNTech 2nd Dose',
    vaccineCode: 'IMCOV-PFIZER-2',
    nhddCode: '16929',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    dependentVaccine: 'IMCOV-PFIZER-1',
    description: 'non-routine',
    dependencyPeriod: 28,
    adminRange: {
      start: 4380,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Moderna 1st Dose',
    vaccineCode: 'IMCOV-MOD-1',
    nhddCode: '16931',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    description: 'non-routine',
    adminRange: {
      start: 6570,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Moderna 2nd Dose',
    vaccineCode: 'IMCOV-MOD-2',
    nhddCode: '16931',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    dependentVaccine: 'IMCOV-MOD-1',
    description: 'non-routine',
    dependencyPeriod: 28,
    adminRange: {
      start: 6570,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Sinopharm 1st Dose',
    vaccineCode: 'IMCOV-SINO-1',
    nhddCode: '16489',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    description: 'non-routine',
    adminRange: {
      start: 6570,
      end: 21900,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Sinopharm 2nd Dose',
    vaccineCode: 'IMCOV-SINO-2',
    nhddCode: '16489',
    diseaseTarget: 'Covid 19 (SARS-CoV-2)',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'covid_19',
    dependentVaccine: 'IMCOV-SINO-1',
    description: 'non-routine',
    dependencyPeriod: 28,
    adminRange: {
      start: 6570,
      end: 21900,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Tetanus 1',
    vaccineCode: 'IMTD-1',
    nhddCode: '50732',
    diseaseTarget: 'Tetanus',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
    description: 'non-routine',
    adminRange: {
      start: 548,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Tetanus 2',
    vaccineCode: 'IMTD-2',
    nhddCode: '50732',
    diseaseTarget: 'Tetanus',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
    dependentVaccine: 'IMTD-1',
    description: 'non-routine',
    dependencyPeriod: 30,
    adminRange: {
      start: 588,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Tetanus 3',
    vaccineCode: 'IMTD-3',
    nhddCode: '50732',
    diseaseTarget: 'Tetanus',
    doseNumber: '3',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
    dependentVaccine: 'IMTD-2',
    description: 'non-routine',
    dependencyPeriod: 183,
    adminRange: {
      start: 771,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Tetanus 4',
    vaccineCode: 'IMTD-4',
    nhddCode: '50732',
    diseaseTarget: 'Tetanus',
    doseNumber: '4',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
    dependentVaccine: 'IMTD-3',
    description: 'non-routine',
    dependencyPeriod: 365,
    adminRange: {
      start: 1136,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Tetanus 5',
    vaccineCode: 'IMTD-5',
    nhddCode: '50732',
    diseaseTarget: 'Tetanus',
    doseNumber: '5',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'tetanus',
    dependentVaccine: 'IMTD-4',
    description: 'non-routine',
    dependencyPeriod: 365,
    adminRange: {
      start: 1501,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Yellow Fever',
    vaccineCode: 'IMYF-I',
    nhddCode: '1002',
    diseaseTarget: 'Yellow Fever',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'yellow_fever',
    description: 'non-routine',
    adminRange: {
      start: 273,
      end: Infinity,
      unit: 'days',
    },
  },

  {
    vaccineName: 'Rabies 1',
    vaccineCode: 'IMRABIES-RABIES-1',
    nhddCode: '13809',
    diseaseTarget: 'Rabies',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
    description: 'non-routine',
    adminRange: {
      start: 0,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Rabies 2',
    vaccineCode: 'IMRABIES-RABIES-2',
    nhddCode: '13809',
    diseaseTarget: 'Rabies',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
    dependentVaccine: 'IMRABIES-RABIES-1',
    description: 'non-routine',
    dependencyPeriod: 3,
    adminRange: {
      start: 3,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Rabies 3',
    vaccineCode: 'IMRABIES-RABIES-3',
    nhddCode: '13809',
    diseaseTarget: 'Rabies',
    doseNumber: '3',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
    dependentVaccine: 'IMRABIES-RABIES-2',
    description: 'non-routine',
    dependencyPeriod: 4,
    adminRange: {
      start: 7,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Rabies 4',
    vaccineCode: 'IMRABIES-RABIES-4',
    nhddCode: '13809',
    diseaseTarget: 'Rabies',
    doseNumber: '4',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
    dependentVaccine: 'IMRABIES-RABIES-3',
    description: 'non-routine',
    dependencyPeriod: 7,
    adminRange: {
      start: 14,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Rabies 5',
    vaccineCode: 'IMRABIES-RABIES-5',
    nhddCode: '13809',
    diseaseTarget: 'Rabies',
    doseNumber: '5',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'rabies',
    dependentVaccine: 'IMRABIES-RABIES-4',
    description: 'non-routine',
    dependencyPeriod: 14,
    adminRange: {
      start: 28,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Influenza 1',
    vaccineCode: 'IMINFLU-1',
    nhddCode: '6306',
    diseaseTarget: 'Influenza',
    doseNumber: '1',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'influenza',
    description: 'non-routine',
    adminRange: {
      start: 182,
      end: Infinity,
      unit: 'days',
    },
  },
  {
    vaccineName: 'Influenza 2',
    vaccineCode: 'IMINFLU-2',
    nhddCode: '6306',
    diseaseTarget: 'Influenza',
    doseNumber: '2',
    dueDate: null,
    occurrenceDateTime: '',
    status: 'upcoming',
    category: 'influenza',
    dependentVaccine: 'IMINFLU-1',
    description: 'non-routine',
    dependencyPeriod: 122,
    adminRange: {
      start: 304,
      end: Infinity,
      unit: 'days',
    },
  },
]
