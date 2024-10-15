export const vaccineDoses = {
  BCG: 20,
  OPV: 20,
  'DPT-HepB+Hib': 10,
  PCV10: 5,
  Rotavaq: 5,
  IPV: 5,
  'Vitamin A': 500,
  'Measles-Rubella': 10,
  'RTS/AS01 (Malaria Vaccine)': 2,
  'Yellow Fever': 10,
  'HPV Vaccine': 1,
  AstraZeneca: 10,
  'Johnson & Johnson': 5,
  'Pfizer/BioNTech': 6,
  Moderna: 6,
  Sinopharm: 1,
  Tetanus: 20,
  Rabies: 1,
  Influenza: 1,
  'Measles-Rubella (diluent)': 1,
  'BCG (diluent)': 1,
  'Yellow Fever (diluent)': 1,
  'OPV (dropper)': 1,
  'Rotavaq (dropper)': 1,
}

const diluentVaccines = ['Measles-Rubella', 'BCG', 'Yellow Fever']

const dropperVaccines = ['OPV', 'Rotavaq']

export const calculateDiluentsDroppers = (vaccine, dosesAvailable) => {
  const dosesPerVial = vaccineDoses[vaccine]

  if (diluentVaccines.includes(vaccine)) {
    return {
      type: 'diluent',
      quantity: dosesAvailable,
    }
  } else if (dropperVaccines.includes(vaccine)) {
    return {
      type: 'dropper',
      quantity: Number((dosesAvailable / dosesPerVial).toFixed(2)),
    }
  } else {
    return null
  }
}
