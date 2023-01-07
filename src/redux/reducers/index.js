// IMPORT ALL CONSTANT STRINGS DEFINED IN action file == ../actions/index.js
import {
  ADD_TO_CART,
  CREATE_USER_NAME,
  REMOVE_FROM_CART,
  RELEASE_VENDOR_ID,
  REMOVE_CART,
  ADD_TO_FAV_CHEF,
  ADD_TO_FAV_REST,
  REMOVE_FROM_FAV_CHEF,
  REMOVE_FROM_FAV_REST,
  ADD_TO_FAV_DINING,
  REMOVE_FROM_FAV_DINING,
  ADD_TO_FAV_DISH,
  REMOVE_FROM_FAV_DISH,
  UPDATE_CART_COUNT,
  USER_LATITUDE,
  USER_LONGITUDE,
} from '../actions/index';

const initialState = {
  createUserName: '',
  cartArray: [],
  vendor_id: '',

  restFavArray: [],
  chefFavArray: [],
  dishFavArray: [],

  cartCount: 0,

  userLatitude: 0.0,
  userLongitude: 0.0,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const updatedCart = [...state.cartArray];
      let t = 0;
      const item = updatedCart.find(
        x => x.product_id === action.payload.product_id,
      );
      t = parseInt(item?.product_price);
      if (item) {
        item.qty++;
      } else {
        if (action.payload?.qty > 1) {
          updatedCart.push(action.payload);
        } else {
          updatedCart.push(action.payload);
        }
      }
      return {
        ...state,
        cartArray: updatedCart,
      };
    }
    case REMOVE_FROM_CART: {
      let updatedCart = [...state.cartArray];

      const item = updatedCart.find(
        x => x.product_id === action.payload.product_id,
      );

      if (item?.qty > 1 && action.payload.qty > 0) {
        action.payload.qty--;
        // if (action.payload.qty > 0) {
        //   item.qty--;
        // }
      } else {
        updatedCart = state.cartArray.filter(
          i => i.product_id !== action.payload.product_id,
        );
      }
      // const deleteArray = state.cartArray.filter((item, index) => {
      //   return index !== action.payload;
      // });
      // return deleteArray;
      return {...state, cartArray: updatedCart};
    }

    case REMOVE_CART: {
      return {...state, cartArray: []};
    }

    case UPDATE_CART_COUNT: {
      return {...state, cartCount: action.payload};
    }

    case RELEASE_VENDOR_ID: {
      return {
        ...state,
        vendor_id: action.payload,
      };
    }
    case ADD_TO_FAV_REST: {
      const updatedCart = [...state.restFavArray];

      updatedCart.push(action.payload);

      return {
        ...state,
        restFavArray: updatedCart,
      };
    }
    case REMOVE_FROM_FAV_REST: {
      let updatedCart = [...state.restFavArray];

      updatedCart = state.restFavArray.filter(i => i.id !== action.payload.id);

      return {
        ...state,
        restFavArray: updatedCart,
      };
    }

    case ADD_TO_FAV_DISH: {
      const updatedCart = [...state.dishFavArray];

      updatedCart.push(action.payload);

      return {
        ...state,
        dishFavArray: updatedCart,
      };
    }
    case REMOVE_FROM_FAV_DISH: {
      let updatedCart = [...state.dishFavArray];

      updatedCart = state.dishFavArray.filter(
        i => i.product_id !== action.payload.product_id,
      );

      return {
        ...state,
        dishFavArray: updatedCart,
      };
    }

    case ADD_TO_FAV_CHEF: {
      const updatedCart = [...state.chefFavArray];

      updatedCart.push(action.payload);

      return {
        ...state,
        chefFavArray: updatedCart,
      };
    }
    case REMOVE_FROM_FAV_CHEF: {
      let updatedCart = [...state.chefFavArray];

      updatedCart = state.chefFavArray.filter(
        i => i.chef_id !== action.payload.chef_id,
      );

      return {
        ...state,
        chefFavArray: updatedCart,
      };
    }
    case USER_LATITUDE: {
      return {
        ...state,
        userLatitude: action.payload,
      };
    }

    case USER_LONGITUDE: {
      return {
        ...state,
        userLongitude: action.payload,
      };
    }

    default:
      // console.log('action params 2 -> ', JSON.stringify(action));
      return state;
  }
};
export default Reducer;
