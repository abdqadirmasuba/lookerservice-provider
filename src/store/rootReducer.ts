import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import businessRegistrationReducer from './slices/businessRegistrationSlice';
// import businessReducer from './slices/businessSlice';
// import bookingReducer from './slices/bookingSlice';
// import bidReducer from './slices/bidSlice';
// import messageReducer from './slices/messageSlice';
// import earningsReducer from './slices/earningsSlice';
// import notificationReducer from './slices/notificationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  theme: themeReducer,
  businessRegistration: businessRegistrationReducer,
//   business: businessReducer,
//   booking: bookingReducer,
//   bid: bidReducer,
//   message: messageReducer,
//   earnings: earningsReducer,
//   notification: notificationReducer,
});

export default rootReducer;