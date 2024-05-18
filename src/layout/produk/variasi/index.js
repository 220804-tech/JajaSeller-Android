import React, { useState, useEffect, createRef } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList, Image
} from 'react-native';
import { Button, Appbar, RadioButton, DataTable } from 'react-native-paper';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';
import { TextInputMask } from 'react-native-masked-text';
import * as Service from '../../../service/Produk';
import ActionSheet from 'react-native-actions-sheet';
import style from '../../../styles/style';
import { Colors, Style } from '../../../export';

export default function index({ idProduct, handleSaveVariasi, valVariasi, status }) {
    const [id_produk, setidProduct] = useState('');
    const [id_variasi, setid_variasi] = useState('');

    const [buttonShow, setbuttonShow] = useState('');

    const [namaVariasi, setnamaVariasi] = useState('');
    const [maxWidth, setmaxWidth] = useState('100%');
    const [minWidth, setminWidth] = useState('0%');

    const [namasmallText, setnamasmallText] = useState(
        'Isi variasi produkmu',
    );
    const [namacolorText, setnamacolorText] = useState('#9A9A9A');

    const [hargaVariasi, sethargaVariasi] = useState(null);
    const [hargasmallText, sethargasmallText] = useState(
        'Isi herga sesuai variasi produkmu',
    );
    const [colorharga, setcolorharga] = useState('#9A9A9A');

    const [stokVariasi, setstokVariasi] = useState(null);
    const [stoksmallText, setstoksmallText] = useState(
        'Isi stok yang terdedia pada variasi produkmu',
    );
    const [colorStok, setcolorStok] = useState('#9A9A9A');

    const [skuVariasi, setskuVariasi] = useState('');
    const [skusmallText, setskusmallText] = useState(
        'Isi sku sesuai variasi produkmu',
    );
    const [colorSku, setcolorSku] = useState('#9A9A9A');

    const [checkedVariasi, setcheckedVariasi] = useState('warna');
    const [textinputCurrency, settextinputCurrency] = useState(false);

    const [mdColor, setmdColor] = useState('#9A9A9A');
    const [mdValue, setmdValue] = useState("Warna");

    const [count, setcount] = useState(0);
    const [variasi, setvariasi] = useState([]);

    const [warna, setwarna] = useState([]);
    const [warnaApi, setwarnaApi] = useState([]);

    const [ukuran, setukuran] = useState([]);
    const [ukuranApi, setukuranApi] = useState([]);

    const actionsheetVariasi = createRef()
    const getItem = () => {
        Service.getWarna().then(res => {
            if (res.status === 200) {
                setwarna(res.model)
                setwarnaApi(res.model)
            }
        }).then(err => console.log("get warna error", err))
        Service.getUkuran().then(res => {
            if (res.status === 200) {
                setukuran(res.model)
                setukuranApi(res.model)
            }
        }).then(err => console.log("get ukuran error", err))
    }
    const handleSelected = (title) => {
        setnamaVariasi(title)
        actionsheetVariasi.current?.setModalVisible(false)
        setmdValue(title)
        setmdColor(Warna.black)
        setnamasmallText("")
        setnamacolorText("#9A9A9A")
    }

    const renderVariasi = ({ item }) => {
        // console.log("renderItem -> brand", item)
        return (
            <TouchableOpacity onPress={() => handleSelected(item.title)} style={styles.touchKategori}>
                <Text style={styles.textKategori}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        if (valVariasi) {
            setskuVariasi(valVariasi.kode_sku)
            sethargaVariasi(valVariasi?.harga_normal)
            setstokVariasi(valVariasi.stok)
            setidProduct(idProduct)
            setid_variasi(valVariasi.id_variasi)
            if (valVariasi.warna !== null) {
                setnamaVariasi(valVariasi.warna)
                setmdColor(Warna.black)
                setmdValue(valVariasi.warna)
                setcheckedVariasi("warna")
            }
            else if (valVariasi.ukuran !== null) {
                setnamaVariasi(valVariasi.ukuran)
                setmdColor(Warna.black)
                setmdValue(valVariasi.ukuran)
                setcheckedVariasi("ukuran")

            }
            else if (valVariasi.model !== null) {
                setnamaVariasi(valVariasi.model)
                setmdColor(Warna.black)
                setmdValue(valVariasi.model)
                setcheckedVariasi('custom')
            }

        }
        getItem()
    }, []);

    const handlePress = async () => {
        const credentials = {
            pilihan: checkedVariasi,
            nama: namaVariasi,
            kode_sku: skuVariasi,
            harga: hargaVariasi,
            stok: stokVariasi,
        };
        if (namaVariasi === '') setnamasmallText('Variasi tidak boleh kosong!') & setnamacolorText('red');
        else if (hargaVariasi === null || hargaVariasi === "0") sethargasmallText('Harga produk variasi tidak boleh kosong!') & setcolorharga('red');
        else if (stokVariasi === null || stokVariasi == "0" || stokVariasi == "") setstoksmallText('Stok produk variasi tidak boleh kosong') & setcolorStok('red');
        else if (skuVariasi === "" || skuVariasi == null || skuVariasi == ' ') {
            setskusmallText('SKU produk variasi tidak boleh kosong!');
            setcolorSku('red');
        } else {
            console.log("status", status)
            if (status == "Add") {
                await handleSaveVariasi(true)
                try {
                    let response = await Service.addVariasi(credentials, id_produk, "post");
                    if (response.data.status == 201) {
                        handleSaveVariasi("201")
                        console.log("response.data.status", response.data.status)
                    } else {
                        console.log("response.data.status", response.data.status)
                        handleSaveVariasi(false)
                    }
                } catch (error) {
                    console.log("handleSaveVariasi => error", error)
                    handleSaveVariasi(false)
                }

            } else if (status == 'Edit') {
                try {
                    let response = await Service.addVariasi(credentials, id_variasi, 'put');
                    if (response.data.status == 200) {
                        handleSaveVariasi("201")
                        console.log("response.data.status", response.data.status)

                    } else {
                        console.log("response.data.status", response.data.status)
                        handleSaveVariasi(false)
                    }
                } catch (error) {
                    console.log("catch error edit variasi => error", error)
                    handleSaveVariasi(false)
                }
            }

        }
    };

    const handleDelete = (val) => {
        setvariasi(variasi.slice(variasi.splice(val, 1)));
        setTimeout(() => {
            console.log('handleDelete -> variasi', variasi);
        }, 1000);
    };
    const handleRadioButton = (text) => {
        setcheckedVariasi(text);
        setnamaVariasi("")
        if (text === 'warna') {
            setmdValue("Warna")
            setmdColor("#9A9A9A")
            // Service.getWarna()
            //     .then((res) => {
            //         console.log('handleRadioButton -> warna');
            //         console.log('handleRadioButton -> res', res);
            //         console.log('handleRadioButton -> res', res.model.status);
            //     })
            //     .catch((res) => {
            //         console.log('handleRadioButton -> res', res);
            //     });
        } else if (text === 'ukuran') {
            setmdValue("Ukuran");
            setmdColor("#9A9A9A")

            // Service.getUkuran()
            //     .then((res) => {
            //         console.log('handleRadioButton -> ukuran');
            //         console.log('handleRadioButton -> res', res);
            //         console.log('handleRadioButton -> res', res.model.status);
            //     })
            //     .catch((res) => {
            //         console.log('handleRadioButton -> res', res);
            //     });
        } else {
            setmdValue('Custom');
            setmdColor("#9A9A9A")
            setnamaVariasi("")
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.tableBody} key={index}>
                <Text style={styles.td}>{item.tipe_variasi}</Text>
                <Text style={styles.td}>{item.nama_variasi}</Text>
                <Text style={styles.td}>{item.harga_variasi}</Text>
                <Text style={styles.td}>{item.sku_variasi}</Text>
                <Text style={styles.td}>
                    <Text onPress={() => handleDelete(index)} style={styles.textDelete}>
                        Delete
                    </Text>
                </Text>
            </View>
        );
    };

    const onChangeText = (name, text) => {
        if (name === 'nama') {
            setnamaVariasi(regexChar('name', text));
            setnamacolorText('#9A9A9A');
            setnamasmallText('Isi nama variasi seperti : putih/hitam/L/XL/dll');
        } else if (name === 'harga') {
            // sethargaVariasi(regexChar('number', text))
            setcolorharga('#9A9A9A');
            sethargasmallText('Isi herga sesuai variasi produkmu');

            if (text.length <= 5) {
                let res = regexChar('currency', text);
                sethargaVariasi(res);
                settextinputCurrency(false);
            } else {
                settextinputCurrency(true);
                sethargaVariasi(text);
            }
        } else if (name === 'sku') {
            setskuVariasi(regexChar('charNumber', text));
            setskusmallText('SKU produk variasi tidak boleh kosong!');
            setcolorSku('#9A9A9A');
        } else {
            setstokVariasi(regexChar('number', text));
            setstoksmallText('Stok produk variasi tidak boleh kosong');
            setcolorStok('#9A9A9A');
        }
    };
    const regexChar = (val, text) => {
        if (val === 'charNumber') {
            return text.replace(/[^a-z0-9 -|]/gi, '');
        } else if (val === 'name') {
            return text.replace(/[^a-z0-9 /-|]/gi, '');
        } else if (val === 'number') {
            return text.replace(/[^0-9]/gi, '');
        } else if (val === 'currency') {
            // let res =
            //     console.log("index -> regexChar -> res", res)
            return text.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }
    };

    const handleSearch = (text) => {
        if (checkedVariasi === "warna") {
            if (text.length === 0) setwarna(warnaApi);
            const beforeFilter = warnaApi;
            const afterFilter = beforeFilter.filter((item) => {
                const itemData = `${item.title.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setwarna(afterFilter);
        } else {
            if (text.length === 0) setukuran(ukuranApi);
            const beforeFilter = ukuranApi;
            const afterFilter = beforeFilter.filter((item) => {
                const itemData = `${item.title.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setukuran(afterFilter);
        }

    }



    return (
        <View style={{ flex: 1, }}>
            <Text style={styles.label}>
                Tipe Variasi<Text style={styles.red}> *</Text>
            </Text>
            <View style={styles.flex0RowCenter}>
                <View style={styles.radioItemLeft}>
                    <RadioButton
                        color={Warna.biruJaja}
                        value="warna"
                        status={checkedVariasi === 'warna' ? 'checked' : 'unchecked'}
                        onPress={() => handleRadioButton('warna')}
                    />
                    <Text style={styles.textradio}>Warna</Text>
                </View>
                <View style={styles.radioItemCenter}>
                    <RadioButton
                        color={Warna.biruJaja}
                        value="ukuran"
                        status={checkedVariasi === 'ukuran' ? 'checked' : 'unchecked'}
                        onPress={() => handleRadioButton('ukuran')}
                    />
                    <Text style={styles.textradio}>Ukuran</Text>
                </View>
                <View style={styles.radioItemRight}>
                    <RadioButton
                        color={Warna.biruJaja}
                        value='custom'
                        status={checkedVariasi === 'custom' ? 'checked' : 'unchecked'}
                        onPress={() => handleRadioButton('custom')}
                    />
                    <Text style={styles.textradio}>Custom</Text>
                </View>
            </View>
            {/* <Text style={[styles.smallText, {}]}>Tipe variasi yang diinginkan</Text> */}
            <Text style={styles.label}>
                {checkedVariasi === "warna" ? "Warna" : checkedVariasi === "ukuran" ? "Ukuran" : 'Custom'}<Text style={styles.red}> *</Text>
            </Text>
            <View style={[style.row, { width: '100%' }]}>
                <TextInput
                    maxLength={17}
                    keyboardType="default"
                    placeholder="Hitam"
                    value={namaVariasi}
                    onChangeText={(text) => onChangeText('nama', text)}
                    style={[styles.inputbox, { width: checkedVariasi == 'custom' ? maxWidth : minWidth }]}
                />
                <TouchableOpacity
                    onPress={() => actionsheetVariasi.current?.setModalVisible()}
                    style={[styles.viewText, { width: checkedVariasi != 'custom' ? maxWidth : minWidth }]}>
                    <Text style={[styles.textInput, { color: mdColor }]}>{mdValue}</Text>
                    <View>
                        <Image
                            style={[styles.iconText, { width: checkedVariasi != 'custom' ? 15 : 0, height: checkedVariasi != 'custom' ? 15 : 0 }]}

                            source={require('../../../icon/down-arrow.png')}
                        />
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => actionsheetVariasi.current?.setModalVisible()} style={{ position: 'absolute', height: 20, width: 20, right: 0, bottom: 15 }}>
                    <Image style={{ height: 20, width: 20, tintColor: Warna.biruJaja }} source={require('../../../icon/down-arrow.png')} />
                </TouchableOpacity> */}
            </View>

            <Text style={[styles.smallText, { color: namacolorText }]}>
                {namasmallText}
            </Text>

            <Text style={styles.label}>
                Harga<Text style={styles.red}> *</Text>
            </Text>
            {textinputCurrency === true ? (
                <TextInputMask
                    autoFocus={true}
                    type={'money'}
                    options={{
                        precision: 3,
                        separator: '.',
                        delimiter: '.',
                        unit: '',
                        suffixUnit: '',
                    }}
                    value={hargaVariasi}
                    onChangeText={(text) => onChangeText('harga', text)}
                    style={styles.inputbox}
                />
            ) : (
                <TextInput
                    maxLength={17}
                    keyboardType="number-pad"
                    placeholder="10000"
                    value={hargaVariasi}
                    onChangeText={(text) => onChangeText('harga', text)}
                    style={styles.inputbox}
                />
            )}
            <Text style={[styles.smallText, { color: colorharga }]}>
                {hargasmallText}
            </Text>

            <Text style={styles.label} numberOfLines={1}>
                Stok<Text style={styles.red}> *</Text>
            </Text>
            <TextInput
                maxLength={4}
                keyboardType="numeric"
                placeholder="0"
                value={stokVariasi}
                onChangeText={(text) => onChangeText('stok', text)}
                style={styles.inputbox}
            />
            <Text style={[styles.smallText, { color: colorStok }]}>
                {stoksmallText}
            </Text>
            <Text style={styles.label}>
                Kode SKU(Stock Keeping Unit)<Text style={styles.red}> *</Text>
            </Text>
            <TextInput
                maxLength={17}
                keyboardType="default"
                placeholder="Kode produk"
                value={skuVariasi}
                onChangeText={(text) => onChangeText('sku', text)}
                style={styles.inputbox}
            />
            <Text style={[styles.smallText, { color: colorSku }]}>{skusmallText}</Text>

            <Button
                style={[Style.row_0_center, Style.mt_3]}
                color={Warna.biruJaja}

                labelStyle={{ color: Warna.white }}
                mode="contained"
                onPress={() => handlePress("add")}>
                Simpan
            </Button>


            <ActionSheet scrollEnabled={true} containerStyle={styles.actionSheet} ref={actionsheetVariasi}>
                <View style={styles.headerModal}>
                    <Text style={styles.headerTitle}>{checkedVariasi === 'warna' ? "Warna" : "Ukuran"}</Text>
                    <TouchableOpacity onPress={() => actionsheetVariasi.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.search}>
                    <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
                        <Image
                            source={require('../../../icon/search.png')}
                            style={{
                                height: undefined,
                                width: undefined,
                                flex: 1,
                                resizeMode: 'contain',
                                tintColor: 'grey',
                            }}
                        />
                    </View>
                    <TextInput
                        placeholder="Cari warna atau ukuran"
                        style={{ flex: 1, paddingLeft: 10 }}
                        onChangeText={(text) => {
                            handleSearch(text)
                        }}
                    />

                </View>
                <View style={{ height: hp('50%'), paddingHorizontal: wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}>
                        <FlatList
                            data={checkedVariasi === 'warna' ? warna : ukuran}
                            renderItem={renderVariasi}
                            keyExtractor={item => item.idv}
                        />

                    </ScrollView>
                </View>
            </ActionSheet>
        </View>
    );
}
const styles = StyleSheet.create({
    rowSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    red: { color: 'red' },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        marginTop: hp('2%'),
        color: Colors.blackgrayScale,
    },
    smallText: {
        fontSize: 11,
        color: '#9A9A9A',
        borderTopColor: '#9A9A9A',
        borderTopWidth: 0.5,
    },
    smallTextRight: { fontSize: 11, color: '#9A9A9A', marginTop: hp('2%') },
    inputbox: { fontSize: 14, borderBottomColor: '#9A9A9A', borderBottomWidth: 0 },
    textradio: { alignSelf: 'center' },
    flex0RowCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'space-between',
        marginTop: hp('1.5%'),
    },
    radioItemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    radioItemCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioItemRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    button: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: hp('2%'),
    },

    btnShow: {
        elevation: 2,
        alignSelf: 'center',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.6%'),
        backgroundColor: Warna.kuningJaja,
        borderRadius: 5,
        color: Warna.white,
        marginHorizontal: wp('1%'),
    },
    textShow: { fontSize: 13, color: Warna.white, fontFamily: 'Poppins-SemiBold' },

    btnSimpan: {
        elevation: 2,
        alignSelf: 'flex-end',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.6%'),
        backgroundColor: Warna.biruJaja,
        borderRadius: 5,
        color: Warna.white,
        marginHorizontal: wp('1%'),
    },
    textSimpan: { fontSize: 13, color: Warna.white, fontFamily: 'Poppins-SemiBold' },

    btnTutup: {
        elevation: 3,
        alignSelf: 'flex-end',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.6%'),
        backgroundColor: Warna.white,
        borderRadius: 5,
        color: Warna.white,
        marginHorizontal: wp('1%'),
    },
    textTutup: { fontSize: 13, color: Warna.black, fontFamily: 'Poppins-SemiBold' },

    dataTable: { flex: 1, flexDirection: 'column' },
    tableHeader: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 0.2,
        borderBottomColor: '#C0C0C0',
        alignItems: 'flex-end',
        marginTop: hp('2%'),
    },
    th: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        color: 'black',
        fontSize: 13,
        alignSelf: 'center',
    },
    tableBody: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    td: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: '300',
        color: 'red',
        paddingVertical: wp('2%'),
        fontSize: 13,
        borderBottomWidth: 0.2,
        borderBottomColor: '#C0C0C0',
    },
    viewText: {
        // flex:,
        // width: wp('85%'),
        height: hp('7%'),
        borderBottomWidth: 0,
        borderBottomColor: "#c0c0c0",
        flexDirection: 'row',
        // alignSelf: 'center',
        alignItems: 'center',
        // backgroundColor:"#c0c0c0",
        justifyContent: 'space-between'
    },
    textInput: { fontSize: 14, alignSelf: "center", textAlign: "left", alignItems: 'flex-end' },
    iconText: { tintColor: '#9a9a9a', width: 15, height: 15, alignSelf: "center" },
    textDelete: { fontWeight: '100', color: 'red' },
    headerModal: { flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingHorizontal: wp('2%'), marginTop: hp('2%'), marginBottom: hp('1%') },
    headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Warna.biruJaja },
    iconClose: { width: 14, height: 14, tintColor: 'grey', },
    touchKategori: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: hp('2%') },
    textKategori: { fontSize: 14, fontWeight: "bold", color: "#454545" },
    actionSheet: {
        paddingHorizontal: wp('4%'),
        height: hp('70%')
    },
    search: {
        flexDirection: 'row',
        paddingHorizontal: '3%',
        borderRadius: 5,
        // flex: 1,
        height: hp('6%'),
        marginHorizontal: '2%',
        marginVertical: '1%',
        backgroundColor: '#D3D3D3',
    },
});
