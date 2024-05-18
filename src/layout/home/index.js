import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, SafeAreaView, RefreshControl, ToastAndroid, Alert, TouchableOpacity, Dimensions, Platform, BackHandler, Share } from 'react-native'
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { Appbar, IconButton, Button, TouchableRipple } from 'react-native-paper';
import database from '@react-native-firebase/database';
import SnackBar from 'react-native-snackbar-component'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { LineChart } from "react-native-chart-kit";
import { getToko, getTokenDevice, getAllOrdersStorage } from "../../service/Storage"
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '../../service/Orders'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Wp, Hp, Colors, Style, ServiceAccount, useNavigation, useFocusEffect, Utils, Loading } from '../../export'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useAndroidBackHandler } from "react-navigation-backhandler";
import dynamicLinks from '@react-native-firebase/dynamic-links';



function Header({ reduxToken, marketName, navigation, notif }) {
    const [link, setlink] = useState('')
    const reduxSeller = useSelector(state => state.user.seller)


    const onShare = async () => {
        console.log('on shareee', link)
        try {
            const result = await Share.share({
                message: `Kunjungi toko kami ${marketName} dapatkan berbagai promo \nKunjungi sekarang ${link}`,

            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }


    const dynamicLink = async () => {

        const p = `${reduxSeller.nama_toko}`;
        const regex = / /i;
        const oiii = p.replace(regex, '-');
        

        try {
            const link_URL = await dynamicLinks().buildShortLink({
                link: `https://jajaid.page.link/store?slug=${oiii}`,
                // <?= str_replace(' ', '-', $core['seller']->nama_toko) ?>
                domainUriPrefix: 'https://jajaid.page.link',
                ios: {
                    bundleId: 'com.jaja.customer',
                    appStoreId: '1547981332',
                    fallbackUrl: 'https://apps.apple.com/id/app/jaja-id-marketplace-hobbies/id1547981332?l=id',
                },
                android: {
                    packageName: 'com.jajaidbuyer',
                    fallbackUrl: 'https://play.google.com/store/apps/details?id=com.jajaidbuyer',
                },
                navigation: {
                    forcedRedirectEnabled: true,
                }
            });
            setlink(link_URL)
            console.log('dynamicc linkkk', link_URL)

        } catch (error) {
            console.log("🚀 ~ file: ProductScreen.js ~ line 138 ~ dynamicLink ~ error", error.message)

        }
    }

    useEffect(() => {
        dynamicLink()
    }, [])

    return (
        <Appbar.Header style={[Style.appBar, { backgroundColor: 'transparent' }]}>
            <View style={Style.row_start_center}>
                {!marketName ?
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={{ borderRadius: 1 }}
                        width={140}
                        height={20}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                    />
                    :
                    <Text onPress={() => navigation.navigate('Lainnya')} style={Style.appBarText}>{marketName}</Text>
                }
            </View>

            <TouchableOpacity style={{ marginRight: '3%' }} onPress={onShare}>
                <Image
                    style={styles.storeIcon}
                    source={require('../../icon/share.png')}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate(!reduxToken ? 'Login' : 'Lainnya')}>
                <Image
                    style={styles.storeIcon}
                    source={require('../../icon/store.png')}
                />
            </TouchableOpacity>
        </Appbar.Header>
    )
}
function Background() {
    return (
        <View style={styles.header}>
            <Image style={styles.imageHeader} source={require('../../icon/head2.png')} />
        </View>
    )
}

export default function Home() {

    const navigation = useNavigation();
    const reduxUser = useSelector(state => state.user)
    const reduxSeller = useSelector(state => state.user.seller)
    const reduxToken = useSelector(state => state.user.token)

    const [sbColor, setsbColor] = useState(Colors.biruJaja);
    const [statistik, setStatistik] = useState("");
    const [arrShowDate, setarrShowDate] = useState(["1", "2", "4", "5", "6", "7"])
    const [arrShowDateItem, setarrShowDateItem] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])

    const [totalNotif, settotalNotif] = useState("0");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadDashboard, setloadDashboard] = useState(false);

    const [marketName, setmarketName] = useState("");
    const [notifText, setnotifText] = useState("")
    const [alertSignal, setalertSignal] = useState(false);
    const [salad, setsalad] = useState("");
    const [loadsalad, setloadsalad] = useState(false);
    const [order, setorder] = useState("");
    const [product, setproduct] = useState("");
    const [voucher, setvoucher] = useState("");
    const [popular, setpopular] = useState("");
    const dashboard = useSelector(state => state.dashboard.dashboard)
    const dispatch = useDispatch()


    const [out, setOut] = useState(false)

    useAndroidBackHandler(() => {
        if (out) {
            BackHandler.exitApp()
            // return false;
        } else {
            Utils.alertPopUp("Tekan sekali lagi untuk keluar aplikasi")
            setTimeout(() => {
                setOut(false)
            }, 4500);
            setOut(true)
            return true
        }
    });

    useEffect(() => {
        handleData()
        return () => {

        }
    }, [reduxUser, reduxToken])



    const handleData = () => {
        if (reduxToken) {
            try {
                setRefreshing(false);
                setloadDashboard(true)
                setloadsalad(true)
                setTimeout(() => {
                    getItem();
                    firebase();
                    getStatistik()
                }, 250);
                setTimeout(() => {
                    handleProps()
                }, 500);
            } catch (error) {
                setloadsalad(false)
                setloadDashboard(false)
            }
        } else {
            setRefreshing(false);
            setloadDashboard(false)
            setloadsalad(false)
        }
    }


    useFocusEffect(
        useCallback(() => {
            onRefresh()
        }, []),
    );

    useFocusEffect(
        useCallback(() => {
            handleSignal()

            if (dashboard && Object.keys(dashboard).length) {
                handleNotifCard()
            } else {
                setnotifText('login')
            }
            return () => {

            }
        }, [dashboard]),
    );
    const handleSignal = () => {
        setloadsalad(false)
        Utils.checkSignal().then(signal => {
            console.log(signal);
            if (!signal.connect) {
                setnotifText(notif[4].isi)
                Utils.alertPopUp("Tidak dapat terhubung, periksa kembali koneksi anda")
            }
        })
    }

    const handleProps = async () => {
        try {
            if (dashboard && Object.keys(dashboard).length) {
                setorder(dashboard.jumlah.pesanan)
                setvoucher(dashboard.jumlah.voucher)
                setproduct(dashboard.jumlah.produk)
                setpopular(dashboard.produk_terlaris)
                setTimeout(() => setloadDashboard(false), 1000);
            } else {
                console.log("dashboard home kosong 198")
            }
            setTimeout(() => {
                if (!dashboard || Object.keys(dashboard).length) {
                    setloadDashboard(false)
                }
            }, 3000);
        } catch (error) {
            setloadsalad(false)
            setloadDashboard(false)
            console.log("🚀 ~ file: index.js ~ line 193 ~ handleProps ~ error", error)
        }
    }

    const handleRedux = async () => {
        try {
            let data = {};
            let signal = await Utils.checkSignal();
            if (signal.connect === true) {
                data = await getAllOrders()
            } else {
                const asyncData = await EncryptedStorage.getItem("orders");
                if (asyncData && asyncData.length) {
                    data = await getAllOrdersStorage()
                }
                Utils.alertPopUp("Periksa kembali koneksi internet anda!")

            }
            dispatch({ type: 'SET_ORDERS', payload: data.orders })
            dispatch({ type: 'SET_ORDER_UNPAID', payload: data.orderUnpaid })
            dispatch({ type: 'SET_ORDER_PAID', payload: data.orderPaid })
            dispatch({ type: 'SET_ORDER_PROCESS', payload: data.orderProcess })
            dispatch({ type: 'SET_ORDER_SENT', payload: data.orderSent })
            dispatch({ type: 'SET_ORDER_COMPLETED', payload: data.orderCompleted })
            dispatch({ type: 'SET_ORDER_BLOCKED', payload: data.orderFailed })
            setTimeout(() => {
                handleProps()
                handleNotifCard()
            }, 1500);
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 231 ~ handleRedux ~ error", error)

        }
    }

    const handleDashboard = async () => {
        try {
            let asyncData = await EncryptedStorage.getItem("dashboard");
            let data = await ServiceAccount.getProfile()
            setTimeout(() => {
                dispatch({ type: 'SET_DASHBOARD', payload: data !== null ? data : JSON.parse(asyncData) })
            }, 500);
            setTimeout(() => {
                setloadDashboard(false)
            }, 3000);
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 252 ~ handleDashboard ~ error", error)
        }
    }

    const notifikasi = [
        { id: 1, tanggal: "12-September-2020", isi: "Exercitation qui aliquip culpa sunt aliqua anim cupidatat nulla do Lorem ex nisi commodo sit. Eiusmod anim aliquip dolore et cupidatat ea laborum exercitation. Magna laboris amet aute reprehenderit quis et nostrud fugiat. Elit ipsum veniam pariatur occaecat mollit reprehenderit.", title: 'Jangan menyerah kamu pasti bisa, selain berusaha, berdoa juga sangat penting!' },
        { id: 2, tanggal: "12-September-2020", isi: "Qui deserunt duis sunt anim sit magna esse irure eu et. Do qui cupidatat nulla non quis. Enim cupidatat occaecat laboris Lorem aliquip veniam nisi elit excepteur. Et do ea officia elit non incididunt ut enim voluptate.", title: 'Jelaskan produkmu secara terperinci di deskripsi' },
        { id: 3, tanggal: "12-September-2020", isi: "Cupidatat reprehenderit ut enim nulla aliquip Lorem qui sit sit esse. Est ea occaecat velit nisi amet veniam sit fugiat consectetur nisi laborum labore esse labore. Ea aliquip proident sint tempor laboris velit sunt excepteur ipsum veniam sit tempor aliquip. Elit dolor nisi quis ullamco commodo enim do. Duis proident in occaecat consectetur anim nisi pariatur anim laboris qui culpa mollit ullamco.", title: 'Kurang nya peminat?, menggunakan foto yang blur adalah salah satu penyebabya loh!' },
        { id: 4, tanggal: "12-September-2020", isi: "Ullamco eiusmod eu deserunt commodo. Consequat ipsum irure amet eiusmod in veniam aliqua excepteur aliquip velit irure ea. Irure eu in ut est deserunt officia elit adipisicing proident eu exercitation et non enim. Ea ut dolor exercitation incididunt. Qui labore tempor deserunt reprehenderit in exercitation aute officia ad quis consequat consectetur anim. Sit ex amet anim elit mollit veniam cillum voluptate sunt Lorem aute anim.", title: 'Respon customer dengan ramah agar tokomu mendapat rating yang bagus darinya' },
    ]

    const notif = [
        { id: 1, isi: `Halo ${marketName} semoga harimu menyenangkan ya.` },
        { id: 2, isi: "Upgrade toko anda untuk mendapatkan feature dan penawaran menarik lainnya!" },
        { id: 3, isi: "Butuh bantuan?, hubungi JajaCS di menu pengaturan." },
        { id: 4, isi: "Tampaknya tokomu belum punya voucher, buka halaman promosi untuk membuatnya!" },
        { id: 5, isi: "Tidak dapat terhubung, periksa koneksi internet anda!" },
    ]

    const generateCode = (lenght) => {
        try {
            let length = 1;
            var result = '';
            var characters = lenght === 4 ? "1234" : "123";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 279 ~ generateCode ~ error", error)
        }
    };

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(false);
            // setloadsalad(true)
            if (reduxToken) {
                setloadDashboard(true)
                setTimeout(() => {
                    // handleRedux()
                    getItem()
                    firebase();
                    handleDashboard()
                }, 250);
                setTimeout(() => {
                    handleProps()
                }, 750);
                setTimeout(() => {
                    setloadsalad(false)
                    setloadDashboard(false)
                }, 5000);
            } else {
                setloadsalad(false)
                setloadDashboard(false)
            }
            setTimeout(() => {
                handleNotifCard()
            }, 750);

        } catch (error) {
            setloadsalad(false)
            setloadDashboard(false)
        }
    }, []);

    function handleNotifCard() {
        try {
            if (dashboard && Object.keys(dashboard).length) {
                let res = dashboard.jumlah;
                if (res.produk.live == "0") {
                    setnotifText("Produk mu masih kosong, buka kehalaman produk untuk menambahkannya!");
                } else if (res.produk.live == "0" && res.produk.arsipkan !== "0") {
                    setnotifText("Belum ada produkmu yang live, ayo aktifkan sekarang!");
                } else if (res.voucher.aktif == "0") {
                    let result = generateCode(4);
                    setnotifText(notif[parseInt(result) - 1].isi);
                } else {
                    let result = generateCode(3);
                    setnotifText(notif[parseInt(result) - 1].isi);
                }
            } else {
                setnotifText("Belum ada produkmu yang live, ayo login dan tambahkan sekarang!");

            }
        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 288 ~ R ~ error", error)

        }
    }

    const getStatistik = async () => {
        let date = new Date().getDate();
        let id = reduxSeller.id_toko
        // let endDateMonth = new Date(, selectedMonth, 0).getDate();
        let start = "";
        let end = ""
        if (parseInt(date) < 8) {
            start = 1;
            end = 7
        } else {
            start = date;
            end = date - 6
        }
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://jsonx.jaja.id/core/seller/dashboard/statistikbulan?id_toko=${id}&tanggal1=${start}&tanggal2=${end}&bulan=${new Date().getMonth() + 1}&tahun=${new Date().getFullYear()}} `, requestOptions)
            .then(response => response.json())
            .then(result => {
                let arrDateLabels = [1, 2, 3, 4, 5, 6, 7];
                if (result.status == 200) {
                    let dateArr = [];
                    arrDateLabels = []
                    // setTimeout(() => setarrShowDateItem(dateArr), 1000);
                    if (result.data.statistik && result.data.statistik.length) {
                        result.data.statistik.map(item => {
                            dateArr.push(parseInt(item.penjualanHarian))
                        })
                        let length = result.data.statistik.length
                        for (let index = 0; index < length; index++) {
                            arrDateLabels.push(
                                parseInt(start) + parseInt(index)
                            )
                        }
                    } else {
                        for (let index = 0; index < 7; index++) {
                            arrDateLabels.push(
                                parseInt(start) + parseInt(index)
                            )
                        }
                    }

                }
                setarrShowDate(arrDateLabels)

            }).catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
    }

    const getItem = () => {
        try {
            ServiceAccount.getsalad().then(result => {
                if (result.status.code == 200) {
                    setsalad(result.data.saldo_seller.remaining_currency_format)
                    setTimeout(() => setloadsalad(false), 200);
                }
            }).catch(error => {
                setTimeout(() => setloadsalad(false), 200);
                setsalad("Rp -")
            })

        } catch (error) {
            console.log("🚀 ~ file: index.js ~ line 178 ~ onRefresh ~ onRefresh", String(error))
        }
    }

    const firebase = async () => {
        if (reduxToken) {
            try {
                let seller = await getToko();
                let id = seller.uid
                let token = await getTokenDevice();
                database()
                    .ref("/people/" + seller.uid)
                    .once('value')
                    .then(snapshot => {
                        let item = snapshot.val();
                        if (!item || !item.notif) {
                            database().ref(`/people/${seller.uid}/`).set({ name: seller.nama_toko, photo: seller.foto, token: token, notif: { home: 0, chat: 0, orders: 0 } })
                            database().ref(`/friend/${seller.uid}/null`).set({ chat: 'null' })
                        } else {
                            database().ref(`/people/${seller.uid}/`).update({ name: seller.nama_toko, photo: seller.foto, token: token })
                        }
                    });


            } catch (error) {
                // ToastAndroid.show(String(error + "180098"), ToastAndroid.LONG, ToastAndroid.CENTER)
                // firebase()
            }
        }
    }

    const handleDaftar = () => {
        Alert.alert(
            "Syarat dan Ketentuan",
            `\n1. Program Gratis Biaya Pengiriman.
            \n2. Dengan mengikuti program ini, biaya pengiriman toko akan disubsidi oleh Jaja.id.
            \n3. Setiap transaksi atau pembelian yang terjadi di toko yang sudah terdaftar, akan dikenakan potongan sebesar 2% untuk biaya penanganan.
            \n4. Klik tombol AJUKAN untuk mengikuti program ini, kami akan memproses paling lambat 3 X 24 Jam.
            
            `,
            [
                {
                    text: "Nanti",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "AJUKAN", onPress: () => {
                        setLoading(true)
                        var myHeaders = new Headers();
                        myHeaders.append("Cookie", "PopUp=ok; ci_session=bpdeio4e9toefqj7mlveb0l9vk593oco");

                        var requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch(`https://jsonx.jaja.id/core/seller/pengaturan/freeongkir?id_toko=${reduxSeller.id_toko}`, requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                setLoading(false)
                                if (result.status.code == 200) {
                                    setTimeout(() => {
                                        Alert.alert(
                                            "Terimakasih",
                                            "Pengajuan anda sedang kami proses",
                                            [
                                                {
                                                    text: "TUTUP", onPress: () => console.log('Pressed'),
                                                }
                                            ]
                                        )
                                    }, 250);
                                } else {
                                    Utils.handleResponse(result)
                                }

                            })
                            .catch(error => {
                                setLoading(false)
                                Utils.handleError(error, "Program Jaja")
                            });
                    }
                }
            ]
        );
    }

    return (
        <SafeAreaView style={[Style.container, { backgroundColor: Platform.OS === 'android' ? null : Colors.biruJaja }]}>
            {/* {loading ? <Loading /> : null} */}
            <SnackBar messageStyle={{ fontFamily: 'Poppins-SemiBold' }} messageColor="#454545" backgroundColor="#f0e68c" visible={alertSignal} top={0} position="top" textMessage="Tidak dapat terhubung, silahkan periksa kembali koneksi internet anda!" actionHandler={() => { console.log("snackbar button clicked!") }} />
            <StatusBar translucent={false} backgroundColor={sbColor} barStyle="light-content" />
            {loading ? <Loading /> : null}

            <ParallaxScroll
                renderHeader={({ animatedValue }) => <Header reduxToken={reduxToken} marketName={dashboard && Object.keys(dashboard).length ? dashboard.nama_toko : "SELLER CENTER"} navigation={navigation} notif={totalNotif} />}
                headerHeight={Hp('7%')}
                fadeOutParallaxForeground={true}
                fadeOutParallaxBackground={true}
                isHeaderFixed={true}
                parallaxHeight={77}
                isBackgroundScalable={false}
                renderParallaxBackground={({ animatedValue }) => <Background animatedValue={animatedValue} />}
                // renderParallaxForeground={({ animatedValue }) => <Foreground animatedValue={animatedValue} loadDashboard={loadDashboard} iconLeft={dashboard && Object.keys(dashboard).length ? dashboard.jumlah.pengunjung : "0"} dashboard && Object.keys(dashboard).length ? dashboard.jumlah.produk_dilihat : "0"={dashboard && Object.keys(dashboard).length ? dashboard.jumlah.produk_dilihat : "0"} animatedValue={animatedValue} />}
                parallaxBackgroundScrollSpeed={5}
                parallaxForegroundScrollSpeed={2.5}
                headerBackgroundColor='transparent'
                headerFixedBackgroundColor={Colors.biruJaja}
                onHeaderFixed={() => setsbColor(Colors.biruJaja)}
                onChangeHeaderVisibility={() => setsbColor(Colors.biruJaja)}
                contentContainerStyle={{ flex: 0, }}
                style={{ backgroundColor: Colors.whiteGrey }}

            >
                <ScrollView
                    // scrollEnabled={false}
                    contentContainerStyle={{ flex: 0 }}
                    nestedScrollEnabled={true}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <View style={styles.body}>
                        <View style={{ flex: 0, flexDirection: 'column', marginBottom: '1%', }}>
                            {loadDashboard ?
                                <>
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 1, marginBottom: '2%' }}
                                        width={72.75}
                                        height={18}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                   
                                </>
                                :
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate("AccountToko")} style={{ flex: 0, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingRight: '5%', marginRight: '3%', marginBottom: '2%' }}>
                                        <IconButton
                                            style={{ margin: 0, padding: '1%', backgroundColor: 'white' }}
                                            icon={require('../../icon/avatar.png')}
                                            color={Colors.biruJaja}
                                            size={14}
                                        />
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={[Style.font_12, Style.ml_2, { color: Colors.white, width: 151, }]}> {dashboard && Object.keys(dashboard).length ? dashboard.jumlah.pengunjung : "0"} Pengunjung</Text>
                                    </TouchableOpacity>
                                </>
                            }

                        </View>
                        <View style={styles.card}>
                            {loadDashboard ?
                                <View style={styles.cardTop}>
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ height: '60%', width: '100%', alignSelf: 'center', borderRadius: 2, }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                </View>
                                :
                                <View style={[styles.cardTop, { paddingVertical: '1%' }]}>
                                    {notifText === 'login' ?
                                        <TouchableRipple >
                                            <Text onPress={() => navigation.navigate('Login')} numberOfLines={3} style={[Style.font_12, Style.bold, Style.py_2, Style.px_3, { backgroundColor: '#f0e68c' }]}><Text style={[Style.font_14, Style.semi_bold, { color: Colors.biruJaja }]}>Login</Text> dan buka toko secara gratis sekarang!</Text>
                                        </TouchableRipple>
                                        :
                                        <View style={[Style.py, { backgroundColor: Colors.biruJaja, borderRadius: 7 }]}>

                                            <Text numberOfLines={3} style={[Style.font_11, Style.semi_bold, Style.p_2, { color: Colors.white, }]}>{notifText}</Text>
                                        </View>
                                    }
                                </View>
                            }

                            <View style={{ borderBottomWidth: 0.75, borderColor: Colors.biruJaja, width: '94%', alignSelf: 'center' }}></View>
                            <TouchableOpacity style={styles.cardCenter}>
                                <Text style={[Style.font_16]}>Saldo</Text>
                                {loadsalad ?
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={[styles.textCenterBot, { borderRadius: 5 }]}
                                        height={33}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    :
                                    <TouchableWithoutFeedback onPress={() => navigation.navigate(reduxToken ? "Count" : "Login")}>
                                        <Text style={[Style.font_24, { color: Colors.biruJaja }]}>{reduxToken ? salad : 'Rp0'}</Text>
                                    </TouchableWithoutFeedback>

                                }

                            </TouchableOpacity>
                            <View style={{ borderBottomWidth: 0.75, borderColor: Colors.biruJaja, width: '94%', alignSelf: 'center' }}></View>

                            <View style={styles.cardBottom}>
                                {loadDashboard ?
                                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", flexWrap: 'wrap', }}>
                                        <ShimmerPlaceHolder
                                            key={"1"}
                                            LinearGradient={LinearGradient}
                                            style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3, { backgroundColor: 'transparent', shadowColor: 'white' }]} shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            key={"2"}
                                            LinearGradient={LinearGradient}
                                            style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3, { backgroundColor: 'transparent', shadowColor: 'white' }]} shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            key={"3"}
                                            LinearGradient={LinearGradient}
                                            style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3, { backgroundColor: 'transparent', shadowColor: 'white' }]} shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            key={"4"}
                                            LinearGradient={LinearGradient}
                                            style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3, { backgroundColor: 'transparent', shadowColor: 'white' }]} shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <ShimmerPlaceHolder
                                            key={"5"}
                                            LinearGradient={LinearGradient}
                                            style={[styles.cardItem, Style.mr, Style.mb_3, { backgroundColor: 'transparent', shadowColor: 'white' }]} shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                    </View>
                                    :

                                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", flexWrap: 'wrap', }}>
                                        <TouchableOpacity key={"1"} style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3]} onPress={() => navigation.navigate(reduxToken ? "Produk" : 'Login')}><Text adjustsFontSizeToFit style={[Style.font_13]}>Produk Live</Text><Text style={Style.font_13}>{reduxToken ? product.live : '0'}</Text></TouchableOpacity>
                                        <TouchableOpacity key={"2"} style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3]} onPress={() => navigation.navigate(reduxToken ? "Penjualan" : 'Login')}><Text adjustsFontSizeToFit style={[Style.font_13]}>Pesanan Baru</Text><Text style={Style.font_13}>{reduxToken ? order.baru : '0'}</Text></TouchableOpacity>
                                        <TouchableOpacity key={"3"} style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3]} onPress={() => navigation.navigate(reduxToken ? "Penjualan" : 'Login')}><Text adjustsFontSizeToFit style={[Style.font_13]}>Perlu Dikirim</Text><Text style={Style.font_13}>{reduxToken ? order.perlu_dikirim : '0'}</Text></TouchableOpacity>
                                        <TouchableOpacity key={"4"} style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3]} onPress={() => navigation.navigate(reduxToken ? "Penjualan" : 'Login')}><Text adjustsFontSizeToFit style={[Style.font_13]}>Produk Terjual</Text><Text style={Style.font_13}>{reduxToken ? order.selesai : '0'}</Text></TouchableOpacity>
                                        <TouchableOpacity key={"5"} style={[styles.cardItem, Style.px_2, Style.mr, Style.mb_3]} onPress={() => navigation.navigate(reduxToken ? "Promosi" : 'Login')}><Text adjustsFontSizeToFit style={[Style.font_13]}>Voucher Aktif</Text><Text style={Style.font_13}>{reduxToken ? voucher.aktif : '0'}</Text></TouchableOpacity>
                                    </View>
                                }
                                {/* </ScrollView> */}
                            </View>

                        </View>
                        {reduxToken && dashboard && Object.keys(dashboard).length && dashboard.free_ongkir == "T" ?
                            <View style={[styles.cardJaja, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <Text numberOfLines={3} style={[Style.font_13, Style.semi_bold, { width: '75%' }]}>Daftarkan segera toko anda untuk menikmati program free ongkir Jaja.id</Text>
                                <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button onPress={handleDaftar} style={{ borderRadius: 100 }} labelStyle={[Style.font_10, Style.semi_bold, { color: Colors.white }]} mode='contained' color={Colors.biruJaja}>Daftar</Button>
                                </View>
                            </View>
                            : null
                        }

                        <View style={styles.cardJaja}>
                            <Text style={[Style.font_16, Style.semi_bold, { marginBottom: '1%' }]}>Produk Terlaris</Text>
                            {loadDashboard ?
                                <View style={Style.column}>
                                    <View style={[Style.row_center, { paddingVertical: '3%' }]}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ backgroundColor: Colors.blackGrey, borderRadius: 7, marginRight: '2%', height: Wp('11%'), width: Wp('11%') }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <View style={Style.column}>
                                            <ShimmerPlaceHolder
                                                LinearGradient={LinearGradient}
                                                style={{ borderRadius: 2, marginBottom: '1%' }}
                                                width={300}
                                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                            />
                                            <ShimmerPlaceHolder
                                                LinearGradient={LinearGradient}
                                                style={{ borderRadius: 2 }}
                                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                            />
                                        </View>
                                    </View>
                                    <View style={Style.row_center}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={{ backgroundColor: Colors.blackGrey, borderRadius: 7, marginRight: '2%', height: Wp('11%'), width: Wp('11%') }}
                                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                        />
                                        <View style={Style.column}>
                                            <ShimmerPlaceHolder
                                                LinearGradient={LinearGradient}
                                                style={{ borderRadius: 2, marginBottom: '1%' }}
                                                width={300}
                                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                            />
                                            <ShimmerPlaceHolder
                                                LinearGradient={LinearGradient}
                                                style={{ borderRadius: 2 }}
                                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                            />
                                        </View>
                                    </View>
                                </View>
                                :
                                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} showsHorizontalScrollIndicator={false}>
                                    {popular && popular.length ?
                                        popular.map((data, idx) => {
                                            return (
                                                // onPress = {() => navigation.navigate('DetailNotifikasi', { item: notif })}
                                                <View key={String(idx)} style={styles.cardJajaItem}>
                                                    <View style={{ height: Wp('11%'), width: Wp('11%'), backgroundColor: Colors.blackGrey, borderRadius: 7, marginRight: '2%' }}>
                                                        <Image style={{ height: Wp('11%'), width: Wp('11%'), borderRadius: 7 }} source={{ uri: data && data.foto_produk ? data.foto_produk : 'https://picsum.photos/500 ' }} />
                                                    </View>
                                                    <View style={Style.column}>
                                                        <Text numberOfLines={1} style={[Style.font_14, Style.medium]}>{data.nama_produk}</Text>
                                                        <View style={[Style.row_space, { width: '100%' }]}>
                                                            <View style={[Style.row_0_start_center, { width: '37%' }]}>
                                                                <IconButton
                                                                    style={{ margin: 0 }}
                                                                    icon={require('../../icon/cart.png')}
                                                                    color={Colors.biruJaja}
                                                                    size={14}
                                                                />
                                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[Style.font_12, { textAlignVertical: 'center', textAlign: 'center' }]}> {data.terjual}</Text>
                                                            </View>

                                                            <View style={[Style.row_0_start_center, { width: '65%' }]}>
                                                                <IconButton
                                                                    style={{ margin: 0 }}
                                                                    icon={require('../../icon/rupiah.png')}
                                                                    color={Colors.biruJaja}
                                                                    size={14}
                                                                />
                                                                <Text numberOfLines={1} style={Style.font_12}> {data.harga_aktif_currency_format}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                        : <View style={[Style.row_center, Style.p_5, { width: '100%', }]}><Text style={Style.font_14}>Belum ada produk</Text></View>
                                    }
                                </ScrollView>
                            }
                        </View>
                        <View style={styles.cardChart}>
                            <View style={[Style.row_evenly]}>
                                <Text style={[Style.font_16, Style.semi_bold, { flex: 0, width: '50%', textAlignVertical: 'bottom' }]}>Grafik Penjualan</Text>
                                {reduxToken ?
                                    <TouchableOpacity onPress={() => navigation.navigate("Statistik")} style={{ flex: 0, width: '40%' }}>
                                        <Text style={[Style.font_14, Style.italic, { textAlignVertical: 'bottom', color: Colors.biruJaja, textAlign: 'right' }]}>Lihat detail </Text>
                                    </TouchableOpacity>
                                    : <View style={{ flex: 0, width: '40%' }}></View>}
                            </View>
                            <LineChart data={{
                                labels: arrShowDate,
                                datasets: [
                                    {
                                        data: arrShowDateItem
                                    }
                                ]
                            }}
                                width={Number(Wp('95%'))} // from react-native
                                height={220}
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    propsForLabels: {
                                        fontSize: 10,
                                    },
                                    backgroundColor: "red",
                                    backgroundGradientFrom: "#87ddfa",
                                    backgroundGradientTo: "#f7fcff",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: (opacity = 0.9) => `#87ddfa`,
                                    labelColor: (opacity = 1) => `rgba(69, 69, 69, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: Colors.biruJaja
                                    }
                                }}
                                bezier
                                style={{
                                    marginTop: 5,
                                    borderRadius: 0
                                }}
                            />
                        </View>
                        <View style={[styles.cardJaja, { marginBottom: '15%' }]}>
                            <Text style={[Style.font_16, Style.semi_bold]}>Info Jaja</Text>
                            {notifikasi.length === 0 ?
                                <>
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 2, marginBottom: '1%', marginTop: '3%' }}
                                        width={300}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 2 }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 2, marginBottom: '1%', marginTop: '7%' }}
                                        width={300}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 2 }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    /><ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 2, marginBottom: '1%', marginTop: '7%' }}
                                        width={300}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={{ borderRadius: 2 }}
                                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                    />
                                </>
                                :
                                notifikasi.map((notif, index) => {
                                    return (
                                        <TouchableOpacity key={String(index)} style={styles.cardJajaItem} >
                                            <Text style={[Style.font_14]}>{notif.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                        </View>
                    </View>
                </ScrollView>
            </ParallaxScroll >
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 0,
        flexDirection: 'column',
        alignSelf: "center",
        justifyContent: 'flex-start',
        paddingBottom: '20%',
        alignItems: 'flex-start',
    },
    chatIcon: {
        width: 24,
        height: 24,
        marginRight: Wp('1%'),
        tintColor: Colors.white
    },
    storeIcon: {
        width: 22,
        height: 22,
        marginRight: Wp('1%'),
        tintColor: Colors.white

    },
    imageHeader: {
        height: '100%',
        width: '100%',
        tintColor: Colors.biruJaja,
        opacity: 1,
        position: 'absolute',
        bottom: '-100%'
    },
    imageHeader2: {
        height: Hp('30%'),
        width: '100%',
        opacity: 1,
        alignSelf: 'flex-end'
    },
    header: {
        height: Hp('15%'),
        width: '100%',
        backgroundColor: Colors.biruJaja,
        opacity: 1,
        zIndex: 9999
    },
    card: {
        flex: 0,
        flexDirection: 'column',
        borderRadius: 11,
        backgroundColor: '#F5F5F5',
        width: Wp('95%'),
        height: Wp('75%'),
        opacity: 0.8,
        shadowColor: Colors.biruJaja,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    cardCenter: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: '93%',
        alignSelf: 'center',
        paddingVertical: '2%'
    },
    cardBottom: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '3%',
        paddingVertical: '2%',
    },
    cardBottomItem: {
        flex: 1, paddingHorizontal: '2%',
        justifyContent: 'space-between',
    },
    cardTop: {
        flex: 1,
        paddingVertical: '2%',
        width: '93%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    cardItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '40%',
        width: '32%',
        paddingHorizontal: '1%',
        paddingVertical: '1%',
        borderRadius: 3,
        opacity: 1,

        backgroundColor: 'white',
        shadowColor: Colors.biruJaja,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    cardItemValue: {
        fontSize: 14,
        fontWeight: '900',
        padding: '1%',
        color: '#454545'
    },
    cardChart: {
        flex: 0,
        flexDirection: 'column',
        paddingTop: '3%',
        marginTop: '2%',
        width: Wp('95%'),
        backgroundColor: 'white',
        borderRadius: 7,
        shadowColor: Colors.biruJaja,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },

    cardTerlaris: {
        flex: 0,
        flexDirection: 'column',
        padding: '3%',
        marginTop: '2%',
        width: Wp('95%'),
        height: Wp('33%'),
        backgroundColor: 'white',
        shadowColor: "#f5f5f5",
        shadowOpacity: 0.2,
        elevation: 0.5,
        borderRadius: 3
    },
    carItemTerlaris: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        width: 160,
        height: 80,
        paddingHorizontal: '1%',
        paddingVertical: '1%',
        borderRadius: 3,
        borderRightWidth: 3.5,
        borderRightColor: '#F5F5F5',
        opacity: 1,
        backgroundColor: 'white'
    },
    iconTerlaris: {
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',

    },
    cardJaja: {
        flex: 0,
        flexDirection: 'column',
        padding: '3%',
        marginTop: '2%',
        marginBottom: '2%',
        width: Wp('95%'),
        // height: Wp('100%'),
        backgroundColor: 'white',
        borderRadius: 7,
        shadowColor: Colors.biruJaja,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    cardJajaItem: {
        flex: 0,
        flexDirection: 'row',
        width: '100%',
        borderBottomColor: '#F5F5F5',
        borderBottomWidth: 2,
        paddingHorizontal: '0%',
        paddingVertical: '3%'
    },

    countNotif: {
        position: 'absolute', height: 14, width: 14, backgroundColor: Colors.redNotif, right: 0, top: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center'
    },
    textCountNotif: { fontSize: 11 }
})



