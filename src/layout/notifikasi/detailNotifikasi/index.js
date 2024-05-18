import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'

import HTML from 'react-native-render-html';
import style from '../../../styles/style';
import { Button, Appbar, IconButton } from 'react-native-paper';
import Warna from '../../../config/Warna';

export default function DetailNotifikasi({ route }) {
    const navigation = useNavigation();
    const [state, setstate] = useState();
    const [title, settitle] = useState("");

    const headerView = <View></View>;
    const htmlContent = `<h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <p style="textAlign: center;">Look at how happy this native cat is</p>
    <br/>
    <img src="https://images.unsplash.com/photo-1603991607992-5ff9b2cd1691?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max" />
    `;



    const handleView = (item) => {
        console.log("index -> route.params.item", route.params.item)
        setstate(item)
        settitle(item.title)
        // headerView =?  <
    }

    useEffect(() => {
        try {
            if (route.params.item) handleView(route.params.item)
        } catch (error) {
            console.log("index -> error", error)
        }
    }, [])

    return (
        <SafeAreaView style={style.container}>
            <Appbar.Header style={style.appBar}>
                <IconButton
                    style={{ margin: 0, marginRight: '1%', marginLeft: '-2%' }}
                    icon={require('../../../icon/arrow.png')}
                    color={Warna.white}
                    size={26}
                    onPress={() => navigation.navigate('Home')}
                />
                <View style={style.row_start_center}>
                    <Text adjustsFontSizeToFit style={style.appBarText}>Infromasi Seputar Jaja</Text>
                </View>

            </Appbar.Header>
            <ScrollView style={[style.column, { paddingHorizontal: '2.5%' }]}>
                <View style={styles.headerTitle}><Text style={styles.textHeaderTitle}>{title != "" ? title : ""}</Text></View>
                <View style={styles.content}><HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} /></View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        flex: 0, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: '3%', paddingHorizontal: '0%'
    },
    textHeaderTitle: {
        fontSize: 20, fontFamily: 'Poppins-SemiBold', color: Warna.black
    },
    content: {
        flex: 0, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: '3%', paddingHorizontal: '0%'
    }
})