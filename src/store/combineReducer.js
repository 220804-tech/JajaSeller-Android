import { combineReducers } from 'redux'
import dashboard from './index'
import orders from './orderStore'
import user from './userStore'
import wallet from './walletStore'
import product from './productStore'
import notification from './notificationStore'
import complain from './complainStore'
import loading from './loadingStore'

export default combineReducers({
    dashboard,
    orders,
    user,
    wallet,
    product,
    notification,
    complain,
    loading
})