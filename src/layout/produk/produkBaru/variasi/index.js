import React, { createRef, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AutoComplete from 'react-native-autocomplete-input';
import { TextInputMask } from 'react-native-masked-text';
import { IconButton, RadioButton, TouchableRipple } from 'react-native-paper';
import Warna from '../../../../config/Warna';
import { Colors, Hp, Style, Utils, Wp } from '../../../../export';
import * as Service from '../../../../service/Produk';
import EncryptedStorage from 'react-native-encrypted-storage'
import ActionSheets from 'react-native-actions-sheet';



export default function index({ data, dataVariasi, handleNext }) {
    console.log("🚀 ~ file: index.js ~ line 15 ~ index ~ dataVariasi", dataVariasi.variasi)
    const actionsheetVariasi = createRef()
    const [namaVariasi, setnamaVariasi] = useState('');
    const [namasmallText, setnamasmallText] = useState(
        '',
    );
    const [namacolorText, setnamacolorText] = useState('#9A9A9A');

    const [hargaVariasi, sethargaVariasi] = useState('');
    const [hargasmallText, sethargasmallText] = useState(
        '',
    );
    const [colorharga, setcolorharga] = useState('#9A9A9A');

    const [stokVariasi, setstokVariasi] = useState('1');
    const [stoksmallText, setstoksmallText] = useState(
        '',
    );
    const [colorStok, setcolorStok] = useState('#9A9A9A');

    const [skuVariasi, setskuVariasi] = useState('');
    const [skusmallText, setskusmallText] = useState(
        '',
    );
    const [colorSku, setcolorSku] = useState('#9A9A9A');

    const [checkedVariasi, setcheckedVariasi] = useState('warna');
    const [textinputCurrency, settextinputCurrency] = useState(false);

    const [variasi, setvariasi] = useState([]);

    const [warna, setwarna] = useState([]);
    const [warnaApi, setwarnaApi] = useState([]);

    const [ukuran, setukuran] = useState([]);
    const [ukuranApi, setukuranApi] = useState([]);
    const [hargaShow, sethargaShow] = useState(true);
    const [stokShow, setstokShow] = useState(true);
    const [count, setcount] = useState(0);
    const [showVariasi, setshowVariasi] = useState(false);

    const handleFilterVariasi = (text) => {
        if (String(text).length) {
            if (checkedVariasi === "warna" && warnaApi.length != 0 || checkedVariasi === "ukuran" && ukuranApi.length != 0) {
                sethargaShow(false)
                setstokShow(false)
                if (String(text).length == 0) {
                    sethargaShow(true)
                    setstokShow(true)
                    return setwarna([])
                }
                let result = [];
                const beforeFilter = checkedVariasi === 'warna' ? warnaApi : ukuranApi;
                const afterFilter = beforeFilter.filter(res => res.toLowerCase().indexOf(text.toLowerCase()) > -1);
                afterFilter.map(item => result.push(item))
                setTimeout(() => checkedVariasi === 'warna' ? setwarna(result) : setukuran(result), 50);
            } else {
                setnamaVariasi(text)
            }
        } else {
            handleFocus()
        }

    }

    const handleGetVariasi = () => {
        EncryptedStorage.getItem('detailVariasi').then(res => {
            console.log("🚀 ~ file: index.js ~ line 82 ~ EncryptedStorage.getItem ~ res", res)
            if (res) {
                try {
                    let data = JSON.parse(res)
                    setvariasi(data)
                } catch (error) {
                    console.log("🚀 ~ file: index.js ~ line 363 ~ EncryptedStorage.getItem ~ error", error)
                }
            } else {
            }
        }).catch(err => {
            console.log("🚀 ~ file: index.js ~ line 368 ~ EncryptedStorage.getItem ~ err", err)
        })
    }

    const getItem = () => {
        handleGetVariasi()
        Service.getWarna().then(res => {
            let resWarna = []
            if (res.status == 200) {
                res.model.map(item => resWarna.push(item.title))
                setwarna(resWarna)
                setTimeout(() => setwarnaApi(resWarna), 1000);
            }
        }).then(err => console.log("get warna error 76", err))
        Service.getUkuran().then(res => {
            let resUkuran = []
            if (res.status == 200) {
                res.model.map(item => resUkuran.push(item.title))
                setukuran(res.model)
                setTimeout(() => setukuranApi(resUkuran), 1000);

            }
        }).then(err => console.log("get ukuran error", err))
    }
    const handleSelected = (title) => {
        setnamaVariasi(title)
        actionsheetVariasi.current?.setModalVisible(false)
        setmdValue(title)
        setnamasmallText("")
        setnamacolorText("#9A9A9A")
    }

    const renderVariasi = ({ item }) => {
        // console.log("renderItem -> brand", item)
        return (
            <TouchableOpacity onPress={() => handleSelected(item.title)} style={styles.touchKategori}>
                <Text style={[Style.font_13, Style.medium]}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        // setvariasi([])
        getItem()
        // handleGetStateVariasi()
        return () => {
            if (data) {
                sethargaVariasi(data.harga);
                setskuVariasi(data.sku)
            }
        }
    }, [dataVariasi]);

    const handlePress = (text) => {
        if (text === 'add') {
            const credentials = {
                pilihan: checkedVariasi,
                nama: namaVariasi,
                kode_sku: skuVariasi,
                harga: hargaVariasi,
                stok: stokVariasi,
            };

            if (namaVariasi === '') {
                setnamasmallText(`Jenis ${checkedVariasi} tidak boleh kosong!`)
                setnamacolorText('red');
            } else if (!hargaVariasi || parseInt(hargaVariasi) <= 1) {
                sethargasmallText('Harga produk variasi tidak boleh kosong!')
                setcolorharga('red')

            }
            // else if (stokVariasi === '0') {
            //     setstoksmallText('Stok produk variasi tidak boleh kosong')
            //     setcolorStok('red');
            // }
            else if (skuVariasi === '') {
                setskusmallText('SKU produk variasi tidak boleh kosong!');
                setcolorSku('red');
            } else {
                Utils.alertPopUp('Variasi berhasil disimpan')
                let newVariasi = [...variasi]
                newVariasi.push(credentials)
                setvariasi(newVariasi)

                setnamasmallText('')
                setnamacolorText(Colors.blackgrayScale);
                sethargasmallText('')
                setcolorharga(Colors.blackgrayScale)
                setskusmallText('');
                setcolorSku(Colors.blackgrayScale);
            }
        };

    }
    const handleDelete = (val) => {
        // let removed = variasi.splice(index, 1)
        // console.log("handleDelete -> removed", removed)
        // setvariasi(variasi.splice(index, 1))
        // setvariasi(delete variasi())
        // const newArr = variasi.splice(val, 1)
        setvariasi(variasi.slice(variasi.splice(val, 1)));
        setTimeout(() => {
            console.log('handleDelete -> variasi', variasi);
        }, 1000);

        // console.log("handleDelete -> variasi.slice(index, variasi.length)", variasi.slice(index, variasi.length))
        // variasi.slice(index, variasi.length)
    };
    const handleRadioButton = (text) => {
        setcheckedVariasi(text);
        setnamaVariasi("")
        if (text === 'warna') {
            // setmdValue("Warna")
            if (warnaApi.length == 0) {
                getItem()
            } else[
                setwarna(warnaApi)
            ]
        } else if (text === 'ukuran') {
            // setmdValue("Ukuran");
            if (ukuranApi.length == 0) {
                getItem()
            } else {
                setukuran(ukuranApi)
            }

        } else {
            // setmdValue("Model");
            setnamaVariasi("")
            setukuran([])
            setwarna([])
            sethargaShow(true)
            setstokShow(true)

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
            setnamasmallText('');
        } else if (name === 'harga') {
            // sethargaVariasi(regexChar('number', text))
            setcolorharga('#9A9A9A');
            sethargasmallText('');

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
            return text.replace(/[^~|/-a-z0-9]/gi, '');
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
    const handleSaveVariasi = () => {
        try {
            EncryptedStorage.setItem('detailVariasi', JSON.stringify(variasi))
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 320 ~ handleSaveDetail ~ error", error)
        }
    }

    // const handleGetStateVariasi = () => {

    //     EncryptedStorage.getItem('detailVariasi').then(res => {
    //         if (res) {
    //             try {
    //                 let data = JSON.parse(res)
    //                 setvariasi(data)
    //                 if (data?.length) {
    //                     dataVariasi(data)
    //                 }
    //                 // handleNext(6, data)
    //             } catch (error) {
    //             }
    //         } else {
    //         }
    //     }).catch(err => {
    //     })
    // }
    const renderListVariasi = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => handleValueDropdown("variasi", item)} style={[Style.row, Style.py_2, { borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.5 }]}>
                <Text style={[Style.font_11, { width: Wp('15%') }]} numberOfLines={1}>{String(item.pilihan)}</Text>
                <Text style={[Style.font_11, { width: Wp('25%') }]} numberOfLines={1}>{item.nama}</Text>
                <Text style={[Style.font_11, { width: Wp('15%') }]} numberOfLines={1}>{item.harga}</Text>
                <Text style={[Style.font_11, { width: Wp('10%') }]} numberOfLines={1}>{item.stok}</Text>
                <Text style={[Style.font_11, { width: Wp('20%') }]} numberOfLines={1}>{item.kode_sku}</Text>
                {/* <TouchableOpacity onPress={() => handleDeleteVariasi(index)}>
                    <Text style={[styles.textlineVariasi, { color: 'red', fontSize: 13 }]}>-</Text>
                </TouchableOpacity> */}
                <IconButton
                    icon={require('../../../../icon/line.png')}
                    size={12}
                    color={Colors.white}
                    style={{ backgroundColor: Colors.red }}

                    onPress={() => handleDelete(index)} />
            </TouchableOpacity >
        )
    }

    const handleFocus = () => {
        if (checkedVariasi === 'warna') {
            setwarna(warnaApi)
        } else if (checkedVariasi === 'ukuran') {
            setukuran(ukuranApi)
        }
    }
    const renderType = ({ item }) => {
        return (
            <TouchableOpacity style={styles.touchKategori} onPress={() => {
                sethargaShow(true)
                setstokShow(true)
                setnamaVariasi(item)
                setnamasmallText('')
                setnamacolorText('#9A9A9A');
                actionsheetVariasi.current?.setModalVisible(false)
            }}>
                <Text style={[Style.font_13, Style.medium]}>{item}</Text>
            </TouchableOpacity >
        )
    }

    return (
        <View style={[Style.column]}>
            {variasi?.length && showVariasi ?
                <ScrollView contentContainerStyle={Style.column} horizontal showsHorizontalScrollIndicator={false}>
                    <View style={[Style.row, Style.py_2, { borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.7, }]}>
                        <Text numberOfLines={1} style={[Style.font_12, Style.medium, { width: Wp('15%') }]}>Tipe</Text>
                        <Text numberOfLines={1} style={[Style.font_12, Style.medium, { width: Wp('25%') }]}>Nama</Text>
                        <Text numberOfLines={1} style={[Style.font_12, Style.medium, { width: Wp('15%') }]}>Harga</Text>
                        <Text numberOfLines={1} style={[Style.font_12, Style.medium, { width: Wp('10%') }]}>Stok</Text>
                        <Text numberOfLines={1} style={[Style.font_12, Style.medium, { width: Wp('20%') }]}>SKU</Text>
                        <Text numberOfLines={1} style={[Style.font_12, Style.medium]}>Aksi</Text>
                    </View>
                    <View style={[Style.column, Style.py_2, { minHeight: Hp('15%'), maxHeight: Hp('82%') }]}>
                        {variasi?.length ?
                            <FlatList
                                horizontal={false}
                                contentContainerStyle={[Style.column]}
                                data={variasi}
                                renderItem={renderListVariasi}
                                keyExtractor={(item, index) => index + ""}
                            />
                            :
                            null
                        }
                    </View>
                </ScrollView >
                :

                <View style={[Style.column, Style.mt_3]}>
                    <Text style={[Style.font_13, Style.medium]} >
                        Pilih Tipe Variasi<Text style={styles.red} > *</Text>
                    </Text >
                    <View style={[Style.row_between_center, Style.mt_2]}>
                        <View style={Style.row}>
                            <RadioButton
                                color={Warna.biruJaja}
                                value="warna"
                                status={checkedVariasi === 'warna' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButton('warna')}
                            />
                            <Text style={styles.textradio}>Warna</Text>
                        </View>
                        <View style={Style.row}>
                            <RadioButton
                                color={Warna.biruJaja}
                                value="ukuran"
                                status={checkedVariasi === 'ukuran' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButton('ukuran')}
                            />
                            <Text style={styles.textradio}>Ukuran</Text>
                        </View>
                        <View style={Style.row}>
                            <RadioButton
                                color={Warna.biruJaja}
                                value='custom'
                                status={checkedVariasi === 'custom' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButton('custom')}
                            />
                            <Text style={styles.textradio}>Custom</Text>
                        </View>
                    </View>
                    <View style={[Style.column, Style.mt_3]}>
                        <Text style={[Style.font_13, Style.medium]}>
                            Jenis {checkedVariasi === "warna" ? "Warna" : checkedVariasi === "ukuran" ? "Ukuran" : "Custom"}<Text style={styles.red}> *</Text>
                        </Text>
                        <View style={[Style.row]}>
                            {checkedVariasi === 'custom' ?
                                null :
                                <TouchableOpacity onPress={() => actionsheetVariasi.current?.setModalVisible()} style={{ position: 'absolute', height: 20, width: 20, right: 0, bottom: 15 }}>
                                    <Image style={{ height: 20, width: 20, tintColor: Warna.biruJaja }} source={require('../../../../icon/down-arrow.png')} />
                                </TouchableOpacity>
                            }
                            <TextInput
                                placeholder={checkedVariasi === 'custom' ? 'Masukkan jenis custom' : `Pilih jenis ${checkedVariasi}`}
                                value={namaVariasi}

                                // editable={checkedVariasi === 'custom' ? true : false}
                                style={[Style.p_2, Style.font_13, { width: '85%' }]}
                                onChangeText={text => setnamaVariasi(text)}

                                onPressIn={() => actionsheetVariasi.current?.setModalVisible(checkedVariasi === 'custom' ? false : true)}
                            />
                            {/* <TouchableOpacity style={{ padding: '2.5%', borderTopWidth: 0.5, borderTopColor: Warna.silver }} onPress={() => {
                                sethargaShow(true)
                                setstokShow(true)
                                setnamaVariasi(item)
                                setwarna([])
                                setukuran([])
                                setnamasmallText('')
                                setnamacolorText('#9A9A9A');
                            }}>
                                <Text style={{ position: 'relative' }}>{namaVariasi}</Text>
                            </TouchableOpacity> */}
                            {/* <AutoComplete
                                data={checkedVariasi === 'warna' ? warna : ukuran}
                                defaultValue={namaVariasi}
                                style={[Style.font_13]}
                                placeholder={`Masukkan ${checkedVariasi === "warna" ? "Warna" : checkedVariasi === "ukuran" ? "Ukuran" : "Model"}`}
                                inputContainerStyle={{ borderWidth: 0 }}
                                listContainerStyle={{ borderWidth: 0, position: 'relative', backgroundColor: Warna.white, elevation: 0, width: "100%" }}
                                listStyle={{ borderWidth: 0.5, backgroundColor: Warna.white, width: '100%', margin: 0 }}
                                onChangeText={text => handleFilterVariasi(text)}
                                onFocus={() => handleFocus()}
                                renderItem={({ item }) => {
                                    return (
                                        <TC style={{ padding: '2.5%', borderTopWidth: 0.5, borderTopColor: Warna.silver }} onPress={() => {
                                            sethargaShow(true)
                                            setstokShow(true)
                                            setnamaVariasi(item)
                                            setwarna([])
                                            setukuran([])
                                            setnamasmallText('')
                                            setnamacolorText('#9A9A9A');
                                        }}>
                                            <Text style={{ position: 'relative' }}>{item}</Text>
                                        </TC>
                                    )
                                }}
                            /> */}
                        </View>

                        <Text style={[styles.smallText, { color: namacolorText }]}>
                            {namasmallText}
                        </Text>
                    </View>

                    <View style={{ flex: 0, flexDirection: 'column' }}>

                        <Text style={[Style.font_13, Style.medium]}>
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
                                editable={hargaShow}
                                maxLength={17}
                                keyboardType="number-pad"
                                placeholder="10000"
                                value={hargaVariasi}
                                onChangeText={(text) => onChangeText('harga', text)}
                                style={[styles.inputbox, Style.font_13]}
                            />
                        )}
                        <Text style={[styles.smallText, { color: colorharga }]}>
                            {hargasmallText}
                        </Text>
                    </View>
                    <Text style={[Style.font_13, Style.medium]} numberOfLines={1}>
                        Stok<Text style={styles.red}> *</Text>
                    </Text>
                    <TextInput
                        editable={stokShow}
                        maxLength={4}
                        keyboardType="numeric"
                        placeholder="0"
                        value={stokVariasi}
                        onChangeText={(text) => onChangeText('stok', text)}
                        style={[styles.inputbox, Style.font_13]}
                    />
                    <Text style={[styles.smallText, { color: colorStok }]}>
                        {stoksmallText}
                    </Text>
                    <Text style={[Style.font_13, Style.medium]}>
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

                    <View style={styles.button}>
                        <TouchableRipple
                            onPress={() => {
                                console.log("🚀 ~ file: index.js ~ line 557 ~ index ~ variasi", variasi)
                                if (variasi.length) {
                                    setshowVariasi(true)
                                } else {
                                    Utils.alertPopUp('Variasi anda masih kosong!')
                                }
                            }}
                            style={[Style.px_3, Style.mr_2, { paddingVertical: '1.5%', backgroundColor: Colors.biruJaja, borderRadius: 2 }]}>
                            <Text style={[Style.font_12, { color: Colors.white }]}>Lihat Variasi</Text>
                        </TouchableRipple>
                        <TouchableRipple
                            onPress={() => handlePress('add')}
                            style={[Style.px_3, { paddingVertical: '1.5%', backgroundColor: Colors.greenDep, borderRadius: 2 }]}>
                            <Text style={[Style.font_12, { color: Colors.white }]}>Simpan</Text>
                        </TouchableRipple>
                    </View>
                </View>
            }
            <View style={showVariasi ? Style.row_center : Style.row_between_center}>
                <TouchableRipple
                    style={[Style.px_4, Style.py_2, { width: Wp('30%'), backgroundColor: Colors.kuningJaja, }]}
                    uppercase={false} mode="contained" onPress={async () => {
                        handleNext(3, variasi)
                        handleSaveVariasi()
                    }}>
                    <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Sebelumnya</Text>
                </TouchableRipple>
                {showVariasi ?
                    <TouchableRipple
                        style={[Style.px_4, Style.py_2, { width: Wp('35%'), backgroundColor: Colors.greenDep, }]}
                        uppercase={false} mode="contained" onPress={() => {
                            setshowVariasi(false)
                            handleSaveVariasi()
                        }}>
                        <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Tambah Variasi</Text>
                    </TouchableRipple> : null}
                <TouchableRipple
                    style={[Style.px_4, Style.py_2, { width: Wp('30%'), backgroundColor: Colors.biruJaja, }]}
                    uppercase={false} mode="contained" onPress={async () => {
                        handleSaveVariasi()
                        handleNext(5, variasi)
                    }}>
                    <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Selesai</Text>
                </TouchableRipple>
            </View>
            <ActionSheets containerStyle={Style.p_3}
                ref={actionsheetVariasi}>
                <View style={[Style.column, Style.pb_4, { minHeight: Hp('66%'), maxHeight: Hp('55%') }]}>
                    <View style={[Style.row_0_center]}>
                        <Text style={[Style.font_14, Style.semi_bold, Style.my_3, { color: Colors.biruJaja, flex: 1 }]}>Pilih Jenis {checkedVariasi === 'warna' ? 'Warna' : 'Ukuran'}</Text>
                        <TouchableOpacity
                            onPress={() => actionsheetVariasi.current?.setModalVisible(false)}
                        >
                            <Image
                                style={styles.iconClose}
                                source={require('../../../../icon/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: '100%', paddingHorizontal: '1%' }}>
                        <ScrollView style={{ flex: 1 }}>
                            <FlatList
                                data={checkedVariasi === 'warna' ? warna : ukuran}
                                renderItem={renderType}
                                keyExtractor={item => item.id_data}
                            />

                        </ScrollView>
                    </View>
                </View>
            </ActionSheets>

        </View >
    );
}

const styles = StyleSheet.create({

    lineVariasi: { flex: 0, flexDirection: 'row', paddingVertical: Hp('2%'), alignSelf: 'center', justifyContent: 'center', backgroundColor: 'blue' },
    iconlineVariasiDelete: { alignSelf: 'center', width: 16, height: 16, tintColor: 'red' },


    red: { color: 'red' },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        marginTop: Hp('2%'),
        color: '#171717',
    },
    smallText: {
        fontSize: 11,
        color: '#9A9A9A',
        borderTopColor: '#9A9A9A',
        borderTopWidth: 0.5,
    },
    smallTextRight: { fontSize: 11, color: '#9A9A9A', marginTop: Hp('2%') },
    inputbox: { fontSize: 14, borderBottomColor: '#9A9A9A', borderBottomWidth: 0 },
    textradio: { alignSelf: 'center' },
    flex0RowCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '1%',
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
        marginVertical: Hp('2%'),
    },


    btnSimpan: {
        elevation: 2,
        alignSelf: 'flex-end',
        paddingHorizontal: Wp('3%'),
        paddingVertical: Hp('0.6%'),
        backgroundColor: Warna.biruJaja,
        borderRadius: 5,
        color: Warna.white,
        marginHorizontal: Wp('1%'),
    },

    btnTutup: {
        elevation: 3,
        alignSelf: 'flex-end',
        paddingHorizontal: Wp('3%'),
        paddingVertical: Hp('0.6%'),
        backgroundColor: Warna.white,
        borderRadius: 5,
        color: Warna.white,
        marginHorizontal: Wp('1%'),
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
        marginTop: Hp('2%'),
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
        paddingVertical: Wp('2%'),
        fontSize: 13,
        borderBottomWidth: 0.2,
        borderBottomColor: '#C0C0C0',
    },
    viewText: {
        height: Hp('7%'),
        borderBottomWidth: 0.2,
        borderBottomColor: "#9A9A9A",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textInput: { fontSize: 14, alignSelf: "center", textAlign: "left", alignItems: 'flex-end' },
    iconText: { tintColor: '#9a9a9a', width: 15, height: 15, alignSelf: "center" },
    textDelete: { fontWeight: '100', color: 'red' },
    headerModal: { flexDirection: 'row', alignContent: 'space-between', alignItems: 'center', paddingHorizontal: Wp('2%'), marginTop: Hp('2%'), marginBottom: Hp('1%') },
    headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Warna.biruJaja },
    iconClose: { width: 14, height: 14, tintColor: 'grey', },
    touchKategori: { borderBottomColor: '#454545', borderBottomWidth: 0.5, paddingVertical: Hp('2%') },
    actionSheet: {
        paddingHorizontal: Wp('4%'),
        height: Hp('80%')
    },
    search: {
        flexDirection: 'row',
        paddingHorizontal: '3%',
        borderRadius: 5,
        height: Hp('6%'),
        marginHorizontal: '2%',
        marginVertical: '1%',
        backgroundColor: '#D3D3D3',
    },
});
