import React, { useState, useEffect, Fragment, createRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import {
    Card,
    Button,
    Switch,
} from 'react-native-paper';

import ActionSheet from 'react-native-actions-sheet';
import ActionSheetStok from 'react-native-actions-sheet';
import ActionSheetHarga from 'react-native-actions-sheet';
import ActionSheetDeskripsi from 'react-native-actions-sheet';
import ActionSheetGambar from 'react-native-actions-sheet';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Service from '../../../service/Voucher';
import { useNavigation } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';

import Warna from '../../../config/Warna';
import style from '../../../styles/style';
import AsyncStorage from '@react-native-community/async-storage';
const actionSheetRef = createRef();
const actionSheetStok = createRef();
const actionSheetHarga = createRef();
const actionSheetDeskripsi = createRef();
const actionSheetGambar = createRef();

export default function index(props) {
    const navigation = useNavigation();
    const [spinner, setspinner] = useState(false);
    const [itemPressed, setitemPressed] = useState("-1");
    const [voucherDetail, setvoucherDetail] = useState("");
    const [productsApi, setProductApi] = useState([]);
    const [products, setProduct] = useState([]);
    const [showAlert, setshowAlert] = useState(false);
    const [titleAlert, setTitleAlert] = useState('');
    const [alertHapus, setAlertHapus] = useState(false);
    const [alertStatus, setAlertStatus] = useState(false);

    const [stok, setStok] = useState(0);
    const [harga, setHarga] = useState(0);
    const [idPromo, setidPromo] = useState(0)

    const [selectedDate, setselectedDate] = useState('start');

    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => {
        typeSelected(idPromo)
        setIsEnabled((previousState) => !previousState);
        setAlertStatus(true);
    };



    const handleAlert = (e) => {
        if (e === 'hapus') {
            actionSheetRef.current?.setModalVisible(false);
            setTimeout(() => {
                setAlertHapus(!alertHapus);
            }, 1000);
        } else if (e === 'deskripsi') {
            actionSheetDeskripsi.current?.setModalVisible(false);
            setTimeout(() => {
                setshowAlert(!showAlert);
            }, 700);
            setTimeout(() => {
                setshowAlert(false);
            }, 2800);
        } else {
            actionSheetStok.current?.setModalVisible(false);
            actionSheetHarga.current?.setModalVisible(false);
            setTimeout(() => {
                setshowAlert(!showAlert);
            }, 700);
            setTimeout(() => {
                setshowAlert(false);
            }, 2800);
        }
    };

    const handleStatusProduk = async () => {
        setAlertStatus(false);
        setspinner(true)
        actionSheetRef.current?.setModalVisible(false);
        setTimeout(async () => {

            Service.updateStatusVoucher(idPromo, 2).then(res => {
                console.log("handleStatusProduk -> res", res)
                console.log("handleStatusProduk -> res", res.status)
                if (res.status === 200) {
                    console.log("handleStatusProduk -> res", res.status)
                    getProductApi();
                    setTimeout(() => {
                        setspinner(false)
                    }, 1000);
                } else {
                    console.log("handleStatusProduk -> res else", res.status)
                }
            }).catch(error => console.log("handleStatusProduk -> error", error))
            setIsEnabled(true);
        }, 1000);
    };

    const handleFilter = (text) => {
        const beforeFilter = products;
        console.log('handleFilterPlus -> searchValue', text);
        const afterFilter = beforeFilter.filter((product) => product.judul_promo.toLowerCase().indexOf(text.toLowerCase()) > -1);
        setProductApi(afterFilter);
    };

    const getProductApi = async () => {
        let idToko = 0
        await AsyncStorage.getItem('xxTwo').then((res) => {
            console.log("AsyncStorage -> Seller", res)
            console.log("getProductApi -> (res.id_toko)", JSON.parse(res).id_toko)

            Service.getVoucher(JSON.parse(res).id_toko)
                .then((res) => {
                    console.log("getProductApi -> res", res)
                    console.log("getProductApi -> res.status", res.status)
                    if (res.status === 200) {
                        setProduct(res.voucher);
                        setProductApi(res.voucher);
                    }
                })
                .catch((e) => {
                    console.log('getProductApi -> eror', e);
                });
        });
        console.log("getProductApi -> idToko", idToko)
    };

    useEffect(() => {
        setAlertHapus(false);
        setshowAlert(false);
        setTitleAlert('');
        if (props.search) {
            handleFilter(props.search)
        } else {
            getProductApi();
        }
    }, [props.search, props.handleFilter]);


    const handleEditVoucher = () => {
        setTimeout(() => {
            actionSheetRef.current?.setModalVisible(false)
        }, 150);
        navigation.navigate('AddVoucher', { voucherDetail });
    };


    const handleDelete = () => {

        console.log("handleDelete -> id_promo", idPromo)
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
                                console.log("handleDelete -> res", res)
                                console.log("handleDelete -> res.status ", res.status)
                                if (res.status === 200) {
                                    getProductApi()
                                    setTimeout(() => {
                                        setspinner(false)
                                        setitemPressed("")
                                    }, 1000);
                                }
                            })
                            actionSheetRef.current?.setModalVisible(false);
                        }
                    }
                ],
                { cancelable: false }
            );
        }

    }

    const typeSelected = (value) => {
        setitemPressed(value)
    }

    console.log(props.handleFilter, 'luar useEddect');
    return (
        <Fragment>
            <ScrollView>
                {productsApi.length === 0 ?
                    <View style={{ alignSelf: 'center', marginTop: hp('2%') }}><Text>Tidak ada voucher</Text></View>
                    :
                    productsApi.map(product => {
                        return (

                            <Card key={product.id_promo} style={[styles.card, { backgroundColor: itemPressed === product.id_promo ? '#9A9A9A' : 'white' }]}>
                                <View style={[style.row_space_top, styles.cardHead]}>
                                    <Text style={[styles.cardTextHead]}>Status : <Text style={{ color: product.status_aktif === "Aktif" ? Warna.biruJaja : 'red' }}>{product.status_aktif}</Text></Text>
                                    <Text style={styles.cardTextHead}>Masa Aktif. {product.mulai} - {product.berakhir}</Text>
                                </View>
                                <View style={style.row_space}>
                                    <View style={styles.cardText}>

                                        <Text style={styles.cardTitle}>{product.judul_promo}</Text>
                                        <Text style={styles.cardStok}>Kode : {product.kode_promo}</Text>
                                        {product.tipe_diskon === "persentase" ?
                                            <Text style={styles.cardStok}>Diskon : {product.potongan_diskon} %</Text> :
                                            <Text style={styles.cardStok}>Diskon : Rp. {product.potongan_diskon}</Text>
                                        }
                                        {product.kategori !== null ?
                                            <Text style={styles.cardStok}>Khusus Kategori : {product.kategori} - {product.sub_kategori}</Text>
                                            :
                                            null
                                        }

                                    </View>
                                    <Card.Actions>
                                        <TouchableOpacity onPress={() => {
                                            setshowAlert(false)
                                            actionSheetRef.current?.setModalVisible()
                                            setTitleAlert(product.title)
                                            setStok(product.stok)
                                            setHarga(product.harga)
                                            setidPromo(product.id_promo)
                                            setvoucherDetail(product)

                                        }}
                                            title="Open ActionSheet">
                                            <Image style={styles.cardIcon} source={require('../../../icon/options.png')} />
                                        </TouchableOpacity>
                                    </Card.Actions>
                                </View>

                            </Card>
                        )
                    })}
            </ScrollView>
            <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetRef}>
                <View style={styles.headerModal}>
                    <Text style={styles.informasiProduk}>Informasi voucher</Text>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalLine}>
                    <Image style={styles.iconModal} source={require('../../../icon/power-button.png')} />
                    <Text style={[styles.textLine, { color: '#c0c0c0' }]}>Status <Text style={{ fontFamily: 'Poppins-Italic' }}>(Pending)</Text></Text>
                    <View style={styles.abc}>
                        <Text style={styles.textLine}>Aktif</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled} />
                    </View>
                </View>
                <TouchableOpacity style={styles.modalLine} onPress={() => handleEditVoucher()}>
                    <Image style={styles.iconModal} source={require('../../../icon/settings.png')} />
                    <Text style={[styles.textLine]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalLine} onPress={() => handleDelete() & typeSelected(idPromo)}>
                    <Image style={styles.iconModal} source={require('../../../icon/delete.png')} />
                    <Text style={styles.textLine}>Hapus</Text>
                </TouchableOpacity>
            </ActionSheet>
            <ActionSheetStok footerHeight={11} containerStyle={styles.actionSheet} ref={actionSheetStok}>
                <View style={styles.headerModal}>
                    <Text style={styles.informasiProduk}>Ubah stok produk</Text>
                    <TouchableOpacity onPress={() => actionSheetStok.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalLine}>
                    <Image style={styles.iconModal} source={require('../../../icon/stock.png')} />
                    <Text style={styles.textLine}>Stok tersisa</Text>
                    <View style={styles.textInputLine}>
                        <TouchableOpacity onPress={() => handleStokMinus()}>
                            <Image style={styles.iconPlusMinus} source={require('../../../icon/line.png')} />
                        </TouchableOpacity>
                        <TextInput keyboardType='numeric' style={styles.textInputStok}>{stok}</TextInput>
                        <TouchableOpacity onPress={() => handleStokPlus()}>
                            <Image style={styles.iconPlusMinus} source={require('../../../icon/plus.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Button style={styles.buttonModal} mode="contained" onPress={() => handleAlert()}>
                    Simpan
                </Button>
            </ActionSheetStok>
            <ActionSheetHarga footerHeight={11} containerStyle={styles.actionSheet} ref={actionSheetHarga}>
                <View style={styles.headerModal}>
                    <Text style={styles.informasiProduk}>Ubah harga produk</Text>
                    <TouchableOpacity onPress={() => actionSheetHarga.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalLine}>
                    <View style={styles.lineHarga}>
                        <Image style={styles.iconModal} source={require('../../../icon/rupiah.png')} />
                        <Text style={styles.textLine}>Harga</Text>
                    </View>
                    <View style={styles.textInputLineHarga}>
                        <Text style={styles.rupiah}>Rp.</Text>
                        <TextInput keyboardType='numeric' style={styles.textInputHarga}>{harga}</TextInput>
                        <Text style={styles.rupiah00}>-00</Text>
                    </View>
                </View>
                <Button style={styles.buttonModal} mode="contained" onPress={() => handleAlert()}>
                    Simpan
                </Button>
            </ActionSheetHarga>
            <ActionSheetGambar footerHeight={11} containerStyle={styles.actionSheet} ref={actionSheetGambar}>
                <View style={styles.headerModal}>
                    <Text style={styles.titleDeskripsi}>Ubah Gambar Produk</Text>
                    <TouchableOpacity onPress={() => actionSheetGambar.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalColumn}>
                    <Text style={styles.noteDeskripsi}>Note : masukkan gambar sesuai dengan produk anda, gunakan gambar yang jelas agar dapat menarik perhatian pengunjung</Text>
                    <View style={styles.listGambar}>
                        <View>
                            <Image style={styles.gambarProduk} source={{ uri: 'https://picsum.photos/700' }} />
                            <Image style={styles.hapusGambar} source={require('../../../icon/close.png')} />
                        </View>
                        <View>
                            <Image style={styles.gambarProduk} source={{ uri: 'https://picsum.photos/700' }} />
                            <Image style={styles.hapusGambar} source={require('../../../icon/close.png')} />
                        </View>
                        <View>
                            <Image style={styles.gambarProduk} source={{ uri: 'https://picsum.photos/700' }} />
                            <Image style={styles.hapusGambar} source={require('../../../icon/close.png')} />
                        </View>
                        <View>
                            <Image style={styles.gambarProduk} source={{ uri: 'https://picsum.photos/700' }} />
                            <Image style={styles.hapusGambar} source={require('../../../icon/close.png')} />
                        </View>
                        <View>
                            <Image style={styles.gambarProduk} source={{ uri: 'https://picsum.photos/700' }} />
                            <Image style={styles.hapusGambar} source={require('../../../icon/close.png')} />
                        </View>
                    </View>

                    <View style={styles.bottomModal}>
                        <TouchableOpacity style={styles.buttonPicture} mode="contained" onPress={() => handleAlert("gambar ")}>
                            <Text style={styles.buttonItem}>Kamera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonPicture} mode="contained" onPress={() => handleAlert("gambar ")}>
                            <Text style={styles.buttonItem}>Galery</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* </Button> */}
                <Button style={styles.buttonModal} mode="contained" onPress={() => handleAlert("deskripsi")}>
                    Simpan
                </Button>

            </ActionSheetGambar>
            <ActionSheetDeskripsi footerHeight={11} containerStyle={styles.actionSheet} ref={actionSheetDeskripsi}>
                <View style={styles.headerModal}>
                    <Text style={styles.titleDeskripsi}>Ubah Deskripsi Produk</Text>
                    <TouchableOpacity onPress={() => actionSheetDeskripsi.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalColumn}>
                    <Text style={styles.noteDeskripsi}>Note : masukkan deskripsi sesuai dengan produk anda, gunakan kata yang sopan dan jelas agar dapat menarik perhatian pengunjung</Text>
                    <TextInput
                        numberOfLines={17}
                        style={styles.textArea}
                        keyboardType="default"
                        multiline={true}
                        mode="outlined"
                        onChangeText={(text) => console.log(text, "text area")}
                    />
                </View>
                <Button style={styles.buttonModal} mode="contained" onPress={() => handleAlert("deskripsi")}>
                    Simpan
                </Button>
            </ActionSheetDeskripsi>
            <AwesomeAlert
                show={showAlert}
                message={`Perubahan pada ${titleAlert} anda berhasil disimpan!`}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
            />

            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertStatus}
                showProgress={false}
                title="Hallo seller"
                message="Anda ingin menonaktifkan produk?"
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
                onConfirmPressed={() => handleStatusProduk()}
            />
            <AwesomeAlert
                show={alertHapus}
                showProgress={false}
                title="AwesomeAlert"
                message="I have a message for you!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    this.hideAlert();
                }}
                onConfirmPressed={() => {
                    this.hideAlert();
                }}
            />

            <Spinner
                visible={spinner}
                color={Warna.biruJaja}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </Fragment>


    )

}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: Warna.white,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        position: "absolute"
    },
    modalHapus: {
        flex: 0,
        width: 300,
        height: 150,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10
    },
    card: {
        marginBottom: '2%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        elevation: 2
    },
    cardItem: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4%'),

    },
    cardImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        backgroundColor: Warna.kuningJaja,
        tintColor: Warna.biruJaja
    },
    cardText: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: wp('3%'),
        paddingRight: wp('1%'),
        paddingVertical: hp('2%'),
        textAlignVertical: 'center',
    },
    cardParentTitle: {
        flex: 1,
        flexDirection: "row"
    },
    cardTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: '0%'
    },
    cardKondisi: {
        fontSize: 8,
        marginLeft: '1%',
        fontFamily: 'Poppins-Italic'
    },
    cardHarga: {
        fontSize: 10,
        fontWeight: '100',
    },
    cardHead: { paddingHorizontal: wp('3%'), paddingVertical: wp('2%'), borderBottomWidth: 0.2, borderBottomColor: '#C0C0C0' },
    cardTextHead: {
        fontFamily: 'Poppins-Italic',
        fontSize: 10,
        fontWeight: '100',
        color: '#454545'
    },
    cardStok: {
        color: 'grey',
        fontSize: 10,
        fontWeight: '100',
        alignSelf: 'baseline',
    },
    cardIcon: {
        width: 25,
        height: 25
    },
    actionSheet: {
        paddingHorizontal: wp('4%'),
    },
    headerModal: {
        flex: 1,
        flexDirection: "row",
        alignContent: "space-between",
        alignItems: "center",
    },
    informasiProduk: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 17,
        color: Warna.biruJaja,
        marginVertical: hp('3%')
    },
    x: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
    },
    modalLine: {
        borderBottomWidth: 0.2,
        borderBottomColor: Warna.biruJaja,
        flex: 1,
        flexDirection: "row",
        paddingVertical: hp('1.5%'),
        justifyContent: "flex-start",
        alignItems: "center"
    },
    modalColumn: {
        flexDirection: "column", borderBottomColor: Warna.biruJaja, flex: 2

    },
    iconModal: {
        width: 23,
        height: 23,
        tintColor: Warna.biruJaja,
        marginRight: wp('5%')
    },
    iconClose: {
        width: 14,
        height: 14,
        tintColor: 'grey',
    },
    textLine: {
        color: 'grey', fontSize: 14, fontWeight: "bold", textAlignVertical: "center"
    },
    textInputLine: {
        flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginRight: wp('1%')
    },

    lineHarga: {
        flex: 1, flexDirection: "row"
    },
    textInputLineHarga: {
        flexDirection: "row", alignItems: "center", borderBottomColor: Warna.biruJaja, borderBottomWidth: 0.7, flex: 2
    },
    textInputDeskripsi: {
        flexDirection: "row", alignItems: "center", borderBottomColor: Warna.biruJaja, borderBottomWidth: 0.7, flex: 2
    },
    textInputStok: {
        borderBottomColor: Warna.biruJaja, overflow: 'hidden', borderBottomWidth: 0.7, width: wp('15%'), paddingVertical: '0.3%', marginHorizontal: wp('2%'), textAlign: "center",
    },
    rupiah: {
        color: 'grey', width: wp('7%')
    },
    textInputHarga: {
        paddingVertical: '0.3%', textAlign: "left", width: wp('47%')

    },
    rupiah00: {
        color: 'grey', justifyContent: "flex-end", width: wp('7%')
    },
    iconPlusMinus: {
        width: 15,
        height: 15,
        tintColor: Warna.biruJaja,
    },
    buttonModal: {
        backgroundColor: Warna.biruJaja,
    },
    titleDeskripsi: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 17,
        color: Warna.biruJaja,
        marginTop: hp('3%'),
        marginBottom: hp('0.5%')
    },
    noteDeskripsi: {
        fontSize: 11,
        fontWeight: '500',
        color: 'grey',
        marginBottom: hp('1%')

    },
    textArea: {
        maxHeight: 200,
        marginBottom: 10,
        borderColor: 'grey',
        borderWidth: 0.5,
        width: wp('92%')
    },
    // ALERT 

    alertContainerStyle: {
        borderColor: 'grey',
        borderWidth: 2
    },


    // gambar
    listGambar: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        width: wp('92%'),
        paddingVertical: hp('2%'),
        alignContent: "space-between",
        justifyContent: "space-between"
    },

    gambarProduk: {
        width: wp('15%'),
        height: hp('7%'),
        alignSelf: "flex-start",
    },
    hapusGambar: {
        width: 11,
        height: 11,
        position: 'absolute',
        right: 0,
        tintColor: 'black'
    },

    bottomModal: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    buttonPicture: {
        width: wp('44%'),
        backgroundColor: Warna.white,
        alignSelf: "center",
        marginBottom: hp('2%'),
        justifyContent: "center",
        alignItems: "center",

        padding: '3%',
        elevation: 3
    },
    buttonItem: {
        color: Warna.biruJaja,

    },
    abc: {
        flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
    },
    flex1end: {
        flex: 1,
        justifyContent: "flex-end"
    }

})