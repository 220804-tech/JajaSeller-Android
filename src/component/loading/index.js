import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import Warna from '../../config/Warna';
import { shadow } from 'react-native-paper';

export default function Loading() {
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <View style={styles.loading}>
                    <Progress.CircleSnail duration={550} size={30} color={[Warna.biruJaja, Warna.kuningJaja]} />
                </View>
                {/* <View style={styles.loadingJaja}>

            </View>
            <View style={styles.cardLogo}>
                <Image style={styles.logoJaja} source={require('../../image/Loading_2.gif')} />
            </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // loadingJaja: {
    //     position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: "#303030", zIndex: 1, elevation: 5, opacity: 0.7
    // },
    // cardLogo: {
    //     backgroundColor: 'white',
    //     width: 250,
    //     height: 150,
    //     elevation: 7,
    //     borderRadius: 20,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // logoJaja: {
    //     width: wp('70%'), height: hp('25%'), shadowColor: "#000", opacity: 2,
    //     shadowOffset: {
    //         width: 0,
    //         height: 3,
    //     },
    //     shadowOpacity: 0.27,
    //     shadowRadius: 4.65,
    //     alignSelf: 'center',
    // },
    loading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: "#454545", elevation: 5, opacity: 0.2 },
    center: {
        zIndex: 1,

        elevation: 24,
    },
    background: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        elevation: 7,
    },
    container: {
        zIndex: 99999,
        backgroundColor: 'transparent',
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.10)',

    },
    loading: {
        padding: 8,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    }
})