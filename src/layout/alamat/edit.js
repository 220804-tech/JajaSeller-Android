import React, { useEffect, useState, createRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, ScrollView, FlatList, SafeAreaView, Alert } from 'react-native'
import Warna from '../../config/Warna'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import style from '../../styles/style';
import MapView, { ProviderPropType, Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import ActionSheet from 'react-native-actions-sheet';
import * as Service from '../../service/wilayahIndonesia';
import * as Storage from '../../service/Storage';
import Maps from './map'
import AsyncStorage from '@react-native-community/async-storage';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import Loading from '../../component/loading'
import { Colors, Style, Utils } from '../../export';
import { useDispatch } from 'react-redux';

export default function EditAlamat(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const actionSheetKecamatan = createRef();
    const actionSheetKelurahan = createRef();
    const actionSheetRef = createRef();

    const [idToko, setIdToko] = useState(false)

    const [showButton, setshowButton] = useState(false)
    const [status, setStatus] = useState("edit")
    const [openActionsheet, setopenActionsheet] = useState("")

    const [address, setAddress] = useState(props.route.params.data)
    const [kecamatan, setkecamatan] = useState([])
    const [kecamatanApi, setkecamatanApi] = useState([])
    const [kelurahan, setkelurahan] = useState([])
    const [kelurahanApi, setkelurahanApi] = useState([])

    const [alamat, setalamat] = useState('')
    const [alamatGoogle, setalamatGoogle] = useState(props.route.params.data.alamat_google === null ? "" : props.route.params.data.alamat_google)
    const [loading, setLoading] = useState(false)

    const [alertTextAlamat, setalertTextAlamat] = useState("")
    const [kodePos, setkodePos] = useState(props.route.params.data.kode_pos)
    const [alertTextkodePos, setalertTextkodePos] = useState("")
    const [provinsiId, setprovinsiId] = useState("")
    const [provValue, setprovValue] = useState("")

    const [kabkotaId, setkabkotaId] = useState("")
    const [kabkotaValue, setkabkotaValue] = useState("")

    const [kecamatanId, setkecamatanId] = useState("")
    const [alertTextKecamatan, setalertTextKecamatan] = useState("")
    const [kelurahanId, setkelurahanId] = useState("")
    const [alertTextKelurahan, setalertTextKelurahan] = useState("")
    const [userId, setuserId] = useState("")
    const [kcValue, setkcValue] = useState("")
    const [kcColor, setkcColor] = useState(Warna.black)
    const [klValue, setklValue] = useState("")
    const [klColor, setklColor] = useState(Warna.black)
    const [textInputColor, settextInputColor] = useState("#C0C0C0");
    const [region, setRegion] = useState({
        latitude: -6.2617525,
        longitude: 106.8407469,
        latitudeDelta: 0.0922 * 0.025,
        longitudeDelta: 0.0421 * 0.025,
    })

    useEffect(() => {
        setshowButton(false)
        if (props.route.params.data && Object.keys(props.route.params.data).length) {
            setalamat(props.route.params.data.alamat_toko)
            setkecamatanId(props.route.params.data.kecamatan_id)
            setkelurahanId(props.route.params.data.kelurahan_id)
            setkabkotaId(props.route.params.data.kota_kabupaten_id)
            setprovinsiId(props.route.params.data.provinsi_id)
            if (props.route.params.data.latitude) {
                let valRegion = region;
                valRegion.latitude = parseFloat(props.route.params.data.latitude);
                valRegion.longitude = parseFloat(props.route.params.data.longitude);
                setRegion(valRegion)
            }
        }
        getItem()
        if (props.route.params.data) {

        }
        if (props.handleSave) {
            console.log(props.handleSave, "wakakak")
            handleSave()
        }
    }, [props.handleSave])

    const handleSave = () => {
        if (kelurahanId === "") {
            Alert.alert(
                "Jaja.id",
                "Kelurahan tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else if (kodePos === "") {
            Alert.alert(
                "Jaja.id",
                "Kode pos tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else if (alamat === "") {
            Alert.alert(
                "Jaja.id",
                "Alamat tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else {
            setLoading(true)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=okfs05bf8vm2fmuf9evj2q5ner9hmku2");
            var raw = JSON.stringify({
                "id_toko": idToko,
                "provinsi": provinsiId,
                "kota_kabupaten": kabkotaId,
                "kecamatan": kecamatanId,
                "kelurahan": kelurahanId,
                "kode_pos": kodePos,
                "alamat_toko": alamat,
                "alamat_google": alamatGoogle,
                "latitude": region.latitude,
                "longitude": region.longitude
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jsonx.jaja.id/core/seller/pengaturan/alamat_toko", requestOptions)
                .then(response => response.text())
                .then(response => {
                    console.log("🚀 ~ file: edit.js ~ line 148 ~ handleSave ~ response", response)
                    try {
                        let result = JSON.parse(response)
                        if (result.status.code === 200) {
                            dispatch({ type: "SET_SELLER", payload: result.data.seller })
                            setTimeout(() => {
                                setLoading(false)
                                navigation.goBack()
                            }, 500);
                        } else {
                            setLoading(false)
                            Utils.handleErrorResponse(result, 'Error with status code : 10210')
                        }

                    } catch (error) {
                        setLoading(false)

                        console.log("🚀 ~ file: edit.js ~ line 161 ~ handleSave ~ error", error)

                    }
                })
                .catch(error => {
                    setLoading(false)
                    Utils.handleError(JSON.stringify(error), 'Error with status code : 10211')
                });


        }
    }

    const getItem = () => {
        try {
            Service.getKecamatan().then((res) => {
                setkecamatan(res.kecamatan);
                setkecamatanApi(res.kecamatan)
            });
            Service.getKelurahan(address.kecamatan_kd).then(res => {
                setkelurahan(res.kelurahan)
                setkelurahanApi(res.kelurahan)
            })

            Storage.getIdToko().then(result => {
                setIdToko(result)
            })
        } catch (error) {
            console.log("🚀 ~ file: edit.js ~ line 109 ~ getItem ~ error", error)
        }
    };

    const handleSelected = (name, value) => {
        setshowButton(true)
        console.log("handleSelected -> name, value", name, value)
        if (name === "kecamatan") {
            setprovinsiId(value.province_id)
            setprovValue(value.province)
            setkabkotaId(value.city_id)
            setkabkotaValue(value.city)
            setkecamatanId(value.kecamatan_id)
            setkcValue(value.kecamatan)
            setkcColor(Warna.black)
            setklValue("Pilih kelurahan")
            setkelurahanId("")
            setklColor("#9A9A9A")

            setalertTextKecamatan("")
            actionSheetKecamatan.current?.setModalVisible(false)

            Service.getKelurahan(value.kecamatan_kd).then(res => {
                console.log("handleSelected -> res", res)
                setkelurahan(res.kelurahan)
                setkelurahanApi(res.kelurahan)
            })
        } else if (name === "kelurahan") {
            actionSheetKelurahan.current?.setModalVisible(false)
            setkelurahanId(value.kelurahan_id)
            console.log("handleSelected -> value.kelurahan_id", value.kelurahan_id)
            setklValue(value.kelurahan_desa)
            setklColor(Warna.black)
            setalertTextKelurahan("")
        }
    }
    const renderKecamatan = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleSelected("kecamatan", item)} style={style.FL_TouchAble}>
                <Text style={style.FL_TouchAbleItem}>{item.city}, {item.kecamatan}</Text>
            </TouchableOpacity>
        )
    }
    const renderKelurahan = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleSelected("kelurahan", item)} style={style.FL_TouchAble}>
                <Text style={style.FL_TouchAbleItem}>{item.kelurahan_desa}</Text>
            </TouchableOpacity>
        )
    }

    const handleSearch = (text, name) => {
        if (name === "kecamatan") {
            const beforeFilter = kecamatanApi;
            const afterFilter = beforeFilter.filter((item) => {
                const itemData = `${item.province.toUpperCase()} ${item.city.toUpperCase()} ${item.kecamatan.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setkecamatan(afterFilter);
        } else {
            const beforeFilter = kelurahanApi;
            const afterFilter = beforeFilter.filter(kel => kel.kelurahan_desa.toLowerCase().indexOf(text.toLowerCase()) > -1);
            setkelurahan(afterFilter)
        }
    };

    const handleStatus = (e) => setStatus(e)

    const handleAlamat = (data) => {
        setRegion(data.region)
        setalamatGoogle(data.alamatGoogle)
        setshowButton(true)
    }

    const handleUpdate = () => {
        setshowButton(true)
        if (openActionsheet === "Kode Pos") {
            if (String(kodePos).length <= 0) {
                setkodePos(props.route.params.data.kode_pos)
            }
        }
        let warningText = String('shopee shope lazada tokoped tokopedia jd.id jdid bukalapak whatsapp').split(" ")
        console.log("🚀 ~ file: edit.js ~ line 277 ~ handleUpdate ~ warningText", warningText)
        let word = alamat
        var words = alamat.split(" ");
        words.map(res => {
            warningText.map(result => {
                if (res.toLowerCase() === result.toLowerCase()) {
                    console.log("true")
                    word = word.replace(res, '***')
                    console.log("🚀 ~ file: edit.js ~ line 285 ~ handleUpdate ~ word", word)
                } else {
                    console.log("false")
                }
            })
        })
        setalamat(word)
    }

    const handleChange = (text, name) => {
        console.log("🚀 ~ file: edit.js ~ line 278 ~ handleChange ~ text", text)
        let warningText = 'shopee shope lazada tokoped tokopedia jd.id jdid bukalapak whatsapp'
        console.log("🚀 ~ file: edit.js ~ line 280 ~ handleChange ~ String(text).includes(warningText)", String(text).includes(warningText))
        let word = text
        var words = text.split(" ");
        words.map(res => {
            console.log("🚀 ~ file: edit.js ~ line 284 ~ handleChange ~ res", res)
            if (String(res).includes(word)) {
                word = String(word).replace(res, '***')
                console.log('true')
            }
        })
        setalamat(word)
    }

    return (
        <SafeAreaView style={style.container}>
            {loading ? <Loading /> : null}
            {status === "edit" ?
                <>
                    <View style={style.appBar}>
                        <View style={style.row_start_center}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image style={style.appBarIcon} source={require('../../icon/arrow.png')} />
                            </TouchableOpacity>
                            <Text style={style.appBarText}>Atur Alamat</Text>
                        </View>
                        {showButton ? <Button mode="text" color={Warna.white} onPress={handleSave}>Simpan</Button> : null}
                    </View>
                    <View style={[style.column_start_center, { padding: '4%', backgroundColor: Warna.white }]}>
                        <TouchableWithoutFeedback>
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>Provinsi</Text>
                                <View style={styles.formItem}>
                                    <Text style={[Style.font_13, { flex: 1, }]}>{provValue === "" ? address.provinsi : provValue}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => console.log("Pressed")}>
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>Kabupaten/Kota</Text>
                                <View style={styles.formItem}>
                                    <Text style={[Style.font_13, { flex: 1, }]}>{kabkotaValue === "" ? address.kota_kabupaten : kabkotaValue}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => actionSheetKecamatan.current?.setModalVisible(true)}>
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>Kecamatan</Text>
                                <View style={styles.formItem}>
                                    <Text style={[Style.font_13, { flex: 1, }]}>{kcValue === "" ? address.kecamatan : kcValue}</Text>
                                    <Text style={[Style.font_12, Style.semi_bold, { elevation: 1, color: Colors.biruJaja }]}>Ubah</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => actionSheetKelurahan.current?.setModalVisible(true)}>
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>Kelurahan</Text>
                                <View style={styles.formItem}>
                                    <Text style={[[Style.font_13, { flex: 1, }], { color: klColor }]}>{klValue === "" ? address.kelurahan : klValue}</Text>
                                    <Text style={[Style.font_12, Style.semi_bold, { elevation: 1, color: Colors.biruJaja }]}>Ubah</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => setopenActionsheet("Kode Pos") & actionSheetRef.current?.setModalVisible(true)}>
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>Kode Pos</Text>
                                <View style={styles.formItem}>
                                    <Text style={[Style.font_13, { flex: 1, }]}>{kodePos}</Text>
                                    <Text style={[Style.font_12, Style.semi_bold, { elevation: 1, color: Colors.biruJaja }]}>Ubah</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => setopenActionsheet("Alamat") & actionSheetRef.current?.setModalVisible(true)}>
                            <View style={[styles.form, { marginBottom: '0%' }]}>
                                <Text style={styles.formTitle}>Alamat Lengkap</Text>
                                <View style={[styles.formItem, { padding: '0%' }]}>
                                    <Text style={[Style.font_13, { flex: 1, }]} numberOfLines={1}>{alamat}</Text>
                                    <Text style={[Style.font_12, Style.semi_bold, { elevation: 1, color: Colors.biruJaja }]}>Ubah</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={[Style.column_0_start, Style.mt_3]}>
                            <Text style={styles.formTitle}>Alamat Google</Text>
                            <View onPress={() => setStatus("map")} style={[Style.row_0_start_center, Style.mt_2]}>
                                <TouchableOpacity onPress={() => setStatus("map")} style={styles.maps}>
                                    <Image style={{ width: '100%', height: '100%' }} source={require('../../icon/map.jpg')} />
                                </TouchableOpacity>
                                <View style={{ flex: 1 }}>
                                    {alamatGoogle === "" ?
                                        <Text onPress={() => setStatus("map")} style={[Style.font_14, { color: Colors.redNotif }]}>Lokasi belum dipin</Text>
                                        :
                                        <Text onPress={() => setStatus("map")} style={[Style.font_13, { borderBottomWidth: 0.5 }]}>{alamatGoogle}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                        {/* <View onPress={() => setStatus("map")} style={[style.row_start_center, { flex: 0, marginTop: '5%' }]}>
                            <View style={styles.maps}>
                                <MapView
                                    onPress={() => setStatus("map")}
                                    style={{ flex: 1 }}
                                    // onRegionChangeComplete={onRegionChange}
                                    region={region}>
                                    <Marker
                                        coordinate={region}
                                    />
                                </MapView>
                            </View>
                            <View style={{ flex: 1 }}>
                                {alamatGoogle === "" ?
                                    <Text onPress={() => setStatus("map")} style={{ fontSize: 14, color: Warna.redPower, fontFamily: 'Poppins-Regular' }}>Lokasi belum dipin</Text>
                                    :
                                    <Text onPress={() => setStatus("map")} style={{ fontSize: 14, color: Warna.blackgrayScale, fontFamily: 'Poppins-Regular', borderBottomWidth: 0.5 }}>{alamatGoogle}</Text>
                                }
                            </View>
                        </View> */}
                    </View>
                </>
                : <Maps data={address} handleAlamat={handleAlamat} status={handleStatus} region={region} />
            }

            <ActionSheet containerStyle={style.actionSheet} ref={actionSheetKecamatan}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Kecamatan</Text>
                    <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible(false)}>
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={style.search}>
                    <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
                        <Image
                            source={require('../../icon/search.png')}
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
                        placeholder="Cari kecamatan"
                        style={{ flex: 1, paddingLeft: 10 }}
                        onChangeText={(text) => handleSearch(text, "kecamatan")}
                    />
                </View>
                <View style={{ height: hp('50%'), paddingHorizontal: wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}>
                        <FlatList
                            data={kecamatan.slice(0, 100)}
                            renderItem={renderKecamatan}
                            keyExtractor={item => item?.id_data}
                        />

                    </ScrollView>
                </View>
            </ActionSheet>
            <ActionSheet containerStyle={style.actionSheet} ref={actionSheetKelurahan}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>Kelurahan</Text>
                    <TouchableOpacity onPress={() => actionSheetKelurahan.current?.setModalVisible(false)}>
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={style.search}>
                    <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
                        <Image
                            source={require('../../icon/search.png')}
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
                        placeholder="Cari kelurahan"
                        style={{ flex: 1, paddingLeft: 10 }}
                        onChangeText={(text) => {
                            handleSearch(text, "kelurahan")
                            setkecamatanCount(kecamatanCount + 1)
                        }}
                    />

                </View>
                <View style={{ height: hp('50%'), paddingHorizontal: wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}>
                        <FlatList
                            data={kelurahan.slice(0, 100)}
                            renderItem={renderKelurahan}
                            keyExtractor={item => item.kelurahan_id}
                        />
                    </ScrollView>
                </View>
            </ActionSheet>
            <ActionSheet onClose={handleUpdate} footerHeight={80} containerStyle={{ paddingHorizontal: '4%', paddingTop: '1%' }}
                ref={actionSheetRef}>
                <View style={style.actionSheetHeader}>
                    <Text style={style.actionSheetTitle}>{openActionsheet === "Kode Pos" ? "Atur Kode Pos" : "Atur Alamat"}</Text>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}  >
                        <Image
                            style={style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.actionSheetBody}>
                    <View style={styles.form}>
                        <Text style={styles.formTitle}>{openActionsheet}</Text>
                        <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                            {openActionsheet === "Kode Pos" ?

                                <TextInput
                                    style={styles.inputbox}
                                    placeholder="Input Kode Pos"
                                    value={kodePos}
                                    onFocus={() => settextInputColor(Warna.biruJaja)}
                                    onBlur={() => settextInputColor('#C0C0C0')}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    onChangeText={(text) => setkodePos(text)}
                                    theme={{
                                        colors: {
                                            primary: Warna.biruJaja,
                                        },
                                    }}
                                /> :
                                <TextInput
                                    style={styles.inputbox}
                                    placeholder="Input Alamat"
                                    value={alamat}
                                    onFocus={() => settextInputColor(Warna.biruJaja)}
                                    onBlur={() => settextInputColor('#C0C0C0')}
                                    keyboardType="default"
                                    maxLength={100}
                                    onChangeText={(text) => setalamat(text)}
                                    theme={{
                                        colors: {
                                            primary: Warna.biruJaja,
                                        },
                                    }}
                                />
                            }
                            {/* <Image /> */}
                        </View>
                    </View>
                </View>
            </ActionSheet>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    maps: { width: wp('21%'), height: wp('21%'), marginRight: '3%' },
    inputbox: {
        width: '100%',
        backgroundColor: 'transparent',
        color: 'black'
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
    form: {
        flex: 0,
        flexDirection: 'column',
        paddingVertical: '1%',
        marginBottom: '3%',
        width: '100%'
    },
    formPlaceholder: {
        fontSize: 14, fontFamily: 'Poppins-Regular', color: Warna.blackLight, flex: 1
    },
    // '#C7C7CD'
    formItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
    },
    formTitle: {
        fontSize: 14, fontFamily: 'Poppins-Regular', color: 'grey'
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 95
    },
    ubah: {
        flex: 0,
        color: Warna.biruJaja,
        fontFamily: 'Poppins-SemiBold',
        elevation: 1
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
})
