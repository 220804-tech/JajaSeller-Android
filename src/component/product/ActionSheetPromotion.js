import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
import { IconButton, Switch, TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as Service from '../../service/Voucher';
import { Wp, Hp, Style, Colors, useNavigation, ServiceProduct } from '../../export'


export default function ActionSheetPromotion({ status, actionSheetRef, typeSelected, setIsEnabled, isEnabled, idPromo, setspinner, getVoucherApi, setitemPressed, handleEditVoucher }) {
    const navigation = useNavigation()
    const [alertStatus, setAlertStatus] = useState(false);

    const reduxSeller = useSelector(state => state.user.seller.id_toko)
    const dispatch = useDispatch()

    const toggleSwitch = () => {
        typeSelected(idPromo, setIsEnabled)
        setIsEnabled((previousState) => !previousState);
        setAlertStatus(true);
    };



    const handleStatusVoucher = async () => {
        setAlertStatus(false);
        setspinner(true)
        actionSheetRef.current?.setModalVisible(false);
        setTimeout(async () => {
            Service.updateStatusVoucher(idPromo, status).then(res => {
                if (res.status === 200) {
                    getVoucherApi();
                    setTimeout(() => {
                        setspinner(false)
                    }, 1000);
                } else {
                    console.log("handleStatusVoucher -> res else", res.status)
                }
            }).catch(error => console.log("handleStatusVoucher -> error", error))
            setIsEnabled(true);
        }, 1000);
    };

    const handleDelete = () => {
        if (idPromo !== 0) {
            Alert.alert(
                "Hapus!",
                "Anda akan menghapus voucher ini?",
                [
                    {
                        text: "BATAL",
                        onPress: () => setitemPressed(""),
                        style: "cancel"
                    },
                    {
                        text: "YA", onPress: () => {
                            setspinner(true)

                            Service.deleteVoucher(idPromo).then(res => {
                                if (res.status === 200) {
                                    getVoucherApi()
                                    setTimeout(() => {
                                        setspinner(false)
                                        setitemPressed("")
                                    }, 1000);
                                } else {
                                    console.log("handleDelete -> masuk else", res.status)
                                }
                            }).catch(err => console.log("handleDelete -> err", err))
                            actionSheetRef.current?.setModalVisible(false);
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }



    return (
        <View style={[Style.column, Style.py_4, { height: Hp('30%') }]}>
            <View style={[Style.row_between_center, Style.mb_5]}>
                <Text adjustsFontSizeToFit style={[Style.font_16, Style.semi_bold]}>Informasi Voucher</Text>
                <IconButton
                    style={{ margin: 0 }}
                    icon={require('../../icon/close.png')}
                    color={Colors.biruJaja}
                    size={18}
                    onPress={() => actionSheetRef.current?.setModalVisible(false)}
                />
            </View>
            <View style={[Style.row_between_center, Style.mb_5]}>
                <View style={[Style.row_0_start_center]}>
                    <Image
                        style={[Style.icon_24, , Style.mr_5, { tintColor: Colors.redPower }]}
                        source={require('../../icon/power-button.png')}
                    />
                    <Text adjustsFontSizeToFit style={[Style.font_14, Style.medium]}>Status Produk</Text>
                </View>
                <View style={Style.row_0_end_center}>
                    <Text style={[Style.font_13, Style.mr_5, { textAlign: 'right' }]}>
                        {isEnabled ? 'Aktif' : 'Tidak Aktif'}
                    </Text>
                    <Switch
                        trackColor={{ false: Colors.light, true: Colors.light }}
                        thumbColor={isEnabled ? Colors.biruJaja : '#f4f3f4'}
                        ios_backgroundColor={Colors.light}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>
            <TouchableRipple style={Style.mb_5} onPress={handleEditVoucher}>
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Style.mr_5, { width: 24, height: 24 }]}
                            source={require('../../icon/setting.png')}
                        />
                        <Text style={[Style.font_14, Style.medium, Style.ml_5]}>Edit</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple>
            <TouchableRipple style={Style.mb_5} onPress={() => handleDelete() & typeSelected(idPromo)}>
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Style.mr_5, { width: 24, height: 24, tintColor: Colors.redPower }]}
                            source={require('../../icon/delete.png')}
                        />
                        <Text style={[Style.font_14, Style.medium, Style.ml_5]}>Hapus</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple>

            {/* onPress={() => handleDelete() & typeSelected(idPromo)} */}
            {/* 
            <TouchableRipple style={Style.mb_5} onPress={handleDelete}>
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Style.mr_5, { width: 30, height: 30, tintColor: Colors.redPower }]}
                            source={require('../../icon/delete.png')}
                        />
                        <Text adjustsFontSizeToFit style={[Style.font_16, Style.medium]}>Hapus</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple> */}

            {/* <TouchableOpacity
                style={styles.modalLine}
                onPress={handleDelete}>
                <Image
                    style={[styles.iconModal, { tintColor: Colors.red }]}
                    source={require('../../icon/.png')}
                />
                <Text adjustsFontSizeToFit style={[Style.font_16, Style.medium]}>Hapus</Text>
            </TouchableOpacity> */}

            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertStatus}
                showProgress={false}
                // title="Ha"
                message="Anda ingin menonaktifkan voucher?"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Tidak"
                confirmText="Nonaktifkan"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setAlertStatus(false);
                    setIsEnabled(true);
                    setitemPressed("-1")
                }}
                onConfirmPressed={() => handleStatusVoucher()}
            />
        </View>

    )
}
