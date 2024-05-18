import React, { useEffect } from 'react'
import { SafeAreaView, Text, StyleSheet, Image, StatusBar, Linking } from 'react-native'
import { Button, Paragraph } from 'react-native-paper'
import Warna from '../../config/Warna'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { Style } from '../../export'

export default function index() {
    const navigation = useNavigation()

    useEffect(() => {
    }, [])

    const handleOpen = () => {
        navigation.replace("Login")
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} hidden={false} backgroundColor={Warna.biruJaja} barStyle="light-content" />
            <Image style={styles.iconMarket} source={require('../../ilustrations/updated.png')} />

            <Paragraph style={styles.textJajakan}>Versi <Text style={styles.textCenter}>terbaru sudah tersedia</Text></Paragraph>
            <Button labelStyle={[Style.font_14, Style.semi_bold, { color: 'white' }]} onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.seller.jaja')} mode="contained" color={Warna.biruJaja} style={styles.button}>Update</Button>
        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: Warna.white },
    iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontFamily: 'Poppins-Regular', color: Warna.black, marginVertical: hp("2%") },
    textCenter: { fontSize: 18, color: Warna.black, fontFamily: 'Poppins-Regular' },
    button: {
        backgroundColor: Warna.biruJaja,
        width: wp('80%'),
        marginTop: hp('3%'),
    },
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