import axios from 'axios'
import { Utils } from '../export'
import { getIdToko } from './Storage'
export async function getNotifications() {
    try {
        let id = await getIdToko()
        return await axios.get(`https://jsonx.jaja.id/core/seller/dashboard/notifikasi?id_toko=${id}`).then(res => res.data)
    } catch (error) {
        Utils.handleError(error, "Error with status code : 20125")
        return null
    }
}