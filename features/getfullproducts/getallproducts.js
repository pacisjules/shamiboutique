import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//initial state
const initialState = {
  all_product_error: null,
  all_products: [],
  all_products_isLoading: false,
};

export const getallproducts = createSlice({
  name: "getallproducts",
  initialState,

  reducers: {
    //Get_information
    set_allProductsDataStart(state) {
      state.all_products_isLoading = true;
      state.all_product_error = null;
    },
    set_allProductDataSuccess(state, action) {
      state.all_products_isLoading = false;
      state.all_products = action.payload;
    },
    set_allProductsDataFailure(state, action) {
      state.all_products_isLoading = false;
      state.all_product_error = action.payload;
    },
  },
});

export const {
  set_allProductsDataStart,
  set_allProductDataSuccess,
  set_allProductsDataFailure,
} = getallproducts.actions;

//Fetching data
export const fetchAllProductsData = () => async (dispatch) => {
  dispatch(set_allProductsDataStart());
  try {
    const response = await axios.get(
      "https://unforgivable-gangs.000webhostapp.com/maincondition.php/all_products",
      {
        params: {
          company: 5,
          date: 1,
        },
      }
    );
    dispatch(set_allProductDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allProductsDataFailure(error.message));
  }
};

export default getallproducts.reducer;
