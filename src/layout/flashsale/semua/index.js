import React, { useState, useEffect, Fragment, createRef } from 'react'
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, TouchableOpacity, TextInput, ImageBackground } from 'react-native'
import {
    Card,
    Button,
    Switch
} from 'react-native-paper';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetStok from "react-native-actions-sheet";
import ActionSheetHarga from "react-native-actions-sheet";
import ActionSheetDeskripsi from "react-native-actions-sheet";
import ActionSheetGambar from "react-native-actions-sheet";
import AwesomeAlert from 'react-native-awesome-alerts';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Warna from '../../../config/Warna';
const actionSheetRef = createRef();
const actionSheetStok = createRef();
const actionSheetHarga = createRef();
const actionSheetDeskripsi = createRef();
const actionSheetGambar = createRef();



export default function index(props) {
    const navigation = useNavigation();
    const [productsApi, setProducts] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [kategori, setKategori] = useState([])
    const [showAlert, setshowAlert] = useState(false)
    const [titleAlert, setTitleAlert] = useState('')
    const [alertHapus, setAlertHapus] = useState(false)
    const [alertStatus, setAlertStatus] = useState(false)
    const [stok, setStok] = useState(0)
    const [harga, setHarga] = useState(0)
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        setAlertStatus(true)
    }
    const handleStokPlus = () => {
        setStok(stok + 1)
    }
    const handleStokMinus = () => {
        setStok(stok - 1)
    }
    const handleActionSheet = (e) => {
        setTitleAlert(e + titleAlert)
        actionSheetRef.current?.setModalVisible(false)
        if (e === "stok ") {
            setTimeout(() => {
                actionSheetStok.current?.setModalVisible(true)
            }, 600);
        } else if (e === "harga ") {
            setTimeout(() => {
                actionSheetHarga.current?.setModalVisible(true)
            }, 600);
        } else if (e === "deskripsi ") {
            setTimeout(() => {
                actionSheetDeskripsi.current?.setModalVisible(true)
            }, 600);
        } else if (e === "gambar ") {
            setTimeout(() => {
                actionSheetGambar.current?.setModalVisible(true)
            }, 600);
        }
    }
    const handleAlert = (e) => {
        if (e === "hapus") {
            actionSheetRef.current?.setModalVisible(false)
            setTimeout(() => {
                setAlertHapus(!alertHapus)
            }, 1000);
        } else if (e === "deskripsi") {
            actionSheetDeskripsi.current?.setModalVisible(false)
            setTimeout(() => {
                setshowAlert(!showAlert)
            }, 700);
            setTimeout(() => {
                setshowAlert(false)
            }, 2800);
        } else {
            actionSheetStok.current?.setModalVisible(false)
            actionSheetHarga.current?.setModalVisible(false)
            setTimeout(() => {
                setshowAlert(!showAlert)
            }, 700);
            setTimeout(() => {
                setshowAlert(false)
            }, 2800);
        }

    }
    const handleHapusProduk = () => {
        setAlertHapus(false)
    }
    const handleStatusProduk = () => {
        setAlertStatus(false)
        setTimeout(() => {
            actionSheetRef.current?.setModalVisible(false)
            setIsEnabled(true)
        }, 1000);

    }
    const products =
        [
            { id: 1, status: 'aktif', masaAktif: "01 September 2020 - 30 September 2020", imageDepan: 'https://picsum.photos/700', imageBelakang: 'asa', imageAtas: 'asa', imageBawah: 'asa', nominal: "10.000", diskon: "20%", title: '10.10 OKTOBER' },
            { id: 2, status: 'aktif', masaAktif: "01 September 2020 - 30 September 2020", imageDepan: 'https://picsum.photos/700', imageBelakang: 'asa', imageAtas: 'asa', imageBawah: 'asa', nominal: "19.000", diskon: "20%", title: '11.11 NOVEMBER' },
            { id: 3, status: 'aktif', masaAktif: "01 September 2020 - 30 September 2020", imageDepan: 'https://picsum.photos/700', imageBelakang: 'asa', imageAtas: 'asa', imageBawah: 'asa', nominal: "21.000", diskon: "20%", title: '12.12 DESEMBER' },
            { id: 4, status: 'tidak aktif', masaAktif: "01 September 2020 - 30 September 2020", imageDepan: 'https://picsum.photos/700', imageBelakang: 'asa', imageAtas: 'asa', imageBawah: 'asa', nominal: "15.000", diskon: "20%", title: '09.09 SEPTEMBER' },
        ]
    const handleFilterPlus = () => {
        const beforeFilter = products
        console.log(beforeFilter, "hahahah");
        const afterFilter = beforeFilter.filter((product) => (product.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1));
        setProducts(afterFilter);
    }
    const handleFilterMin = (text) => {
        const beforeFilter = products
        console.log(beforeFilter, "hahahah");
        const afterFilter = beforeFilter.filter((product) => (product.title.toLowerCase().indexOf(text.toLowerCase()) > -1));
        setProducts(afterFilter);
    }

    const handleKategorii = () => {
        const data = []
        products.map(product => {
            data.push([product.kondisi])
            data.push(product.kategori)
        })
        setKategori(data)
    }
    useEffect(() => {
        setProducts(products);
        handleKategorii();
        console.log(kategori, "ini kategori");
        setAlertHapus(false)
        setshowAlert(false)
        setTitleAlert('')
        if (props.search) {
            const prop = props.search;
            console.log(searchValue.length, "length state");
            console.log(prop.length, "length props");
            if (searchValue.length < prop.lenght) {
                setSearchValue(prop)
                handleFilterPlus()
            } else {
                setProducts(products);
                handleFilterMin(props.search)
            }
        } else if (props.handleFilter) {
            console.log("masuk modal");
            openMenu()
        } else if (props.handleModal) {
            console.log(" maskkkk")
        }
        else {
            setProducts(products);
        }

        console.log('property changed', props.search);
    }, [props.search, props.handleFilter])

    return (
        <Fragment>
            <ScrollView>
                {productsApi.map(product => {
                    return (

                        <Card key={product.id} style={styles.card}>

                            <View style={styles.cardItem}>
                                <View style={styles.cardText}>
                                    <View style={styles.cardParentTitle}>
                                        <Text style={styles.cardTitle}>{product.title}</Text>
                                        <Text style={styles.cardKondisi}>{product.status}</Text>
                                    </View>
                                    <Text style={styles.cardHarga}>Masa Aktif. {product.masaAktif}</Text>
                                    <Text style={styles.cardStok}>Diskon {product.diskon}</Text>
                                    <Text style={styles.cardStok}>Nominal Diskon Rp.{product.nominal}</Text>

                                </View>
                                <Card.Actions>
                                    <TouchableNativeFeedback onPress={() => {
                                        setshowAlert(false)
                                        actionSheetRef.current?.setModalVisible()
                                        setTitleAlert(product.title)
                                        setStok(product.stok)
                                        setHarga(product.harga)
                                    }}
                                        title="Open ActionSheet">
                                        <Image style={styles.cardIcon} source={require('../../../icon/options.png')} />
                                    </TouchableNativeFeedback>
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
                    <Text style={styles.textLine}>Status</Text>
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
                <TouchableOpacity style={styles.modalLine} onPress={() => handleActionSheet("gambar ")}>
                    <Image style={styles.iconModal} source={require('../../../icon/abc.png')} />
                    <Text style={styles.textLine}>Nama</Text>

                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLine} onPress={() => handleActionSheet("stok ")}>
                    <Image style={styles.iconModal} source={require('../../../icon/coupon.png')} />
                    <Text style={styles.textLine}>Diskon</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLine} onPress={() => handleActionSheet("harga ")}>
                    <Image style={styles.iconModal} source={require('../../../icon/rupiah.png')} />
                    <Text style={styles.textLine}>Nominal Diskon</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLine} onPress={() => handleActionSheet("gambar ")}>
                    <Image style={styles.iconModal} source={require('../../../icon/photo.png')} />
                    <Text style={styles.textLine}>Gambar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLine} onPress={() => handleAlert("hapus")}>
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
                show={alertHapus}
                showProgress={false}
                title="PERINGATAN!"
                message="Anda yakin ingin menghapus voucher ini?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Tidak"
                confirmText="Hapus"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => setAlertHapus(false)}
                onConfirmPressed={() => handleHapusProduk()}
            />

            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertStatus}
                showProgress={false}
                message="Bila anda mwnonaktifkan produk, produk tidak akan di tampilkan di toko, dan akan dipindahkan ke halaman tidak aktif"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Tidak"
                confirmText="Ya"
                confirmButtonColor="#DD6B55"

                onCancelPressed={() => {
                    setAlertStatus(false)
                    setIsEnabled(true)
                }}
                onConfirmPressed={() => handleStatusProduk()}
            />
        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        position: "absolute"
    },
    card: {
        marginBottom: '2%',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        position: "relative",
        elevation: 2
    },
    cardItem: {
        flex: 1,
        flexDirection: 'row',
        padding: '4%',
        zIndex: 1
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
        marginLeft: '3%'
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
    cardStok: {
        color: 'grey',
        fontSize: 10,
        fontWeight: '100',
        alignSelf: 'baseline'
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