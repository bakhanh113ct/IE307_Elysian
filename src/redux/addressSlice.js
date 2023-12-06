import {createSlice} from '@reduxjs/toolkit';

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    value: '',
    selected: 0,
    checked: false,
    modal: false,
    completed: false,
    modalTime: false,
    timePicker: null,
  },
  reducers: {
    setValue(state, action) {
      state.value = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setChecked: state => {
      if (state.checked === false) state.checked = true;
      else state.checked = false;
    },
    openOrCloseModel: state => {
      if (state.modal === false) state.modal = true;
      else state.modal = false;
    },
    setCompleted: state => {
      if (state.completed == false) state.completed = true;
      else state.completed = false;
    },
    setModalTime: state => {
      if (state.modalTime == true) state.modalTime = false;
      else state.modalTime = true;
    },
    setTimePicker(state, action) {
      state.timePicker = action.payload;
    },
    clear(){
      return {
        value: '',
        selected: 0,
        checked: false,
        modal: false,
        completed: false,
        modalTime: false,
        timePicker: null,
      }
    }
  },
});

export const {
  setValue,
  setSelected,
  setChecked,
  openOrCloseModel,
  setCompleted,
  setModalTime,
  setTimePicker,
  clear
} = addressSlice.actions;
export const selectedAddress = state => state.address.value;
export const selectedID = state => state.address.selected;
export const selectChecked = state => state.address.checked;
export const selectModal = state => state.address.modal;
export const selectCompleted = state => state.address.completed;
export const selectTimePicker = state => state.address.timePicker;

export default addressSlice.reducer;
