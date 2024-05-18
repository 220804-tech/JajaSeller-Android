import React from 'react'
import { View, Text, Image, StyleSheet } from "react-native";
import { Appbar, Paragraph } from 'react-native-paper'

export default function index() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Warna.white }}>
            <Image
                style={styles.iconMarket}
                source={require('../../ilustrations/empty.png')}
            />
            <Paragraph style={styles.textJajakan}>Ups..<Text style={styles.textCenter}> kamu belum chat siapapun</Text>
            </Paragraph>
        </View>
    )
}

const styles = StyleSheet.create({


    textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Warna.biruJaja, marginVertical: hp('2%') },
    iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },

})