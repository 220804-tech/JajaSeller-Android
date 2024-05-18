const initialState = {
    allNotification: [],
    wishlists: [],
    infoJaja: [],
    target: {}
}

export default function notificationStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_ALL_NOTIF':
            return { ...state, allNotification: payload }
        case 'SET_WISHLISTS':
            return { ...state, wishlists: payload }
        case 'SET_INFOJAJA':
            return { ...state, infoJaja: payload }
        case 'SET_TARGET':
            return { ...state, target: payload }
        case 'RESET_NOTIFICATION':
            return {
                ...state, allNotification: [],
                wishlists: [],
                infoJaja: [],
                target: {}
            }
        default:
            return state;
    }
}