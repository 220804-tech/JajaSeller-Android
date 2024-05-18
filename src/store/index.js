const initialState = {
    notifikasiShow: false,
    notifikasi: { chat: 0, home: 0, orders: 0 },
    dataNotifikasi: {},

    products: [],
    productsActive: [],
    productsNotActive: [],
    productsSoldOut: [],
    productsWaitConfirm: [],
    productsBlocked: [],
    dashboard: {},
}

export default function store(state = initialState, action) {
    const { type, valueNotifikasi, valueShowNotif, payload } = action;
    switch (type) {
        case 'HANDLE_SHOW_NOTIFIKASI':
            return { ...state, notifikasiShow: valueShowNotif }
        case 'HANDLE_NOTIFIKASI':
            return { ...state, notifikasi: valueNotifikasi }
        case 'SET_NOTIFIKASI':
            return { ...state, notifikasi: payload }
        case 'SET_DATA_NOTIFIKASI':
            return { ...state, dataNotifikasi: payload }
        case 'SET_DASHBOARD':
            return { ...state, dashboard: payload }
        case 'RESET_PRODUCT':
            return {
                ...state,
                notifikasiShow: false,
                notifikasi: { chat: 0, home: 0, orders: 0 },
                dataNotifikasi: {},
                products: [],
                productsActive: [],
                productsNotActive: [],
                productsSoldOut: [],
                productsWaitConfirm: [],
                productsBlocked: [],
                dashboard: {},
            }
        default:
            return state;
    }
}