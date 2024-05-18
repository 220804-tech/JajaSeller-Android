import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from "react-native";
import { Appbar, Button, Paragraph } from 'react-native-paper'
import { Colors, Hp, Style, Wp, useNavigation } from '../../export';

export default function NotFound(props) {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
            <Image
                style={styles.iconMarket}
                source={require('../../ilustrations/empty.png')}
            />
            <Paragraph style={styles.textJajakan}>Ups..<Text style={styles.textCenter}> {props.text}</Text></Paragraph>
            {props.text === 'sepertinya kamu belum login..' ? <Button onPress={() => navigation.navigate('Login')} style={{ width: '33.3%' }} mode='contained' color={Colors.biruJaja} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]}>Login</Button> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Colors.biruJaja, marginVertical: Hp('2%') },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') }
})