import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { getIdToko } from './Storage'

import EncryptedStorage from 'react-native-encrypted-storage';
import { Utils } from '../export';
import axios from 'axios';

export async function getAllOrders() {
    let orders = await getOrders()
    let orderUnpaid = await getOrderUnpaid();
    let orderPaid = await getOrderPaid();
    let orderSent = await getOrderSent();
    let orderProcess = await getOrderProcess();
    let orderCompleted = await getOrderCompleted();
    let orderFailed = await getOrderFailed();

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

export async function getOrders() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=all&page=1&limit=50&filter_date=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('data keluar')
            if (result.status.code == 200) {
                EncryptedStorage.setItem("orders", JSON.stringify(result.data.items));
                console.log('data return')
                return result.data.items
            } else {
                return ([])
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20126")
            return []
        });
}

export async function getOrderUnpaid() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=belum-dibayar&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.text())
        .then(data => {
            try {
                let result = JSON.parse(data)
                if (result.status.code == 200) {
                    EncryptedStorage.setItem("order-unpaid", JSON.stringify(result.data.items));
                    return result.data.items;
                } else {
                    return ([])
                }
            } catch (error) {
                alert(data)
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20127")
            return []
        });
}

export async function getOrderPaid() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=pesanan-baru&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code == 200) {
                EncryptedStorage.setItem("order-paid", JSON.stringify(result.data.items));
                return result.data.items
            } else {
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20128")
            return []
        });
}

export async function getOrderProcess() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=perlu-dikirim&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code == 200) {
                EncryptedStorage.setItem("order-process", JSON.stringify(result.data.items));
                return result.data.items
            } else {
                return ([])
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20129")
            return []
        });
}


export async function getOrderSent() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=dikirimkan&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code == 200) {
                EncryptedStorage.setItem("order-sent", JSON.stringify(result.data.items));
                return result.data.items
            } else {
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20130")
            return []
        });
}
export async function getOrderCompleted() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=selesai&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code == 200) {
                EncryptedStorage.setItem("order-completed", JSON.stringify(result.data.items));
                return result.data.items
            } else {
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20131")
            return []
        });
}

export async function getOrderFailed() {
    let id = await getIdToko()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${id}&status=pembatalan&page=1&limit=25&filter_date=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status.code == 200) {
                EncryptedStorage.setItem("order-failed", JSON.stringify(result.data.items));
                return result.data.items
            } else {
                return []
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 20132")
            return []
        });
}

export async function requestPickup(id, crendentials) {
    console.log("🚀 ~ file: Orders.js ~ line 190 ~ requestPickup ~ crendentials", crendentials)
    try {
        var data = JSON.stringify({
            "id_toko": id,
            "invoice": crendentials
        });
        var config = {
            method: 'post',
            url: 'https://jsonx.jaja.id/core/seller/pickup',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(function (response) {
                if (response?.data?.status?.code === 200) {
                    return true
                } else {
                    Utils.handleErrorResponse(response.data, 'Error with status code : 31010')
                    return false
                }
            })
            .catch(function (error) {
                Utils.handleError(error, 'Error with status code : 31011')
                return false
            });
    } catch (error) {
        Utils.handleError(error, 'Error with status code : 31012')
        return false
    }
}
