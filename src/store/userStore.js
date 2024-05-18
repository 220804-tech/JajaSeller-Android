const initialState = {
    user: "",
    seller: "",
    token: "",
    verifikasi: true,
}

export default function userStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_TOKEN':
            return { ...state, token: payload }
        case 'SET_USER':
            return { ...state, user: payload }
        case 'SET_SELLER':
            return { ...state, seller: payload }
        case 'SET_VERIFIKASI':
            return { ...state, verifikasi: payload }
        case 'USER_LOGOUT':
            return {
                ...state, user: "",
                seller: "",
                token: null,
                verifikasi: true,
            }
        default:
            return state;
    }
}