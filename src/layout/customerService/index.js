import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, StyleSheet, Image, Animated, StatusBar } from 'react-native'
import { Button, Paragraph, TextInput } from 'react-native-paper'
import { Colors, useNavigation, Hp, Wp, Style } from '../../export'

export default function JajaCs() {
    const [animationColor, setanimationColor] = useState(new Animated.Value(0))
    const [colorHolder, setcolorHolder] = useState("#ffffff")
    const [number, setnumber] = useState("")
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');

    const navigation = useNavigation()

    const handleAnimation = (valChange, valState, valDuration) => {
        Animated.timing(animationColor, {
            toValue: 1,
            duration: 1000
        }).start(() => {
            Animated.timing(animationColor, {
                toValue: 0,
                duration: 1000
            }).start()
        })
    }

    const handleOpen = () => {
        navigation.goBack()
    }

    // async function signInWithPhoneNumber() {
    //     const confirmation = await auth().signInWithPhoneNumber('+6285770144727');
    //     setConfirm(confirmation);
    //   }

    //   async function confirmCode() {
    //     try {
    //       await confirm.confirm(code);
    //     } catch (error) {
    //       console.log('Invalid code.');
    //     }
    //   }

    //   if (!confirm) {
    //     return (
    //       <Button
    //         title="Phone Number Sign In"
    //         onPress={() => signInWithPhoneNumber('+6285770144727')}
    //       />
    //     );
    //   }

    // const handlePress=()=> {
    //     let num = '+6285770144727'
    //     firebase.auth.signInWithPhoneNumber(num).then(function(e){
    //         e.confirm(code).then(function(result){
    //             console.log(result.user,'user');
    //             // document.querySelector('')
    //         })
    //     })
    // }

    // const handleClick=()=>{
    //     // let recaptcha =  new firebase.auth.RecaptchaVerifier('recaptcha');
    //     let number = '+6285770144727'
    //     firebase.auth.signInWithPhoneNumber(number, recaptcha).then(function(e){
    //         let code = prompt('enter the otp', '')
    //         if (code === null) return;
    //         e.confirm(code).then(function(result){
    //             console.log(result.user,'user');
    //             // document.querySelector('')
    //         }).catch(err=> {
    //         console.log("handleClick -> err", err)

    //         })
    //     })
    // }

    return (

        <SafeAreaView style={styles.container}>
            <StatusBar translucent={false} hidden={false} backgroundColor={Colors.biruJaja} barStyle="light-content" />
            <Image style={styles.iconMarket} source={require('../../ilustrations/empty.png')} />
            <Paragraph style={styles.textJajakan}><Text style={[Style.font_18, Style.bold]}>Ups.. </Text><Text style={[Style.font_18]}>feature ini akan segera hadir, nantikan update selanjutnya.</Text></Paragraph>
            <Button labelStyle={[Style.font_14, Style.semi_bold, { color: 'white' }]} onPress={() => handleOpen()} mode="contained" color={Colors.biruJaja} style={styles.button}>Kembali</Button>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textJajakan: { alignSelf: 'center', width: Wp('80%'), textAlign: 'center' },
    button: {
        // backgroundColor: Colors.kuningJaja,
        color: Colors.biruJaja,
        width: Wp('77%'),
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