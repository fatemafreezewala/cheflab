// export const BASE_URL =
//   'https://web10technologies.com/Chelab_full_project/public/api/';
// export const BASE_URL = 'http://3.111.253.190/api/';
export const BASE_URL = 'https://cheflab.co.in/api/';

export const API_END_POINTS = {
  // wallet api
  getUserWallets: `${BASE_URL}get-user-wallet`,
  rechargeWallets: `${BASE_URL}recharge-wallet`,
  userAllTransaction: `${BASE_URL}user-all-transaction`,
  registerOtpSend: `${BASE_URL}register-send-otp`, // done
  registerVerifyOtp: `${BASE_URL}register-verify-otp`, // done
  registerVerifiedUser: `${BASE_URL}register-verified-user`, // done
  loginOtpSend: `${BASE_URL}login-otp-send`, // done
  loginVerifyOtp: `${BASE_URL}login-otp-verify`, // done
  referEarn: `${BASE_URL}refer-amount`, // done
  //  RESTAURANT SECTION
  getRestaurantHomePage: `${BASE_URL}home`, // done
  getBlogPromotion: `${BASE_URL}get-blog-promotion`, // done

  getRestaurantListByCategory: `${BASE_URL}getRestaurantByCategory`, // done

  getRestaurantDetailPage: `${BASE_URL}getRestaurantDetailPage`, // done

  restaurantBrowseMenu: `${BASE_URL}browse-menu`, // done

  restaurantSearchData: `${BASE_URL}search-data`, // done

  restaurantProductCustomizableData: `${BASE_URL}custmizable-data`, // done

  restaurantVendorCoupon: `${BASE_URL}vendor-coupon`,

  getRestaurantByCuisines: `${BASE_URL}getRestaurantByCuisines`,

  getRestaurantDetailByFoodtype: `${BASE_URL}getRestaurantDetailByFoodtype`,

  // CHEF SECTION
  getChefHomePage: `${BASE_URL}chef-home`, // done

  getChefListByCategory: `${BASE_URL}getChefByCategory`, // done

  getChefDetailPage: `${BASE_URL}getChefDetailPage`, // done

  getChefProfile: `${BASE_URL}getChefProfile`, // done

  // MASTER
  getAllFoodCategories: `${BASE_URL}getCategories`, // done
  getAllCuisines: `${BASE_URL}getCuisines`, // done

  // CART SECTION
  productAddToCart: `${BASE_URL}add-to-cart`,
  updateProductCart: `${BASE_URL}update-cart`,

  viewCart: `${BASE_URL}view-cart`,

  // PRODUCT SECTION
  getProductDetailById: `${BASE_URL}getProductDetail`,

  removeEmptyCart: `${BASE_URL}empty-cart`,

  restaurantAddFavorite: `${BASE_URL}like-vendor`,
  chefAddFavorite: `${BASE_URL}like-chef`,

  productAddFavorite: `${BASE_URL}like-product`,

  restaurantRemoveFavorite: `${BASE_URL}dislike-vendor`,
  chefRemoveFavorite: `${BASE_URL}dislike-vendor-chef`,
  // chefDishRemoveFav: `${BASE_URL}dislike-product-chef`,

  productRemoveFavorite: `${BASE_URL}dislike-product`,

  updateCart: `${BASE_URL}update-cart`,
  getAllVendorRatingReview: `${BASE_URL}get-vendor-rating-review`,
  getVendorAllReview: `${BASE_URL}get-vendor-all-review`,

  // ORDER API
  createOrder: `${BASE_URL}create-order`,

  // COUPON API
  getVendorPromoCode: `${BASE_URL}procode-coupon-details`,
  getVendorPromoCodeDetails: `${BASE_URL}vendor-coupon-details`,
  getVendorPromoCodeApply: `${BASE_URL}procode-coupon-apply`,

  getUserInfo: `${BASE_URL}get-user-info`,

  updateUserInfo: `${BASE_URL}update-user-info`,

  getUserFavList: `${BASE_URL}get-user-fav-vendors`,

  getUserOrder: `${BASE_URL}get-order`,

  saveUserDeliveryAddress: `${BASE_URL}delivery-address-user`,

  getUserDeliveryAddress: `${BASE_URL}get-delivery-address`,
  updateUserDeliveryAddress: `${BASE_URL}delivery-address-update`,

  // DINE OUT SECTION
  getDineOutRestaurant: `${BASE_URL}dine-out-get-restaurant`,

  dineOutBooking: `${BASE_URL}dine-out-booking`,

  getDineOutSlot: `${BASE_URL}get-dine-out-slot`,

  getHomeBanner: `${BASE_URL}getHomeBanner`,
  getPromotionBanner: `${BASE_URL}getPromotionBanner`,
  // user section
  updateUserProfile: `${BASE_URL}update-user-info`,

  // POLICY SECTION

  getTermsConditions: `${BASE_URL}terms-and-condition-userapp`,
  getPrivacyPolicy: `${BASE_URL}privacy-and-policy`,
  getCancellationPolicy: `${BASE_URL}cancellation-policy`,
  getAboutUs: `${BASE_URL}aboutus`,
  getFAQS: `${BASE_URL}user-faq`,

  // social media api
  socialMediaApi: `${BASE_URL}socialmedia`,

  // restaurant filter
  restaurantFilterApi: `${BASE_URL}get-filter-restourant`,

  saveContactUs: `${BASE_URL}save-contact-us`,

  get_all_liked_products: `${BASE_URL}get-all-liked-products`,
  get_all_liked_rest: `${BASE_URL}get-all-liked-restaurant`,
  get_all_liked_chef: `${BASE_URL}get-all-liked-chef`,
  get_cart_count: `${BASE_URL}get-cart`,
  deleteUserAddress: `${BASE_URL}delivery-address-delete`,

  // app update events
  get_update_version: `${BASE_URL}get-update-version`,

  // order time difference
  get_order_time_difference: `${BASE_URL}get-order-time-diff`,
  callCancelOrder: `${BASE_URL}cancel-order`,
  callRegisterToken: `${BASE_URL}user-fcm-token`,

  get_order_details: `${BASE_URL}get-order-details`,

  get_driver_live: `${BASE_URL}get-driver-live`,
};
