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
}

const diluentVaccines = ['Measles-Rubella', 'BCG', 'Yellow Fever']

const dropperVaccines = ['OPV', 'Rotavaq']

const calculateDiluentsDroppers = (vaccine, dosesAvailable) => {
  const dosesPerVial = vaccineDoses[vaccine]

  if (diluentVaccines.includes(vaccine)) {
    return dosesAvailable
  } else if (dropperVaccines.includes(vaccine)) {
    return Math.ceil(dosesAvailable / dosesPerVial)
  } else {
    return null
  }
}
