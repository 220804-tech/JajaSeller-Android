import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import TidakAktif from './tidakAktif';
import Aktif from './aktif';
import SemuaVoucher from './semuaVoucher';
import { Colors, Hp, Style, Wp } from '../../export'
export default function index(props) {
    const [status, setStatus] = useState('Aktif');

    const [W_SemuaVoucher, setW_SemuaVoucher] = useState('');
    const [W_Aktif, setW_Aktif] = useState('');
    const [W_TidakAktif, setW_TidakAktif] = useState('');
    // const [W_Berakhir, setW_Berakhir] = useState('');
    const [TC_SemuaVoucher, setTC_SemuaVoucher] = useState(Colors.black);
    const [TC_Aktif, setTC_Aktif] = useState(Colors.black);
    const [TC_TidakAktif, setTC_TidakAktif] = useState(Colors.black);
    // const [TC_Berakhir, setTC_Berakhir] = useState(Colors.black);
    const [BC_SemuaVoucher, setBC_SemuaVoucher] = useState('');
    const [BC_Aktif, setBC_Aktif] = useState('');
    const [BC_TidakAktif, setBC_TidakAktif] = useState('');
    // const [BC_Berakhir, setBC_Berakhir] = useState('');
    const [searchValue, setSearch] = useState('');
    const [kategori, setKategori] = useState(0);

    function StatusVoucher(statusVoucher) {
        if (statusVoucher == 'SemuaVoucher') {
            setStatus(statusVoucher)
            setW_SemuaVoucher(Colors.biruJaja)
            setW_Aktif(null)
            setW_TidakAktif(null)
            setTC_SemuaVoucher(Colors.white)
            setTC_Aktif(Colors.black);
            setTC_TidakAktif(Colors.black);

            setBC_SemuaVoucher('#639bc6');
            setBC_Aktif(Colors.black);
            setBC_TidakAktif(Colors.black);
        } else if (statusVoucher == 'Aktif') {
            setStatus(statusVoucher);

            setW_SemuaVoucher(null);
            setW_Aktif(Colors.biruJaja);
            setW_TidakAktif(null);

            setTC_SemuaVoucher(Colors.black);
            setTC_Aktif(Colors.white);
            setTC_TidakAktif(Colors.black);

            setBC_SemuaVoucher(Colors.black);
            setBC_Aktif('#639bc6');
            setBC_TidakAktif(Colors.black);
        } else {
            setStatus(statusVoucher);

            setW_SemuaVoucher(null);
            setW_Aktif(null);
            setW_TidakAktif(Colors.biruJaja);

            setTC_SemuaVoucher(Colors.black);
            setTC_Aktif(Colors.black);
            setTC_TidakAktif(Colors.white);

            setBC_SemuaVoucher(Colors.black);
            setBC_Aktif(Colors.black);
            setBC_TidakAktif('#639bc6');
        }
        console.log(statusVoucher);
    }

    function statePertama() {
        setStatus('Aktif'),
            setW_SemuaVoucher(null),
            setW_Aktif(Colors.biruJaja),
            setW_TidakAktif(null),
            setTC_SemuaVoucher(Colors.black),
            setTC_Aktif(Colors.white),
            setTC_TidakAktif(Colors.black),
            setBC_SemuaVoucher(Colors.black),
            setBC_Aktif('#639bc6'),
            setBC_TidakAktif(Colors.black),
            console.log(status);
    }
    const handleSearch = (text) => {
        setSearch(text);
    }

    const handleKategeori = () => {
        setKategori(kategori + 1);
    };

    useEffect(() => {
        statePertama();
    }, [props]);

    var data = <View></View>;
    if (status == 'SemuaVoucher') {
        data =
            <SemuaVoucher search={searchValue} handleFilter={kategori} />
    } else if (status == 'Aktif') {
        data = (
            <Aktif search={searchValue} handleFilter={kategori} />
        );
    } else {
        data = (
            <TidakAktif search={searchValue} handleFilter={kategori} />
        );
    }
    return (
        <>
            <View style={styles.search}>
                <Image
                    source={require('../../assets/icons/loupe.png')}
                    style={{
                        height: 23,
                        width: 23,
                        flex: 1,
                        resizeMode: 'contain',
                        marginRight: '1%'
                    }}
                />
                <TextInput
                    placeholder="Cari Voucher"
                    style={[Style.font_13, { marginBottom: '-0.5%', width: '90%', height: '100%', color: Colors.black, textAlignVertical: 'center' }]}
                    onChangeText={(text) => handleSearch(text)}
                />
            </View>
            <View
                style={styles.buttonOpsi}>
                <TouchableOpacity
                    onPress={() =>
                        StatusVoucher('Aktif')
                    }
                    style={{
                        borderRadius: 11,
                        borderWidth: 0.5,
                        paddingVertical: '2%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 6,
                        borderColor: BC_Aktif,
                        backgroundColor: W_Aktif,
                        alignSelf: 'center',
                        width: 110,
                    }}>
                    <Text
                        style={[Style.font_12, Style.text_center, { color: TC_Aktif }]}>
                        Aktif
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        StatusVoucher('TidakAktif')
                    }
                    style={{
                        borderRadius: 11,
                        borderWidth: 0.5,
                        paddingVertical: '2%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 6,
                        borderColor: BC_TidakAktif,
                        backgroundColor: W_TidakAktif,
                        alignSelf: 'center',
                        width: 110,
                    }}>
                    <Text
                        style={[Style.font_12, Style.text_center, { color: TC_TidakAktif }]}>
                        Tidak Aktif
                    </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
            </View>

            <View style={[Style.container, Style.my, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
                {data}
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    search: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '3%',
        borderRadius: 5,
        height: Hp('5.7%'),
        width: Wp('95%'),
        margin: '2%',
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        alignSelf: 'center',
    },
    buttonOpsi: {
        paddingHorizontal: '2%',
        height: Hp('6%'),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

});
