import React, { useState, useEffect, createRef } from 'react'
import style from '../../styles/style'
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, TextInput, TouchableNativeFeedback, Platform } from 'react-native';
import ActionButton from 'react-native-action-button';
import ActionSheet from 'react-native-actions-sheet';
import SelectMultiple from 'react-native-select-multiple';
import Voucher from '../voucher'
import Flashsale from '../flashsale'
import Story from '../story'
import { Appbar, Button } from 'react-native-paper';
import Warna from '../../config/Warna';
import { useNavigation } from '@react-navigation/native';
import Menu, { MenuItem } from 'react-native-material-menu';
import { Dropdown } from "react-native-material-dropdown";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { Colors } from '../../export';

export default function Promosis(props) {
    const navigation = useNavigation();

    const menu = createRef()
    const flashsaleRef = createRef();
    const selectedRef = createRef();
    const reduxAuth = useSelector(state => state.user.token)
    const [title, settitle] = useState("Voucher Toko")
    const [sesi, setsesi] = useState("")
    const [date, setdate] = useState("")
    const [titleFlashsale, settitleFlashsale] = useState("")
    const [products, setproducts] = useState([{ 'id': '1', 'label': "Tamiya Sonic 4X4" }, { "id": '2', 'label': 'Lemper Abadi' }])
    const [productSelected, setproductSelected] = useState([])
    const [waktuIndonesia, setwaktuIndonesia] = useState([{ id: "1", value: "09-00 - 18:00" }, { id: "2", value: "18:00 - 09:00" }])
    const [zonaWaktu, setzonaWaktu] = useState("")
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [alertTextDate, setalertTextDate] = useState("")

    const reduxUser = useSelector(state => state.user)

    useEffect(() => {

    }, [props])

    const hideMenu = (name) => {
        try {
            menu.current.hide();
        } catch (error) {

        }
        if (name === "flashsale") {
            flashsaleRef.current.setModalVisible(true)
        } else if (name === "product") {
            selectedRef.current.setModalVisible(true)
        } else {
            navigation.navigate("AddVoucher")
        }
    };

    const showMenu = () => {
        menu.current.show();
        setDatePickerVisibility(false);

    };

    const showDatePicker = () => {
        setalertTextDate("");
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };


    const handleCloseAS = (text) => {
        console.log('cokD');
        console.log("handleCloseAS -> text", text)
        if (text === 'Voucher Toko') {
            settitle('Voucher Toko')
        } else if (text === "Jaja Story") {
            navigation.navigate('Story')
            // settitle('Jaja Story')
        } else {
            settitle('Flashsale')
        }
        // actionSheetLayout.current?.setModalVisible(false)
    }

    const handleConfirm = (picked) => {
        let string = picked.toString()
        console.log("🚀 ~ file: index.js ~ line 77 ~ handleConfirm ~ string", string)
        let res = string.slice(0, 15);
        setdate(res)
        hideDatePicker();
    };

    const renderLabel = (label) => {
        return (
            <TouchableOpacity
                onPress={() => alert('ahah')}
                style={{ padding: '1%' }}>
                <Text style={{ fontSize: 14, color: Warna.blackGrey, fontFamily: 'Poppins-SemiBold' }}>{label}</Text>
            </TouchableOpacity>
        );
    };
    const onSelectionsChange = (selected) => {
        setproductSelected(selected);
    };
    return (
        <SafeAreaView style={style.container}>

            {/* HEADER */}
            <View style={style.appBar}>
                <View style={style.row_start_center}>
                    <Text style={[style.appBarText, { marginBottom: '-1%' }]}>Promosi  </Text>
                    <Image style={styles.arrowRight} source={require('../../icon/right-arrow.png')} />
                    <Text style={[style.appBarText, { marginBottom: '-1%' }]}> {title}</Text>
                </View>
                <TouchableOpacity onPress={() => hideMenu("voucher")}>
                    <Image style={style.appBarIcon} source={require('../../icon/more.png')} />
                </TouchableOpacity>
                {/* {title !== "Jaja Story" && reduxAuth ?
                    <Menu
                        ref={menu}
                        button={
                            <TouchableOpacity onPress={showMenu}>
                                <Image style={style.appBarIcon} source={require('../../icon/more.png')} />
                            </TouchableOpacity>}
                    >

                        {title === "Voucher Toko" ?
                            <MenuItem onPress={() => hideMenu("voucher")}>Tambah Voucher</MenuItem>
                            :
                            <>
                                <MenuItem onPress={() => hideMenu("flashsale")}>Buat Flashale</MenuItem>
                                <MenuItem onPress={() => hideMenu("product")}>Tambah Produk</MenuItem>
                            </>
                        }
                    </Menu>
                    : null
                } */}
            </View>



            {/* BODY */}

            <View style={[style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
                {title === "Voucher Toko" ? <Voucher /> : title === 'Flashsale' ? <Flashsale /> : <Story />}
            </View>



            {/* ACTION SHEET */}

            {reduxAuth ?
                <ActionButton buttonColor={Warna.white} renderIcon={() =>
                    <Image
                        style={{ width: '37%', height: '37%' }}
                        source={require('../../icon/menu.png')}
                    />}>
                    <ActionButton.Item buttonColor='#3498db' title="Flashale (Coming Soon)" onPress={() => console.log("pressed")}>
                        <Text style={styles.textMenu}>F</Text>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor={Warna.kuningJaja} title="Jaja Story" onPress={() => handleCloseAS("Jaja Story")}>
                        <Text style={styles.textMenu}>J</Text>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor={Warna.biruJaja} title="Voucher Toko" onPress={() => handleCloseAS('Voucher Toko')}>
                        <Text style={styles.textMenu}>V</Text>
                    </ActionButton.Item>
                </ActionButton>
                : null
            }
            <ActionSheet
                footerHeight={11}
                containerStyle={style.actionSheet}
                ref={flashsaleRef}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Promosi</Text>
                    <TouchableOpacity
                        onPress={() =>
                            flashsaleRef.current?.setModalVisible(false)
                        }>
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={style.column_center_start}>
                    <View style={[style.column_center_start, { width: '100%', marginBottom: '3%' }]}>
                        <Dropdown
                            style={{ paddingHorizontal: 0, width: '100%' }}
                            containerStyle={{ paddingHorizontal: 0, width: '100%' }}
                            // label="Pilih Sesi"
                            placeholder="Pilih sesi"
                            labelTextStyle={{ fontWeight: '900', fontSize: 14, color: Warna.blackLight }}
                            labelColor={Warna.biruJaja}
                            textColor={zonaWaktu ? Warna.blackgrayScale : Warna.silver}
                            labelFontSize="14"
                            data={waktuIndonesia}
                            value={zonaWaktu}
                            onChangeText={value => setzonaWaktu(value)}
                        />
                    </View>

                    <View style={[style.column_center_start, { width: '100%', marginBottom: '3%' }]}>
                        <TextInput
                            value={titleFlashsale}
                            placeholder="Judul"
                            style={styles.inputBox}
                            onChangeText={text => settitleFlashsale(text)}
                        />
                    </View>

                    <TouchableOpacity style={[style.column_center_start, { width: '100%', marginBottom: '11%' }]} onPress={showDatePicker}>
                        <TextInput
                            editable={false}
                            keyboardType="numeric"
                            placeholder={date === "" ? "Pilih tanggal" : date}
                            style={[styles.inputBox, { color: date ? Warna.blackgrayScale : Warna.silver }]}
                            value={date}
                            theme={{
                                colors: {
                                    primary: Warna.biruJaja,
                                },
                            }}
                        />
                        <TouchableNativeFeedback onPress={showDatePicker}>
                            <Image
                                style={styles.iconCalendar}
                                source={require('../../icon/calendar.png')}
                            />
                        </TouchableNativeFeedback>
                    </TouchableOpacity>
                    <View style={[style.column_center_start, { width: '100%', marginBottom: '3%' }]}>
                        <Button style={{ width: '100%' }} contentStyle={{ width: '100%' }} color={Warna.biruJaja} labelStyle={{ color: Warna.white }} mode="contained" onPress={() => console.log('Pressed')}>
                            Buat Flashsale
                        </Button>
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode='date'
                        is24Hour={true}
                        onConfirm={(text) => handleConfirm(text)}
                        onCancel={() => hideDatePicker()}
                    />
                </View>
            </ActionSheet>

            <ActionSheet
                footerHeight={11}
                containerStyle={{ height: hp(`${products.length * 20}%`), maxHeight: hp('95%'), paddingHorizontal: '4%', flex: 1, flexDirection: 'column', position: 'relative', paddingVertical: '2%' }}
                ref={selectedRef}>
                <View style={[style.actionSheetHeader, { flex: 0, marginBottom: '2%' }]}>
                    <Text style={style.actionSheetTitle}>Pilih Produk</Text>
                    <TouchableOpacity
                        onPress={() =>
                            selectedRef.current?.setModalVisible(false)
                        }>
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[style.column_center_start, { flex: 1 }]}>
                    <View style={{ borderWidth: 0.2, flex: 0, width: '100%', borderRadius: 5 }}>
                        <TextInput />
                    </View>

                    <View style={{ height: products.length * 50, maxHeight: hp('80%'), paddingVertical: '3%', width: '100%' }}>
                        <SelectMultiple
                            items={products}
                            rowStyle={{ borderBottomWidth: 0, marginBottom: '2%' }}
                            renderLabel={renderLabel}
                            flatListProps={{ padding: 0 }}
                            selectedItems={productSelected}
                            onSelectionsChange={onSelectionsChange}
                        />
                    </View>
                    <View style={[style.column_center_start, { width: '100%', marginBottom: '3%' }]}>
                        <Button style={{ width: '100%' }} contentStyle={{ width: '100%' }} color={Warna.biruJaja} labelStyle={{ color: Warna.white }} mode="contained" onPress={() => console.log('Pressed')}>
                            Buat Flashsale
                        </Button>
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode='date'
                        is24Hour={true}
                        onConfirm={(text) => handleConfirm(text)}
                        onCancel={() => hideDatePicker()}
                    />

                </View>
            </ActionSheet>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    arrowRight: { tintColor: 'white', width: 12, height: 12 },
    textMenu: { fontSize: 16, fontFamily: 'Poppins-Bold', color: 'white' },
    inputBox: { width: '100%', borderBottomWidth: 0.2, },
    iconCalendar: {
        position: 'absolute',
        tintColor: Warna.biruJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
})
