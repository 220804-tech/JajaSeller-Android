import React from 'react';
import { ToastAndroid } from 'react-native';
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import * as Storage from './Storage'
export async function getPesananBaru() {
  return await axios
    .get("https://reqres.in/api/users?page=2")
    .then((res) => res.data);
}

export async function getPesananDiBatalkan() {
  return await axios
    .get("https://reqres.in/api/users?page=2")
    .then((res) => res.data);
}

const AsyncStorageAllOrders = (name) => {
  console.log("🚀 ~ file: Penjualan.js ~ line 17 ~ AsyncStorageAllOrders ~ name", name)
  AsyncStorage.getItem(name).then(res => {
    console.log("🚀 ~ file: Penjualan.js ~ line 18 ~ AsyncStorage.getItem ~ res", res)
    if (res == null || res == undefined) {
      AsyncStorage.setItem(name, JSON.stringify([]))
    }
  })
}

export async function getAllOrders() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=all&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("🚀 ~ file: Penjualan.js ~ line 36 ~ getAllOrders ~ result", result)
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-all", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-all")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders('order-all')
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)

      });
  } catch (error) {
    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
    AsyncStorageAllOrders("order-all")
  }
}

export async function getUnpaid() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=belum-dibayar&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-unpaid", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-unpaid")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders("order-unpaid")
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
      });

  } catch (error) {
    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)

    AsyncStorageAllOrders("order-unpaid")
  }
}
export async function getPaid() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=pesanan-baru&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-paid", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-paid")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders("order-paid")
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
      });
  } catch (error) {
    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
    AsyncStorageAllOrders("order-paid")
  }
}
export async function getProcess() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=perlu-dikirim&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-process", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-process")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders("order-process")
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
      })
  } catch (error) {
    AsyncStorageAllOrders("order-process")
  }
}

export async function getSent() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=dikirimkan&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-sent", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-sent")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders("order-sent")
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
      })
  } catch (error) {
    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
    AsyncStorageAllOrders("order-sent")
  }
}

export async function getCompleted() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=selesai&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-completed", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-completed")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders("order-completed")
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)

      });
  } catch (error) {
    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
    AsyncStorageAllOrders("order-completed")
  }
}

export async function getCanceled() {
  try {
    let idToko = await Storage.getIdToko()
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    await fetch(`https://jsonx.jaja.id/core/seller/penjualan?id_toko=${idToko}&status=pembatalan&page=1&limit=100&filter_date=`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status.code === 200) {
          AsyncStorage.setItem("order-cancel", JSON.stringify(result.data.items))
        } else {
          AsyncStorageAllOrders("order-cancel")
        }
      })
      .catch(error => {
        AsyncStorageAllOrders("order-cancel")
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
      });
  } catch (error) {
    AsyncStorageAllOrders("order-cancel")
    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
  }
}