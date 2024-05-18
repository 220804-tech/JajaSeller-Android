const initialState = {
    orders: [],
    orderUnpaid: [],
    orderPaid: [],
    orderProcess: [],
    orderSent: [],
    orderCompleted: [],
    orderFailed: [],
    orderDetail: "",
    orderInvoice: '',
    invoicePickups: [],
    showPickup: false,
    orderRefresh: true,
    pickupRefresh: false,
    count: 0
}

export default function orderStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_ORDER_INVOICE':
            return { ...state, orderInvoice: payload }
        case 'SET_ORDER_DETAIL':
            return { ...state, orderDetail: payload }
        case 'SET_ORDERS':
            return { ...state, orders: payload }
        case 'SET_ORDER_UNPAID':
            return { ...state, orderUnpaid: payload }
        case 'SET_ORDER_PAID':
            return { ...state, orderPaid: payload }
        case 'SET_ORDER_PROCESS':
            return { ...state, orderProcess: payload }
        case 'SET_ORDER_SENT':
            return { ...state, orderSent: payload }
        case 'SET_ORDER_COMPLETED':
            return { ...state, orderCompleted: payload }
        case 'SET_ORDER_BLOCKED':
            return { ...state, orderFailed: payload }
        case 'SET_SHOW_PICKUP':
            return { ...state, showPickup: payload }
        case 'SET_INVOICE_PICKUP':
            return { ...state, invoicePickups: payload }
        case 'SET_ORDER_REFRESH':
            console.log('44 line masuk redux', payload)
            return { ...state, orderRefresh: payload }
        case 'SET_PICKUP_REFRESH':
            return { ...state, pickupRefresh: payload }
        case 'SET_ORDER_COUNT':
            return { ...state, count: payload }
        case 'RESET_ORDER':
            return {
                ...state, orders: [],
                orderUnpaid: [],
                orderPaid: [],
                orderProcess: [],
                orderSent: [],
                orderCompleted: [],
                orderFailed: [],
                orderDetail: "",
                orderInvoice: '',
                invoicePickups: [],
                showPickup: false,
                orderRefresh: false,
                pickupRefresh: false
            }
        default:
            return state;
    }
}