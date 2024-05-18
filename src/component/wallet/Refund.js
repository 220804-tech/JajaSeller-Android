import React from 'react'
import { View, Text, SafeAreaView, ScrollView, Platform } from 'react-native'
import { Style, Colors, Wp, Hp } from '../../export'
import { DataTable } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function Income() {
    const reduxRefund = useSelector(state => state.wallet.refund)
    return (
        <SafeAreaView style={[Style.container, { backgroundColor: Platform.OS === 'ios' ? Colors.white : null }]}>
            <DataTable>
                <DataTable.Header>
                    <View style={[Style.column_0_center_start, { width: Wp('40%') }]}>
                        <Text numberOfLines={2} style={Style.font_12}>Deskripsi</Text>
                    </View>
                    <View style={[Style.column_0_center, { width: Wp('30%') }]}>
                        <Text numberOfLines={2} style={Style.font_12}>Nominal</Text>
                    </View>
                    {/* <View style={[Style.column_0_center_end, { width: Wp('22%') }]}>
                            
                        </View> */}

                    <View style={[Style.column_0_center, { flex: 1 }]}>
                        <Text numberOfLines={2} style={[Style.font_12]}>Status</Text>
                    </View>
                </DataTable.Header>
                <ScrollView contentContainerStyle={{ paddingBottom: '40%' }}>
                    {reduxRefund && reduxRefund.length ?
                        reduxRefund.map((item, index) => {
                            return (
                                <DataTable.Row key={index}>
                                    <View style={[Style.column_0_center_start, { width: Wp('40%') }]}>
                                        <Text numberOfLines={2} style={Style.font_13}>{item.description}</Text>
                                        <Text numberOfLines={2} style={[Style.font_10, { color: Colors.blackGrey, fontFamily: 'Poppins-Italic' }]}>{String(item.date).slice(0, 16)}</Text>
                                    </View>
                                    <View style={[Style.column_0_center, { width: Wp('30%') }]}>
                                        <Text numberOfLines={2} style={Style.font_12}>{item.totalCurrencyFormat}</Text>
                                    </View>
                                    <View style={[Style.column_0_center, { flex: 1, }]}>
                                        <Text numberOfLines={2} style={[Style.font_10, { color: item.status == "pending" ? Colors.kuningJaja : item.status == "done" ? Colors.biruJaja : Colors.redNotif }]}>{String(item.status).toLocaleUpperCase()}</Text>
                                    </View>
                                    {/* <DataTable.Cell numeric></DataTable.Cell> */}
                                    {/* <View style={[Style.column_0_center_end, { backgroundColor: 'silver', width: Wp('20%') }]}>

                                    </View> */}
                                </DataTable.Row>
                            )
                        })
                        :
                        <View style={[{ flex: 1, paddingVertical: "15%", justifyContent: 'center', alignItems: 'center', }]}>
                            <Text style={{ color: 'grey', fontSize: 14, fontFamily: 'Poppins-Italic' }}>Kamu belum melakukan transaksi apapun!</Text>
                        </View>
                    }
                </ScrollView>
            </DataTable>
        </SafeAreaView >
    )
}
