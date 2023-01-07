export const CREATE_USER_NAME = 'CREATE_USER_NAME';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const RELEASE_VENDOR_ID = 'RELEASE_VENDOR_ID';
export const REMOVE_CART = 'REMOVE_CART';
export const UPDATE_CART_COUNT = 'UPDATE_CART_COUNT';

export const ADD_TO_FAV_REST = 'ADD_TO_FAV_REST';
export const REMOVE_FROM_FAV_REST = 'REMOVE_FROM_FAV_REST';

export const ADD_TO_FAV_CHEF = 'ADD_TO_FAV_CHEF';
export const REMOVE_FROM_FAV_CHEF = 'REMOVE_FROM_FAV_CHEF';

export const ADD_TO_FAV_DISH = 'ADD_TO_FAV_DISH';
export const REMOVE_FROM_FAV_DISH = 'REMOVE_FROM_FAV_DISH';

export const USER_LATITUDE = 'USER_LATITUDE';
export const USER_LONGITUDE = 'USER_LONGITUDE';

export const userLatitude = val => ({
  type: USER_LATITUDE,
  payload: val,
});
export const userLongitude = val => ({
  type: USER_LONGITUDE,
  payload: val,
});

export const createUserName = val => ({
  type: CREATE_USER_NAME,
  payload: val,
});

export const addItemToCart = val => ({
  type: ADD_TO_CART,
  payload: val,
});

export const removeItemCart = val => ({
  type: REMOVE_FROM_CART,
  payload: val,
});

export const updateCartCount = val => ({
  type: UPDATE_CART_COUNT,
  payload: val,
});

export const addItemToFavRest = val => ({
  type: ADD_TO_FAV_REST,
  payload: val,
});

export const removeItemFavRest = val => ({
  type: REMOVE_FROM_FAV_REST,
  payload: val,
});

export const addItemToFavChef = val => ({
  type: ADD_TO_FAV_CHEF,
  payload: val,
});

export const removeItemFavChef = val => ({
  type: REMOVE_FROM_FAV_CHEF,
  payload: val,
});

export const addItemToFavDish = val => ({
  type: ADD_TO_FAV_DISH,
  payload: val,
});

export const removeItemFavDish = val => ({
  type: REMOVE_FROM_FAV_DISH,
  payload: val,
});

export const emptyCart = val => ({
  type: REMOVE_CART,
  payload: val,
});

export const releaseVendorId = val => ({
  type: RELEASE_VENDOR_ID,
  payload: val,
});
