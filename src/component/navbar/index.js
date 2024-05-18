import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import Warna from '../../config/Warna';
import style from '../../styles/style'
import { useNavigation } from '@react-navigation/native'


export default function index(props) {
    const navigation = useNavigation();


    useEffect(() => {
        if (props.onPress) {
            console.log("pressed")
        }
    }, [props])

    return (
        <Appbar.Header style={[style.appBar, { backgroundColor: props.transparent ? 'transparent' : Warna.biruJaja, elevation: props.transparent ? 0 : 2 }]}>
            <View style={style.row_start_center}>
                {props.back === true ?
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[props.transparent ? style.appBarTouch : null]}>
                        <Image style={style.appBarIcon} source={require('../../icon/arrow.png')} />
                    </TouchableOpacity>
                    : null

                }
                {props.title ? <Text style={style.appBarText}>{props.title}</Text> : null}

            </View>
            {
                props.icon ?

                    <TouchableOpacity>
                        <Image style={[style.appBarIcon]} source={props.icon} />
                    </TouchableOpacity>
                    : null
            }
        </Appbar.Header >

    )
}
