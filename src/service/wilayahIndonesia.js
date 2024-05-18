import axios from 'axios';
export async function provinsi() {
    return await axios.get("https://jsonx.jaja.id/core/data/province").then((res) => res.data)
}
export async function kabupatenKota(id_provinsi) {
    return await axios.get(`https://jsonx.jaja.id/core/data/city?province=${id_provinsi}`).then((res) => res.data)
}
export async function getKecamatan() {
    return await axios.get('https://jsonx.jaja.id/core/data/kecamatan').then((res) => res.data)
}
export async function getKelurahan(kd_kec) {
    return await axios.get(`https://jsonx.jaja.id/core/data/kelurahan?kd_kec=${kd_kec}`).then((res) => res.data)
}