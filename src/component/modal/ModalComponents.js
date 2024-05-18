import { View, Text, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Hp, Style, Wp, Colors } from '../../export'
import { Button } from 'react-native-paper'

export default function ModalComponents(props) {
    const [showvisible, setshowVisible] = useState(false)
    const [inputText, setinputText] = useState('')

    useEffect(() => {
        setshowVisible(props?.visible)
    }, [props?.visible])


    // const handleNext = () => {
    //     setshowVisible(false)
    //     props.handleVisible(false)
    // }

    const handleVisible = (val) => {
        setinputText('')
        setshowVisible(false)
        props.handleVisible(false, val, inputText)
    }


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showvisible}
        >
            <View style={{ width: Wp('100%'), height: Hp('100%'), zIndex: 999, justifyContent: 'center', alignItems: 'center', backgroundColor: `rgba(129,129,129,0.7)` }} >
                <View style={[Style.column_0_center, { width: props?.width ? props.width : Wp('90%'), height: props?.height ? props.height : Wp('50%'), backgroundColor: Colors.white, elevation: 11, borderRadius: 5 }]}>
                    <View style={[Style.column_0_start, Style.px_4, Style.pt_5, { width: '100%', height: '80%' }]}>
                        <Text style={[Style.font_16, Style.medium, Style.mb_3]}>{props?.title}</Text>
                        {props?.subTitle ?
                            <Text style={[Style.font_14, Style.mt_3]}>{props?.subTitle}</Text>
                            : null}
                        {props.inputText ?
                            <TextInput numberOfLines={1} autoFocus={true} style={[Style.p, Style.mt_2, { borderBottomWidth: 0.2, width: '100%', borderBottomColor: Colors.silver }]} value={inputText} onChangeText={(text) => setinputText(text)} />
                            : null
                        }
                    </View>
                    <View style={[Style.row_between_center, Style.pb_2, Style.px_2, { alignItems: 'flex-end', width: '100%' }]}>
                        <Button onPress={() => handleVisible('close')} mode="text" labelStyle={[Style.font_10, Style.semi_bold]} style={{ height: '100%', width: '30%' }} color={Colors.kuningJaja}>
                            Tutup
                        </Button>
                        <View style={[Style.row_0_end, { width: '70%' }]}>
                            {props?.nextTwo ?
                                <Button onPress={() => handleVisible('next')} mode="text" labelStyle={[Style.font_10, Style.semi_bold]} style={{ height: '100%', width: '45%' }} color={Colors.biruJaja}>
                                    {props?.nextTwo}
                                </Button>
                                : null
                            }
                            <Button onPress={() => handleVisible('nextTwo')} mode="text" labelStyle={[Style.font_10, Style.semi_bold]} style={{ height: '100%', width: '45%' }} color={Colors.biruJaja}>
                                {props?.next}
                            </Button>

                        </View>
                    </View>
                </View>
            </View>
        </Modal >
    )
}