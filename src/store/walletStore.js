const initialState = {
    income: [],
    withdrawal: [],
    refund: [],
}

export default function walletStore(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'SET_INCOME':
            return { ...state, income: payload }
        case 'SET_WITHDRAWAL':
            return { ...state, withdrawal: payload }
        case 'SET_REFUND':
            return { ...state, refund: payload }
        case 'RESET_WALLET':
            return {
                ...state,
                income: [],
                withdrawal: [],
                refund: [],
            }
        default:
            return state;
    }
}