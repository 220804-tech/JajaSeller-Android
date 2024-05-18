import { getIdToko } from './Storage'
import EncryptedStorage from 'react-native-encrypted-storage';

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