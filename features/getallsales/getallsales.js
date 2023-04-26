import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const currentDate = new Date();
//initial state
const initialState = {
  all_sale_error: null,
  all_sales: [],
  all_sales_isLoading: false,
};

export const getallsales = createSlice({
  name: "getallsales",
  initialState,

  reducers: {
    //Get_information
    set_allsalesDataStart(state) {
      state.all_sales_isLoading = true;
      state.all_sale_error = null;
    },
    set_allsaleDataSuccess(state, action) {
      state.all_sales_isLoading = false;
      state.all_sales = action.payload.sort((a, b) => new Date(b.Sales_time) - new Date(a.Sales_time));
    },
    set_allsalesDataFailure(state, action) {
      state.all_sales_isLoading = false;
      state.all_sale_error = action.payload;
    },
  },
});

export const {
  set_allsalesDataStart,
  set_allsaleDataSuccess,
  set_allsalesDataFailure,
} = getallsales.actions;

//Fetching data
export const fetchAllSalesData = () => async (dispatch) => {
  dispatch(set_allsalesDataStart());
  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  try {
    const response = await axios.get(
      "https://unforgivable-gangs.000webhostapp.com/maincondition.php/all_sales_days",
      {
        params: {
          date: formattedDate,
          company: 5,
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};

export default getallsales.reducer;
