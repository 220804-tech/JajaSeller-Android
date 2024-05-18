import React from 'react'
import { View, Text } from 'react-native'
import { IconButton } from 'react-native-paper'
import Warna from '../../config/Warna'
import style from '../../styles/style'
import { useNavigation } from "@react-navigation/native";
export default function index({ title }) {
    const navigation = useNavigation();
    return (
        <View style={style.header}>
            <View style={style.row_start_center}>
                <IconButton
                    icon={require('../../icon/arrow.png')}
                    style={{ margin: 0 }}
                    color={Warna.black}
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <Text adjustsFontSizeToFit style={style.headerTitle}>{title}</Text>
            </View>
        </View>

    )
}
