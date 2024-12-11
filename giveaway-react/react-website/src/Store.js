import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import LoginSlice from './Slices/LoginSlice';
import CommonSlice from './Slices/CommonSlice';
import StoreSlice from './Slices/StoreSlice';
import ProductDetailsSlice from './Slices/ProductDetailsSlice';
import AddToCartSlice from './Slices/AddToCartSlice';
import CartItemSlice from './Slices/CartSlice';
import MyOrdersSlice from './Slices/MyOrdersSlice';
import ProfileSlice from './Slices/ProfileSlice';
import CourseSlice from './Slices/CourseSlice';
import DrawsSlice from './Slices/DrawsSlice';
import PlanSlice from './Slices/PlanSlice';
import PlanCategorySlice from './Slices/PlanCategorySlice';
import StaticContentSlice from './Slices/StaticContentSlice';
import SignUpSlice from './Slices/SignUpSlice';
import CourseCategorySlice from './Slices/CourseCategorySlice';
import GetPartnersSlice from './Slices/GetPartners';
import SubscriptionSlice from './Slices/Subscription';
import ProductCategoriesSlice from './Slices/ProductCategoriesSlice';
import ApplyCouponSlice from './Slices/ApplyCouponSlice';
import BecomeAPartner from './Slices/BecomeAPartner';
import FaqSlice from './Slices/FaqSlice';
import PastWinnersSlice from './Slices/PastWinners';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'loginAction',
    'storeAction',
    'productDetailsAction',
    'addToCartAction',
    'cartItemsAction',
    'ordersAction',
    'profileAction',
    'courseAction',
    'drawAction',
    'planAction',
    'planCategoryAction',
    'staticContentAction',
    'signUpAction',
    'courseCategoryAction',
    'getPartnerAction',
    'subscriptionAction',
    'ProductCategoriesAction',
    'ApplyCouponAction',
    'BecomeAPartnerAction',
    'FaqAction',
    'PastWinnersAction'
  ] // Add planAction to blacklist to prevent persistence
};
const rootReducer = combineReducers({
  loginAction: LoginSlice,
  commonAction: CommonSlice,
  storeAction: StoreSlice,
  productDetailsAction: ProductDetailsSlice,
  addToCartAction: AddToCartSlice,
  cartItemsAction: CartItemSlice,
  ordersAction: MyOrdersSlice,
  profileAction: ProfileSlice,
  courseAction: CourseSlice,
  drawAction: DrawsSlice,
  planAction: PlanSlice, // This will not be persisted
  planCategoryAction: PlanCategorySlice,
  staticContentAction: StaticContentSlice,
  signUpAction: SignUpSlice,
  courseCategoryAction: CourseCategorySlice,
  getPartnerAction: GetPartnersSlice,
  subscriptionAction: SubscriptionSlice,
  ProductCategoriesAction: ProductCategoriesSlice,
  ApplyCouponAction: ApplyCouponSlice,
  BecomeAPartnerAction: BecomeAPartner,
  FaqAction: FaqSlice,
  PastWinnersAction: PastWinnersSlice // Corrected from PastWinnersActiion to PastWinnersAction
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
});

const persistor = persistStore(store);

export { store, persistor };
export const { dispatch } = store;
export default store;
