import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Appbar, } from 'react-native-paper'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';

export default function ProdukDeskripsi() {
    return (
        <View style={StyleSheet.container}>
            <Appbar.Header style={styles.appBar}>
                <TouchableOpacity style={styles.iconHeader} onPress={() => this.props.navigation.navigate("Login")}>
                    <Image
                        source={require('../../../icon/arrow.png')}
                        style={styles.appBarIcon}
                    />
                </TouchableOpacity>
            </Appbar.Header>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    iconHeader: {
        width: wp('10%')
    },
    appBar: {
        backgroundColor: '#64B0C9',
        height: hp('5%'),
        color: 'white',
        paddingHorizontal: wp('5%')
    },
    appBarIcon: {
        tintColor: Warna.white,
        width: 27,
        height: 27
    },

})