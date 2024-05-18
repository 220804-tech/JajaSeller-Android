import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ToastAndroid, ScrollView } from 'react-native'
import style from '../../styles/style'
import Navbar from '../../component/navbar'
import { Dropdown } from "react-native-material-dropdown";
import Warna from '../../config/Warna';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LineChart } from "react-native-chart-kit";
import { StyleSheet } from 'react-native';
import { getIdToko } from '../../service/Storage';

export default function Statistik() {
    // const [year, setyear] = useState("")
    const [month, setmonth] = useState("")
    // const [monthId, setmonthId] = useState(new Date().getMonth() + 1)

    const [date, setDate] = useState("")

    const [listYear, setListYear] = useState([{ id: "1", value: "2020" }, { id: "2", value: "2021" }, { id: "3", value: "2022" }]);
    const [listMonth, setListMonth] = useState([{ id: "1", value: "Januari" }, { id: "2", value: "Februari" }, { id: "3", value: "Maret" }, { id: "4", value: "April" }, { id: "5", value: "Mei" }, { id: "6", value: "Juni" }, { id: "7", value: "Juli" }, { id: "8", value: "Agustus" }, { id: "9", value: "September" }, { id: "10", value: "Oktober" }, { id: "11", value: "November" }, { id: "12", value: "Desember" }]);
    const [listDate, setListDate] = useState([{ value: "1 - 7" }, { value: "8 - 14" }, { value: "15 - 21" }, { value: "22 - 28" }])

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [defaultYear, setdefaultYear] = useState(new Date().getFullYear())

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

    const [arrShowDate, setarrShowDate] = useState(["1", "2", "4", "5", "6", "7"])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState("")
    const [selectedDate, setSelectedDate] = useState("1 - 7")

    const [dataYear, setDataYear] = useState("")
    const [dataMonth, setDataMonth] = useState("")
    const [arrShowDateItem, setarrShowDateItem] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [arrShowYearItem, setArrShowYearItem] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])


    useEffect(() => {

        getDataYear(null)
        handleShowMonth()
        handleShowDate()

    }, [])

    const getDataYear = async (year) => {
        let id = await getIdToko()
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://jsonx.jaja.id/core/seller/dashboard/statistiktahun?id_toko=${id}&tahun=${year ? year : selectedYear}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: index.js ~ line 55 ~ getDataYear ~ result", result.data)
                setDataYear(result.data)
                let arrYearItem = []
                let arrYear = []

                if (result.status == 200) {
                    let yearRange = parseInt(defaultYear) - parseInt(result.data.date_buka_toko.slice(0, 4))
                    for (let index = 0; index < yearRange + 2; index++) {
                        arrYear.push({ "id": index + 1, 'value': defaultYear - index })
                    }

                    for (let [key, value] of Object.entries(result.data.statistik[0])) {
                        arrYearItem.push(parseInt(value))
                    }
                    setArrShowYearItem(arrYearItem)
                    console.log("🚀 ~ file: index.js ~ line 777 ~ setTimeout ~ arrYearItem", arrYearItem)
                    setListYear(arrYear)
                    // setListMonth(arrYearLabels)
                }
            }).catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
    }

    const getDataMonth = async (start, end, idMonth, idYear) => {
        let id = await getIdToko()
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://jsonx.jaja.id/core/seller/dashboard/statistikbulan?id_toko=${id}&tanggal1=${start}&tanggal2=${end}&bulan=${idMonth ? idMonth : selectedMonth}&tahun=${idYear ? idYear : selectedYear}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                let arrDateLabels = [1, 2, 3, 4, 5, 6, 7];
                if (result.status == 200) {
                    let arrDate = [{ "value": "" }, { "value": '1 - 7' }, { "value": '8 - 14' }, { "value": '15 - 21' }, { "value": `22 - ${result.data.jumlah_tanggal}` }]
                    let dateArr = [];
                    arrDateLabels = []
                    setDataMonth(result.data);
                    result.data.statistik.map(item => {
                        dateArr.push(parseInt(item.penjualanHarian))
                    })
                    let length = result.data.statistik.length
                    for (let index = 0; index < length; index++) {
                        arrDateLabels.push(
                            parseInt(start) + parseInt(index)
                        )

                    }
                    setListDate(arrDate)
                    setTimeout(() => setarrShowDateItem(dateArr), 1000);

                }
                setarrShowDate(arrDateLabels)

            }).catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));

    }

    const handleFetchStatistik = (name, value) => {
        if (name === "date") {
            if (value === "1 - 7") {
                setSelectedDate(value)
                getDataMonth(1, 7, null, null)
                setStartDate(1)
                setEndDate(7)
            } else if (value === "8 - 14") {
                setSelectedDate(value)
                getDataMonth(8, 14, null, null)
                setStartDate(8)
                setEndDate(15)
            } else if (value === "15 - 21") {
                setSelectedDate(value)
                getDataMonth(15, 21, null, null)
                setStartDate(16)
                setEndDate(21)
            } else if (value !== "") {
                setSelectedDate(value)
                getDataMonth(22, parseInt(value.slice(value.length - 2, value.length)), null, null)
                setStartDate(22)
                setEndDate(value.slice(value.length - 2, value.length))
            }
        } else if (name === "month") {
            listMonth.map(item => {
                if (item.value == value) {
                    setmonth(item.value)
                    setSelectedMonth(item.id)
                    getDataMonth(startDate, endDate, item.id, null)
                }
            })
        } else if (name === "year") {
            console.log("🚀 ~ file: index.js ~ line 147 ~ handleFetchStatistik ~ name", name)
            getDataYear(value)
            getDataMonth(startDate, endDate, selectedMonth, value)
            setSelectedYear(value)
        }

    }

    const handleShowMonth = () => {
        let dateNow = new Date().getDate();
        listMonth.map(item => {
            if (item.id == selectedMonth) {
                setmonth(item.value)
            }
        })
        let endDateMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        let round7 = handleRound(dateNow)
        if (round7 >= 28) {
            setStartDate("22")
            setEndDate(endDateMonth)
            setSelectedDate(`${"22" + " - " + endDateMonth}`)
            getDataMonth("22", endDateMonth, null, null)

        } else {
            setStartDate(round7 - 6)
            setEndDate(round7)
            setSelectedDate(`${round7 - 6 + " - " + round7}`)
            getDataMonth(round7 - 6, round7, null, null)
        }
    }

    const handleRound = (num) => {
        return Math.ceil(parseInt(num) / 7) * 7;
    }

    const handleShowDate = () => {

    }

    return (
        <SafeAreaView style={style.container}>
            <Navbar back={true} title="Detail Statistik" />
            <ScrollView contentContainerStyle={{ flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: '4%', backgroundColor: 'white', paddingVertical: '2%' }}>
                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Italic', color: Warna.blackgrayScale, marginBottom: "5%", alignSelf: 'flex-start' }}>*Data statistik telah disesuaikan pada tahun dan bulan :</Text>
                <View style={[style.row_space0, { marginBottom: '5%' }]}>
                    <Dropdown
                        animationDuration={0}
                        label="Bulan"
                        labelTextStyle={{ color: Warna.blackgrayScale }}
                        itemPadding={2}
                        dropdownOffset={{ top: 20, left: 0 }}
                        containerStyle={{ flex: 1, margin: 0, width: '40%', }}
                        itemTextStyle={{ margin: 0, padding: 0, height: 20 }}
                        fontSize={14}
                        data={listMonth}
                        value={month}
                        onChangeText={value => handleFetchStatistik("month", value)}
                    />
                    <Dropdown
                        animationDuration={0}

                        label="Tahun"
                        itemPadding={2}
                        dropdownOffset={{ top: 20, left: 0 }}
                        containerStyle={{ flex: 1, margin: 0, width: '40%', }}
                        itemTextStyle={{ margin: 0, padding: 0, height: 20, }}
                        pickerStyle={{ minHeight: '30%', maxHeight: '100%' }}
                        fontSize={14}
                        data={listYear}
                        value="2021"
                        onChangeText={value => handleFetchStatistik("year", value)}
                    />
                </View>

                <View style={styles.form}>
                    <Text style={styles.formTitle}>Pendapatan bersih dalam tahun {selectedYear}</Text>
                    <View style={styles.formItem}>
                        <Text style={styles.formPlaceholder}>{dataYear.penghasilanTahunan}</Text>
                    </View>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Pendapatan bersih dalam bulan {month.toLowerCase()}</Text>
                    <View style={styles.formItem}>
                        <Text style={styles.formPlaceholder}>{dataMonth && dataMonth.totalPenjualan ? dataMonth.totalPenjualan : "0"}</Text>
                    </View>
                </View>
                {console.log("🚀 ~ file: index.js ~ line 235 ~ index ~ arrShowYearItem", arrShowYearItem)}
                <LineChart
                    yAxisLabel="Rp"

                    data={{
                        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
                        datasets: [
                            {
                                data: arrShowYearItem
                            }

                        ]
                    }}
                    width={Number(wp('92%'))}
                    height={Number(wp('50%'))}

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
                            stroke: Warna.biruJaja
                        }
                    }}
                    bezier

                    style={{
                        marginTop: 5,
                        marginBottom: 5,
                        borderRadius: 0
                    }}
                />



                <View style={[style.row_space0, { marginTop: '5%' }]}>
                    <Dropdown
                        animationDuration={0}
                        label="Tanggal Penjualan"
                        labelTextStyle={{ color: Warna.blackgrayScale }}
                        itemPadding={2}
                        dropdownOffset={{ top: 20, left: 0 }}
                        containerStyle={{ flex: 1, margin: 0, width: '40%', }}
                        itemTextStyle={{ margin: 0, padding: 0, height: 20, }}
                        pickerStyle={{ minHeight: '30%', maxHeight: '100%' }}
                        fontSize={14}
                        data={listDate}
                        value={selectedDate}
                        onChangeText={value => handleFetchStatistik("date", value)}
                    />
                </View>
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Pendapatan bersih dalam minggu ini</Text>
                    <View style={styles.formItem}>
                        <Text style={styles.formPlaceholder}>{dataMonth && dataMonth.totalPenjualanRange ? dataMonth.totalPenjualanRange : "0"}</Text>
                    </View>
                </View>
                <LineChart
                    yAxisLabel="Rp"
                    data={{
                        labels: arrShowDate,
                        datasets: [
                            {
                                data: arrShowDateItem
                            }
                        ]
                    }}
                    width={Number(wp('92%'))} // from react-native
                    height={Number(wp('50%'))}
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
                            stroke: Warna.biruJaja
                        }
                    }}
                    bezier

                    style={{
                        marginTop: 5,
                        marginBottom: 5,
                        borderRadius: 0
                    }}
                />

            </ScrollView>
            {/* {/* new Date().getFullYear(); */}
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    form: {
        flex: 0,
        flexDirection: 'column',
        paddingVertical: '1%',
        marginBottom: '3%'
    },
    formPlaceholder: {
        flex: 1, fontSize: 14, fontWeight: '900', color: Warna.blackLight
    },
    // '#C7C7CD'
    formItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
    },
    formTitle: {
        fontSize: 14, fontWeight: '900', color: 'grey'
    },
})
