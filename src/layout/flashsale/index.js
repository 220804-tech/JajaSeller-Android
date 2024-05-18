import React, { useState, useEffect, createRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Warna from '../../config/Warna';
import { useNavigation } from '@react-navigation/native';
import AkanDatang from './akanDatang';
import SedangBerlangsung from './sedangBerlangsung';
import SemuaVoucher from './semua';
import Berakhir from './berakhir'

import { Dropdown } from 'react-native-material-dropdown';
import { Hp, Colors, Wp } from '../../export';

export default function index() {
    const [status, setStatus] = useState('SedangBerlangsung');
    const [W_SemuaVoucher, setW_SemuaVoucher] = useState('');
    const [W_SedangBerlangsung, setW_SedangBerlangsung] = useState('');
    const [W_AkanDatang, setW_AkanDatang] = useState('');
    const [W_Berakhir, setW_Berakhir] = useState('');
    const [TC_SemuaVoucher, setTC_SemuaVoucher] = useState(Warna.black);
    const [TC_SedangBerlangsung, setTC_SedangBerlangsung] = useState(Warna.black);
    const [TC_AkanDatang, setTC_AkanDatang] = useState(Warna.black);
    const [TC_Berakhir, setTC_Berakhir] = useState(Warna.black);
    const [BC_SemuaVoucher, setBC_SemuaVoucher] = useState('');
    const [BC_SedangBerlangsung, setBC_SedangBerlangsung] = useState('');
    const [BC_AkanDatang, setBC_AkanDatang] = useState('');
    const [BC_Berakhir, setBC_Berakhir] = useState('');
    const [searchValue, setSearch] = useState('');
    const [kategori, setKategori] = useState(0);

    function StatusVoucher(statusVoucher) {
        if (statusVoucher == 'SemuaVoucher') {
            setStatus(statusVoucher),
                setW_SemuaVoucher(Warna.biruJaja),
                setW_SedangBerlangsung(null),
                setW_AkanDatang(null),
                setW_Berakhir(null)
            setTC_SemuaVoucher(Warna.white),
                setTC_SedangBerlangsung(Warna.black);
            setTC_AkanDatang(Warna.black);
            setTC_Berakhir(Warna.black);
            setBC_SemuaVoucher('#639bc6');
            setBC_SedangBerlangsung(Warna.black);
            setBC_AkanDatang(Warna.black);
            setBC_Berakhir(Warna.black)
        } else if (statusVoucher == 'SedangBerlangsung') {
            setStatus(statusVoucher);
            setW_SemuaVoucher(null);
            setW_SedangBerlangsung(Warna.biruJaja);
            setW_AkanDatang(null);
            setW_Berakhir(null);
            setTC_SemuaVoucher(Warna.black);
            setTC_SedangBerlangsung(Warna.white);
            setTC_AkanDatang(Warna.black);
            setTC_Berakhir(Warna.black);
            setBC_SemuaVoucher(Warna.black);
            setBC_SedangBerlangsung('#639bc6');
            setBC_AkanDatang(Warna.black);
            setBC_Berakhir(Warna.black)
        } else if (statusVoucher == 'Berakhir') {
            setStatus(statusVoucher);
            setW_SemuaVoucher(null);
            setW_SedangBerlangsung(null);
            setW_AkanDatang(null);
            setW_Berakhir(Warna.biruJaja)
            setTC_SemuaVoucher(Warna.black);
            setTC_SedangBerlangsung(Warna.black);
            setTC_AkanDatang(Warna.black);
            setTC_Berakhir(Warna.white);
            setBC_SemuaVoucher(Warna.black);
            setBC_SedangBerlangsung(Warna.black);
            setBC_AkanDatang(Warna.black);
            setBC_Berakhir('#639bc6')
        } else {
            setStatus(statusVoucher);
            setW_SemuaVoucher(null);
            setW_SedangBerlangsung(null);
            setW_AkanDatang(Warna.biruJaja);
            setW_Berakhir(null)
            setTC_SemuaVoucher(Warna.black);
            setTC_SedangBerlangsung(Warna.black);
            setTC_AkanDatang(Warna.white);
            setTC_Berakhir(Warna.black);
            setBC_SemuaVoucher(Warna.black);
            setBC_SedangBerlangsung(Warna.black);
            setBC_AkanDatang('#639bc6')
            setBC_Berakhir(Warna.black)
        }
    }

    function statePertama() {
        setStatus('SedangBerlangsung'),
            setW_SemuaVoucher(null),
            setW_SedangBerlangsung(Warna.biruJaja),
            setW_AkanDatang(null),
            setW_Berakhir(null)

        setTC_SemuaVoucher(Warna.black),
            setTC_SedangBerlangsung(Warna.white),
            setTC_AkanDatang(Warna.black),
            setTC_Berakhir(Warna.black);

        setBC_SemuaVoucher(Warna.black),
            setBC_SedangBerlangsung('#639bc6'),
            setBC_AkanDatang(Warna.black),
            setBC_Berakhir(Warna.black)
        console.log(status);
    }
    const handleSearch = (text) => {
        console.log(text, 'text onChange');
        setSearch(text);
    }

    useEffect(() => {
        statePertama();

    }, []);

    var data = <View></View>;
    if (status == 'SedangBerlangsung') {
        data = (
            <SedangBerlangsung search={searchValue} handleFilter={kategori} />
        );

    } else if (status == 'Berakhir') {
        data = (
            <SedangBerlangsung search={searchValue} handleFilter={kategori} />
        );
    } else {
        data = (
            <AkanDatang search={searchValue} handleFilter={kategori} />
        );
    }
    return (
        <>
            <View style={styles.search}>
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
                    placeholder="Cari Voucher"
                    style={{ flex: 1, paddingLeft: 10 }}
                    onChangeText={(text) => handleSearch(text)}
                    theme={{
                        colors: {
                            primary: Warna.white,
                            text: Warna.black,
                        },
                    }}
                />

            </View>

            <View
                style={styles.buttonOpsi}>
                {/* <TouchableOpacity
                    onPress={() =>
                        StatusVoucher('SemuaVoucher')
                    }
                    style={{
                        borderRadius: 11,
                        borderWidth: 0.7,
                        paddingHorizontal: 3,
                        paddingVertical: 8,
                        justifyContent: 'center',
                        marginRight: 5,
                        borderColor: BC_SemuaVoucher,
                        backgroundColor: W_SemuaVoucher,
                        alignSelf: 'center',
                        flex: 1,
                    }}>
                    <Text style={{ fontSize: 10, alignSelf: 'center', color: TC_SemuaVoucher }}>
                        Voucher
                    </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    onPress={() =>
                        StatusVoucher('SedangBerlangsung')
                    }
                    style={{
                        borderRadius: 11,
                        borderWidth: 0.7,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 5,
                        borderColor: BC_SedangBerlangsung,
                        backgroundColor: W_SedangBerlangsung,
                        alignSelf: 'center',
                        flex: 1,
                    }}>
                    <Text
                        style={{ fontSize: 10, alignSelf: 'center', color: TC_SedangBerlangsung }}>
                        Berlangsung
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        StatusVoucher('Berakhir')
                    }
                    style={{
                        borderRadius: 11,
                        borderWidth: 0.7,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 5,
                        borderColor: BC_Berakhir,
                        backgroundColor: W_Berakhir,
                        alignSelf: 'center',
                        flex: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: 10,
                            alignSelf: 'center',
                            color: TC_Berakhir,
                        }}>
                        Berakhir
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        StatusVoucher('AkanDatang')
                    }
                    style={{
                        borderRadius: 11,
                        borderWidth: 0.7,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 5,
                        borderColor: BC_AkanDatang,
                        backgroundColor: W_AkanDatang,
                        alignSelf: 'center',
                        flex: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: 10,
                            alignSelf: 'center',
                            color: TC_AkanDatang,
                        }}>
                        Akan Datang
                    </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
            </View>
            <View style={styles.content}>
                {data}
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    appBar: {
        backgroundColor: Warna.biruJaja,
        color: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '3%',
    },
    appBarIcon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        tintColor: '#ffff',
    },
    appBarText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    item: {
        tintColor: '#ffff',
        alignSelf: 'flex-end',
        textAlign: 'right',
        color: 'white',
    },
    search: {
        flexDirection: 'row',
        paddingHorizontal: '3%',
        borderRadius: 5,
        height: Hp('6%'),
        width: Wp('95%'),
        marginHorizontal: '2%',
        marginVertical: '2%',
        backgroundColor: Colors.white,
        elevation: 3,
        alignSelf: 'center'
    },
    buttonOpsi: {
        paddingHorizontal: '2%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        marginHorizontal: '0%',
        marginVertical: '1%',
    },
    add: {
        width: 25,
        height: 25,
        tintColor: 'black'
    },
    inputDropdown: {
        width: 110
    },

});
