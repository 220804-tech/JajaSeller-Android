import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, Platform, Share } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
import { IconButton, Switch, TouchableRipple } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import { Wp, Hp, Style, Colors, useNavigation, ServiceProduct } from '../../export'
import dynamicLinks from '@react-native-firebase/dynamic-links';



export default function ActionSheet({ isEnabled, setIsEnabled, productOnpress, actionSheetRef, actionSheetGambar, actionSheetDiskon, actionSheetListVariasi, setTitleAlert, setonClose, setspinner, setproductOnpress, setitemPressed }) {
    const navigation = useNavigation()
    const [alertStatus, setAlertStatus] = useState(false);
    const reduxSeller = useSelector(state => state.user.seller.id_toko)

    const [link, setlink] = useState('')
    console.log('state. dynamicc linkkk', link)


    const dispatch = useDispatch()

    const toggleSwitch = (e) => {
        setonClose(false)
        setIsEnabled((previousState) => !previousState);
        setAlertStatus(true);
    };


    const handleFetchProduct = async () => {
        setspinner(false)
        setitemPressed("")
        setproductOnpress({})
        try {
            let allProduct = await ServiceProduct.fetchAllProduct(reduxSeller)
            if (allProduct) {
                dispatch({ type: 'SET_PRODUCTS', payload: allProduct })
                dispatch({ type: 'FETCH_PRODUCTS', payload: false })
            }
        } catch (error) {
            console.log("file: index.js ~ line 1001 ~ handleFetchProduct ~ error", error)
        }
    }


    const handleEditProduk = () => {
        if (productOnpress.status === "diblokir") {
            handleRevisi()
        } else {
            actionSheetRef.current?.setModalVisible(false);
            setTimeout(() => {
                navigation.navigate('ProdukEdit', {
                    item: productOnpress,
                });
            }, 150);
        }
    };

    const handleDelete = () => {
        if (productOnpress.id_produk !== 0) {
            Alert.alert(
                'Hapus!',
                'Anda ingin menghapus produk ini?',
                [
                    {
                        text: 'BATAL',
                        onPress: () => setitemPressed(''),
                        style: 'cancel',
                    },
                    {
                        text: 'YA',
                        onPress: () => {
                            setspinner(true);
                            ServiceProduct.deleteProduct(productOnpress.id_produk).then((res) => {
                                if (res.status === 200) {
                                    handleFetchProduct()
                                    dispatch({ type: 'FETCH_LIVE', payload: true })
                                    dispatch({ type: 'FETCH_ARCHIVE', payload: true })
                                    dispatch({ type: 'FETCH_SOLDOUT', payload: true })
                                    dispatch({ type: 'FETCH_BLOCKED', payload: true })
                                }
                            }).catch(error => console.log(String(error)));
                            actionSheetRef.current?.setModalVisible(false);

                            setTimeout(() => setspinner(false), 3000);


                        },
                    },
                ],
                { cancelable: false },
            );
        }
    };

    const handleRevisi = async (data) => {
        await actionSheetRef.current?.setModalVisible(false);
        navigation.navigate('ProdukEdit', {
            item: data ? data : productOnpress,
            revisi: true,
            revisiName: data.konfirmasi_produk[0].pelanggaran.split(","),
            alasan: data.konfirmasi_produk[0].alasan,
        });
    }


    const handleActionSheet = (e) => {
        setTitleAlert(e + productOnpress.nama_produk);
        actionSheetRef.current?.setModalVisible(false);
        if (e === 'gambar ') {
            setTimeout(() => {
                actionSheetGambar.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'listvariasi') {
            setTimeout(() => {
                actionSheetListVariasi.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'diskon') {
            setTimeout(() => {
                actionSheetDiskon.current?.setModalVisible(true);
            }, 600);
        } else if (e === 'preview') {
            setTimeout(() => { navigation.navigate('ProdukPreview') }, 200);
        }
    };

    const handleStatusProduk = async () => {
        setAlertStatus(false);
        setspinner(true);
        actionSheetRef.current?.setModalVisible(false);
        setTimeout(() => {
            setitemPressed(productOnpress.id_produk)
        }, 155);

        setTimeout(() => {
            ServiceProduct.updateStatusProduct(productOnpress.id_produk, productOnpress.status_produk === "live" ? 2 : productOnpress.status_produk === "arsipkan" ? 1 : null)
                .then((res) => {
                    if (res.status === 200) {
                        handleFetchProduct();
                        dispatch({ type: 'FETCH_LIVE', payload: true })
                        dispatch({ type: 'FETCH_ARCHIVE', payload: true })
                    }
                })
        }, 500);
        setTimeout(() => setspinner(false), 2000);
    };

    const onShare = async () => {
        console.log('on shareee', link)
        try {
            const result = await Share.share({
                message: `Dapatkan ${productOnpress.nama_produk} di Jaja.id \nDownload sekarang ${link}`,

            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }




    const dynamicLink = async () => {

        try {
            const link_URL = await dynamicLinks().buildShortLink({
                link: `https://jajaid.page.link/product?slug=${productOnpress.slug_produk}`,
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
        if (productOnpress?.slug_produk) {
            dynamicLink()
        }
    }, [productOnpress?.slug_produk])

    return (
        <View style={[Style.column, { height: Hp('45%'), paddingHorizontal: Platform.OS === 'android' ? '4%' : '2%', paddingVertical: Platform.OS === 'android' ? '2%' : '4%' }]}>
            <View style={[Style.row_between_center, Style.mb_5]}>
                <Text adjustsFontSizeToFit style={[Platform.OS === 'android' ? Style.font_16 : Style.font_18, Style.semi_bold]}>Informasi Produk</Text>
                <IconButton
                    style={{ margin: 0 }}
                    icon={require('../../icon/close.png')}
                    color={Colors.biruJaja}
                    size={18}
                    onPress={() => actionSheetRef.current?.setModalVisible(false)}
                />
            </View>
            {productOnpress.status_produk === "live" || productOnpress.status_produk === "arsipkan" ?
                <View style={[Style.row_between_center, Style.mb, Style.p_3, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, }]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Platform.OS === 'ios' ? Style.icon_30 : Style.icon_23, Style.mr_5, { tintColor: Colors.redPower }]}
                            source={require('../../icon/power-button.png')}
                        />
                        <Text adjustsFontSizeToFit style={[Platform.OS === 'android' ? Style.font_14 : Style.font_16, Style.medium]}>Status Produk</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                        <Text style={[Style.font_13, Style.mr_5, { textAlign: 'right' }]}>
                            {isEnabled ? 'Aktif' : 'Tidak Aktif'}
                        </Text>
                        <Switch
                            trackColor={{ false: Colors.light, true: Colors.light }}
                            thumbColor={isEnabled ? Colors.biruJaja : '#f4f3f4'}
                            ios_backgroundColor={Colors.light}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>
                : null
            }

            <TouchableRipple style={[Style.mb, Style.p_3, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, }]} onPress={onShare}>
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Style.mr_5, { width: Platform.OS === 'ios' ? 30 : 23, height: Platform.OS === 'ios' ? 30 : 23, tintColor: Colors.biruJaja }]}
                            source={require('../../icon/share.png')}
                        />
                        <Text adjustsFontSizeToFit style={[Platform.OS === 'android' ? Style.font_14 : Style.font_16, Style.medium]}>Share Produk</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple>


            <TouchableRipple style={[Style.mb, Style.p_3, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, }]} onPress={() => {
                actionSheetRef.current?.setModalVisible(false)
                setTimeout(() => navigation.navigate("ProdukPreview", { data: productOnpress }), 200);
            }} >
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Platform.OS === 'ios' ? Style.icon_30 : Style.icon_23, Style.mr_5, { tintColor: Colors.biruJaja }]}
                            source={require('../../icon/eye-visible.png')}
                        />
                        <Text adjustsFontSizeToFit style={[Platform.OS === 'android' ? Style.font_14 : Style.font_16, Style.medium]}>Lihat Preview</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple>
            <TouchableRipple style={[Style.mb, Style.p_3, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, }]} onPress={() => {
                handleActionSheet('listvariasi')
            }}>
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Style.mr_5, { width: Platform.OS === 'ios' ? 30 : 23, height: Platform.OS === 'ios' ? 30 : 23 }]}
                            source={require('../../icon/specification.png')}
                        />
                        <Text adjustsFontSizeToFit style={[Platform.OS === 'android' ? Style.font_14 : Style.font_16, Style.medium]}>Variasi Product</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple>



            {productOnpress.status_produk === "menunggu konfirmasi" ?
                null :
                <TouchableRipple style={[Style.mb, Style.p_3, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, }]}
                    onPress={() => productOnpress.status_produk !== "blokir" ? handleEditProduk() : handleRevisi(productOnpress)}>
                    <View style={[Style.row_between_center]}>
                        <View style={[Style.row_0_start_center]}>
                            <Image
                                style={[Style.mr_5, { width: Platform.OS === 'ios' ? 30 : 23, height: Platform.OS === 'ios' ? 30 : 23 }]}
                                source={require('../../icon/setting.png')}
                            />
                            <Text style={[Platform.OS === 'android' ? Style.font_14 : Style.font_16, Style.medium, Style.ml_5]}>Edit</Text>
                        </View>
                        <View style={Style.row_0_end_center}>
                        </View>
                    </View>
                </TouchableRipple>
            }

            <TouchableRipple style={[Style.mb, Style.p_3, { borderBottomWidth: 0.2, borderBottomColor: Colors.silver, }]} onPress={handleDelete}>
                <View style={[Style.row_between_center]}>
                    <View style={[Style.row_0_start_center]}>
                        <Image
                            style={[Style.mr_5, { width: Platform.OS === 'ios' ? 30 : 23, height: Platform.OS === 'ios' ? 30 : 23, tintColor: Colors.redPower }]}
                            source={require('../../icon/delete.png')}
                        />
                        <Text adjustsFontSizeToFit style={[Platform.OS === 'android' ? Style.font_14 : Style.font_16, Style.medium]}>Hapus</Text>
                    </View>
                    <View style={Style.row_0_end_center}>
                    </View>
                </View>
            </TouchableRipple>

            {/* <TouchableOpacity
                style={styles.modalLine}
                onPress={handleDelete}>
                <Image
                    style={[styles.iconModal, { tintColor: Colors.red }]}
                    source={require('../../icon/.png')}
                />
                <Text adjustsFontSizeToFit style={[Platform.OS==='android'?Style.font316:Style.font_16, Style.medium]}>Hapus</Text>
            </TouchableOpacity> */}
            <AwesomeAlert
                alertContainerStyle={styles.alertContainerStyle}
                overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
                show={alertStatus}
                showProgress={false}
                // title="Hallo seller"
                message={productOnpress.status_produk === "live" ? "Anda ingin menonaktifkan produk?" : "Anda ingin mengaktifkan produk?"}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Tidak"
                confirmText={productOnpress.status_produk === "live" ? "Nonaktifkan" : "Aktifkan"}
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setonClose(true)
                    setAlertStatus(false);
                    setIsEnabled(productOnpress.status_produk === "live" ? true : false);
                }}
                onConfirmPressed={() => handleStatusProduk()}
            />
        </View>

    )
}
