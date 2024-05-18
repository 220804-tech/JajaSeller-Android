// import { createStore } from 'redux'
// import { persistStore, persistReducer } from 'redux-persist'
// import AsyncStorage from '@react-native-community/async-storage';
// import { rootReducer } from './reducer'
// import storeConstants from './constants'

// const persistConfig = {
//     key: "root",
//     storage: AsyncStorage
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// const store = createStore(persistedReducer,
//     storeConstants.DEF_STORE);

// const persistor = persistStore(store);

// const getPersistor = () => persistor;

// const getStore = () => store;
// const getState = () => {
//     return store.getState();
// };

// export { getStore, getState, getPersistor };
// export default { getStore, getState, getPersistor }