import React, { useState, createRef, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert, Platform } from 'react-native'
import MapView from 'react-native-maps';
import { Appbar, Button } from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import { Style, Colors, Hp, Wp } from '../../export';

export default function map(props) {
    const actionSheetRef = createRef();

    const [showFooter, setshowFooter] = useState(false)

    const [place_id, setplace_id] = useState("")
    const [alamatGoogle, setalamatGoogle] = useState('')
    const [alamatGoogleDetail, setalamatGoogleDetail] = useState('')
    const [dataGoogle, setdataGoogle] = useState('')
    const [address_components, setaddress_components] = useState('')
    const [dataSearch, setdataSearch] = useState([])

    const [region, setRegion] = useState({
        latitude: -6.2617525,
        longitude: 106.8407469,
        latitudeDelta: 0.0922 * 0.025,
        longitudeDelta: 0.0421 * 0.025,
    })

    useEffect(() => {

    }, [props])

    const onRegionChange = region => {
        let data = region;
        data.latitude = region.latitude;
        data.longitude = region.longitude;
        setRegion(data)
    }

    const handleCheckLokasi = () => {

        fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + region.latitude + "," + region.longitude + "&sensor=false&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
            .then((response) => response.json())
            .then((responseJson) => {
                setalamatGoogle(responseJson.results[0].address_components[1].long_name + ' , ' + responseJson.results[0].address_components[0].short_name)
                setalamatGoogleDetail(responseJson.results[0].formatted_address)
                setdataGoogle(responseJson.results[0])
                setaddress_components(responseJson.results[0].address_components)
                handleShowData()
                setshowFooter(true)

            })
            .catch((error) => console.log("error", error));

    }

    const handleShowData = () => {
        for (var i = 0; i < address_components.length; i++) {
            const addr = address_components[i];

            if (addr.types[0] == 'administrative_area_level_4') {
                const getLocality = addr.long_name;
            }
            if (addr.types[0] == 'administrative_area_level_3') {
                const getLocality = addr.long_name;
            }
            if (addr.types[0] == 'administrative_area_level_2') {
                const getAdministrative = addr.long_name;
            }
            if (addr.types[0] == 'administrative_area_level_1') {
                const getAdministrative = addr.long_name;
            }
            if (addr.types[0] == 'country') {
                const getCountry = addr.long_name;
            }
            if (addr.types[0] == 'postal_code') {
                const getCountry = addr.long_name;
            }
        }
    };

    const cariLatlon = (item) => {
        var value = item['place_id'];
        console.log("_cariLatlon: " + value);
        if (value) {
            fetch("https://maps.googleapis.com/maps/api/geocode/json?place_id=" + value + "&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
                .then((response) => response.json())
                .then((responseJson) => {
                    setRegion({
                        latitude: responseJson.results[0].geometry.location.lat,
                        longitude: responseJson.results[0].geometry.location.lng,
                        latitudeDelta: 0.0922 * 0.025,
                        longitudeDelta: 0.0421 * 0.025,
                    })
                    setaddress_components(responseJson.results[0].address_components)
                    setTimeout(() => handleShowData(), 500);

                })
                .catch((error) => console.log("error 117", error));
        }

    }

    const handleSearch = (text) => {
        if (String(text).length > 2) {
            fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyC_O0-LKyAboQn0O5_clZnePHSpQQ5slQU")
                .then((response) => response.json())
                .then((responseJson) => setdataSearch(responseJson.predictions))
                .catch((error) => console.log("error", error));
        }
    }

    const handleSave = () => {
        let data = {
            region: region,
            alamatGoogle: alamatGoogleDetail
        }

        Alert.alert(
            "Jaja.id",
            "Anda akan menyimpan lokasi ini?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        props.status("edit")
                        props.handleAlamat(data)
                    }
                }
            ],
            { cancelable: false }
        );
    }
    return (
        <SafeAreaView style={Style.container}>
            <View style={[Style.appBar]}>
                <View style={[Style.row_start_center, { flex: 1 }]}>
                    <TouchableOpacity onPress={() => props.status("edit")}>
                        <Image style={Style.appBarIcon} source={require('../../icon/arrow.png')} />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(true)} style={styles.search}>
                    <Text onPress={() => actionSheetRef.current?.setModalVisible(true)} style={[Style.font_14]}>Cari lokasi...</Text>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(true)}>
                        <Image style={[Style.icon_16]} source={require('../../assets/icons/loupe.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>

            </View>
            {/* <ScrollView> */}
            <View style={styles.body}>
                <View style={styles.bodyMaps}>
                    <MapView
                        // provider= {PROVIDER_GOOGLE}
                        enableZoomControl={true}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        zoomControlEnabled={true}
                        autoFocus={true}
                        debounce={500}
                        fetchDetails={true}
                        listViewDisplayed={false}
                        style={{ flex: 1, flexDirection: 'column' }}
                        rotateEnabled={false}
                        region={region}
                        onRegionChangeComplete={onRegionChange}
                        showsUserLocation >
                        {/* <TouchableOpacity>
                            <Text>Cek Lokasi</Text>
                            </TouchableOpacity> */}
                        {/* <Marker
                                coordinate={region}
                                onPress={handleCheckLokasi}
                            /> */}
                    </MapView>
                    <View style={styles.markerFixed}>
                        <TouchableOpacity onPress={handleCheckLokasi}>
                            <Text style={[Style.font_18, Style.semi_bold, Style.p_2, Style.text_center, { color: Colors.white, backgroundColor: Colors.biruJaja, borderRadius: 10 }]}>Cek Lokasi</Text>
                            <Image style={[Style.icon_48, Style.mt, { alignSelf: 'center' }]} source={require('../../icon/google-maps.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {alamatGoogle !== "" ?
                    <View style={styles.bodyPicker}>
                        <View style={styles.textItem}>
                            <Text style={[Style.font_16, Style.text_center, Style.mb_2]}>{alamatGoogle}</Text>
                            <Text style={[Style.font_14]}>{alamatGoogleDetail}</Text>
                        </View>
                        <Button color={Colors.biruJaja} labelStyle={[Style.font_14, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={() => handleSave()}>Pilih Lokasi</Button>
                        <View style={{ flex: 1 }}></View>
                    </View>
                    : null
                }
            </View>
            {/* </ScrollView> */}

            <ActionSheet ref={actionSheetRef}
                containerStyle={styles.bodySearch}>
                <View style={[{ flex: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }]}>
                    <View style={styles.searchInput}>
                        <TextInput
                            style={[Style.font_13, { width: '100%' }]}
                            placeholder="Nama Jalan/Perumahan/Gedung "
                            onChangeText={text => handleSearch(text)}
                        />
                    </View>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                        <Image style={[Style.appBarIcon, { tintColor: Colors.biruJaja, transform: [{ rotate: '270deg' }] }]} source={require('../../icon/arrow.png')} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 0 }}>
                    {dataSearch && dataSearch.length ?

                        <FlatList
                            data={dataSearch}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setalamatGoogle(item["structured_formatting"]["main_text"])
                                            setalamatGoogleDetail(item["description"])
                                            setplace_id(item["place_id"])
                                            actionSheetRef.current?.setModalVisible(false);
                                            cariLatlon(item);

                                        }}
                                        style={[Style.row_0_start_center, Style.my_2, Style.py_2, { borderBottomWidth: 0.5 }]}
                                    >
                                        <Image style={[Style.icon_23, Style.mr_2]} source={require('../../icon/google-maps.png')} />
                                        <View style={{ flexDirection: "column", marginVertical: 15 }}>
                                            <Text numberOfLines={1} style={[Style.font_14, Style.medium, Style.mr_2, { width: Wp('75%') }]}>
                                                {item["structured_formatting"]["main_text"]}
                                            </Text>
                                            {item.structured_formatting.secondary_text ?
                                                <Text numberOfLines={2} style={[Style.font_13, Style.light, { width: Wp('77%') }]}>
                                                    {item["structured_formatting"]["secondary_text"]}
                                                </Text>
                                                : null
                                            }
                                        </View>
                                    </TouchableOpacity>

                                )
                            }}
                        />
                        : <Text style={[Style.font_14, Style.text_center, Style.py_5, Style.my_5]}>Data tidak ditemukan!</Text>}
                </ScrollView>

            </ActionSheet>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    body: {
        width: Wp("100%"),
        height: Hp("100%"),
        backgroundColor: Colors.white
    },
    bodyMaps: {
        width: Wp("100%"),
        height: '100%',
    },
    bodyPicker: {
        width: Wp("100%"),
        height: Platform.OS === 'ios' ? Hp("41%") : Hp("35%"),
        backgroundColor: Colors.white,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.biruJaja,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 0,
        flexDirection: 'column',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0
    },
    textItem: {
        flex: 2,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: '3%'
    },
    alamatTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: Colors.blackLight
    },
    alamatContent: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.blackgrayScale
    },
    search: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, opacity: 0.3, paddingVertical: '2%', paddingHorizontal: '5%' },
    bodySearch: {
        width: Wp("100%"),
        height: Platform.OS === 'ios' ? Hp("95%") : Hp("100%"),
        backgroundColor: Colors.white,
        elevation: 2,
        flex: 0,
        flexDirection: 'column',
        paddingVertical: Platform.OS === 'ios' ? '7%' : '5%',
        paddingHorizontal: '4%',
        // justifyContent: 'space-between'
    },
    searchInput: {
        width: '85%',
        height: Platform.OS === 'ios' ? Hp('5%') : Hp('6%'),
        borderWidth: Platform.OS === 'ios' ? 1 : 0.7,
        borderColor: Colors.biruJaja,
        borderRadius: 7,
        paddingHorizontal: '3%',
        flex: 0,
        flexDirection: 'row',


    },
    markerFixed: {
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
        left: '35.3%',
        // marginLeft: -60,
        // marginTop: -100,
        position: 'absolute',
        top: '35%',
    },
})
