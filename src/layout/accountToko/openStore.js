import React, { useState, useEffect, createRef } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, ToastAndroid, TextInput } from "react-native";
import { Button } from 'react-native-paper';
import { Dropdown } from "react-native-material-dropdown";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Colors, Loading, Style } from '../../export'
export default function openStore(props) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [toko, setToko] = useState("")
    const [waktuIndonesia, setwaktuIndonesia] = useState([{ id: "1", value: "WIT" }, { id: "2", value: "WITA" }, { id: "3", value: "WIB" }])
    const [zonaWaktu, setzonaWaktu] = useState("WIB")
    const [loading, setLoading] = useState(false);

    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("23:59")
    const [btnSave, setbtnSave] = useState({
        name: "SIMPAN",
        color: Colors.silver
    })

    const [btnSennin, setbtnSennin] = useState(false)
    const [btnSelasa, setbtnSelasa] = useState(false)
    const [btnRabu, setbtnRabu] = useState(false)
    const [btnKamis, setbtnKamis] = useState(false)
    const [btnJumat, setbtnJumat] = useState(false)
    const [btnSabtu, setbtnSabtu] = useState(false)
    const [btnMinggu, setbtnMinggu] = useState(false)
    const [alertTextStartDate, setalertTextStartDate] = useState(false)
    const [alertTextEndDate, setalertTextEndDate] = useState(false)

    const [selectedDate, setselectedDate] = useState('start');

    const showDatePicker = (text) => {
        if (text === 'end') {
            setselectedDate('end');
            setalertTextEndDate("")
        } else {
            setselectedDate('start');
            setalertTextStartDate("")
        }
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSave()
        let string = date.toString()
        let res = string.slice(16, 21);
        if (selectedDate === 'start') {
            setStartTime(res);
        } else {

            setEndTime(res);

        }
        hideDatePicker();
    };

    useEffect(() => {
        if (props.data) {
            setToko(props.data)
            if (Object.keys(props.data.jadwal_toko.buka_toko).length !== 0 && props.data.jadwal_toko.buka_toko.constructor === Object) {
                try {
                    setbtnSave({ name: "RESET", color: Colors.kuningJaja })
                    getItem(props.data.jadwal_toko.buka_toko)
                } catch (error) {
                    // ToastAndroid.show("Ada kesalahan teknis", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    // props.handleLoading(false)
                }
            } else {
                setbtnSave({ name: "SIMPAN", color: Colors.silver })

            }
        }
    }, [props])

    const getItem = (data) => {
        let schedule = data.days.split(",")
        setbtnSave({ name: "RESET", color: Colors.kuningJaja })
        schedule.forEach(element => {
            if (element === "monday") {
                setbtnSennin(true)
            } else if (element === "tuesday") {
                setbtnSelasa(true)
            } else if (element === "wednesday") {
                setbtnRabu(true)
            } else if (element === "thursday") {
                setbtnKamis(true)
            } else if (element === "friday") {
                setbtnJumat(true)
            } else if (element === "saturday") {
                setbtnSabtu(true)
            } else if (element === "sunday") {
                setbtnMinggu(true)
            }
        });

    }

    const setSave = () => setbtnSave({ name: "SIMPAN", color: Colors.biruJaja })
    const setReset = () => setbtnSave({ name: "RESET", color: Colors.kuningJaja })

    const handleSave = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=b60kv1jpuu6f1dp1sp85k39hqcv3al40");
        let days = ""
        btnSennin ? days += "monday," : null
        btnSelasa ? days += "tuesday," : null
        btnRabu ? days += "wednesday," : null
        btnKamis ? days += "thursday," : null
        btnJumat ? days += "friday," : null
        btnSabtu ? days += "saturday," : null
        btnMinggu ? days += "sunday," : null
        if (btnSave.name === "SIMPAN" && endTime !== "" && days !== "") {
            let raw = JSON.stringify({ "id_toko": toko.id_toko, "data": { "days": days.substring(0, days.length - 1), "time_open": startTime, "time_close": endTime, "time_zone": zonaWaktu.toLocaleLowerCase() } });
            if (startTime !== "" && endTime === "") {
                setalertTextEndDate("Jam tutup toko tidak boleh kosong!")
                ToastAndroid.show("Jam tutup toko tidak boleh kosong!", ToastAndroid.SHORT, ToastAndroid.CENTER)
            } else if (endTime !== "" && days === "") {
                ToastAndroid.show("Silahkan pilih hari terlebih dahulu", ToastAndroid.SHORT, ToastAndroid.CENTER)
            } else if (startTime == endTime && startTime !== "") {
                setalertTextEndDate("Jam tutup toko tidak boleh sama dengan jam buka toko!")
                ToastAndroid.show("Jam tutup toko tidak boleh sama dengan jam buka toko!", ToastAndroid.SHORT, ToastAndroid.CENTER)
            } else {
                setLoading(true)
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch("https://jsonx.jaja.id/core/seller/pengaturan/jadwal_toko/buka", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status.code === 200) {
                            props.handleLoading(false)
                            setReset()
                            setTimeout(() => ToastAndroid.show("Jadwal toko berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);
                            setTimeout(() => setLoading(false), 3000);
                        } else {
                            props.handleLoading(false)
                            setLoading(false)
                            setTimeout(() => ToastAndroid.show(result.status.message, ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);
                        }
                    })
                    .catch(error => {
                        setLoading(false)
                        ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER)
                    });
            }
        } else {
            setLoading(true)
            let raw = JSON.stringify({ "id_toko": toko.id_toko, "data": null });
            var req = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/pengaturan/jadwal_toko/buka", req)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code == 200) {
                        props.handleLoading(false)
                        setSave()
                        setTimeout(() => ToastAndroid.show("Jadwal toko berhasil direset", ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);
                        setTimeout(() => setLoading(false), 3000);
                    } else {
                        setLoading(false)
                        ToastAndroid.show(result.status.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                    }
                })
                .catch(error => {
                    setLoading(false)
                    ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER)
                });
        }
    }

    return (
        <View style={styles.body}>
            {loading ? <Loading /> : null}
            <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', }}>
                <View style={{ flexDirection: 'column', marginBottom: '5%', backgroundColor: Colors.silver, padding: '2%' }}>
                    <Text style={[Style.font_14, Style.semi_bold]}>Atur jadwal tokomu</Text>
                    <Text style={Style.font_14}>Tentukan hari dan jam berapa tokomu bisa melayani pembeli</Text>
                </View>
                <Button style={styles.btn} contentStyle={Style.p} color={btnSennin ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnSennin ? setbtnSennin(false) : setbtnSennin(true), setSave() }}>
                    Senin
                </Button>
                <Button style={styles.btn} contentStyle={Style.p} color={btnSelasa ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnSelasa ? setbtnSelasa(false) : setbtnSelasa(true), setSave() }}>
                    Selasa
                </Button>
                <Button style={styles.btn} contentStyle={Style.p} color={btnRabu ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnRabu ? setbtnRabu(false) : setbtnRabu(true), setSave() }}>
                    Rabu
                </Button>
                <Button style={styles.btn} contentStyle={Style.p} color={btnKamis ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnKamis ? setbtnKamis(false) : setbtnKamis(true), setSave() }}>
                    Kamis
                </Button>
                <Button style={styles.btn} contentStyle={Style.p} color={btnJumat ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnJumat ? setbtnJumat(false) : setbtnJumat(true), setSave() }}>
                    Jumat
                </Button>
                <Button style={styles.btn} contentStyle={Style.p} color={btnSabtu ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnSabtu ? setbtnSabtu(false) : setbtnSabtu(true), setSave() }}>
                    Sabtu
                </Button>
                <Button style={styles.btn} contentStyle={Style.p} color={btnMinggu ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnMinggu ? setbtnMinggu(false) : setbtnMinggu(true), setSave() }}>
                    Minggu
                </Button>
            </View>
            <Text style={styles.label}>
                Jam Buka
            </Text>
            <TouchableOpacity style={[Style.row_0, { borderBottomWidth: 0.2 }]} onPress={() => showDatePicker('start')}>
                <TextInput
                    editable={false}
                    keyboardType="phone-pad"
                    placeholder="00-00"
                    style={styles.inputbox}
                    value={startTime}
                    onChangeText={(text) => onchangeText(text, 'date', 'start')}
                    theme={{
                        colors: {
                            primary: Colors.biruJaja,
                        },
                    }}
                />
                <TouchableNativeFeedback onPress={() => showDatePicker('start')}>
                    <Image
                        style={styles.iconCalendar}
                        source={require('../../icon/calendar.png')}
                    />
                </TouchableNativeFeedback>
            </TouchableOpacity>
            <Text style={[Style.smallTextAlert, { color: 'red' }]}>
                {alertTextStartDate}
            </Text>
            <Text style={styles.label}>
                Jam Tutup
            </Text>
            <TouchableOpacity style={styles.flexRow} onPress={() => showDatePicker('end')}>
                <TextInput
                    editable={false}
                    keyboardType="numeric"
                    placeholder={endTime === "" ? "00:00" : endTime}
                    style={styles.inputbox}
                    value={endTime}
                    theme={{
                        colors: {
                            primary: Colors.biruJaja,
                        },
                    }}
                />
                <TouchableNativeFeedback onPress={() => showDatePicker('end')}>
                    <Image
                        style={styles.iconCalendar}
                        source={require('../../icon/calendar.png')}
                    />
                </TouchableNativeFeedback>
            </TouchableOpacity>
            <Text style={[Style.smallTextAlert, { color: 'red' }]}>
                {alertTextEndDate}
            </Text>
            <Dropdown
                label="Zona Waktu"
                labelTextStyle={[Style.font_14, { color: Colors.kuningJaja }]}
                textColor={Colors.biruJaja}
                labelFontSize="14"
                data={waktuIndonesia}
                value={zonaWaktu}
                onChangeText={value => setzonaWaktu(value)}
            />
            <Button disabled={btnSave.color === Colors.silver ? true : false} onPress={handleSave} contentStyle={{ padding: '1%', }} color={btnSave.color} mode="contained" labelStyle={{ color: Colors.white }}>
                {btnSave.name}
            </Button>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                is24Hour={true}
                onConfirm={(text) => handleConfirm(text)}
                onCancel={() => hideDatePicker()}
            />
        </View >
    )
}
const styles = StyleSheet.create({
    body: { flex: 1, flexDirection: 'column', padding: '4%', },
    btn: { marginRight: '3%', marginBottom: '3%' },
    iconCalendar: {
        position: 'absolute',
        tintColor: Colors.biruJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
        borderBottomWidth: 0.2
    },

});
