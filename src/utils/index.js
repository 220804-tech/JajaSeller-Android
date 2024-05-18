import { ToastAndroid, Alert, Platform, AlertIOS } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import { Utils } from '../export';

import EncryptedStorage from 'react-native-encrypted-storage';

export function money(value) {
    value = value.replace(".", "")
    value = value.replace(" ", "")
    value = value.replace(",", "")
    value = value.replace("-", "")
    if (value.length == 0) {
        return 0;
    } else if (value.length > 1 && value.substring(0, 1) == 0) {
        return value.substring(1, value.length)

    } else if (value.length == 1 && value == 0) {
        return 0;
    } else if (value.length == 2 && value.substring(0, 1) == 0 && value.substring(1, 2) == 0) {
        return 0;
    } else if (value.length == 3 && value.substring(0, 1) == 0 && value.substring(1, 2) == 0 && value.substring(2, 3) == 0) {
        return 0;
    } else if (value.length == 4) {
        return value.insert(1, ".")
    } else if (value.length == 5) {
        return value.insert(2, ".")
    } else if (value.length == 6) {
        return value.insert(3, ".")
    } else if (value.length == 7) {
        value = value.insert(1, ".")
        value = value.insert(5, ".")
        return value;
    } else if (value.length == 8) {
        value = value.insert(2, ".")
        value = value.insert(6, ".")
        return value;
    } else if (value.length == 9) {
        value = value.insert(3, ".")
        value = value.insert(7, ".")
        return value;
    } else if (value.length == 10) {
        value = value.insert(1, ".")
        value = value.insert(5, ".")
        value = value.insert(9, ".")
        return value;
    } else if (value.length == 11) {
        value = value.insert(2, ".")
        value = value.insert(6, ".")
        value = value.insert(10, ".")
        return value;
    } else if (value.length == 12) {
        value = value.insert(3, ".")
        value = value.insert(7, ".")
        value = value.insert(11, ".")
        return value;
    } else if (value.length == 13) {
        value = value.insert(1, ".")
        value = value.insert(5, ".")
        value = value.insert(9, ".")
        value = value.insert(13, ".")
        return value;
    } else if (value.length == 14) {
        value = value.insert(2, ".")
        value = value.insert(6, ".")
        value = value.insert(10, ".")
        value = value.insert(14, ".")
        return value;
    }
    else if (value.length == 15) {
        value = value.insert(3, ".")
        value = value.insert(7, ".")
        value = value.insert(11, ".")
        value = value.insert(15, ".")
        return value;
    } else if (value.length == 16) {
        value = value.insert(4, ".")
        value = value.insert(8, ".")
        value = value.insert(12, ".")
        value = value.insert(16, ".")
        value = value.insert(1, ".")
        return value;
    } else {
        return value;
    }
}

export async function checkSignal() {
    let signalInfo = {}
    await NetInfo.fetch().then(state => {
        signalInfo.type = state.type
        signalInfo.connect = state.isConnected
    });
    return signalInfo
}

export function regex(name, value) {
    if (name === "number") {
        return (value.replace(/[^0-9]/gi, ''))
    } else if (name === "money") {
        let result = money(value)
        console.log("🚀 ~ file: index.js ~ line 105 regex ~ result", result)
        return result.replace(/[^0-9.]/gi, '')
    }
}

export function payouts() {

}

export function handleResponseError(error) {
    Alert.alert(
        "Error with status 13021",
        String(error.message) + " => " + String(error.code),
        [
            {
                text: "TUTUP",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            }
        ],
        { cancelable: false }
    );
}

export function handleResponse(error) {
    if (error.status.code !== 200 && error.status.code !== 204) {
        Alert.alert(
            "Error with status 12001",
            String(error.status.message) + " => " + String(error.status.code),
            [
                {
                    text: "TUTUP",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    } else {

    }
}
export function handleError(error, name) {
    if (String(error).toLowerCase().includes('request failed') || String(error).toLowerCase().includes('network error') || String(error).toLowerCase().includes('network request failed')) {
        alertPopUp("Tidak dapat terhubung, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
    } else {
        Alert.alert(
            "Error with status :",
            `${name + " " + String(error)}`,
            [
                {
                    text: "TUTUP",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }
}

export function handleErrorResponse(error, errorCode) {
    if (String(error).includes('request failed')) {
        Utils.alertPopUp('Periksa koneksi anda terlenih dahulu!')
    } else {
        if (error && Object.keys(error).length) {
            if (error.status && Object.keys(error.status).length && error.status.code !== 200 && error.status.code !== 204) {
                if (error.status && error.status.message) {
                    alertPopUp(String(error.status.message))
                } else {
                    Alert.alert(
                        errorCode,
                        String(error.status.message) + " => " + String(error.status.code),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            } else if (error.error) {
                alertPopUp(String(error.message))
            }
        } else {
            Alert.alert(
                errorCode,
                "Error response:" + String(error),
                [
                    {
                        text: "TUTUP",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    }
                ],
                { cancelable: false }
            );
        }
    }
}

export function alertPopUp(text) {
    try {
        if (Platform.OS === 'android') {
            ToastAndroid.show(text, ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            AlertIOS.alert(text);
        }
    } catch (error) {

    }
}
export async function userLogin() {
    try {
        let res = await EncryptedStorage.getItem('token')
        if (res && String(res).length === 18) {
            return false

        } else {
            return false

        }
    } catch (error) {
        return false

    }

}

export async function handleSignal() {
    try {
        await NetInfo.fetch().then(state => {
            if (state.isConnected) {
                alertPopUp('Tidak dapat memuat ke server')
            } else {
                alertPopUp("Tidak dapat terhubung, periksa kembali koneksi internet anda!")
            }
        });

    } catch (error) {
        console.log("🚀 ~ file: Form.js ~ line 71 ~ handleSignal ~ error", error)
    }
}

