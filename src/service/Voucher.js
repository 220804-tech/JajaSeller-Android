import axios from "axios";
var qs = require('qs');

export async function getVoucher(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/voucher?page=&limit=10&filter=&id_toko=${id_toko}&id_promo=`).then((res) => res.data);
}
export async function getVoucherAktif(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/voucher?page=&limit=10&filter=1&id_toko=${id_toko}&id_promo=`).then((res) => res.data);
}
export async function getVoucherTidakAktif(id_toko) {
    return await axios.get(`https://jsonx.jaja.id/core/seller/voucher?page=&limit=10&filter=2&id_toko=${id_toko}&id_promo=`).then((res) => res.data);
}

export async function deleteVoucher(id_promo) {
    return await axios.delete(`https://jsonx.jaja.id/core/seller/voucher/${id_promo}`).then((res) => res.data);
}

export async function addVoucher(form) {
    console.log("addVoucher -> form", form)
    let data = new FormData();
    data.append('kode_promo', form.kode_promo);
    data.append('mulai', form.mulai);
    data.append('berakhir', form.berakhir);
    data.append('judul_promo', form.judul_promo);
    data.append('id_kategori', form.id_kategori);
    data.append('id_sub_kategori', form.sub_kategori);
    data.append('nominal_diskon', form.nominal_diskon);
    data.append('persentase_diskon', form.persentase_diskon);
    data.append('kuota_voucher', form.kuota_voucher);
    data.append('banner_promo', form.banner_promo);
    data.append('id_toko', form.id_toko);

    return await axios.post('https://jsonx.jaja.id/core/seller/voucher', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export async function editVoucher(form, id_promo) {
    var data = qs.stringify({
        'kode_promo': form.kode_promo,
        'mulai': form.mulai,
        'berakhir': form.berakhir,
        'judul_promo': form.judul_promo,
        'id_kategori': form.id_kategori,
        'id_sub_kategori': form.sub_kategori,
        'nominal_diskon': form.nominal_diskon,
        'persentase_diskon': form.persentase_diskon,
        'kuota_voucher': form.kuota_voucher,
        'banner_promo': form.banner_promo
    })

    return await axios.put(`https://jsonx.jaja.id/core/seller/voucher/${id_promo}`, data)
}
export async function getPesananDiBatalkan() {
    return await axios
        .get("https://reqres.in/api/users?page=2")
        .then((res) => res.data);
}

export async function updateStatusVoucher(id_promo, id_status) {
    try {
        let res = await axios.put(`https://jsonx.jaja.id/core/seller/voucher/status/${id_promo}/${id_status}`,)
        return res.data;
    } catch (error) {
        console.log("updateStatusVoucher -> error", error)
    }
}