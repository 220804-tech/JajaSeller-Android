import React from 'react'
import { View, Text, Platform } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Style, useNavigation, Colors } from '../../export'

export default function Appbar(props) {
    const navigation = useNavigation();
    return (
        <View style={[Style.header, { backgroundColor: props.Bg ? props.Bg : Colors.biruJaja }]}>
            <View style={Style.row_start_center}>
                {props.back ?
                    <IconButton
                        icon={require('../../icon/arrow.png')}
                        style={{ margin: 0, padding: 0 }}
                        color={Colors.white}
                        size={24}
                        onPress={() => props.back2 ? props.backThere(false) : navigation.goBack()}
                    /> : null
                }
                {props.title ?
                    <Text adjustsFontSizeToFit style={[Style.font_16, Style.semi_bold, { color: Colors.white, marginBottom: Platform.OS == 'android' ? '-1%' : 3 }]}>{props.title}</Text>
                    : null
                }
            </View>
        </View>
    )
}
