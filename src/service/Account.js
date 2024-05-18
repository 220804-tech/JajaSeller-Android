import axios from 'axios';
import qs from 'qs'
import AsyncStorage from "@react-native-community/async-storage";
import EncryptedStorage from 'react-native-encrypted-storage';
import { getIdToko } from './Storage'
import { Utils } from '../export';

export async function register(user) {
    var data = new FormData();
    data.append('nama_lengkap', user.username);
    data.append('email', user.email);
    data.append('password', user.password);
    data.append('telepon', user.telephone);
    data.append('from_login', 'android');
    return axios.post("https://jsonx.jaja.id/core/seller/auth/register", data).then((res) => res.data).catch(err => err)
}

export async function vertifikasiEmail() {
    return await axios.get("https://reqres.in/api/register", user).then((res) => res.data)
}
export async function registerToko(toko) {
    var data = new FormData();
    data.append('nama_toko', toko.nama);
    data.append('provinsi', toko.provinsi);
    data.append('kota_kabupaten', toko.kabKota);
    data.append('kecamatan', toko.kecamatan);
    data.append('kelurahan', toko.kelurahan);
    data.append('kode_pos', toko.kodePos);
    data.append('alamat_toko', toko.alamat);
    data.append('greeting_message', 'Selamat Datang di Toko Dev');
    data.append('deskripsi_toko', `${toko.nama} adalah toko di Jaja.id`);
    data.append('id_customer', toko.customer);
    return axios.post("https://jsonx.jaja.id/core/seller/buka_toko", data).then((res) => res.data).catch(err => err)
}

export async function getInfoToko(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dashboard?id_toko=${id_toko}`).then(res => res.data)
}

export async function getDashboard(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dashboard?id_toko=${id_toko}`)
        .then(res => res.data)
}

export async function getProfile() {
    let id = await getIdToko();
    return await axios.get(`https://jsonx.jaja.id/core/seller/dashboard?id_toko=${id}`)
        .then(res => {
            if (res.status === 200) {
                EncryptedStorage.setItem("dashboard", JSON.stringify(res.data.data));
                return res.data.data
            } else {
                return null
            }
        }).catch(err => {
            Utils.handleError(err, "Error with status code : 20124")
            return null
        })
}

export async function getBk(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dompetku/rekening?id_toko=${id_toko}`)
        .then(res => res.data)

}
export async function vertifikasiKey(credentials) {
    var data = JSON.stringify(credentials);
    console.log("🚀 ~ file: Account.js ~ line 51 ~ vertifikasiKey ~ credentials", credentials)

    var config = {
        method: 'post',
        url: 'https://jsonx.jaja.id/core/seller/dompetku/pin/verification',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'ci_session=ca43m1psshpha10j3qb0mv2an465d66t'
        },
        data: data
    };

    return await axios(config).then(response => response.data)

}

export async function addKey(credentials) {
    var data = JSON.stringify(credentials);
    console.log("🚀 ~ file: Account.js ~ line 51 ~ vertifikasiKey ~ credentials", credentials)

    var config = {
        method: 'post',
        url: 'https://jsonx.jaja.id/core/seller/dompetku/pin/create',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'ci_session=ca43m1psshpha10j3qb0mv2an465d66t'
        },
        data: data
    };

    return await axios(config).then(response => response.data)
}

async function getId() {
    try {
        return await AsyncStorage.getItem("xxTwo").then(toko => JSON.parse(toko).id_toko)
    } catch (error) {
        console.log(error, " => error get id toko")
    }
}

export async function addBk(crendentials) {
    // var data = new FormData();
    // data.append('bank_code', crendentials.bank_code);
    // data.append('bank_name', crendentials.bank_name);
    // data.append('account', crendentials.account);
    // data.append('branch_office', crendentials.branch_office);
    // data.append('city', crendentials.city);
    // data.append('id_toko', crendentials.id_toko);

    // var config = {
    //     method: 'post',
    //     url: 'https://jsonx.jaja.id/core/seller/dompetku/rekening',
    //     headers: {
    //         'Cookie': 'ci_session=7tilgokv674dvak44b254cbc3vsurpk5',
    //     },
    //     data: data
    // };

    // return await axios(config)
    //     .then(resp => resp)
    //     .catch(err => Utils.handleError(JSON.stringify(err), "Error with status code 10012"));

    // return await axios.post("https://jsonx.jaja.id/core/seller/dompetku/rekening", data, { headers: { 'Content-Type': 'multipart/form-data' } })
    //     .then(res => res.data)


    var data = new FormData();
    data.append('bank_code', crendentials.bank_code);
    data.append('bank_name', crendentials.bank_name);
    data.append('account', crendentials.account);
    data.append('branch_office', crendentials.branch_office);
    data.append('city', crendentials.city);
    data.append('id_toko', crendentials.id_toko);

    var config = {
        method: 'post',
        url: 'https://jsonx.jaja.id/core/seller/dompetku/rekening',
        headers: {
            'Cookie': 'ci_session=7tilgokv674dvak44b254cbc3vsurpk5',
            // ...data.getHeaders()
        },
        data: data
    };

    return await axios(config)
        .then(response => response.data)
        .catch(err => Utils.handleError(err, 'Error with status code : 10012'))

}

export async function editBk(crendentials) {
    var data = qs.stringify({
        'name': crendentials.name,
        'bank_code': crendentials.bkKode,
        'bank_name': crendentials.bkName,
        'account': crendentials.acc,
    });
    return await axios.post(`https://jsonx.jaja.id/core/seller/dompetku/rekening/${crendentials.id}`, data)
        .then(res => res.data)
}

export async function deleteBk(idBk, idToko) {
    return await axios.delete(`https://jsonx.jaja.id/core/seller/dompetku/rekening/${idBk}?id_toko=${idToko}`)
        .then(res => res.data)
}
export async function getKey(id) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dompetku/pin?id_toko=${id}`)
        .then(res => res.data)
}

export async function getsalad() {
    let result = await getId()
    return await axios.get(`https://jsonx.jaja.id/core/seller/dompetku/saldo?id_toko=${result}`)
        .then(res => res.data)
}

export async function withdrawal(credentials) {
    var data = JSON.stringify(credentials);

    var config = {
        method: 'post',
        url: 'https://jsonx.jaja.id/core/seller/dompetku/saldo',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'ci_session=pq2v6hedc3ctoimutsv614vfjv3dvd3q'
        },
        data: data
    };
    return await axios(config).then(response => response.data)

}

export async function getListTransaction(result) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dompetku/payouts?id_toko=${result}`)
        .then(res => res.data)
}

export async function getListIncome(result) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dompetku/income?id_toko=${result}&status=all`)
        .then(res => res.data)
}
export async function getListRefund(result) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dompetku/income?id_toko=${result}&status=refund`)
        .then(res => res.data)
}

export async function getNotifications(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/dashboard/notifikasi?id_toko=${id_toko}`).then(res => res.data)
}