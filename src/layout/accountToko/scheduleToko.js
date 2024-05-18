import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, TouchableNativeFeedback, ToastAndroid, TextInput } from "react-native";
import { Button } from 'react-native-paper';
import { Dropdown } from "react-native-material-dropdown";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from "../../styles/setting";
import { Colors, Loading, Style, Hp } from '../../export'

export default function scheduleToko(props) {
    const [loading, setLoading] = useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [toko, setToko] = useState("")
    const [waktuIndonesia, setwaktuIndonesia] = useState([{ id: "1", value: "WIT" }, { id: "2", value: "WITA" }, { id: "3", value: "WIB" }])
    const [zonaWaktu, setzonaWaktu] = useState("WIB")
    const [startTime, setStartTime] = useState("")
    const [btnSave, setbtnSave] = useState({ name: "SIMPAN", color: Colors.silver })
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

    const [openLayout, setopenLayout] = useState(false);
    const [noteText, setnoteText] = useState("");
    const [endTime, setEndTime] = useState("")
    const [alertnoteText, setalertnoteText] = useState("")
    const [btnSubmit, setbtnSubmit] = useState({ name: "SIMPAN", color: Colors.silver })
    const [notif1, setnotif1] = useState("Atur jadwal libur tokomu bila ingin tutup sewaktu - waktu.")

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

    const handleSubmit = () => {
        if (btnSubmit.name === 'SIMPAN') {
            if (!startTime) {
                setalertTextStartDate("Tanggal mulai tidak boleh kosong")
            } else if (!endTime) {
                setalertTextEndDate("tanggal berakhir boleh kosong!")
            } else if (noteText.length == 0 || !noteText) {
                setalertnoteText("Catatan tidak boleh kosong!")
            } else {
                setLoading(true)
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "ci_session=ib9c1gdmt65a56a15jf6qtitgimaa8qr");

                var raw = JSON.stringify({ "id_toko": toko.id_toko, "data": { "date_from": startTime, "date_to": endTime, "note": noteText } });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://jsonx.jaja.id/core/seller/pengaturan/jadwal_toko/libur", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status.code === 200) {
                            props.handleLoading(false)
                            setTimeout(() => ToastAndroid.show("Jadwal toko berhasil diperbahrui", ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);
                            setTimeout(() => setLoading(false), 3000);
                        } else {
                            ToastAndroid.show("error " + String(result.status.message), ToastAndroid.LONG, ToastAndroid.CENTER)
                            setTimeout(() => setLoading(false), 1000);
                        }
                    })
                    .catch(error => {
                        setTimeout(() => setLoading(false), 1000);
                        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                    });
            }
        } else {
            setLoading(true)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=147grouounmng6t9tuvk3986nn8f9m7n");

            var raw = JSON.stringify({ "id_toko": toko.id_toko, "data": null });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jsonx.jaja.id/core/seller/pengaturan/jadwal_toko/libur", requestOptions)
                .then(response => response.json())
                .then(res => {
                    if (res.status.code === 200) {
                        props.handleLoading(false)
                        setTimeout(() => ToastAndroid.show("Jadwal libur toko berhasil direset", ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);
                        setTimeout(() => setLoading(false), 3000);
                    } else {
                        setTimeout(() => ToastAndroid.show(String(res.status.message), ToastAndroid.LONG, ToastAndroid.CENTER), 500);
                    }
                    setTimeout(() => setLoading(false), 3000);
                })
                .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER), 500);
        }
    }

    const handleConfirm = (name, dateTime) => {
        if (name === "time") {
            let string = dateTime.toString()
            setSave()
            let res = string.slice(16, 21);
            if (selectedDate === 'start') {
                setStartTime(res);
            } else {
                setEndTime(res);
            }
        } else {
            setbtnSubmit({ name: 'SIMPAN', color: Colors.biruJaja })
            let string = JSON.stringify(dateTime);
            if (selectedDate === 'start') {
                setStartTime(string.slice(1, 11));
            } else {
                setEndTime(string.slice(1, 11));
            }
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

                }
            } else {
                setbtnSave({ name: "SIMPAN", color: Colors.silver })
            }
            if (Object.keys(props.data.jadwal_toko.libur_toko).length !== 0 && props.data.jadwal_toko.libur_toko.constructor === Object) {
                setStartTime(props.data.jadwal_toko.libur_toko.date_from)
                setEndTime(props.data.jadwal_toko.libur_toko.date_to)
                setnoteText(props.data.jadwal_toko.libur_toko.note)
                setbtnSubmit({ name: "BUKA SEKARANG", color: Colors.biruJaja })
                let concat = props.data.jadwal_toko.libur_toko.date_from === props.data.jadwal_toko.libur_toko.date_to ? false : true
                setTimeout(() => {
                    if (concat) {
                        setnotif1(`Tokomu akan libur pada tanggal ${props.data.jadwal_toko.libur_toko.date_from} sampai ${props.data.jadwal_toko.libur_toko.date_to}`)

                    } else {
                        setnotif1(`Tokomu akan libur pada tanggal ${props.data.jadwal_toko.libur_toko.date_from}`)
                    }

                }, 100);
            } else {
                setnotif1(`Atur jadwal libur tokomu, bila ingin libur di waktu yang akan datang.`)
                setbtnSubmit({ name: "SIMPAN", color: Colors.silver })
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
        <View style={[styles.card, { padding: '0%', margin: '0%' }]}>
            {loading ? <Loading /> : null}
            <View style={[Style.row_space0, { height: Hp('5.5%'), backgroundColor: Colors.white, elevation: 2 }]}>
                <TouchableOpacity onPress={() => setopenLayout(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={[Style.font_13, { color: openLayout ? Colors.blackgrayScale : Colors.biruJaja }]} >Buka Toko</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setopenLayout(true)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={[Style.font_13, { color: openLayout ? Colors.biruJaja : Colors.blackgrayScale }]} >Libur Toko</Text></TouchableOpacity>
            </View>

            {openLayout ? closeStore() : openStore()}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={openLayout ? "date" : "time"}
                is24Hour={true}
                onConfirm={(text) => handleConfirm(openLayout ? 'date' : 'time', text)}
                onCancel={() => hideDatePicker()} />
        </View>
    )
    function closeStore() {
        return (
            <View style={[Style.column, { padding: '4%' }]}>
                <View style={{ flexDirection: 'column', marginBottom: '5%', backgroundColor: Colors.silver, padding: '2%' }}>
                    <Text style={[Style.font_14, Style.semi_bold]}>Atur jadwal tokomu</Text>
                    <Text style={Style.font_14}>{notif1}</Text>
                </View>
                <Text style={[styles.label, Style.mt_2]}>
                    Mulai Tanggal
                </Text>
                <TouchableOpacity style={styles.flexRow} onPress={() => showDatePicker('start')}>
                    <TextInput
                        editable={false}
                        keyboardType="phone-pad"
                        placeholder="YYYY-MMM-DD"
                        style={styles.inputbox}
                        value={startTime}
                        onChangeText={(text) => onchangeText(text, 'date', 'start')}
                        theme={{
                            colors: {
                                primary: Colors.biruJaja,
                            },
                        }} />
                    <TouchableNativeFeedback onPress={() => showDatePicker('start')}>
                        <Image
                            style={styles.iconCalendar}
                            source={require('../../icon/calendar.png')} />
                    </TouchableNativeFeedback>
                </TouchableOpacity>
                <Text style={[Style.smallTextAlert, { color: 'red' }]}>
                    {alertTextStartDate}
                </Text>
                <Text style={[styles.label, Style.mt_2]}>
                    Berakhir Tanggal
                </Text>
                <TouchableOpacity style={styles.flexRow} onPress={() => showDatePicker('end')}>
                    <TextInput
                        editable={false}
                        placeholder="YYYY-MMM-DD"
                        keyboardType="numeric"
                        style={styles.inputbox}
                        value={endTime}
                        theme={{
                            colors: {
                                primary: Colors.biruJaja,
                            },
                        }} />
                    <TouchableNativeFeedback onPress={() => showDatePicker('end')}>
                        <Image
                            style={styles.iconCalendar}
                            source={require('../../icon/calendar.png')} />
                    </TouchableNativeFeedback>
                </TouchableOpacity>
                <Text style={[Style.smallTextAlert, { color: 'red' }]}>
                    {alertTextEndDate}
                </Text>

                <Text style={[styles.label, Style.mt_2]}>
                    Catatan
                </Text>
                <TextInput
                    // editable={true}
                    textAlignVertical="top"
                    placeholder="Masukkan alasan untuk customer disini..."
                    style={[styles.inputbox, {
                        borderWidth: 1, borderColor: Colors.silver, borderRadius: 4, marginTop: '2%', padding: '2%'
                    }]}
                    multiline={true}
                    onChangeText={text => setnoteText(text)}
                    numberOfLines={3}
                    maxLength={100}
                    value={noteText}
                    theme={{
                        colors: {
                            primary: Colors.biruJaja,
                        }
                    }} />

                <Text style={[Style.smallTextAlert, { color: 'red', flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                    {alertnoteText}
                </Text>
                <Button disabled={btnSubmit.color === Colors.biruJaja ? false : true} onPress={handleSubmit} contentStyle={{ padding: '1%' }} color={btnSubmit.color} mode="contained" labelStyle={{ color: Colors.white }}>
                    {btnSubmit.name}
                </Button>


            </View >
        )
    }

    function openStore() {
        return (
            <View style={[Style.column, { padding: '4%' }]}>
                <View style={{ flexDirection: 'column', marginBottom: '5%', backgroundColor: Colors.silver, padding: '2%' }}>
                    <Text style={[Style.font_14, Style.semi_bold]}>Atur jadwal tokomu</Text>
                    <Text style={Style.font_14}>Tentukan hari dan jam berapa tokomu bisa melayani pembeli.</Text>
                </View>
                <View style={{ flex: 0, flexDirection: 'row', flexWrap: 'wrap', }}>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnSennin ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnSennin ? setbtnSennin(false) : setbtnSennin(true), setSave(); }}>
                        Senin
                    </Button>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnSelasa ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnSelasa ? setbtnSelasa(false) : setbtnSelasa(true), setSave(); }}>
                        Selasa
                    </Button>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnRabu ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnRabu ? setbtnRabu(false) : setbtnRabu(true), setSave(); }}>
                        Rabu
                    </Button>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnKamis ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnKamis ? setbtnKamis(false) : setbtnKamis(true), setSave(); }}>
                        Kamis
                    </Button>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnJumat ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnJumat ? setbtnJumat(false) : setbtnJumat(true), setSave(); }}>
                        Jumat
                    </Button>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnSabtu ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnSabtu ? setbtnSabtu(false) : setbtnSabtu(true), setSave(); }}>
                        Sabtu
                    </Button>
                    <Button style={styles.btn} contentStyle={{ padding: '1%', }} color={btnMinggu ? Colors.biruJaja : Colors.silver} mode="contained" labelStyle={{ color: Colors.white }} onPress={() => { btnMinggu ? setbtnMinggu(false) : setbtnMinggu(true), setSave(); }}>
                        Minggu
                    </Button>
                </View>
                <Text style={[styles.label, { marginTop: '2%' }]}>
                    Jam Buka
                </Text>
                <TouchableOpacity style={styles.flexRow} onPress={() => showDatePicker('start')}>
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
                        }} />
                    <TouchableNativeFeedback onPress={() => showDatePicker('start')}>
                        <Image
                            style={styles.iconCalendar}
                            source={require('../../icon/calendar.png')} />
                    </TouchableNativeFeedback>
                </TouchableOpacity>
                <Text style={[Style.smallTextAlert, { color: 'red' }]}>
                    {alertTextStartDate}
                </Text>
                <Text style={[styles.label, { marginTop: '2%' }]}>
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
                        }} />
                    <TouchableNativeFeedback onPress={() => showDatePicker('end')}>
                        <Image
                            style={styles.iconCalendar}
                            source={require('../../icon/calendar.png')} />
                    </TouchableNativeFeedback>
                </TouchableOpacity>
                <Text style={[Style.smallTextAlert, { color: 'red' }]}>
                    {alertTextEndDate}
                </Text>
                {/* <Dropdown
                    label="Zona Waktu"
                    labelTextStyle={[Style.font_14]}
                    textColor={Colors.silver}
                    labelFontSize="14"
                    data={waktuIndonesia}
                    value={zonaWaktu}
                    onChangeText={value => setzonaWaktu(value)} /> */}
                <Button disabled={btnSave.color === Colors.silver ? true : false} onPress={handleSave} contentStyle={{ padding: '1%', }} color={btnSave.color} mode="contained" labelStyle={{ color: Colors.white }}>
                    {btnSave.name}
                </Button>

            </View>
        )
    }
}
