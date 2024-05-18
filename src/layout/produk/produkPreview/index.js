
import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, RefreshControl, Dimensions, ScrollView, Platform } from 'react-native'
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import style from '../../../styles/style';
import { money } from '../../../utils'
import Warna from '../../../config/Warna';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'
import Navbar from '../../../component/navbar'
import { getToko } from '../../../service/Storage'
import { SliderBox } from "react-native-image-slider-box";
import { Colors } from '../../../export';
const screenHeight = Dimensions.get('screen').height;

function Header() {
    return (
        <Navbar back={true} transparent={true} />
    )
}
function Background(data) {
    let toko = data.toko
    console.log("🚀 ~ file: index.js ~ line 22 ~ Background ~ toko", toko)
    let item = data.data;
    let variasi = data.data?.variasi?.[0];

    return (
        <View style={[styles.header]}>
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }} style={{ width: '100%', }}>
                <View style={styles.card}>
                    <Text adjustsFontSizeToFit style={styles.textNamaProduk}>{data.data.nama_produk}</Text>
                    <View style={{ flex: 0, flexDirection: 'row' }}>
                        {variasi?.presentase_diskon ?
                            <View style={styles.diskonbox}>
                                <Text adjustsFontSizeToFit style={styles.diskonPersentase}>{variasi.presentase_diskon}%</Text>
                            </View>
                            : null
                        }
                        <View style={{ flex: 0, flexDirection: 'column' }}>
                            {variasi?.presentase_diskon ?
                                <Text adjustsFontSizeToFit style={styles.beforeDiskon}>Rp. {money(variasi?.harga_normal ? variasi.harga_normal : item.harga)}</Text>
                                : null
                            }
                            <Text adjustsFontSizeToFit style={styles.afterDisokon}>Rp. {money(variasi?.harga_variasi ? variasi.harga_variasi : item.harga)}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Image style={styles.circleImage} source={{ uri: toko.foto ? toko.foto : 'https://picsum.photos/700' }} />
                    <View style={{ flex: 0, flexDirection: 'column', }}>
                        <Text adjustsFontSizeToFit style={styles.namaToko}>{toko ? toko.nama_toko : ""}</Text>
                        <View style={[style.row_0, { marginBottom: '1%' }]}><Image style={{ marginRight: '4%' }} source={require('../../../diamond/diamond-1.gif')} /><Image style={{ marginRight: '4%' }} source={require('../../../diamond/diamond-1.gif')} /><Image style={{ marginRight: '2%' }} source={require('../../../diamond/diamond-1.gif')} /></View>
                        <View style={[style.row_0, { alignItems: 'center' }]}><Image style={{ tintColor: Warna.blackGrey, height: 14, width: 11, marginRight: '3%' }} source={require('../../../icon/pin-location.png')} /><Text adjustsFontSizeToFit style={styles.textKota}>{toko && toko.lokasi ? toko.lokasi.kota_kabupaten : ""}</Text></View>
                    </View>
                </View>
                <View style={[styles.card, { alignItems: 'flex-start' }]}>
                    <Text adjustsFontSizeToFit style={styles.textTitle}>Informasi Produk</Text>
                    <View style={[style.row_0, { justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#000', paddingBottom: '2%', marginBottom: '10%' }]}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>Kondisi</Text>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>Berat</Text>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>Stok</Text>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>Kategori</Text>
                        </View>
                        <View style={{ flex: 3, flexDirection: 'column' }}>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>{item.kondisi}</Text>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>{item.berat} Gram</Text>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem}>{item.jumlah_stok_in}</Text>
                            <Text adjustsFontSizeToFit style={styles.informasiProdukItem} numberOfLines={1}>{item.kategori}</Text>
                        </View>
                    </View>
                    <Text adjustsFontSizeToFit style={styles.textTitle}>Deskripsi Produk</Text>
                    <View style={[style.row_0, { justifyContent: 'space-between', paddingBottom: '5%', width: '100%', }]}>
                        <View style={style.column}>
                            <Text adjustsFontSizeToFit style={styles.textDeskripsi}>{item.deskripsi}</Text>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
function Foreground({ data }) {
    let photos = []
    data.foto.map(res => photos.push(res.url_foto))
    return (<SliderBox sliderBoxHeight={hp('40%')} images={photos} />)
}

export default function ProdukPreview(props) {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [sbColor, setsbColor] = useState('transparent');
    const [toko, setToko] = useState({});


    const { data } = props.route.params;

    const onRefresh = useCallback(() => {
        console.log("🚀 ~ file: index.js ~ line 21 ~ Background ~ toko", props.route.params)

    }, []);

    useEffect(() => {
        handleToko()
    }, [])

    const handleToko = () => {
        getToko().then(res => {
            setToko(res)
        })
    }
    return (
        <SafeAreaView style={style.container}>
            {/* <SnackBar messageStyle={{ fontFamily: 'Poppins-SemiBold' }} messageColor="white" backgroundColor={Warna.biruJaja} visible={notifTop} top={0} position="bottom" textMessage="PIN berhasil disimpan!" autoHidingTime={2000} /> */}
            <StatusBar translucent={true} backgroundColor={Platform.OS === 'ios' ? Colors.biruJaja : sbColor} barStyle="light-content" />
            <ParallaxScroll
                renderHeader={({ animatedValue }) => <Header animatedValue={animatedValue} navigation={navigation} />}
                headerHeight={hp('7%')}
                fadeOutParallaxForeground={false}
                fadeOutParallaxBackground={false}
                isHeaderFixed={true}
                parallaxHeight={screenHeight + (data.deskripsi.length + (data.deskripsi.length / 4))}
                isBackgroundScalable={false}
                renderParallaxBackground={({ animatedValue }) => <Background toko={toko} data={data} animatedValue={animatedValue} />}
                renderParallaxForeground={({ animatedValue }) => <Foreground data={data} animatedValue={animatedValue} />}
                parallaxBackgroundScrollSpeed={2.5}
                parallaxForegroundScrollSpeed={2.5}
                headerBackgroundColor='transparent'
                headerFixedBackgroundColor={Platform.OS === 'ios' ? 'transparent' : Colors.biruJaja}
                onHeaderFixed={() => setsbColor(Warna.biruJaja)}
                onChangeHeaderVisibility={() => setsbColor(Warna.kuningJaja)}
                style={{ flex: 0, position: 'relative' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            </ParallaxScroll>
        </SafeAreaView >
    );

}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        marginTop: hp('40%'),
        width: wp('100%'),
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: 0.95,
        backgroundColor: Platform.OS === 'ios' ? Colors.biruJaja : null
    },
    card: {
        flex: 0, flexDirection: 'column', marginBottom: '2%', backgroundColor: Warna.white, paddingHorizontal: '5%', paddingVertical: '6%'
    },
    circleImage: {
        borderRadius: 100,
        height: 55,
        width: 55,
        marginRight: '3%'
    },
    textNamaProduk: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: Warna.biruJaja,
        marginBottom: '4%',
    },
    textTitle: {
        fontSize: 16,
        color: Warna.blackLight,
        marginBottom: '4%',
        fontFamily: 'Poppins-Regular',
        borderBottomWidth: 0.5, borderBottomColor: '#000'
    },
    diskonbox: {
        backgroundColor: 'red',
        padding: '2.5%',
        textAlignVertical: 'center',
        textAlign: 'center',
        borderRadius: 4,
        marginRight: '4%'

    },
    diskonPersentase: {
        color: Warna.white,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        fontFamily: 'Poppins-Regular',
    },
    beforeDiskon: {
        fontSize: 13,
        textDecorationLine: 'line-through',
        fontFamily: 'Poppins-Regular'
    },
    afterDisokon: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: 'red'
    },
    namaToko: {
        fontSize: 14,
        color: Warna.blackgrayScale,
        fontFamily: 'Poppins-Regular',
        marginBottom: '1%'
    },
    textKota: {
        fontSize: 12,
        color: Warna.blackgrayScale,
        fontFamily: 'Poppins-Regular'
    },
    informasiProdukItem: {
        fontSize: 14,
        color: Warna.blackgrayScale,
        fontFamily: 'Poppins-Regular'
    },
    textDeskripsi: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Warna.blackgrayScale,
    },
})
