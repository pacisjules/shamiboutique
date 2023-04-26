import { configureStore } from '@reduxjs/toolkit';
import My_change_totals from '../features/changetotals/change_total_slice';
import get_current from '../features/getcurrentproducts/get_current';
import getallproducts from '../features/getfullproducts/getallproducts';
import getallsales from '../features/getallsales/getallsales';
export const store = configureStore({
  reducer: {
    changeTotals:My_change_totals,
    get_current_products:get_current,
    all_products:getallproducts,
    all_sales:getallsales,
  },
})