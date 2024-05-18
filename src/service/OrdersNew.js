
import { Utils } from '../export';

export async function getTabAll(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=all&page=1&limit=50&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 22 ~ getTabAll ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900120")
            return []
        });
}

export async function getTabUnpaid(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=belum-dibayar&page=1&limit=10&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 51 ~ getTabUnpaid ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900121")
            return []
        });
}

export async function getTabPaid(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=pesanan-baru&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 77 ~ getTabPaid ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900122")
            return []
        });
}

export async function getTabNeedSent(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=perlu-dikirim&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 104 ~ getTabNeedSent ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900123")
            return []
        });
}

export async function getTabSent(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=dikirimkan&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 132 ~ getTabSent ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900124")
            return []
        });
}

export async function getTabCompleted(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=selesai&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 158 ~ getTabCompleted ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900125")
            return []
        });
}

export async function getTabFailed(id) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=pembatalan&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(res => {
            try {
                let result = JSON.parse(res)
                if (result.status.code == 200) {
                    return result.data.items
                } else {
                    return []
                }
            } catch (error) {
                Utils.alertPopUp(JSON.stringify(res))
                console.log("🚀 ~ file: OrdersNew.js ~ line 185 ~ getTabCompleted ~ error", String(error))
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 900165")
            return []
        });
}