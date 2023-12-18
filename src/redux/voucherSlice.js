import {createSlice} from '@reduxjs/toolkit';

const voucherSlice = createSlice({
  name: 'voucher',
  initialState: '',
  reducers: {
    chooseVoucher: (state, action) => {
      return action.payload
    },
    removeVoucher: (state, action) => {
        return ''
      },
  },
});

export const {chooseVoucher, removeVoucher} = voucherSlice.actions;

export default voucherSlice.reducer;
