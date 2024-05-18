import React, { useState, useEffect, Fragment } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';
import { money } from '../../../utils'
import Loading from '../../../component/loading'
import style from '../../../styles/style';
import { setPriceStock } from '../../../service/Produk'
import { ScrollView } from 'react-native';
export default function index(props) {
    let { data, save, id, handleActionSheet } = props;
    const [state, setstate] = useState(0)
    const [loading, setLoading] = useState(false)
    const [newData, setnewData] = useState(data)


    useEffect(() => {
        if (data) {
            setnewData(data)
        }
    }, [props])

    const handleCountStok = (name, i) => {
        save()
        let array = newData;
        if (name == "plus") {
            setstate(state + 1)
            array[i].stok = String(parseInt(array[i].stok) + 1)
        } else if (name == "minus") {
            setstate(state - 1)
            array[i].stok = array[i].stok < 1 ? "0" : String(parseInt(array[i].stok) - 1)
        }
        setnewData(array)

    };

    const handleChange = (name, i, value) => {
        save()
        setstate(state + 1)
        let array = newData;
        if (name === "stok") {
            array[i].stok = value
        } else if (name === "harga") {
            array[i].harga_normal = value
        }
        setTimeout(() => {
            setnewData(array)
        }, 200);
    }

    const handleSimpan = () => {
        setLoading(true);
        setPriceStock(id, newData).then(res => {
            console.log("🚀 ~ file: index.js ~ line 58 ~ setPriceStock ~ res", res)
            setTimeout(() => {
                if (res.status === 200) {
                    handleActionSheet();
                }
            }, 1000);


        })
        setTimeout(() => setLoading(false), 3000);

    }


    const renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%' }}>
                <Text>{item.ukuran ? item.ukuran : item.warna ? item.warna : item.model ? item.model : "Default"}</Text>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput maxLength={11} style={{ borderBottomWidth: 0.5, borderColor: Warna.biruJaja, width: '55%' }} keyboardType="numeric" onChangeText={text => handleChange("harga", index, text.replace(".", ""))} >
                        {item?.harga_normal}
                    </TextInput>
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '45%' }}>
                        <TouchableOpacity style={{ backgroundColor: Warna.kuningJaja, borderRadius: 100, height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleCountStok("minus", index)}>
                            <Image style={styles.iconPlusMinus} source={require('../../../icon/line.png')} />
                        </TouchableOpacity>
                        <TextInput autoFocus={true} maxLength={5} keyboardType="numeric" style={{ borderBottomWidth: 0.5, borderColor: Warna.biruJaja, width: '30%', textAlign: 'center', marginHorizontal: '2%' }} onChangeText={text => handleChange("stok", index, text)}>
                            {item.stok}
                        </TextInput>
                        <TouchableOpacity style={{ padding: '2%', backgroundColor: Warna.kuningJaja, borderRadius: 100, height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleCountStok("plus", index)}>
                            <Image style={styles.iconPlusMinus} source={require('../../../icon/plus.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 0, marginBottom: '3%' }}>
            {loading ? <Loading /> : null}
            <ScrollView style={{ minHeight: hp('20%'), maxHeight: hp('45%') }} contentContainerStyle={{ flex: 0 }}>
                <FlatList
                    data={newData}
                    extraData={state}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_variasi}
                />
            </ScrollView>
            <Button labelStyle={{ color: Warna.white }} color={Warna.biruJaja} mode="contained" onPress={handleSimpan} style={{ marginTop: '3%' }}>Simpan</Button>
        </View >
    )
}
const styles = StyleSheet.create({
    iconPlusMinus: {
        width: 20,
        height: 20,
        tintColor: Warna.white,
    },
})
