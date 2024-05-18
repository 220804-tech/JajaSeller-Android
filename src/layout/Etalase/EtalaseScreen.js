import { View, Text, SafeAreaView, FlatList, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import { Style, Appbar, ServiceProduct, Utils, Colors, FastImage, Wp, Hp, ModalAlert, Loading } from '../../export'
import { useSelector } from 'react-redux'
import Collapsible from 'react-native-collapsible'
import ActionSheets from 'react-native-actions-sheet';

export default function EtalaseScreen() {
    const [listetalase, setlistEtalase] = useState([])
    const [listetalaseApi, setlistEtalaseApi] = useState([])

    const reduxStore = useSelector(state => state.user.seller)
    const [loading, setloading] = useState(false)
    const [etalaseselected, setetalaseSelected] = useState('')
    const [productselected, setproductSelected] = useState('')

    const [modal, setmodal] = useState(false)
    const [count, setcount] = useState(0)

    const etalaseRef = createRef();

    useEffect(() => {
        getItem()
        return () => {
            setloading(false)
        }
    }, [])


    const getItem = async () => {
        try {
            let errorResponse = true
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            setTimeout(() => {
                if (errorResponse) {
                    Utils.alertPopUp('Tidak dapat memuat data, periksa kembali koneksi internet anda!')
                }
            }, 22000);

            return await fetch(`https://elibx.jaja.id/jaja/etalase/get-etalase-product?id=${reduxStore.id_toko}`, requestOptions)
                .then(response => response.text())
                .then(json => {
                    try {
                        errorResponse = false
                        let result = JSON.parse(json)
                        console.log("🚀 ~ file: EtalaseScreen.js ~ line 53 ~ getItem ~ result", result.data.length)
                        if (result?.status?.code === 200) {
                            setlistEtalase(result.data)
                            setlistEtalaseApi(result.data)

                            setcount(count + 1)
                        } else if (!result?.data?.length) {
                            return []
                        } else {
                            Utils.alertPopUp(result?.status?.message)
                            return []
                        }
                    } catch (error) {
                        console.log("🚀 ~ file: index.js ~ line 929 ~ getData ~ error", error)
                    }
                })
                .catch(error => {
                    console.log("🚀 ~ file: FeedScreen.js ~ line 132 ~ getData ~ error", error)
                    Utils.handleError(String(error), 'Error with status code : 81002')
                    return []
                });
        } catch (error) {
            Utils.alertPopUp(String(error), 'Error with status code : 51002')
            return []
        }

    }

    const handleOpen = (item) => {
        if (!item?.show) {
            const beforeFilter = JSON.parse(JSON.stringify(listetalaseApi));
            const afterFilter = beforeFilter.filter(val => val.name.toLowerCase() === item.name.toLowerCase());
            console.log("🚀 ~ file: EtalaseScreen.js ~ line 84 ~ handleOpen ~ afterFilter", afterFilter)
            let newArr = afterFilter?.length ? afterFilter : listetalaseApi
            newArr.filter((obj, index) => {
                if (obj.id == item.id) {
                    newArr[index].show = !newArr[index]?.show
                }
            });
            setlistEtalase(newArr)
            // setlistEtalaseApi(newArr)

            setcount(count + 1)
        } else {
            setlistEtalase(listetalaseApi)
        }

    }

    const handleEtalaseName = (text) => {
        setloading(true)
        let loadingStop = false

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "id": etalaseselected.id,
            "name": text
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://elibx.jaja.id/jaja/etalase/edit-etalase", requestOptions)
            .then(response => response.text())
            .then(result => {
                try {
                    let object = JSON.parse(result)
                    if (object?.status?.code != 200) {
                        Utils.alertPopUp(object.status.message)
                    } else {
                        getItem()
                    }
                    setetalaseSelected('')
                    setloading(false)
                    loadingStop = true
                } catch (error) {
                    setloading(true)
                    Utils.handleErrorResponse(String(result), 'Error with status code : 691001')
                    loadingStop = true
                    console.log("🚀 ~ file: EtalaseScreen.js ~ line 107 ~ handleEtalaseName ~ error", error)
                }
            })
            .catch(error => {
                loadingStop = true
                Utils.handleErrorResponse(String(error.message), 'Error with status code : 691002')
            });

        setTimeout(() => {
            if (!loadingStop) {
                setloading(false)
            }
        }, 15000);
    }


    const handleChangeEtalase = (item) => {
        etalaseRef.current?.setModalVisible(false)
        setloading(true)
        let loadingStop = false



        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "productId": 10977,
            "etalaseId": 303
        });


        var raw = JSON.stringify({
            "productId": productselected.id,
            "etalaseId": item.id
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://elibx.jaja.id/jaja/etalase/move-etalase", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log("🚀 ~ file: EtalaseScreen.js ~ line 162 ~ handleChangeEtalase ~ result", result)
                try {
                    let object = JSON.parse(result)
                    if (object?.status?.code != 200) {
                        Utils.alertPopUp(object.status.message)
                    } else {
                        getItem()
                    }
                    setloading(false)
                    loadingStop = true
                } catch (error) {
                    setloading(false)
                    Utils.handleErrorResponse(String(result), 'Error with status code : 691003')
                    loadingStop = true

                }
            })
            .catch(error => {
                console.log("🚀 ~ file: EtalaseScreen.js ~ line 181 ~ handleChangeEtalase ~ error", error)
                setloading(false)
                loadingStop = true
                Utils.handleErrorResponse(String(error.message), 'Error with status code : 691004')
            });



        setTimeout(() => {
            if (!loadingStop) {
                setloading(false)
            }
        }, 15000);
    }





    const renderEtalase = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleChangeEtalase(item)} style={[Style.py_2, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver }]}>
                <Text style={[Style.font_14, Style.medium]}>{item?.name}</Text>
            </TouchableOpacity >
        )
    }


    const renderRow = ({ item }) => {
        // if (item.name != 'Semua Produk') {
        return (
            <View onPress={() => console.log('test')} style={[Style.column_0_center, Style.mb, Style.py_2, Style.px_3, { width: Wp('100%'), backgroundColor: Colors.white }]}>
                <View style={[Style.row_between_center, Style.pt, { width: '100%', alignSelf: 'flex-start', }]}>
                    <Text adjustsFontSizeToFit style={[Style.font_13, Style.medium, { width: '75%', alignSelf: 'flex-start', textAlignVertical: 'center' }]}>{item.name}</Text>
                    <View style={[Style.row_around_center]}>
                        {item.name != 'Semua Produk' ?
                            <TouchableOpacity onPress={() => {
                                setmodal(true)
                                setetalaseSelected(item)
                            }} style={[Style.row_0_center, Style.p_2, Style.mr_5,]}>
                                <FastImage
                                    style={[Style.icon_16, { alignSelf: 'center' }]}
                                    source={require('../../icon/edit_pen.png')}
                                    resizeMode={FastImage.resizeMode.center}
                                    tintColor={Colors.silver}
                                />
                            </TouchableOpacity>
                            : <TouchableOpacity onPress={() => console.log('first')} style={[Style.row_0_center, Style.p_2, Style.mr_5,]}>
                                <FastImage
                                    style={[Style.icon_16, { alignSelf: 'center' }]}
                                    source={require('../../icon/edit_pen.png')}
                                    resizeMode={FastImage.resizeMode.center}
                                    tintColor={'transparent'}
                                />
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => handleOpen(item)} style={[Style.row_0_center, Style.p_2, Style.ml_5, { transform: [{ rotate: '270deg' }] }]}>
                            <FastImage
                                style={[Style.icon_21, { alignSelf: 'center', transform: [{ rotate: item?.show ? '90deg' : '0deg' }] }]}
                                source={require('../../icon/down-arrow.png')}
                                resizeMode={FastImage.resizeMode.center}
                                tintColor={item?.show ? Colors.kuningJaja : Colors.biruJaja}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Collapsible collapsed={item?.show ? false : true} style={{ flex: 0, height: Hp('100%'), width: '100%', alignSelf: 'center', }}>
                    {item.items?.length ?
                        <FlatList
                            style={{ width: '100%' }}
                            data={item.name != 'Semua Produk' ? item.items : item.items[0]}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => String(index + 'GX')}
                        />
                        :
                        <Text style={[Style.font_14, Style.my, Style.px_5, Style.py_2, { width: '100%', color: Colors.blackGrey }]}>Tidak ada produk</Text>
                    }
                </Collapsible>
            </View >

        )
        // }
    }

    // const renderItem = ({ item, index }) => {
    //   if (etalase.) {

    //   }
    // }
    const renderItem = ({ item }) => {
        return (
            <View onPress={() => console.log('test')} style={[Style.row_between_center, Style.shadow_3, Style.mt, Style.mb_3, Style.px_5, Style.py_2, { shadowColor: Colors.biruJaja, width: Wp('100%'), borderBottomColor: 0.2, borderBottomColor: Colors.silver, alignSelf: 'center', backgroundColor: Colors.white }]}>
                <Text numberOfLines={1} style={[Style.font_12, { width: '80%', }]}>{item.name}</Text>
                <TouchableOpacity style={[Style.row_0_center, Style.p_2, Style.mr_5,]} onPress={() => {
                    etalaseRef.current?.setModalVisible()
                    setproductSelected(item)
                }}>
                    <FastImage
                        style={[Style.icon_16, { alignSelf: 'center' }]}
                        source={require('../../icon/edit_pen.png')}
                        resizeMode={FastImage.resizeMode.center}
                        tintColor={Colors.biruJaja}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const handleSearch = (text) => {
        const beforeFilter = JSON.parse(JSON.stringify(listetalaseApi));
        const afterFilter = beforeFilter.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
        console.log("🚀 ~ file: EtalaseScreen.js ~ line 292 ~ handleSearch ~ afterFilter", afterFilter)
        setlistEtalase(afterFilter)
        setcount(count + 1)
    }

    return (
        <SafeAreaView style={Style.container}>
            <Appbar back={true} title="Etalase Produk" />
            {loading ? <Loading /> : null}
            <View style={[Style.row_between_center, Style.my_2, Style.px_3, { backgroundColor: Colors.white, borderColor: Colors.biruJaja, borderWidth: 0.5, borderRadius: 4, height: Hp('5.5%'), width: Wp('95%'), alignSelf: 'center' }]}>
                <Image
                    source={require('../../assets/icons/loupe.png')}
                    style={{
                        height: 23,
                        width: 23,
                        resizeMode: 'contain',
                        marginRight: '1%'
                    }}
                />
                <TextInput
                    placeholder="Cari Produk"
                    style={[Style.font_13, { marginBottom: '-0.5%', width: '90%', color: Colors.black, textAlignVertical: 'center' }]}
                    onChangeText={(text) => handleSearch(text)}
                />
            </View>
            <FlatList
                style={{ width: Wp('100%') }}
                data={listetalase}
                renderItem={renderRow}
                keyExtractor={(item, index) => String(index + 'GX')}
                scrollEnabled={true}
            />
            <ModalAlert
                visible={modal}
                title="Ganti Nama Etalase"
                // subTitle="Pilih opsi berikut"
                inputText={true}
                close='Tutup'
                next='Simpan'
                height={Wp('40%')}
                handleVisible={(show, val, text) => {
                    setmodal(show)
                    console.log("🚀 ~ file: EtalaseScreen.js ~ line 278 ~ EtalaseScreen ~ show", show)
                    console.log("🚀 ~ file: EtalaseScreen.js ~ line 279 ~ EtalaseScreen ~ val", val)
                    if (val != 'close') {
                        handleEtalaseName(text)
                    }
                }}
            />


            <ActionSheets containerStyle={Style.p_3}
                ref={etalaseRef}>
                <View style={[Style.column, { minHeight: Hp('40%'), maxHeight: Hp('75%') }]}>
                    <View style={[Style.row_0_center]}>
                        <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Etalase Toko</Text>
                        <TouchableOpacity
                            onPress={() => {
                                etalaseRef.current?.setModalVisible(false)
                            }}
                        >
                            <Image
                                style={Style.icon_16}
                                source={require('../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[Style.px, Style.pb_5, { height: '100%' }]}>
                        <ScrollView style={{ flex: 1, }}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                        >
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                // nestedScrollEnable={true}
                                // scrollEnabled={true}
                                style={Style.pb_5}
                                data={listetalaseApi}
                                renderItem={renderEtalase}
                                keyExtractor={(item, index) => index + 'AN'}
                            />
                        </ScrollView>
                    </View>
                </View>
            </ActionSheets>
        </SafeAreaView>

    )
}