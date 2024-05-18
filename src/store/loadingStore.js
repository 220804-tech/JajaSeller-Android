const initialState = {
    dashboard: true
}

export default function loading(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_DASHBOARD_LOADING':
            return { ...state, dashboard: payload }
        case 'USER_LOGOUT':
            return {
                ...state,
                dashboard: true,
            }
        default:
            return state;
    }
}