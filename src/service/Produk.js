import axios from "axios";
import qs from 'qs'
import AsyncStorage from "@react-native-community/async-storage";
import { Utils } from "../export";

export async function getProducts() {
  let result = await getId()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=&id_toko=${result}`, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.status == 200) {
        AsyncStorage.setItem('allProducts', JSON.stringify(res.product))
      } else {
        AsyncStorage.setItem('allProducts', JSON.stringify([]))
      }
    })
    .catch(error => console.log('error allProducts : ', error));
}

export async function getProductsLive() {
  let result = await getId()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=1&id_toko=${result}`, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.status == 200) {
        AsyncStorage.setItem('productsLive', JSON.stringify(res.product))
      } else {
        AsyncStorage.setItem('productsLive', JSON.stringify([]))
      }
    })
    .catch(error => console.log('error productsLive : ', error));
}

export async function getProductsNostock() {
  let result = await getId()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=&id_toko=${result}&stok=true`, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.status == 200) {
        AsyncStorage.setItem('productsNostock', JSON.stringify(res.product))
      } else {
        AsyncStorage.setItem('productsNostock', JSON.stringify([]))
      }
    })
    .catch(error => console.log('error productsNostock : ', error));
}

export async function getProductsArchive() {
  let result = await getId()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=4&id_toko=${result}`, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.status == 200) {
        AsyncStorage.setItem('productsArchive', JSON.stringify(res.product))
      } else if (res.status == 404 && res.message == 'Produk masih kosong') {
        AsyncStorage.setItem('productsArchive', JSON.stringify([]))
      }
    })
    .catch(error => console.log('error productsArchive : ', error));
}

export async function getProductsWaitConfirm() {
  let result = await getId()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=5&id_toko=${result}`, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.status == 200) {
        AsyncStorage.setItem('productsWaitConfirm', JSON.stringify(res.product))
      } else {
        AsyncStorage.setItem('productsWaitConfirm', JSON.stringify([]))
      }
    })
    .catch(error => console.log('error productsWaitConfirm : ', error));
}

export async function getProductsBlocked() {
  let result = await getId()
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=3&id_toko=${result}`, requestOptions)
    .then(response => response.json())
    .then(res => {
      if (res.status == 200) {
        AsyncStorage.setItem('productsBlocked', JSON.stringify(res.product))
      } else {
        AsyncStorage.setItem('productsBlocked', JSON.stringify([]))
      }
    })
    .catch(error => console.log('error productsBlocked : ', error));
}

export async function getApiProduk(id_toko) {
  let data;
  let result = await getId()
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "ci_session=5uvmd9reofi22n7vi9ireo9tmo4452f4");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=&id_toko=${result}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      data = result.product
    })
  return data
}

export async function getProdukTidakAktif(id_toko) {
  return await axios
    .get(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=4&id_toko=${id_toko}&id_produk=`)
    .then((res) => res.data);
}

export async function getProdukDitolak(id_toko) {
  return await axios
    .get(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=2&id_toko=${id_toko}&id_produk=`)
    .then((res) => res.data);
}

export async function getMenungguKonfirmasi(id_toko) {
  return await axios
    .get(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=5&id_toko=${id_toko}&id_produk=`)
    .then((res) => res.data);
}

export async function getProdukDiblokir(id_toko) {
  return await axios
    .get(`https://jsonx.jaja.id/core/seller/product?page=1&limit=10&filter=3&id_toko=${id_toko}&id_produk=`)
    .then((res) => res.data);
}

export async function getPesananDiBatalkan() {
  return await axios
    .get("https://reqres.in/api/users?page=2")
    .then((res) => res.data);
}

export async function getKategori() {
  return await axios
    .get("https://jsonx.jaja.id/core/data/kategori")
    .then((res) => res.data);
}

export async function getBrand() {
  return await axios
    .get("https://jsonx.jaja.id/core/data/brand")
    .then((res) => res.data);
}

export async function getWarna() {
  return await axios
    .get("https://jsonx.jaja.id/core/data/model?jenis=warna")
    .then((res) => res.data);
}
export async function getUkuran() {
  return await axios
    .get("https://jsonx.jaja.id/core/data/model?jenis=ukuran")
    .then((res) => res.data);
}

export async function getProductById(id_produk) {
  return await axios.get(`https://jsonx.jaja.id/core/seller/product/${id_produk}`).then((res) => res.data);
}

export async function deleteDiskon(id_variasi) {
  return await axios.delete(`https://jsonx.jaja.id/core/seller/product/diskon/${id_variasi}`)
}
export async function deleteVariasi(id_variasi) {
  try {
    let res = await axios.delete(`https://jsonx.jaja.id/core/seller/product/diskon/${id_variasi}`,)
    return res.data;
  } catch (error) {
    console.log("deleteProduct -> error", error)
  }
}

export async function postProduk(form) {
  let data = new FormData();

  data.append('save_as', form.save_as);
  data.append('nama_produk', form.nama_produk);
  data.append('id_kategori', form.id_kategori);
  data.append('id_sub_kategori', form.id_sub_kategori);
  data.append('deskripsi', form.deskripsi);
  data.append('merek', form.merek);
  data.append('produk_variasi_harga', form.produk_variasi_harga);
  data.append('variasi', JSON.stringify(form.variasi));
  data.append('kode_sku_single', form.kode_sku_single);
  data.append('harga_single', form.harga_single);
  data.append('stok_single', form.stok_single);
  data.append('tipe_berat', form.tipe_berat);
  data.append('berat', form.berat);
  data.append('ukuran_paket_panjang', form.ukuran_paket_panjang);
  data.append('ukuran_paket_lebar', form.ukuran_paket_lebar);
  data.append('ukuran_paket_tinggi', form.ukuran_paket_tinggi);
  data.append('asal_produk', form.asal_produk);
  data.append('id_toko', form.id_toko);
  data.append('kondisi', form.kondisi);
  data.append('pre_order', form.pre_order);
  data.append('masa_pengemasan', form.masa_pengemasan);
  data.append('file_foto_1', form.file_foto_1);
  data.append('file_foto_2', form.file_foto_2);
  data.append('file_foto_3', form.file_foto_3);
  data.append('file_foto_4', form.file_foto_4);
  data.append('file_foto_5', form.file_foto_5);

  let config = {
    method: 'post',
    url: 'https://jsonx.jaja.id/core/seller/product',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  };


  let response = axios(config).then(res => {
    console.log("postProduk -> res", JSON.stringify(res.data))

    return JSON.stringify(res.data)
  }).catch(error => {
    console.log("postProduk -> error", error)
    return error
  })

  return response
}
export async function editProduct(form, id, status) {

  console.log("editProduct -> id", id)
  return axios.put(`https://jsonx.jaja.id/core/seller/product/${id}${status ? '?status=5' : ''}`, form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

}
export async function addVariasi(form, id, meth) {
  console.log("🚀 ~ file: Produk.js ~ line 155 ~ addVariasi ~ id", id)
  console.log("addVariasi -> form", form)
  console.log("addVariasi -> meth", meth)
  if (meth == "post") {
    let data = new FormData();
    data.append('pilihan', form.pilihan);
    data.append('nama', form.nama);
    data.append('kode_sku', form.kode_sku);
    data.append('harga', form.harga);
    data.append('stok', form.stok);

    var config = {
      method: 'post',
      url: `https://jsonx.jaja.id/core/seller/product/variasi/${id}`,
      data: data
    };

    return await axios(config);
  } else {
    var data = qs.stringify({
      'pilihan': form.pilihan,
      'nama': form.nama,
      'kode_sku': form.kode_sku,
      'harga': form.harga,
      'stok': form.stok
    });
    return await axios.put(`https://jsonx.jaja.id/core/seller/product/variasi/${id}`, data)
  }
}


export async function aturDiskon(credentials, id_variasi) {
  var data = qs.stringify({
    'presentase_diskon': credentials.presentase_diskon,
    'tgl_mulai_diskon': credentials.tgl_mulai_diskon,
    'tgl_berakhir_diskon': credentials.tgl_berakhir_diskon
  });
  return await axios.put(`https://jsonx.jaja.id/core/seller/product/diskon/${id_variasi}`, data);
}

async function getId() {
  try {
    return await AsyncStorage.getItem("xxTwo").then(toko => JSON.parse(toko).id_toko)
  } catch (error) {
    // Utils.handleError(error)
  }
}

export async function getIdToko() {
  return await AsyncStorage.getItem("xxTwo").then(toko => JSON.parse(toko).id_toko)
}
export async function getName() {
  return await AsyncStorage.getItem("xxTwo").then(toko => JSON.parse(toko).nama_toko)
}

export async function getRating() {
  let result = await getId()
  return await axios.get(`https://jsonx.jaja.id/core/seller/review/rating?id_toko=${result}`).then((res) => res.data);
}

export async function getDetailRating(val) {
  return await axios.get(`https://jsonx.jaja.id/core/seller/review/rating/${val}`).then((res) => res.data);
}

export async function getRatingById(rating) {
  return await axios.get(`https://jsonx.jaja.id/core/seller/review/rating/${rating}`).then((res) => res.data);
}

export async function getReport() {
  let result = await getId()
  return await axios.get(`https://jsonx.jaja.id/core/seller/review/report?id_toko=${result}`).then((res) => res.data);
}
export async function getReportById(report) {
  return await axios.get(`https://jsonx.jaja.id/core/seller/review/report/${report}`).then((res) => res.data);
}


export async function setPriceStock(id, credentials) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "ci_session=9gmlq53v0q3rup6jnummkgmjvq6uov9n");

  var raw = JSON.stringify({ "variasi": credentials });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return await fetch(`https://jsonx.jaja.id/core/seller/product/variasi_array/${id}`, requestOptions)
    .then(response => response.json())
    .then(result => result)
    .catch(error => Utils.handleError(error));
}




