const initialState = {
    allProducts: [],
    fetchAllProduct: true,

    liveProducts: [],
    fetchliveProduct: true,

    archiveProducts: [],
    fetcharchiveProduct: true,

    soldOutProducts: [],
    fetchsoldOutProduct: true,

    blockedProducts: [],
    fetchblockedProduct: true,

}

export default function productStore(state = initialState, action) {
    const { type, payload } = action;
    // console.log("🚀 ~ file: productStore.js ~ line 21 ~ productStore ~ payload", payload)
    switch (type) {
        case 'SET_PRODUCTS':
            // alert(payload.length)
            return { ...state, allProducts: payload }
        case 'FETCH_PRODUCTS':
            return { ...state, fetchAllProduct: payload }

        case 'SET_PRODUCTS_LIVE':
            return { ...state, liveProducts: payload }
        case 'FETCH_LIVE':
            return { ...state, fetchliveProduct: payload }

        case 'SET_PRODUCTS_ARCHIVE':
            return { ...state, archiveProducts: payload }
        case 'FETCH_ARCHIVE':
            return { ...state, fetcharchiveProduct: payload }

        case 'SET_PRODUCTS_SOLDOUT':
            return { ...state, soldOutProducts: payload }
        case 'FETCH_SOLDOUT':
            return { ...state, fetchsoldOutProduct: payload }

        case 'SET_PRODUCTS_BLOCKED':
            return { ...state, blockedProducts: payload }
        case 'FETCH_BLOCKED':
            return { ...state, fetchblockedProduct: payload }

        case 'RESET_STORE':
            return {
                ...state,
                allProducts: [],
                fetchAllProduct: true,
                liveProducts: [],
                fetchliveProduct: true,
                archiveProducts: [],
                fetcharchiveProduct: true,
                soldOutProducts: [],
                fetchsoldOutProduct: true,
                blockedProducts: [],
                fetchblockedProduct: true
            }
        default:
            return state;
    }
}