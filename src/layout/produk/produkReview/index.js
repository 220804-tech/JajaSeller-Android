import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, BackHandler, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Image } from 'react-native';
import { View, Text } from 'react-native'
import ActionButton from 'react-native-action-button';
import { Appbar } from 'react-native-paper';
import Warna from '../../../config/Warna';
import style from '../../../styles/style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Service from '../../../service/Produk'
import { Style } from '../../../export';
import { useSelector } from 'react-redux';
export default function ReviewProduk() {
    const navigation = useNavigation();
    const [layout, setlayout] = useState("Rating")
    const [totalAll, setTotalAll] = useState({})
    const [totalReport, setTotalReport] = useState("")
    const [refreshing, setrefreshing] = useState(false)

    const [produkReview, setProdukReview] = useState([])
    const [produkReport, setProdukReport] = useState([])
    const reduxSeller = useSelector(state => state.user.seller)

    useEffect(() => {
        getListRating()
        getListReport()
    }, [])

    const getListRating = async () => {
        try {
            let response = await Service.getRating(reduxSeller.id_toko);
            setTotalAll({
                review: response.data.total_all_review,
                average: response.data.average_all_rating
            })
            setProdukReview(response.data.rating)
            // setListRating(response.data.review)
        } catch (error) {
            setTotalAll({})
            setProdukReview([])
        }
    }

    const getListReport = async () => {
        try {
            let response = await Service.getReport();
            setTotalReport(!!response?.data?.total_all_report ? response.data.total_all_report : '0')
            setProdukReport(!!response?.data?.report?.[0] ? response.data.report : [])
        } catch (error) {
            setProdukReport([])
            console.log("🚀 ~ file: index.js ~ line 51 ~ getListReport ~ error", error)
        }
    }
    const renderProdukReview = ({ item }) => {
        return (
            <DataTable.Row onPress={() => navigation.navigate('Ulasan', { data: item })}>
                <DataTable.Cell>{item.nama_produk}</DataTable.Cell>
                <DataTable.Cell numeric>{item.average_rating}</DataTable.Cell>
                <DataTable.Cell numeric>{item.total_review}</DataTable.Cell>
            </DataTable.Row>
        )
    }
    const renderProdukReport = ({ item }) => {
        return (
            <DataTable.Row >
                <DataTable.Cell>{item.nama_produk}</DataTable.Cell>
                <DataTable.Cell numeric><Text>{item.detail[0].alasan}</Text></DataTable.Cell>
                <DataTable.Cell numeric>{item.total_report}</DataTable.Cell>
            </DataTable.Row>
        )
    }

    const onRefresh = useCallback(async () => {
        setrefreshing(true);
        getListRating()
        getListReport()
        setTimeout(() => setrefreshing(false), 2000);
    }, []);

    return (
        <SafeAreaView style={style.container}>
            <Appbar style={[style.appBar, { paddingHorizontal: wp('0%') }]}>
                <Appbar.Action
                    icon={require('../../../icon/arrow.png')}
                    color={Warna.white}
                    style={{ backgroundColor: Warna.biruJaja }}

                    onPress={() => navigation.goBack()}
                />
                <View style={style.row_start_center}>
                    <Text style={style.appBarText}>Review Produk</Text>
                </View>
            </Appbar>
            <View style={Style.containeriOS}>
                {layout === "Rating" ?
                    <View style={{ padding: '2%' }}>
                        <DataTable>
                            <View style={{ flex: 0, flexDirection: 'column', padding: '2%', alignItems: 'center', backgroundColor: 'white', elevation: 2, padding: '3%', marginBottom: '2%' }}>
                                <View style={styles.textWrapperRating}>
                                    <Image source={require('../../../icon/ulasan.png')} style={[styles.iconStart, { tintColor: Warna.kuningJaja }]} />
                                    <Text style={styles.textLeftRating}>{totalAll.average}</Text>
                                    <Text style={[Style.font_13]}>/5.0</Text>
                                    <Text style={styles.textRightRating}>Rata-Rata Rating</Text></View>
                                <View style={styles.textWrapperRating}>
                                    <Image source={require('../../../icon/feedback.png')} style={styles.iconStart} />
                                    <Text style={styles.textLeftRating}>{totalAll.review}</Text>
                                    <Text style={styles.textCenterRating}></Text>
                                    <Text style={styles.textRightRating}>Ulasan</Text></View>
                            </View>
                            {produkReview.length !== 0 ?
                                <View style={{ padding: '2%', backgroundColor: 'white', elevation: 2 }}>
                                    <>
                                        <DataTable.Header>
                                            <DataTable.Title>Nama Produk</DataTable.Title>
                                            <DataTable.Title numeric>Rating</DataTable.Title>
                                            <DataTable.Title numeric>Ulasan</DataTable.Title>
                                        </DataTable.Header>
                                        <FlatList
                                            data={produkReview}
                                            renderItem={renderProdukReview}
                                            key={item => item.id_produk}
                                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                        />
                                    </>

                                </View>
                                : <Text adjustsFontSizeToFit style={{ width: '100%', textAlign: 'center', marginTop: '11%', fontSize: 14, color: Warna.blackgrayScale, fontFamily: 'Poppins-Italic' }}>Ulasan anda masih kosong</Text>
                            }

                        </DataTable>
                    </View>
                    :
                    <View style={{ padding: '2%' }}>
                        <DataTable>
                            <View style={{ flex: 0, flexDirection: 'column', padding: '2%', alignItems: 'center', backgroundColor: 'white', elevation: 2, padding: '3%', marginBottom: '2%' }}>
                                <View style={styles.textWrapperRating}><Image source={require('../../../icon/ulasan.png')} style={[styles.iconStart, { tintColor: Warna.redPower }]} /><Text style={styles.textLeftRating}>0</Text><Text style={styles.textRightRating}>Daftar Produk Dilaporkan</Text></View>
                            </View>
                            {produkReport.length !== 0 ?
                                <View style={{ padding: '2%', backgroundColor: 'white', elevation: 2 }}>
                                    <DataTable.Header>
                                        <DataTable.Title>Nama Produk</DataTable.Title>
                                        <DataTable.Title>Keterangan</DataTable.Title>
                                        <DataTable.Title>Dilaporkan</DataTable.Title>
                                    </DataTable.Header>
                                    <FlatList
                                        data={produkReport}
                                        renderItem={renderProdukReport}
                                        key={item => item.id_produk}
                                    />
                                </View>
                                : <Text adjustsFontSizeToFit style={{ width: '100%', textAlign: 'center', marginTop: '11%', fontSize: 14, color: Warna.blackgrayScale, fontFamily: 'Poppins-Italic' }}>Pertahankan!, produk anda belum menerima report apapun</Text>
                            }
                        </DataTable>
                    </View>

                }
            </View>
            <ActionButton buttonColor={Warna.white} renderIcon={() =>
                <Image
                    style={{ width: '40%', height: '40%' }}
                    source={require('../../../icon/menu.png')}
                />
            }>
                <ActionButton.Item buttonColor='#3498db' title="Rating Produk" onPress={() => setlayout("Rating")}>
                    {/* <Text style={styles.textMenu}>P</Text> */}
                    <Image
                        style={{ width: '35%', height: '35%', tintColor: Warna.kuningJaja }}
                        source={require('../../../icon/ulasan.png')}
                    />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="Report Produk" onPress={() => setlayout("Report")}>
                    {/* <Text style={styles.textMenu}>V</Text> */}
                    <Image
                        style={{ width: '35%', height: '35%', tintColor: Warna.redPower }}
                        source={require('../../../icon/ulasan.png')}
                    />
                </ActionButton.Item>
            </ActionButton>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    textWrapperRating: { flex: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2%' },
    iconStart: { height: hp('4.5%'), width: hp('4.5%'), flex: 0, resizeMode: 'contain', marginRight: '3%' },
    textLeftRating: {
        flex: 0,
        fontSize: 22,
        color: 'grey',
        fontFamily: 'Poppins-SemiBold',
        marginRight: '1%'
    },
    textCenterRating: {
        flex: 0,
        fontSize: 13,
        color: 'grey',
        fontWeight: '900',
        marginRight: '5%',
        textAlignVertical: 'bottom'

    },
    textRightRating: {
        flex: 1,
        fontSize: 16,
        color: 'grey',
        fontWeight: '900',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        // backgroundColor: 'blue',
        textAlign: 'right',
        fontFamily: 'Poppins-Regular'
    }
})