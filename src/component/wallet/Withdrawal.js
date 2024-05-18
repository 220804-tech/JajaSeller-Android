import React from 'react'
import { View, Text, SafeAreaView, ScrollView, Alert, Platform } from 'react-native'
import { Style, Colors, Wp, Hp } from '../../export'
import { DataTable } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function Withdrawal() {
    const reduxWithdrawal = useSelector(state => state.wallet.withdrawal)

    const handleShowDetail = item => {
        console.log("file: Withdrawal.js ~ line 11 ~ Withdrawal ~ item", item.created_at)
        Alert.alert(
            `Detail Pengeluaran`,

            `\n1. Status :  ${item.status == "queued" ? "Menunggu" : item.status == "processed" ? "Diproses" : item.status == "completed" ? "Selesai" : "Gagal"} .                    
            \n2. Rekening : ${item.beneficiary_name} - ${item.beneficiary_account}.
            \n3. Deskripsi : ${item.notes}.
            \n4. Jumlah :  ${item.amount_total_currency_format} .  
            \n5. Waktu Tanggal : ${String(item.created_at).slice(0, 16)}.
            `,
            [
                {
                    text: "Tutup",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ]
        );
    }
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
                    {reduxWithdrawal && reduxWithdrawal.length ?
                        reduxWithdrawal.map((item, index) => {
                            return (
                                <DataTable.Row key={index} onPress={() => handleShowDetail(item)}>
                                    <View style={[Style.column_0_center_start, { width: Wp('40%') }]}>
                                        <Text numberOfLines={2} style={Style.font_13}>{item.notes}</Text>
                                        <Text numberOfLines={2} style={[Style.font_10, { color: Colors.blackGrey, fontFamily: 'Poppins-Italic' }]}>{String(item.created_at).slice(0, 16)}</Text>
                                    </View>
                                    <View style={[Style.column_0_center, { width: Wp('30%') }]}>
                                        <Text numberOfLines={2} style={Style.font_12}>{item.amount_currency_format}</Text>
                                    </View>
                                    <View style={[Style.column_0_center, { flex: 1, }]}>
                                        <Text numberOfLines={2} style={[Style.font_10, { color: item.status == "queued" ? Colors.kuningJaja : item.status == "processed" ? Colors.biruJaja : item.status == "completed" ? Colors.greenLight : Colors.redNotif }]}>{String(item.status == "queued" ? "Menunggu" : item.status == "processed" ? "Diproses" : item.status == "completed" ? "Selesai" : "Gagal").toLocaleUpperCase()}</Text>
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
