import AsyncStorage from "@react-native-community/async-storage";
import * as ProductService from './Produk'
import * as AccountService from './Account'
import * as Orders from './Penjualan'

import * as Storage from './Storage'
import { ToastAndroid } from 'react-native'
import { Utils } from "../export";

// export async function getProducts(idToko) {
//     try {
//         let id = await Storage.getIdToko();
//         await ProductService.getProducts()
//         let data = await AsyncStorage.getItem("allProducts");
//         if (data && data.length !== 0) {

//         }
//     } catch (error) {

//     }
// }

export async function getProduct(idToko) {
    let id_toko = ""
    try {
        await AsyncStorage.getItem('xxTwo').then((toko) => {
            if (toko == null) {
                id_toko = idToko
            } else {
                id_toko = JSON.parse(toko).id_toko
            }
        });
    } catch (error) {
        console.log("getProduct -> error", error)
        id_toko = idToko
    }

    try {
        let res = await ProductService.getApiProduk(id_toko)

    } catch (error) {

    }
    ProductService.getApiProduk(id_toko)
        .then((res) => {
            if (res.status == 200) {
                AsyncStorage.setItem('products', JSON.stringify(res.product));
                console.log("productsAktif -> lenght array ", JSON.stringify(res.product.length))
            } else if (res.status == 404) {
                AsyncStorage.setItem('products', JSON.stringify([]));
            }
            else {
                console.log("productsAktif -> res.status ", JSON.stringify(res.status))
                AsyncStorage.getItem('products').then(resp => {
                    if (resp == undefined || resp == null) {
                        AsyncStorage.setItem('products', JSON.stringify([]));
                    }
                })
            }
        })
        .catch((e) => {
            console.log("products -> fetch list produk aktif error : ", e)
            AsyncStorage.getItem('products').then(resp => {
                if (resp == undefined || resp == null) {
                    AsyncStorage.setItem('products', JSON.stringify([]));
                }
            })
        });
    ProductService.getProdukTidakAktif(id_toko)
        .then((res) => {
            if (res.status == 200) {
                console.log("productsDeactive -> length array ", res.product.lenght)
                AsyncStorage.setItem('productsDeactive', JSON.stringify(res.product));
            } else if (res.status == 404) {
                AsyncStorage.setItem('productsDeactive', JSON.stringify([]));
            }
            else {
                console.log("productsDeactive -> res.status ", JSON.stringify(res.status))
                AsyncStorage.getItem('productsDeactive').then(resp => {
                    if (resp == undefined || resp == null) {
                        AsyncStorage.setItem('productsDeactive', JSON.stringify([]));
                    }
                })
            }
        })
        .catch((e) => {
            console.log("productsDeactive -> fetch list error : ", e)
            AsyncStorage.getItem('productsDeactive').then(resp => {
                if (resp == undefined || resp == null) {
                    AsyncStorage.setItem('productsDeactive', JSON.stringify([]));
                }
            })
        });
    ProductService.getProdukDitolak(id_toko)
        .then((res) => {
            console.log('productsDitolak -> List : ', JSON.stringify(res.status));
            if (res.status === 200) {
                console.log("getProduct -> DITOLAK", res.product.length)
                AsyncStorage.setItem('productsDitolak', JSON.stringify(res.product));
            } else if (res.status === 404) {
                AsyncStorage.setItem('productsDitolak', JSON.stringify([]));
            }
            else {
                console.log("productsDitolak -> res.status ", res.status)
                AsyncStorage.getItem('productsDitolak').then(resp => {
                    if (resp == undefined || resp == null) {
                        AsyncStorage.setItem('productsDitolak', JSON.stringify([]));
                    }
                })
            }
        })
        .catch((e) => {
            console.log("productsDitolak -> fetch list error : ", e)
            AsyncStorage.getItem('productsDitolak').then(resp => {
                if (resp == undefined || resp == null) {
                    AsyncStorage.setItem('productsDitolak', JSON.stringify([]));
                }
            })
        });
    ProductService.getProdukDiblokir(id_toko)
        .then((res) => {
            console.log('productsDiblokir -> List : ', JSON.stringify(res.status));
            if (res.status === 200) {
                // console.log("getProduct -> DIBLOKIR", res.product.length)
                AsyncStorage.setItem('productsDiblokir', JSON.stringify(res.product));
            } else if (res.status === 404) {
                AsyncStorage.setItem('productsDiblokir', JSON.stringify([]));
            }
            else {
                console.log("productsDiblokir -> res.status ", res.status)
                AsyncStorage.getItem('productsDiblokir').then(resp => {
                    if (resp == undefined || resp == null) {
                        AsyncStorage.setItem('productsDiblokir', JSON.stringify([]));
                    }
                })
            }
        })
        .catch((e) => {
            console.log("productsDiblokir -> fetch list error : ", e)
            AsyncStorage.getItem('productsDiblokir').then(resp => {
                if (resp == undefined || resp == null) {
                    AsyncStorage.setItem('productsDiblokir', JSON.stringify([]));
                }
            })
        });
}


export async function getDashboard() {
    try {
        let id = await Storage.getIdToko()
        let response = await AccountService.getDashboard(id);
        if (response.status == 200) {
            await AsyncStorage.setItem("x1", JSON.stringify(response.data))
        } else {
            await AsyncStorage.getItem("x1").then(result => {
                if (result == undefined || result == null) {
                    AsyncStorage.setItem("x1", "")
                }
            })

        }
    } catch (error) {
        await AsyncStorage.getItem("x1").then(result => {
            console.log("🚀 ~ file: Data.js ~ line 156 ~ getDashboard ~ error", error)
            if (result == undefined || result == null) {
                // AsyncStorage.setItem("x1", "belumLogin")
            }
        })
    }
}

export async function getData() {
    try {
        let id = await Storage.getIdToko();
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=j4efp81smrg1tpc6gadd6oob219h28k5");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/pengaturan/profil/" + id, requestOptions)
            .then(response => response.json())
            .then(async result => {
                await AsyncStorage.setItem('xOne', JSON.stringify(result.customer))
                await AsyncStorage.setItem('xxTwo', JSON.stringify(result.seller))
            })
            .catch(error => {
                console.log("🚀 ~ file: Data.js ~ line 194 ~ getData ~ error", error)
                setTimeout(() => {
                    Alert.alert(
                        "Jaja.id",
                        "Mohon periksa kembali koneksi internet anda!",
                        [
                            {
                                text: "OK", onPress: () => {
                                    return false
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }, 200);
            });
    } catch (error) {
        console.log("🚀 ~ file: Data.js ~ line 211 ~ getData ~ error", error)
    }
}

export async function getAccount(id) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=j4efp81smrg1tpc6gadd6oob219h28k5");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch("https://jsonx.jaja.id/core/seller/pengaturan/profil/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    return result
                } else {
                    Utils.handleErrorResponse(result, 'Error with statu code : 10301')
                }
            })
            .catch(error => {
                Utils.handleError(JSON.stringify(error), 'Error with status code')
            });
    } catch (error) {
        console.log("🚀 ~ file: Data.js ~ line 211 ~ getData ~ error", error)
    }
}
export async function getNotifications() {
    try {
        let result = await Storage.getIdToko();
        let response = await AccountService.getNotifications(result);
        if (response.data !== null) {
            if (response.data.total_data !== 0) {
                return await response.data.total_data
            } else {
                return 0;
            }
        }
    } catch (error) {
        console.log("🚀 ~ file: Data.js ~ line 228 ~ getNotifications ~ error", error)
        return 0;
    }
}

export async function getAllProducts() {
    try {
        await ProductService.getProducts();
        await ProductService.getProductsLive();
        await ProductService.getProductsArchive();
        await ProductService.getProductsNostock()
        await ProductService.getProductsWaitConfirm();
        await ProductService.getProductsBlocked();

    } catch (error) {
        console.log("🚀 ~ file: Data.js ~ line 237 ~ getAllProducts ~ error", error)
    }
}

export async function getAllOrders() {
    try {
        await Orders.getAllOrders()
        await Orders.getUnpaid()
        await Orders.getPaid()
        await Orders.getProcess()
        await Orders.getSent()
        Orders.getCompleted()
        Orders.getCanceled()
    } catch (error) {
        console.log("🚀 ~ file: Data.js ~ line 252 ~ getAllOrders ~ error", error)
    }
}

