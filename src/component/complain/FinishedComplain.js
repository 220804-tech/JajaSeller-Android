import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Modal } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Style, Colors, Wp, Hp, } from '../../export'
import VideoPlayer from 'react-native-video-player';
import Swiper from 'react-native-swiper'
import { Button } from 'react-native-paper'

export default function FinishedComplain() {
    const dispatch = useDispatch()
    const complainDetails = useSelector(state => state.complain.complainDetails)
    console.log("🚀 ~ file: FinishedComplain.js ~ line 11 ~ FinishedComplain ~ complainDetails", complainDetails)
    const complainStep = useSelector(state => state.complain.complainStep)
    const orderInvoice = useSelector(state => state.orders.orderInvoice)
    const [modal, setModal] = useState(false)

    const [collapsForm, setCollapsForm] = useState(true)
    const [resiSeller, setResiSeller] = useState('')
    const [checked, setChecked] = useState('');
    const [modalConfirm, setModalConfirm] = useState(false);
    const [alasanTolak, setAlasanTolak] = useState('');
    const [statusBar, setStatusBar] = useState(Colors.biruJaja);

    const newLocal = <View style={[Style.column, Style.p_3, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
        <Text style={[Style.font_13, Style.medium, Style.my, { color: Colors.blackgrayScale }]}>Alasan Komplain</Text>
        <Text numberOfLines={25} style={[Style.font_13, Style.mt]}>{complainDetails.jenis_komplain ? complainDetails.jenis_komplain + ' - ' : ''}{complainDetails.judul_komplain ? complainDetails.judul_komplain + ' - ' : ''}{complainDetails.komplain}</Text>
        <Text style={[Style.font_13, Style.medium, Style.mt_3, Style.mb]}>Bukti komplain</Text>
        <View style={[Style.row]}>
            {!complainDetails.gambar1 && !complainDetails.gambar2 && !complainDetails.gambar3 ?
                <View style={Style.column}>
                    <Text style={[Style.font_13, Style.light]}>- 0 Foto dilampirkan</Text>
                    <Text style={[Style.font_13, Style.light]}>- 0 Video dilampirkan</Text>
                </View>
                : null
            }
            {complainDetails.gambar1 ?
                <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                    <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 18, borderRadius: 4, backgroundColor: Colors.blackGrey }} source={{ uri: complainDetails.gambar1 }} />
                </TouchableOpacity>

                : null
            }
            {complainDetails.gambar2 ?
                <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                    <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 18, borderRadius: 4, backgroundColor: Colors.blackGrey }} source={{ uri: complainDetails.gambar2 }} />
                </TouchableOpacity>
                : null
            }
            {complainDetails.gambar3 ?
                <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={Style.my_2}>
                    <Image style={{ width: Wp('18%'), height: Wp('18%'), marginRight: 18, borderRadius: 4, backgroundColor: Colors.blackGrey }} source={{ uri: complainDetails.gambar3 }} />
                </TouchableOpacity>
                : null
            }
            {complainDetails.video ?
                <TouchableOpacity onPress={() => setModal(true) & setStatusBar(Colors.black)} style={[Style.row_0_center, Style.my_2, { width: Wp('18%'), height: Wp('18%'), backgroundColor: Colors.black, borderRadius: 4 }]}>
                    <Image style={{ width: '35%', height: '35%', tintColor: Colors.white, alignSelf: 'center' }} source={require('../../icon/play.png')} />
                </TouchableOpacity>
                :
                null

            }
        </View>
        <Text style={[Style.font_13, Style.medium, Style.mt_3, Style.mb]}>Produk dikomplain</Text>
        <View style={[Style.row_start_center, { width: '100%' }]}>
            <Image style={{ width: Wp('18%'), height: Wp('18%'), borderRadius: 4, backgroundColor: Colors.blackgrayScale }}
                resizeMethod={"scale"}
                resizeMode="cover"
                source={{ uri: complainDetails.product[0].image }}
            />
            <View style={[Style.column_between_center, { marginTop: '-1%', alignItems: 'flex-start', height: Wp('18%'), width: Wp('82%'), paddingHorizontal: '3%' }]}>
                <View style={Style.column}>
                    <Text numberOfLines={1} style={[Style.font_13, { width: '90%' }]}>{complainDetails.product[0].name}</Text>
                    <Text numberOfLines={1} style={[Style.font_11, Style.light, { marginTop: '-1%' }]}>{complainDetails.product[0].variasi ? complainDetails.product[0].variasi : ""}</Text>
                </View>
                <View style={[Style.row_between_center, { width: '90%' }]}>
                    {complainDetails.totalOtherProduct ?
                        <Text numberOfLines={1} style={[Style.font_13, Style.light]}>{complainDetails.totalOtherProduct ? "+(" + complainDetails.totalOtherProduct + " produk lainnya)" : ""}</Text>
                        : null
                    }
                    <Text numberOfLines={1} style={[Style.font_13]}>{complainDetails.totalPriceCurrencyFormat}</Text>
                </View>
            </View>
        </View>

    </View>

    return (
        <View style={Style.container}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={statusBar}
                barStyle='default'
                showHideTransition="fade"
            />
            {complainDetails && Object.keys(complainDetails).length ?
                <ScrollView
                    style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}

                    contentContainerStyle={Style.pt_2} >
                    <View style={Style.column}>
                        {complainDetails.solusi === 'lengkapi' ?
                            <View style={Style.column}>

                                <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                    <Text style={[Style.font_13]}>Komplain telah selesai, saldo akan masuk ke rekening pembeli bila sudah menambahkan no rekening, paling lambat 3 x 24 Jam.</Text>
                                </View>
                                {newLocal}
                            </View>
                            :
                            complainDetails.solusi === 'refund' ?
                                !complainDetails.alasan_tolak_by_seller ?
                                    <View style={Style.column}>
                                        <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                            <Text style={[Style.font_13]}>Komplain telah selesai, saldo akan masuk ke rekening pembeli bila sudah menambahkan no rekening, paling lambat 3 x 24 Jam</Text>
                                        </View>
                                        {newLocal}
                                    </View>
                                    :
                                    <View style={Style.column}>
                                        <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                            <Text style={[Style.font_13]}>Komplain anda batalkan dengan alasan: {complainDetails.alasan_tolak_by_seller}</Text>
                                        </View>
                                        {newLocal}
                                    </View>
                                : complainDetails.solusi === 'change' ?
                                    !complainDetails.alasan_tolak_by_seller ?
                                        <View style={Style.column}>
                                            {/* <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                <Text style={[Style.font_13]}>Komplain telah selesai</Text>
                                            </View> */}
                                            <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                <Text style={[Style.font_13]}>Nomor resi berhasil ditambahkan, nomor resi anda saat ini: {complainDetails.resi_seller}</Text>
                                            </View>
                                            {newLocal}
                                        </View>
                                        :
                                        <View style={Style.column}>
                                            <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                                <Text style={[Style.font_13]}>Komplain anda batalkan dengan alasan: {complainDetails.alasan_tolak_by_seller}</Text>
                                            </View>
                                            {newLocal}
                                        </View>
                                    :
                                    <View style={Style.column}>
                                        <View style={[Style.column, Style.py_2, Style.px_3, Style.mb_2, Style.medium, { width: '100%', backgroundColor: Colors.white, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                            <Text style={[Style.font_13, Style.medium]}>Komplain anda tolak dengan alasan: <Text style={Style.font_13}>{complainDetails.catatan_solusi}</Text></Text>
                                        </View>
                                        {newLocal}
                                    </View>
                        }
                    </View>
                </ScrollView>
                : null
            }
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(!modal);
                    setStatusBar(Colors.biruJaja)
                }}>
                <View style={{ flex: 1, width: Wp('100%'), height: Hp('100%'), backgroundColor: Colors.black, zIndex: 999 }}>
                    {complainDetails && Object.keys(complainDetails).length ?
                        <Swiper style={styles.wrapper} showsButtons={true}>
                            {complainDetails.gambar1 ?
                                <View style={[Style.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar1 }} />
                                </View> : null
                            }
                            {complainDetails.gambar2 ?
                                <View style={[Style.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar2 }} />
                                </View> : null
                            }
                            {complainDetails.gambar3 ?
                                <View style={[Style.row_center]}>
                                    <Image style={{ width: Wp('100%'), height: Hp('100%'), resizeMode: 'contain' }} source={{ uri: complainDetails.gambar3 }} />
                                </View> : null
                            }
                            {complainDetails.video ?
                                <View style={[Style.row_center]}>
                                    <VideoPlayer
                                        video={{ uri: complainDetails.video }}
                                        resizeMode="cover"
                                        style={{ width: Wp('100%'), height: Hp('100%') }}
                                        disableFullscreen={false}
                                        fullScreenOnLongPress={true}
                                    />
                                </View>
                                : null
                            }
                        </Swiper>
                        : null
                    }
                </View>
            </Modal >
            {/* <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <Button onPress={() => complainDetails.solusi == 'refund' ? setModalRefund('first') : setModalChange('first')} mode="contained" labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]} style={{ width: '49%' }} color={Colors.biruJaja}>
                    Terima
                </Button>
            </View> */}
        </View >
    )
}
