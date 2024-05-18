import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native'
import style from '../../styles/style'
import { Appbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function RegistrasiEmail({ route }) {
    const [state, setstate] = useState("")
    const { data } = route.params;

    useEffect(() => {

    }, [])

    return (
        <SafeAreaView style={style.container}>
            <Appbar.Header style={style.appBar}>
                <TouchableOpacity style={{ marginRight: wp('1%') }} onPress={() => navigation.navigate('Promosi')}>
                    <Image style={style.arrowBack} source={require('../../icon/arrow.png')} />
                </TouchableOpacity>
                <View style={style.row_start_center}>
                    <Text style={style.appBarText}>Profile</Text>
                </View>
            </Appbar.Header>
            <ScrollView style={styles.scrollview}>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollview: {
        flex: 0,
        flexDirection: 'column'
    }
})