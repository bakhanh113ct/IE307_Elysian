import {createSlice} from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {list: [], index: 0, note: ''},
  reducers: {
    addProduct: (state, action) => {
      let check = true;
      let index = 0;
      let temp = {};
      state.list.forEach((e, i) => {
        if (
          JSON.stringify(e.product) ===
            JSON.stringify(action.payload.product) &&
          JSON.stringify(e.size) === JSON.stringify(action.payload.size) &&
          JSON.stringify(e.topping) === JSON.stringify(action.payload.topping)
        ) {
          check = false;
          index = i;
          temp = {
            ...e,
            count: e.count + action.payload.count,
            total: e.total + action.payload.total,
          };
        }
      });
      if (check) {
        state.list.push({...action.payload, key: state.index});
        state.index += 1;
      } else {
        state.list.splice(index, 1, temp);
      }
    },
    removeProduct: (state, action) => {
      let index = 0;
      state.list.forEach((e, i) => {
        if (
          JSON.stringify(e.product) ===
            JSON.stringify(action.payload.product) &&
          JSON.stringify(e.size) === JSON.stringify(action.payload.size) &&
          JSON.stringify(e.topping) === JSON.stringify(action.payload.topping)
        ) {
          index = i;
        }
      });
      state.list.splice(index, 1);
    },
    removeAllProduct: state => {
      state.list.splice(0, state.list.length);
    },
    changeNote(state, action) {
      state.note = action.payload;
    },
    clearNote(state) {
      state.note = '';
    },
  },
});

export const {
  addProduct,
  removeProduct,
  removeAllProduct,
  changeNote,
  clearNote,
} = orderSlice.actions;
export const selectNote = state => state.orders.note;

export default orderSlice.reducer;
