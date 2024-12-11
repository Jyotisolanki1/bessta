// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';

import authReducer from './slices/auth';
import usersReducer from './slices/users';
import partnersReducer from './slices/partners';
import productsReducer from './slices/products';
import coursesReducer from './slices/courses';
import couponReducer from './slices/coupons';
import eventReducer from './slices/events';
import orderReducer from './slices/orders';
import planReducer from './slices/plans';
import companyReducer from './slices/company';
import departmentReducer from './slices/department';
import branchReducer from './slices/branch';
import employeeReducer from './slices/employee';
import jobReducer from './slices/job';
import cmsReducer from './slices/cms';
import helpReducer from './slices/help';
import dashboardReducer from './slices/dashboard';
import faqsReducer from './slices/faqs';
import businessCatReducer from './slices/businessCategory';
import pastWinnerReducer from './slices/pastWinner';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  snackbar: snackbarReducer,
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'berry-'
    },
    cartReducer
  ),
  kanban: kanbanReducer,
  customer: customerReducer,
  contact: contactReducer,
  product: productReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  mail: mailReducer,
  user: userReducer,
  partner: partnersReducer,
  menu: menuReducer,
  auth: authReducer,
  users: usersReducer,
  products: productsReducer,
  courses: coursesReducer,
  plans: planReducer,
  coupons: couponReducer,
  events: eventReducer,
  orders: orderReducer,
  company: companyReducer,
  department: departmentReducer,
  branch: branchReducer,
  employee: employeeReducer,
  job: jobReducer,
  cms: cmsReducer,
  help: helpReducer,
  dashboard: dashboardReducer,
  faqs: faqsReducer,
  businessCat: businessCatReducer,
  pastWinner: pastWinnerReducer
});

export default reducer;
