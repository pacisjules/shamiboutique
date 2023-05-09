import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  expenses_error: null,
  all_expense: [],
  expense_isLoading: false,
};

export const getallexpenses = createSlice({
  name: "getallexpenses",
  initialState,

  reducers: {
    //Get_information
    set_allExpensesDataStart(state) {
      state.expense_isLoading = true;
      state.expenses_error = null;
    },
    set_allExpensesDataSuccess(state, action) {
      state.expense_isLoading = false;
      state.all_expense = action.payload;
    },
    set_allExpensesDataFailure(state, action) {
      state.expense_isLoading = false;
      state.expenses_error = action.payload;
    },
  },
});

export const {
    set_allExpensesDataStart,
    set_allExpensesDataSuccess,
    set_allExpensesDataFailure,
} = getallexpenses.actions;


//Fetching data
export const fetchAllExpensesData = (sales_point_id) => async (dispatch) => {
  dispatch(set_allExpensesDataStart());

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
      "https://unforgivable-gangs.000webhostapp.com/getexpenses.php/getallexpenses",
      {
        params: {
            salespoint: sales_point_id,
            date:formattedDate
        },
      }
    );
    dispatch(set_allExpensesDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allExpensesDataFailure(error.message));
  }
};

export default getallexpenses.reducer;
