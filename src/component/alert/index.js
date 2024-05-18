import { Alert } from 'react-native'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class index {
    alertUsername() {
        return Alert.alert(
            'Tolong input dengan benar!',
            'Username tidak boleh kurang dari 4 huruf',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                },
            ]
        )
    }

    alertPassword() {
        return Alert.alert(
            'Tolong input dengan benar!',
            'Konfirmasi password tidak sama',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                },
            ]
        )

    }
    alertEmial() {
        Alert.alert(
            'Tolong input dengan benar',
            'Email',
            [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => console.log('OK Pressed')
            },
            ]
        )
    }
}
