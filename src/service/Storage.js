import AsyncStorage from '@react-native-community/async-storage';
import * as Product from './Produk'

import EncryptedStorage from 'react-native-encrypted-storage';


export async function getAllOrderStorage() {
    let orders = await storageOrder();
    let orderUnpaid = await storageOrderUnpaid();
    let orderPaid = await storageOrderPaid();
    let orderProcess = await storageOrderProcess();
    let orderSent = await storageOrderSent();
    let orderCompleted = await storageOrderCompleted();
    let orderFailed = await storageOrderFailed();

    let data = {
        orders: orders,
        orderUnpaid: orderUnpaid,
        orderPaid: orderPaid,
        orderProcess: orderProcess,
        orderSent: orderSent,
        orderCompleted: orderCompleted,
        orderFailed: orderFailed
    }
    return data
}
export async function storageOrder() {
    return await EncryptedStorage.getItem("orders").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}
export async function storageOrderUnpaid() {
    return await EncryptedStorage.getItem("order-unpaid").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}
export async function storageOrderPaid() {
    return await EncryptedStorage.getItem("order-paid").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}
export async function storageOrderProcess() {
    return await EncryptedStorage.getItem("order-process").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}
export async function storageOrderSent() {
    return await EncryptedStorage.getItem("order-sent").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}
export async function storageOrderCompleted() {
    return await EncryptedStorage.getItem("order-completed").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}
export async function storageOrderFailed() {
    return await EncryptedStorage.getItem("order-failed").then(res => {
        if (res) {
            return JSON.parse(res)
        } else {
            return []
        }
    }).catch(() => {
        return []
    })
}

export function getUserId() {
    AsyncStorage.getItem('xOne').then((customer) => {
        console.log("🚀 ~ file: Storage.js ~ line 5 ~ AsyncStorage.getItem ~ customer", JSON.parse(customer).uid)
        return JSON.parse(customer)
    }).catch(err => {
        console.log("🚀 ~ file: Storage.js ~ line 8 ~ AsyncStorage.getItem ~ err", err)
    })
}
export async function getUID() {
    try {
        let result = await EncryptedStorage.getItem('seller')
        return JSON.parse(result).uid
    } catch (error) {
        console.log("🚀 ~ file: Storage.js ~ line 16 ~ getUID ~ error", error)

    }
}

export async function getAllProducts() {
    return await AsyncStorage.getItem('allProducts').then(async result => {
        if (result && result.length !== 0) {
            return await JSON.parse(result)
        } else {
            await Product.getProducts();
            setTimeout(async () => {
                const res = await AsyncStorage.getItem("allProducts");
                return JSON.parse(res);
            }, 500);
        }
    })
}

export async function getLiveProducts() {
    return await AsyncStorage.getItem('productsLive').then(async result => {
        if (result && result.length !== 0) {
            return await JSON.parse(result)
        } else {
            await Product.getProductsLive();
            setTimeout(async () => {
                const res = await AsyncStorage.getItem("productsLive");
                return JSON.parse(res);
            }, 500);
        }
    })
}

export async function getNostockProducts() {
    return await AsyncStorage.getItem('productsNostock').then(async result => {
        if (result && result.length !== 0) {
            return await JSON.parse(result)
        } else {
            await Product.getProductsNostock();
            setTimeout(async () => {
                const res = await AsyncStorage.getItem("productsNostock");
                return JSON.parse(res);
            }, 500);
        }
    })
}

export async function getArchiveProducts() {
    return await AsyncStorage.getItem('productsArchive').then(async result => {
        if (result && result.length !== 0) {
            return await JSON.parse(result)
        } else {
            await Product.getProductsArchive();
            setTimeout(async () => {
                const res = await AsyncStorage.getItem("productsArchive");
                return JSON.parse(res);
            }, 500);
        }
    })
}

export async function getWaitConfirmProducts() {
    return await AsyncStorage.getItem('productsWaitConfirm').then(async result => {
        if (result && result.length !== 0) {
            return await JSON.parse(result)
        } else {
            await Product.getProductsWaitConfirm();
            setTimeout(async () => {
                const res = await AsyncStorage.getItem("productsWaitConfirm");
                return JSON.parse(res);
            }, 500);
        }
    })
}

export async function getBlockedProducts() {
    return await AsyncStorage.getItem('productsBlocked').then(async result => {
        if (result && result.length !== 0) {
            return JSON.parse(result)
        } else {
            await Product.getProductsBlocked();
            setTimeout(async () => {
                const res = await AsyncStorage.getItem("productsBlocked");
                return JSON.parse(res);
            }, 500);
        }
    })
}

export async function getToko() {
    return await EncryptedStorage.getItem('seller').then(result => JSON.parse(result))
}
export async function getTokenDevice() {
    return await AsyncStorage.getItem('token').then(result => result)
}

export async function getDashboard() {
    return await AsyncStorage.getItem('x1').then(result => JSON.parse(result))
}

export async function getIdToko() {
    try {
        let result = await EncryptedStorage.getItem('seller')
        if (String(result).length) {
            return JSON.parse(result)?.id_toko
        } else {
            return ''
        }
    } catch (error) {
        console.log("🚀 ~ file: Storage.js ~ line 16 ~ getUIDD ~ error", error)
        return ""
    }
}
export async function getpw() {
    try {
        let result = await AsyncStorage.getItem('xOne');
        return JSON.parse(result).have_password
    } catch (error) {
        return ""
    }
}


export async function getProductAktif() {
    try {
        return await AsyncStorage.getItem('products')
    } catch (error) {
        console.log("🚀 ~ file: Storage.js ~ line 38 ~ error", error)
    }
}