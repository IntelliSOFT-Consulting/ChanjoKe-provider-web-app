import { createSlice } from '@reduxjs/toolkit'
import { calculateDiluentsDroppers } from '../../data/vaccineDoses'

const initialState = {
  vaccines: [{}],
}

const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    addVaccine: (state, action) => {
      const { vaccine, index, maximum, minimum, recommendedStock } =
        action.payload
      const diluentOrDropper = calculateDiluentsDroppers(vaccine, 0)
      const hasDiluentOrDropper = state.vaccines[index]?.hasDiluentOrDropper

      // Remove current vaccine and any associated diluent/dropper
      state.vaccines.splice(index, hasDiluentOrDropper ? 2 : 1)

      // Construct vaccine payload
      const vaccinePayload = {
        ...action.payload,
        hasDiluentOrDropper: diluentOrDropper
          ? `${vaccine} (${diluentOrDropper.type})`
          : null,
      }

      // Insert new vaccine and diluent/dropper if applicable
      if (diluentOrDropper) {
        state.vaccines.splice(index, 0, vaccinePayload, {
          vaccine: `${vaccine} (${diluentOrDropper.type})`,
          quantity: diluentOrDropper.quantity,
          maximum,
          minimum,
          recommendedStock,
        })
      } else {
        state.vaccines.splice(index, 0, vaccinePayload)
      }
    },

    populateVaccines: (state, action) => {
      state.vaccines = action.payload
    },

    removeVaccine: (state, action) => {
      const { index } = action.payload
      const hasDiluentOrDropper = state.vaccines[index]?.hasDiluentOrDropper
      state.vaccines.splice(index, hasDiluentOrDropper ? 2 : 1)
    },

    changeVaccineQuantity: (state, action) => {
      const { vaccine, quantity } = action.payload
      const vaccineToChange = state.vaccines.find((v) => v.vaccine === vaccine)

      if (vaccineToChange) {
        vaccineToChange.quantity = quantity

        if (vaccineToChange.hasDiluentOrDropper) {
          const diluentOrDropperToChange = state.vaccines.find(
            (v) => v.vaccine === vaccineToChange.hasDiluentOrDropper
          )
          if (diluentOrDropperToChange) {
            diluentOrDropperToChange.quantity = calculateDiluentsDroppers(
              vaccine,
              quantity
            ).quantity
          }
        }
      }
    },

    clearNewOrder: (state) => {
      state.vaccines = [{}]
    },
  },
})

export const {
  addVaccine,
  populateVaccines,
  removeVaccine,
  changeVaccineQuantity,
  clearNewOrder,
} = newOrderSlice.actions

export default newOrderSlice.reducer
