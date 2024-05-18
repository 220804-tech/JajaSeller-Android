import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, StyleSheet, Image, StatusBar, Platform, View } from 'react-native'
import { Button, Paragraph } from 'react-native-paper'
import Warna from '../../config/Warna'
import { Colors, Style, Utils, Wp, Hp, useNavigation } from '../../export'
import { useSelector } from 'react-redux'
// import { useAndroidBackHandler } from "react-navigation-backhandler";

export default function Welcome() {
    const navigation = useNavigation()



    const handleOpen = () => {
        console.log("🚀 ~ file: index.js ~ line 26 ~ handleOpen ~ Platform.OS", Platform.OS)
        // if (Platform.OS === 'ios') {
        navigation.navigate("Home")
        // } else {
        //     navigation.navigate("Login")
        // }
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={true} backgroundColor='transparent' barStyle="dark-content" />
            <Image style={styles.iconMarket} source={require('../../icon/open.png')} />
            <Paragraph style={styles.textJajakan}>Jajakan <Text style={styles.textCenter}>produkmu untuk bisnis kamu sekarang juga.</Text></Paragraph>
            <View style={[Style.row_between_center, { width: Wp('80%') }]}>

                {/* <Button labelStyle={[Style.font_13, Style.semi_bold, { color: 'white' }]} onPress={() => handleOpen()} mode="contained" contentStyle={{ width: Wp('39%') }} color={Warna.kuningJaja} style={styles.button}>Mulai</Button> */}
                {/* {
            Platform.OS == 'ios' ? */}
                <Button labelStyle={[Style.font_13, Style.semi_bold, { color: 'white' }]} onPress={() => navigation.navigate('Login')} mode="contained" contentStyle={{ width: Wp('80%') }} color={Colors.kuningJaja} style={styles.button}>Mulai</Button>
                {/* : null
            } */}
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f9fb' },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, color: Warna.blackgrayScale, fontFamily: 'Poppins-Regular', marginVertical: Hp("2%") },
    textCenter: { fontSize: 18, color: Warna.blackgrayScale, fontFamily: 'Poppins-Medium' },
    button: {
        color: Warna.biruJaja,
        width: Wp('80%'),
        marginTop: Hp('3%'),
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontFamily: 'Poppins-SemiBold'
    }
})