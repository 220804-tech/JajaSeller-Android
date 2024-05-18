import React, { useState, useEffect, createRef } from 'react'
import { Alert, View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableNativeFeedback, Image, ScrollView, FlatList } from 'react-native'
import { Button } from 'react-native-paper'

import style from '../../../styles/style'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';
import ActionSheetKategori from 'react-native-actions-sheet';
import ActionSheetSubKategori from 'react-native-actions-sheet';
import { Colors, Style } from '../../../export';

export default function addBrand(props) {
    const kategoriRef = createRef();
    const subKategoriRef = createRef();
    const [showSubCategorys, setShowSubCategorys] = useState(false)
    const [categorys, setCategorys] = useState(props.data)
    const [subCategorys, setsubCategorys] = useState([])
    const [subvalue, setsubvalue] = useState("")
    const [brandName, setbrandName] = useState("")
    const [brandText, setbrandText] = useState("Input brand yang ingin didaftarkan")
    const [brandTextColor, setbrandTextColor] = useState("#9A9A9A")


    const [kategoriValue, setkategoriValue] = useState(
        {
            text: "Kosongkan jika kategori tidak ditemukan",
            id: "",
            value: "",
            colorText: "#9A9A9A"
        })
    const [subkategoriValue, setsubkategoriValue] = useState(
        {
            text: "Kosongkan jika subkategori tidak ditemukan",
            id: "",
            value: "",
            colorText: "#9A9A9A"

        })
    const { id } = props

    useEffect(() => {
    }, [])

    const validationState = () => {
        if (kategoriValue.id === "") {
            let text = kategoriValue
            text.text = "Kategori tidak boleh kosong!"
            this.setState({
                kategoriForm: text
            })
            return false
        } else if (showSubCategorys === true && subkategoriValue === "") {
            let text = kategoriForm
            text.text = "Sub Kategori tidak boleh kosong!"
            text.style = style.smallTextAlertError
            this.setState({
                kategoriForm: text
            })
            return false
        }
    }

    const renderCategorys = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("kategori", item)} style={styles.touchAble}>
                <Text style={styles.textKategori}>{item.kategori}</Text>
            </TouchableOpacity >
        )
    }

    const renderSubCategorys = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("subKategori", item)} style={styles.touchAble}>
                <Text style={styles.textKategori}>{item.sub_kategori}</Text>
            </TouchableOpacity >
        )
    }

    const handleValueDropdown = (text, val) => {
        if (text === "kategori") {
            kategoriRef.current?.setModalVisible(false)
            let arrsubCategorys = val.sub_kategori;
            arrsubCategorys.sort()
            setsubCategorys(arrsubCategorys)
            let item = kategoriValue;
            item.id = val.id_kategori
            item.value = val.kategori
            setkategoriValue(item)
            let arr = val.sub_kategori
            if (arr.length == 0) {
                setShowSubCategorys(false)
            } else {
                setsubCategorys(val.sub_kategori)
                setShowSubCategorys(true)
            }
            setsubkategoriValue({
                text: "Kosongkan jika subkategori tidak ditemukan",
                id: "",
                value: "",
                colorText: "#9A9A9A"

            })
        } else if (text === "subKategori") {
            subKategoriRef.current?.setModalVisible(false)
            let text = subkategoriValue;
            text.id = val.id_sub_kategori
            text.value = val.sub_kategori
            setsubkategoriValue(text)
            setsubvalue(val.sub_kategori)
        }
    }

    const handlePost = () => {
        console.log("🚀 ~ file: addBrand.js ~ line 109 ~ handlePost ~ brandValue.value", brandName)
        console.log("🚀 ~ file: addBrand.js ~ line 118 ~ handlePost ~ kategoriValue.id", kategoriValue.id)
        console.log("🚀 ~ file: addBrand.js ~ line 118 ~ handlePost ~ subkategoriValue.id", subkategoriValue.id)
        console.log("🚀 ~ file: addBrand.js ~ line 118 ~ handlePost ~ id", id)
        if (brandName != "" && brandName.length >= 2) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "brand": brandName,
                "id_kategori": kategoriValue.id,
                "id_sub_kategori": subkategoriValue.id,
                "id_toko": id
            });
            console.log("🚀 ~ file: addBrand.js ~ line 116 ~ handlePost ~ raw", raw)

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/product/brand", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: addBrand.js ~ line 134 ~ handlePost ~ result", result.status.code)
                    console.log("🚀 ~ file: addBrand.js ~ line 134 ~ handlePost ~ result", result.status.code === 201)
                    if (result.status.code === 201) {
                        setbrandTextColor(Warna.blackGrey)
                        setbrandText("Input brand yang ingin didaftarkan")
                        Alert.alert(
                            "Jaja.id",
                            "Brand anda berhasil ditambahkan, akan ditampilkan setelah disetujui ", [
                            {
                                text: "Ok",
                                onPress: () => props.handleTitle("Tambah Produk"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    } else if (result.status.code === 409) {
                        setbrandTextColor(Warna.red)
                        setbrandText("Nama brand sudah pernah digunakan!")
                        Alert.alert(
                            "Jaja.id",
                            "Nama brand sudah pernah digunakan!", [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );

                    }
                })
                .catch(error => console.log('error', error));
        } else {
            Alert.alert(
                "Jaja.id",
                "Brand tidak boleh kosong atau minimal 2 karakter!", [
                {
                    text: "Ok",
                    onPress: () => console.log("Pressed"),
                    style: "cancel"
                }
            ],
                { cancelable: false }
            );
        }

    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', padding: '4%', }}>
            <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: '2%' }}>
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%' }}>
                    <Text style={styles.labelUkuran}>
                        Kategori
                    </Text>
                    <TouchableOpacity style={styles.flexRow} onPress={() => kategoriRef.current?.setModalVisible(true)}>
                        <TextInput
                            editable={false}
                            placeholder="Pilih kategori"
                            style={styles.inputbox}
                            value={kategoriValue.value}

                        />
                        <TouchableNativeFeedback onPress={() => kategoriRef.current?.setModalVisible(true)}>
                            <Image
                                style={styles.iconDownArrow}
                                source={require('../../../icon/down-arrow.png')}
                            />
                        </TouchableNativeFeedback>
                    </TouchableOpacity>
                    <Text style={[styles.textForm, { color: kategoriValue.colorText }]}>{kategoriValue.text}</Text>
                </View>
                {showSubCategorys ?
                    <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%' }}>
                        <Text style={styles.labelUkuran}>
                            Sub Kategori
                        </Text>
                        <TouchableOpacity style={styles.flexRow} onPress={() => subKategoriRef.current?.setModalVisible(true)}>
                            <TextInput
                                editable={false}
                                placeholder="Pilih subkategori"
                                style={styles.inputbox}
                                value={subkategoriValue.value}

                            />
                            <TouchableNativeFeedback nPress={() => kategoriRef.current?.setModalVisible(true)}>
                                <Image
                                    style={styles.iconDownArrow}
                                    source={require('../../../icon/down-arrow.png')}
                                />
                            </TouchableNativeFeedback>
                        </TouchableOpacity>
                        <Text style={[styles.textForm, { color: subkategoriValue.colorText }]}>{subkategoriValue.text}</Text>
                    </View>
                    :
                    <Text style={styles.title}>
                        <Text></Text>
                    </Text>
                }
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '5%' }}>
                    <Text style={styles.labelUkuran}>
                        Brand<Text style={{ color: 'red' }}> *</Text>
                    </Text>
                    <TextInput
                        numberOfLines={1}
                        value={brandName}
                        placeholder="Input brand"
                        onChangeText={text => setbrandName(text)}
                    />
                    <Text style={[styles.textForm, { color: brandTextColor }]}>{brandText}</Text>
                </View>
                <Button mode="contained" color={Warna.biruJaja} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} onPress={() => handlePost()}>
                    Tambah
                </Button>
                <Text style={{ fontSize: 14, fontStyle: "italic", color: Warna.biruJaja, marginTop: '2%', textAlign: 'center' }}>Note : Brand anda akan ditampilkan setelah disetujui</Text>

            </View>
            <ActionSheetKategori
                scrollEnabled={false}
                // extraScroll={100}
                footerHeight={50}
                containerStyle={{ paddingHorizontal: '4%', paddingVertical: '2%' }}
                ref={kategoriRef}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Kategori Produk</Text>
                    <TouchableOpacity
                    // onPress={() => kategoriRef.current?.setModalVisible(false)}
                    >
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        // nestedScrollEnabled={true}
                        scrollEnabled={true}>
                        <FlatList
                            // nestedScrollEnable={true}
                            data={categorys}
                            renderItem={renderCategorys}
                            keyExtractor={item => item.id_kategori}
                        />

                    </ScrollView>
                </View>
            </ActionSheetKategori>
            <ActionSheetSubKategori scrollEnabled={true} containerStyle={{ paddingHorizontal: '2%' }}
                ref={subKategoriRef}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Sub Kategori</Text>
                    <TouchableOpacity
                    // onPress={() => kategoriRef.current?.setModalVisible(false)}
                    >
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        scrollEnabled={true}>
                        <FlatList
                            data={subCategorys}
                            renderItem={renderSubCategorys}
                            keyExtractor={item => item.id_sub_kategori}
                        />

                    </ScrollView>
                </View>
            </ActionSheetSubKategori>
        </View>


    )
}
export const styles = StyleSheet.create({
    ukuranItem: { flex: 1, flexDirection: 'column', alignItems: 'center' },
    labelUkuran: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: '1%', color: Warna.biruJaja },
    title: { fontSize: 14, fontWeight: '900', color: Warna.blackgrayScale },
    textForm: { fontSize: 11, borderTopWidth: 0.5, borderTopColor: '#9A9A9A' },
    iconDownArrow: {
        position: 'absolute',
        tintColor: Warna.biruJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
    touchAble: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: hp('2%') },
    textKategori: { fontSize: 14, fontWeight: "bold", color: "#454545" },
    inputbox: {
        width: wp('90%'),
        backgroundColor: 'transparent',
        color: 'black'
    },
})
