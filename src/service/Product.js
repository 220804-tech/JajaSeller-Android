import { Utils } from '../export'
import axios from "axios";
import qs from 'qs'
import { Alert } from 'react-native';


export async function productDetail(auth, slug) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Cookie", "ci_session=pkkgeivel5ftbi5a9eod0r8k5276f8v9");
    var requestOptions = {
        method: 'GET',
        headers: auth ? myHeaders : "",
        redirect: 'follow'
    };
    return await fetch(`https://jaja.id/backend/product/${slug}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                let data = JSON.parse(result)
                if (data && Object.keys(data).length && data.status.code === 200) {
                    return data.data;
                } else {
                    if (data.status.code !== 400) {
                        Utils.handleErrorResponse(data, "Error with status code : 12051")
                    }
                    return data
                }
            } catch (error) {
                Utils.handleError(JSON.stringify(result), "Error with status code : 12052")
            }
        })
        .catch(error => {
            console.log("🚀 ~ file: Product.js ~ line 32 ~ productDetail ~ error", error)
            Utils.handleError(String(error), "Error with status code : 120477")
            return null
        });
}


export async function fetchAllProduct(idToko) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=t8ehlkm10jm01957usn7v4t23v201bmg");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let result = await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=50&filter=&id_toko=${idToko}`, requestOptions).then(res => res.json());
        if (result.status == 200) {
            return result.product
        } else {
            return []
        }
    } catch (error) {
        Utils.handleError(error)
        return null
    }
}


export async function fetchLiveProduct(idToko) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=t8ehlkm10jm01957usn7v4t23v201bmg");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let result = await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=50&filter=1&id_toko=${idToko}`, requestOptions).then(res => res.json());
        if (result.status == 200) {
            return result.product
        } else {
            return []
        }
    } catch (error) {
        Utils.handleError(error, 'Live')
        return null
    }
}


export async function fetchArchiveProduct(idToko) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=t8ehlkm10jm01957usn7v4t23v201bmg");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let result = await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=50&filter=4&id_toko=${idToko}`, requestOptions).then(res => res.json());
        if (result.status == 200) {
            return result.product
        } else {
            return []
        }
    } catch (error) {
        Utils.handleError(error, "Produk Diarsipkan")
        return null
    }
}


export async function fetchSoldOutProduct(idToko) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=t8ehlkm10jm01957usn7v4t23v201bmg");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let result = await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=50&filter=6&id_toko=${idToko}`, requestOptions).then(res => res.json());
        console.log("file: Product.js ~ line 81 ~ fetchSoldOutProduct ~ result", result)
        if (result.status == 200) {
            return result.product
        } else {
            return []
        }
    } catch (error) {
        Utils.handleError(error, "Produk Habis")
        return null
    }
}


export async function fetchBlockedProduct(idToko) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=t8ehlkm10jm01957usn7v4t23v201bmg");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let data = []
        let result = await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=50&filter=3&id_toko=${idToko}`, requestOptions).then(res => res.json());
        if (result.status == 200) {
            data = await result.product
        } else {
            data = [];
        }
        let resultChild = await fetch(`https://jsonx.jaja.id/core/seller/product?page=1&limit=50&filter=5&id_toko=${idToko}`, requestOptions).then(res => res.json());
        if (result.status == 200) {
            if (resultChild.product && resultChild.product.length) {
                return data.concat(resultChild.product)
            } else {
                return data
            }
        } else {
            return data
        }

    } catch (error) {
        Utils.handleError(error, "Produk diblokir")
        return null
    }
}

export async function getProductById(id_produk) {
    try {
        return await axios.get(`https://jsonx.jaja.id/core/seller/product/${id_produk}`).then((res) => res.data);
    } catch (error) {
        Utils.handleError(error, "Produk Detail")
    }
}

export async function updateStatusProduct(id_produk, id_status) {
    try {
        let res = await axios.put(`https://jsonx.jaja.id/core/seller/product/status/${id_produk}/${id_status}`,)
        return res.data;
    } catch (error) {
        Utils.handleError(error, "Update status")
        console.log("updateStatusProduct -> error", error)
    }
}
export async function deleteProduct(id_produk) {
    try {
        let res = await axios.delete(`https://jsonx.jaja.id/core/seller/product/${id_produk}`)
        return res.data;
    } catch (error) {
        Utils.handleError(error, "Hapus produk")
    }
}

export async function aturDiskon(credentials, id_variasi) {
    try {
        var data = qs.stringify({
            'presentase_diskon': credentials.presentase_diskon,
            'tgl_mulai_diskon': credentials.tgl_mulai_diskon,
            'tgl_berakhir_diskon': credentials.tgl_berakhir_diskon
        });
        let res = await axios.put(`https://jsonx.jaja.id/core/seller/product/diskon/${id_variasi}`, data);
        return res
    } catch (error) {
        Utils.handleError(error, "Atur diskon")
    }
}

export async function deleteDiskon(id_variasi) {
    try {
        return await axios.delete(`https://jsonx.jaja.id/core/seller/product/diskon/${id_variasi}`)
    } catch (error) {
        Utils.handleError(error, "Reset diskon")
    }
}

export async function getCategorys() {
    return await axios.get("https://jsonx.jaja.id/core/data/kategori")
        .then((res) => res.data);
}

export async function getBrands() {
    return await axios.get("https://jsonx.jaja.id/core/data/brand")
        .then((res) => res.data);
}

export async function addProduct(form) {
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
        return JSON.stringify(res.data)
    }).catch(error => {
        Utils.handleSignal(error)
        return error
    })

    return response
}

export async function getEtalase(idToko) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return await fetch(`https://elibx.jaja.id/jaja/etalase/get-etalase?id=${idToko}`, requestOptions)
        .then(response => response.text())
        .then(json => {
            try {
                let result = JSON.parse(json)
                if (result?.status?.code === 200) {
                    return result.data
                } else if (!result?.data?.length) {
                    return false
                } else {
                    Utils.alertPopUp(result?.status?.message)
                    return false
                }
            } catch (error) {
                Utils.handleErrorResponse(String(json), 'Error with status code : 92002')
                return false
            }
        })
        .catch(error => {
            Utils.handleErrorResponse(String(error), 'Error with status code : 91001')
            return false
        });
}


export async function addEtalase(idToko, etalaseName) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "seller_id": idToko,
        "name": etalaseName
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    return await fetch("https://elibx.jaja.id/jaja/etalase/add-etalase", requestOptions)
        .then(response => response.text())
        .then(json => {
            console.log("🚀 ~ file: Product.js ~ line 287 ~ addEtalase ~ json", json)
            try {
                let result = JSON.parse(json)
                if (result?.status?.code === 200) {
                    return true
                } else {
                    Utils.alertPopUp(result?.status?.message)
                    return true
                }
            } catch (error) {
                Utils.handleErrorResponse(String(json), 'Error with status code : 92001')
                return true
            }
        })
        .catch(error => {
            console.log("🚀 ~ file: Product.js ~ line 304 ~ addEtalase ~ error", error)
            Utils.handleErrorResponse(String(error), 'Error with status code : 91001')
            return true
        });
}
