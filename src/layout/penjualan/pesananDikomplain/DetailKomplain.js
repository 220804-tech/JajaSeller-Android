import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, ToastAndroid, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native'
import StepIndicator from 'react-native-step-indicator';
import { useSelector, useDispatch } from 'react-redux';
import FinishedComplain from '../../../component/complain/FinishedComplain';
import ProsesComplain from '../../../component/complain/ProsesComplain';
import RequestComplian from '../../../component/complain/RequestComplain';
import ResponseComplain from '../../../component/complain/ResponseComplain';
import WaitingDelivery from '../../../component/complain/WaitingDelivery';
import { Appbar, Colors, Style, Utils, Loading, Wp } from '../../../export';
import firebaseDatabase from '@react-native-firebase/database';

export default function DetailKomplain() {
    const updateComplain = useSelector(state => state.complain.complainUpdate)
    const orderInvoice = useSelector(state => state.orders.orderInvoice)
    const orderUid = useSelector(state => state.orders.orderUid)
    const reaUpdate = useSelector(state => state.dashboard.notifikasi)
    const [refreshing, setRefreshing] = useState(false);

    const seller = useSelector(state => state.user.seller)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [position, setPosition] = useState(0)
    const [currentPosition, setCurrentPosition] = useState(null)
    const [complainStep, setComplainStep] = useState(0)
    const [titleHeader, setTitleHeader] = useState('Detail komplain')
    const [complainDetails, setComplainDetails] = useState('')

    const [tabLabels, setTabLabels] = useState(['Permintaan Komplain'])
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: Colors.redNotif,
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: Colors.biruJaja,
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: Colors.biruJaja,
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: Colors.biruJaja,
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: Colors.redNotif,
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 12,
        currentStepLabelColor: Colors.redNotif,
        labelFontFamily: 'Poppins-Regular',
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getItem()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);

    useEffect(() => {
        try {
            if (updateComplain) {
                getItem()
                setLoading(true)
            }
            if (currentPosition) {
                setTitleHeader('Detail Komplain')
            } else {
                setTitleHeader('Permintaan Komplain')
            }
        } catch (error) {

        }
    }, [updateComplain])
    useEffect(() => {
        firebaseDatabase()
            .ref(`/people/${seller.uid}/notif/orders`)
            .on('value', snapshot => {
                getItem()
                console.log('User data: ', snapshot.val());
            });
    }, [])
    const handleSteps = (step) => {
        dispatch({ type: 'SET_COMPLAIN_STEPS', payload: step })
    }
    const handeCurrencyPosition = (status) => {
        dispatch({ type: 'SET_COMPLAIN_STATUS', payload: status })
    }

    const getItem = () => {
        dispatch({ type: 'SET_COMPLAIN_UPDATE', payload: false })

        console.log("masuk siniiiiiiiiiiiiiiiiiiiii")
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=gtrkoupbvif5d7v2miftk5169juji2ln");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let res = true

        fetch(`https://jsonx.jaja.id/core/seller/order/complainDetailSeller?invoice=${orderInvoice}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                res = false
                setTimeout(() => setLoading(false), (1000));
                if (result.status.code === 200) {
                    if (result.data && Object.keys(result.data[0]).length) {
                        let data = result.data[0];
                        setLoading(false)
                        dispatch({ type: 'SET_COMPLAIN_DETAILS', payload: data })
                        setComplainDetails(data)
                        console.log("101")
                        if (!data.solusi) {
                            setCurrentPosition(0)
                            setComplainStep(1)
                            console.log("111")

                            setTabLabels(['Permintaan Komplain'])
                        } else if (data.solusi == 'refund') {
                            setTabLabels(['Permintaan Komplain', 'Menunggu Pengiriman', 'Perlu Diproses', 'Komplain Selesai'])
                            setComplainStep(4)
                            if (!data.resi_customer) {
                                setCurrentPosition(1)
                                console.log("151")
                            } else if (data.resi_customer && !data.alasan_tolak_by_seller && data.status !== 'completed') {
                                setCurrentPosition(2)
                                console.log("141")
                            } else if (data.alasan_tolak_by_seller && data.resi_seller) {
                                setCurrentPosition(3)
                                console.log("131")

                            } else if (data.status == 'completed') {
                                console.log("121")
                                setCurrentPosition(4)
                            }
                        } else if (data.solusi == 'change') {
                            setTabLabels(['Permintaan Komplain', 'Menunggu Pengiriman', 'Perlu Diproses', 'Komplain Selesai'])
                            setComplainStep(4)
                            if (!data.resi_customer) {
                                console.log("161")
                                setCurrentPosition(1)
                            } else if (data.resi_customer && !data.resi_seller && data.status !== 'completed') {
                                console.log("🚀 ~ file: DetailKomplain.js ~ line 127 ~ getItem ~ data", data)
                                console.log("171")
                                setCurrentPosition(2)
                            } else if (data.resi_seller) {
                                console.log("181")
                                setCurrentPosition(3)
                            } else if (data.status == 'completed') {
                                console.log("191")
                                setCurrentPosition(4)
                            }
                        } else if (data.solusi == 'lengkapi') {
                            setComplainStep(3)
                            console.log("200")
                            setTabLabels(['Permintaan Komplain', 'Perlu Diproses', 'Komplain Selesai'])
                            if (!data.resi_seller) {
                                console.log("201")
                                setCurrentPosition(1)
                            } else if (data.resi_seller && data.status !== 'completed') {
                                console.log("211")
                                setCurrentPosition(2)
                            } else if (data.status == 'completed') {
                                console.log("221")
                                setCurrentPosition(3)
                            }

                        } else if (data.solusi == 'tolak') {
                            console.log("231")
                            setComplainStep(2)
                            setTabLabels(['Permintaan Komplain', 'Komplain Selesai'])
                            if (complainDetails.status === 'completed') {
                                setCurrentPosition(2)
                            } else {
                                setCurrentPosition(1)

                            }
                        }
                        //     setDetails(data)
                        //     setstatusTest(data.status)
                        //     setSolusiTest(data.solusi == "lengkapi" ? 'complete' : data.solusi)
                        //     // refund,change, lengkapi, tolak
                        //     setalasanTolak(data.alasan_tolak_by_seller)
                        //     setResiBuyer(data.resi_customer)
                        //     setResiSeller(data.resi_seller)
                        //     setSolusiTest(data.solusi)
                        //     if (data.solusi) {
                        //         setDisabled(true)
                        //         setChecked(data.solusi == "lengkapi" ? 'complete' : data.solusi)
                        //         console.log("masuk sisni")
                        //     } else {
                        //         setDisabled(false)
                        //     }
                        // }
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12053')
                    }
                }
            })
            .catch(error => {
                res = false
                Utils.handleError(error, "Error with status code : 12054")
            });

        setTimeout(() => {
            if (res) {
                setTimeout(() => {
                    let signal = Utils.checkSignal();
                    if (!signal.connect) {
                        ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                    }
                    setLoading(false)
                }, 5000);
                ToastAndroid.show("Sedang Memuat..", ToastAndroid.CENTER, ToastAndroid.TOP)
            } else {
                setLoading(false)
            }
        }, 7000);
    }

    return (
        <SafeAreaView style={Style.container}>
            <Appbar title={titleHeader} back={true} />
            {loading ? <Loading /> : null}
            <ScrollView
                style={[{ flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            >
                <View style={[Style.column, { flex: 1 }]}>
                    {complainDetails && Object.keys(complainDetails).length && currentPosition !== 0 ?
                        <View style={[{ backgroundColor: Colors.white, justifyContent: 'center', paddingVertical: '3%' }]}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={currentPosition}
                                labels={tabLabels}
                                stepCount={complainStep}
                            />
                        </View>
                        :
                        null
                    }
                    {complainDetails && Object.keys(complainDetails).length ?
                        <View style={{ flex: 1 }}>
                            {/* {complainDetails.solusi === 'tolak' || complainDetails.status === 'completed' && currentPosition !== 0 ?
                                <FinishedComplain />
                                : currentPosition == 0 ?
                                    <RequestComplian />
                                    : currentPosition == 2 ?
                                        <ProsesComplain /> : <WaitingDelivery />} */}
                            {console.log("🚀 ~ file: DetailKomplain.js ~ line 272 ~ currentPosition", currentPosition)}
                            {currentPosition === 0 ? <RequestComplian />
                                : currentPosition === 1 && complainDetails.solusi !== 'tolak' ? <WaitingDelivery /> : currentPosition === 2 && complainDetails.solusi !== 'lengkapi' && complainDetails.solusi !== 'tolak' ? <ProsesComplain />
                                    : <FinishedComplain />
                            }
                        </View>
                        : null}
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}
