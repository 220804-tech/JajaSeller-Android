import React, { useState, useEffect, Fragment, createRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card, Button } from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetStok from 'react-native-actions-sheet';
import ActionSheetHarga from 'react-native-actions-sheet';
import ActionSheetDeskripsi from 'react-native-actions-sheet';
import ActionSheetGambar from 'react-native-actions-sheet';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Service from '../../../service/Voucher';
const actionSheetRef = createRef();
const actionSheetStok = createRef();
const actionSheetHarga = createRef();
const actionSheetDeskripsi = createRef();
const actionSheetGambar = createRef();
import { Colors, Hp, Style, Loading, Wp, useNavigation, ActionSheetPromotion } from '../../../export'
import { useSelector } from 'react-redux';

export default function index(props) {
    const reduxSeller = useSelector(state => state.user.seller.id_toko)
    const navigation = useNavigation();
    const [spinner, setspinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [itemPressed, setitemPressed] = useState("-1");

    const [voucherDetail, setvoucherDetail] = useState("");
    const [voucherApi, setVoucher] = useState([]);
    const [vouchers, setVouchers] = useState([]);

    const [showAlert, setshowAlert] = useState(false);
    const [titleAlert, setTitleAlert] = useState('');
    const [alertHapus, setAlertHapus] = useState(false);
    const [alertStatus, setAlertStatus] = useState(false);

    const [stok, setStok] = useState(0);
    const [harga, setHarga] = useState(0);
    const [idPromo, setidPromo] = useState(0)
    const [isEnabled, setIsEnabled] = useState(true);

    const onRefresh = useCallback(() => {
        getVoucherApi()
    }, []);


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


    const handleFilter = (text) => {
        const beforeFilter = vouchers;
        const afterFilter = beforeFilter.filter((vcr) => vcr.judul_promo.toLowerCase().indexOf(text.toLowerCase()) > -1);
        setVoucher(afterFilter);
    };

    const getVoucherApi = async () => {
        Service.getVoucherAktif(reduxSeller)
            .then((res) => {
                if (res.status === 200) {
                    setVouchers(res.voucher)
                    setVoucher(res.voucher)
                } else if (res.message == "Voucher masih kosong") {
                    setVouchers([])
                    setVoucher([])
                }
                setTimeout(() => setspinner(false), 1000);
            })
            .catch((e) => {
                console.log('getVoucherApi -> eror', e);
            });
    };

    useEffect(() => {
        setAlertHapus(false);
        setshowAlert(false);
        setTitleAlert('');
        if (props.search) {
            handleFilter(props.search)
        } else {
            getVoucherApi();
        }
    }, [props.search, props.handleFilter]);


    const handleEditVoucher = () => {
        setTimeout(() => {
            actionSheetRef.current?.setModalVisible(false)
        }, 150);
        navigation.navigate('AddVoucher', { voucherDetail });
    };




    const typeSelected = (value) => {
        setitemPressed(value)
    }

    return (
        <Fragment>
            {spinner ? <Loading /> : null}
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {voucherApi.length === 0 ?
                    <View style={[Style.font_14, Style.mt_5, Style.py_5, { alignSelf: 'center' }]}><Text>Tidak ada voucher</Text></View>
                    :
                    voucherApi.map(product => {
                        return (

                            <Card key={product.id_promo} style={[styles.card, { backgroundColor: itemPressed === product.id_promo ? '#9A9A9A' : 'white' }]}>
                                <View style={[Style.row_space_top, styles.cardHead]}>
                                    <Text style={[Style.font_10]}>Status : <Text style={{ color: product.status_aktif === "Aktif" ? Colors.biruJaja : 'red' }}>{product.status_aktif}</Text></Text>
                                    <Text style={Style.font_10}>Masa Aktif. {product.mulai} - {product.berakhir}</Text>
                                </View>
                                <View style={Style.row_space}>
                                    <View style={styles.cardText}>

                                        <Text style={[Style.font_14, Style.semi_bold]}>{product.judul_promo}</Text>
                                        <Text style={[Style.font_10]}>Kode : {product.kode_promo}</Text>
                                        {product.tipe_diskon === "persentase" ?
                                            <Text style={[Style.font_10]}>Diskon : {product.potongan_diskon} %</Text> :
                                            <Text style={[Style.font_10]}>Diskon : Rp. {product.potongan_diskon}</Text>
                                        }
                                        {product.kategori !== null ? <Text style={[Style.font_10]}>Khusus Kategori : {product.kategori} - {product.sub_kategori}</Text> : null}
                                        <Text style={[Style.font_10]}>Kuota voucher : {product.kuota_voucher}/{product.kuota_terpakai}</Text>

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
                                            <Image style={Style.icon_25} source={require('../../../icon/options.png')} />
                                        </TouchableOpacity>
                                    </Card.Actions>
                                </View>
                            </Card>
                        )
                    })}
            </ScrollView>
            <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetRef}>
                <ActionSheetPromotion status={2} idPromo={idPromo} actionSheetRef={actionSheetRef} typeSelected={typeSelected} isEnabled={isEnabled} setIsEnabled={setIsEnabled} setspinner={setspinner} getVoucherApi={getVoucherApi} setitemPressed={setitemPressed} handleEditVoucher={handleEditVoucher} />
            </ActionSheet>
            <ActionSheetStok footerHeight={11} containerStyle={styles.actionSheet} ref={actionSheetStok}>
                <View style={styles.headerModal}>
                    <Text style={styles.actionSheetTitle}>Ubah stok produk</Text>
                    <TouchableOpacity onPress={() => actionSheetStok.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalLine}>
                    <Image style={styles.iconModal} source={require('../../../icon/stock.png')} />
                    <Text style={Style.font_14}>Stok tersisa</Text>
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
                    <Text style={styles.actionSheetTitle}>Ubah harga produk</Text>
                    <TouchableOpacity onPress={() => actionSheetHarga.current?.setModalVisible(false)}>
                        <Image style={styles.iconClose} source={require('../../../icon/close.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalLine}>
                    <View style={styles.lineHarga}>
                        <Image style={styles.iconModal} source={require('../../../icon/rupiah.png')} />
                        <Text style={Style.font_14}>Harga</Text>
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
        </Fragment>


    )

}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: Colors.white,
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
        paddingVertical: Hp('2%'),
        paddingHorizontal: Wp('4%'),
    },
    cardImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        backgroundColor: Colors.kuningJaja,
        tintColor: Colors.biruJaja
    },
    cardText: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: Wp('3%'),
        paddingRight: Wp('1%'),
        paddingVertical: Hp('2%'),
        textAlignVertical: 'center',
    },
    cardParentTitle: {
        flex: 1,
        flexDirection: "row"
    },
    cardHead: { paddingHorizontal: Wp('3%'), paddingVertical: Wp('2%'), borderBottomWidth: 0.2, borderBottomColor: '#C0C0C0' },
    actionSheet: {
        paddingHorizontal: Wp('4%'),
    },
    headerModal: {
        flex: 1,
        flexDirection: "row",
        alignContent: "space-between",
        alignItems: "center",
    },
    actionSheetTitle: {
        flex: 1,
        fontFamily: "Poppins-SemiBold",
        fontSize: 17,
        color: Colors.biruJaja,
        marginVertical: Hp('3%')
    },
    x: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
    },
    modalLine: {
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.biruJaja,
        flex: 1,
        flexDirection: "row",
        paddingVertical: Hp('1.5%'),
        justifyContent: "flex-start",
        alignItems: "center"
    },
    modalColumn: {
        flexDirection: "column", borderBottomColor: Colors.biruJaja, flex: 2

    },
    iconModal: {
        width: 23,
        height: 23,
        tintColor: Colors.biruJaja,
        marginRight: Wp('5%')
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
        flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginRight: Wp('1%')
    },

    lineHarga: {
        flex: 1, flexDirection: "row"
    },
    textInputLineHarga: {
        flexDirection: "row", alignItems: "center", borderBottomColor: Colors.biruJaja, borderBottomWidth: 0.7, flex: 2
    },
    textInputDeskripsi: {
        flexDirection: "row", alignItems: "center", borderBottomColor: Colors.biruJaja, borderBottomWidth: 0.7, flex: 2
    },
    textInputStok: {
        borderBottomColor: Colors.biruJaja, overflow: 'hidden', borderBottomWidth: 0.7, width: Wp('15%'), paddingVertical: '0.3%', marginHorizontal: Wp('2%'), textAlign: "center",
    },
    rupiah: {
        color: 'grey', width: Wp('7%')
    },
    textInputHarga: {
        paddingVertical: '0.3%', textAlign: "left", width: Wp('47%')

    },
    rupiah00: {
        color: 'grey', justifyContent: "flex-end", width: Wp('7%')
    },
    iconPlusMinus: {
        width: 15,
        height: 15,
        tintColor: Colors.biruJaja,
    },
    buttonModal: {
        backgroundColor: Colors.biruJaja,
    },
    titleDeskripsi: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 17,
        color: Colors.biruJaja,
        marginTop: Hp('3%'),
        marginBottom: Hp('0.5%')
    },
    noteDeskripsi: {
        fontSize: 11,
        fontWeight: '500',
        color: 'grey',
        marginBottom: Hp('1%')

    },
    textArea: {
        maxHeight: 200,
        marginBottom: 10,
        borderColor: 'grey',
        borderWidth: 0.5,
        width: Wp('92%')
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
        width: Wp('92%'),
        paddingVertical: Hp('2%'),
        alignContent: "space-between",
        justifyContent: "space-between"
    },

    gambarProduk: {
        width: Wp('15%'),
        height: Hp('7%'),
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
        width: Wp('44%'),
        backgroundColor: Colors.white,
        alignSelf: "center",
        marginBottom: Hp('2%'),
        justifyContent: "center",
        alignItems: "center",
        padding: '3%',
        elevation: 3
    },
    buttonItem: {
        color: Colors.biruJaja,

    },
    abc: {
        flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
    },
    flex1end: {
        flex: 1,
        justifyContent: "flex-end"
    }

})
