import React, { useState, useEffect, useCallback, createRef } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, RefreshControl, TouchableWithoutFeedback, TextInput, Alert, ActivityIndicator, Platform } from "react-native";
import { Appbar, RadioButton, Button } from "react-native-paper";
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetCamera from 'react-native-actionsheet';
import AsyncStorage from "@react-native-community/async-storage";
import { styles } from "../../styles/setting";
import { Style, Colors, Storage, useNavigation, Loading, Hp, Wp } from "../../export";

export default function Lainnya() {
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    const imageRef = createRef();
    const [profile, setProfile] = useState([]);
    const [id, setid] = useState("");
    const [email, setemail] = useState("");
    const [name, setname] = useState("");
    const [date, setdate] = useState("");
    const [gender, setgender] = useState("");
    const [photo, setphoto] = useState("");
    const [telephone, settelephone] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [checked, setChecked] = useState('');
    const [showButton, setshowButton] = useState(false);
    const [loading, setloading] = useState(false);
    const [view, setview] = useState(false);
    const [open, setOpen] = useState("Nama Lengkap");
    const [textInputColor, settextInputColor] = useState("#C0C0C0"); ''
    const [textInputColor2, settextInputColor2] = useState("#C0C0C0");

    const [oldcolor, setoldcolor] = useState("#C0C0C0");
    const [passwordcolor, setpasswordcolor] = useState("#C0C0C0");
    const [confirmcolor, setconfrimcolor] = useState("#C0C0C0");

    const [oldpassword, setoldpassword] = useState("");
    const [alertOldPassword, setalertOldPassword] = useState("");
    const [confirmPasswordState, setconfirmPasswordState] = useState("");
    const [password, setpassword] = useState("");
    const [alertTextPassword, setalertTextPassword] = useState("");
    const [accPassword, setaccPassword] = useState(false);
    const [alertTextPassword1, setalertTextPassword1] = useState("");
    const [accPassword1, setaccPassword1] = useState(false);

    const getItem = async () => {
        try {
            let result = await Storage.getIdToko();
            setid(result)
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=j4efp81smrg1tpc6gadd6oob219h28k5");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch("https://jsonx.jaja.id/core/seller/pengaturan/profil/" + result, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) {
                        let image = { "path": result.customer.foto_customer }
                        setProfile(result.customer)
                        settelephone(result.customer.telepon)
                        setname(result.customer.nama_lengkap)
                        setdate(result.customer.tgl_lahir)
                        setChecked(result.customer.jenis_kelamin === null ? "" : result.customer.jenis_kelamin === "pria" ? "first" : 'second')
                        setgender(result.customer.jenis_kelamin === null ? null : result.customer.jenis_kelamin === "pria" ? "pria" : "wanita")
                        setphoto(image)
                        setemail(result.customer.email)
                    } else {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message + " => " + result.status.code, [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            },
                        ],
                            { cancelable: false }
                        );
                    }

                })
                .catch(error => {
                    Alert.alert(
                        "Jaja.id",
                        "Periksa koneksi anda atau coba lagi nanti!", [
                        {
                            text: "Ok",
                            onPress: () => console.log("Pressed"),
                            style: "cancel"
                        },
                    ],
                        { cancelable: false }
                    );
                });
        } catch (error) {
        }
    }

    const onRefresh = useCallback(() => {
        AsyncStorage.getItem("xxTwo").then(toko => {
            getItem();
        });
    }, []);

    useEffect(() => {
        setloading(false)
        getItem();
        getData();
    }, []);

    const getData = async () => {
        try {
            let result = await Storage.getpw()
            result === true ? setview(true) : setview(false)

        } catch (error) {

        }
    }

    const handleEdit = (e) => {
        if (e === "Nama Lengkap") {
            setOpen("Nama Lengkap")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        }
        //  else if (e === "Nomor Telephone") {
        //     setOpen("Nomor Telephone")
        //     setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        // } 
        else if (e === "Jenis Kelamin") {
            setOpen("Jenis Kelamin")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        } else if (e === "Password") {
            setOpen("Password")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        }
    }
    const showDatePicker = (text) => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDate = (date) => {
        let str = JSON.stringify(date);
        setdate(str.slice(1, 11))
        hideDatePicker();
        handleUpdate(str.slice(1, 11), photo)
    };
    const goToPicFromCameras = () => {
        ImagePicker.openCamera({
            width: 450,
            height: 500,
            cropping: true,
            includeBase64: true,
        }).then((image) => {
            setphoto(image)
            handleUpdate(date, image)
        });
    }
    const goToPickImage = () => {
        ImagePicker.openPicker({
            width: 450,
            height: 500,
            cropping: true,
            includeBase64: true,
        }).then((image) => {
            setphoto(image)
            handleUpdate(date, image)
        });
    }
    const handleUpdate = (date, image) => {
        if (name !== profile.nama_lengkap || telephone !== profile.telepon || date !== profile.tgl_lahir || image.path !== profile.foto_customer || gender !== profile.jenis_kelamin) {
            setshowButton(true)
            console.log(true, "handleUpdate");
        } else {
            console.log(false, "handleUpdate");
            setshowButton(false)
        }
    }

    const handleSimpan = async () => {
        setloading(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=qm3c2sqojtn01m7v33e5o2gqdme5t9th");
        var raw = JSON.stringify({ "id_toko": id, "nama_lengkap": name, "tgl_lahir": date, "jenis_kelamin": checked === "first" ? 'pria' : 'wanita', "telepon": telephone, "foto_customer": photo.data })
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://jsonx.jaja.id/core/seller/auth/change_profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    getItem()
                    setTimeout(() => {
                        setloading(false)
                        setshowButton(false)
                    }, 500);
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Profile anda berhasil diubah!", [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            },
                        ],
                            { cancelable: false }
                        );
                    }, 600);
                } else {
                    setTimeout(() => {
                        setloading(false)
                    }, 200);
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message + " => " + result.status.code, [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            },
                        ],
                            { cancelable: false }
                        );
                    }, 300);
                }

            })
            .catch(error => {
                setTimeout(() => {
                    setloading(false)
                }, 300);
                setTimeout(() => {
                    Alert.alert(
                        "Jaja.id",
                        "Periksa koneksi anda atau coba lagi nanti", [
                        {
                            text: "Ok",
                            onPress: () => console.log("Pressed"),
                            style: "cancel"
                        },
                    ],
                        { cancelable: false }
                    );
                }, 400);
            });
    }
    const confirmPassword = (e) => {
        setalertTextPassword('Password tidak sama!');
        console.log(e.nativeEvent.text, ' confirm password');
        if (e.nativeEvent.text === password) {
            setaccPassword(true)
            setalertTextPassword("")
        }
        setconfirmPasswordState(e.nativeEvent.text)
    };
    const handlePassword = (e) => {
        if (accPassword === true) {
            if (confirmPasswordState !== password) {
                setalertTextPassword("Password tidak sama!")
                setaccPassword(false)
            } else {
                setalertTextPassword("")
                setaccPassword(true)
            }
        }
        const str = e.nativeEvent.text;
        if (str.length < 6) {
            setalertTextPassword1("Password terlalu pendek")
            setaccPassword1(false)
        } else {
            setalertTextPassword1("")
            setaccPassword1(true)
        }
        setpassword(e.nativeEvent.text)
    };

    const handleReset = () => {
        if (!oldpassword) setalertOldPassword('Password lama tidak boleh kosong')
        if (!password) setalertTextPassword1('Password tidak boleh kosong!');
        if (confirmPasswordState === '') {
            setalertTextPassword('Konfirmasi password tidak boleh kosong!')
        }
        if (password && confirmPasswordState && oldpassword) {
            actionSheetRef.current?.setModalVisible(false)
            setTimeout(() => setloading(true), 100);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=jsa5vc624ko4lhupcms2jg6iba1p573f");

            var raw = JSON.stringify({ "email": email, "old_password": oldpassword, "new_password": password, "confirm_new_password": confirmPasswordState });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jsonx.jaja.id/core/seller/auth/change_password/new", requestOptions)
                .then(response => response.json())
                .then(result => {

                    if (result.status.code === 200) {
                        setTimeout(() => {
                            setloading(false)
                            console.log("awkaowkakwakwokawokwoawoakwo");
                            Alert.alert(
                                "Jaja.id",
                                "Kata sandi anda berhasil diubah!", [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("pressed"),
                                    style: "cancel"
                                },
                            ],
                                { cancelable: false }
                            );
                        }, 100);
                    } else if (result.status.code === 400) {
                        setTimeout(() => {
                            setloading(false)
                        }, 300);
                        if (result.status.message === "confirm password not same") {
                            setTimeout(() => {
                                setalertTextPassword("Konfirmasi password tidak sama!")
                                Alert.alert(
                                    "Jaja.id",
                                    "Konfirmasi password tidak sama!", [
                                    {
                                        text: "Ok",
                                        onPress: () => actionSheetRef.current?.setModalVisible(true),
                                    },
                                ],
                                    { cancelable: false }
                                );
                            }, 500);
                        } else if (result.status.message === "password old not same") {
                            setTimeout(() => {
                                setalertOldPassword("Password lama anda salah!")
                                Alert.alert(
                                    "Jaja.id",
                                    "Password lama anda salah!", [
                                    {
                                        text: "Ok",
                                        onPress: () => actionSheetRef.current?.setModalVisible(true),
                                    },
                                ],
                                    { cancelable: false }
                                );
                                console.log("tidak sama");
                            }, 500);
                        }
                    } else {
                        setloading(false)
                        Alert.alert(
                            "Jaja.id",
                            "Error at 343" + result, [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            },
                        ],
                            { cancelable: false }
                        );
                    }
                })
                .catch(error => {
                    setloading(false)
                    Alert.alert(
                        "Jaja.id",
                        "Periksa koneksi anda atau coba lagi nanti!", [
                        {
                            text: "Ok",
                            onPress: () => console.log("Pressed"),
                            style: "cancel"
                        },
                    ],
                        { cancelable: false }
                    );
                });
        }
    }

    const handleAdd = () => {
        if (password === '') setalertTextPassword1('Password tidak boleh kosong!');
        if (confirmPasswordState === '') {
            setalertTextPassword('Konfirmasi password tidak boleh kosong!')
        } else {
            actionSheetRef.current?.setModalVisible(false)
            setTimeout(() => setloading(true), 100);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "email": email, "new_password": password, "confirm_new_password": confirmPasswordState });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jsonx.jaja.id/core/seller/auth/change_password/add", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        setTimeout(() => {
                            setloading(false)
                            console.log("awkaowkakwakwokawokwoawoakwo");
                            Alert.alert(
                                "Jaja.id",
                                "Kata sandi anda berhasil diubah!", [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("pressed"),
                                    style: "cancel"
                                },
                            ],
                                { cancelable: false }
                            );
                        }, 100);
                    } else {
                        setloading(false)
                    }
                })
                .catch(error => {
                    setloading(false)
                    Alert.alert(
                        "Jaja.id",
                        "Periksa koneksi anda atau coba lagi nanti!", [
                        {
                            text: "Ok",
                            onPress: () => console.log("Pressed"),
                            style: "cancel"
                        },
                    ],
                        { cancelable: false }
                    );
                });
        }
    }
    return (
        <SafeAreaView style={Style.container}>
            {loading ? <Loading /> : null}
            {/* <View style={styles.header}> */}
            <Appbar.Header style={{ width: '100%', elevation: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.biruJaja, height: Platform.OS === 'android' ? Hp('8%') : Hp('5.5%'), color: 'white', paddingHorizontal: Wp('4%'), marginTop: '3%' }}>
                <TouchableOpacity style={Style.mr} onPress={() => navigation.goBack()}>
                    <Image style={Style.arrowBack} source={require('../../icon/arrow.png')} />
                </TouchableOpacity>
                <View style={Style.row_start_center}>
                    <Text adjustsFontSizeToFit style={Style.appBarText}>Akun Profile</Text>
                </View>
                <TouchableOpacity onPress={() => handleSimpan()}>
                    <Text adjustsFontSizeToFit style={Style.appBarText}>Simpan</Text>
                </TouchableOpacity>
            </Appbar.Header>
            {/* <Image style={styles.imageHeader} source={require('../../icon/head2.png')} /> */}
            {/* </View> */}
            {/* </View> */}
            {/* <Image loadingIndicatorSource={<ActivityIndicator />} style={styles.avatar} source={{ uri: photo.path === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : photo.path }} /> */}
            <View style={[Style.column, Style.p_4, Style.mb_2, { flex: 1, backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null }]}>
                {/* <TouchableWithoutFeedback onPress={() => handleEdit("Nama Lengkap")}>
                    <View style={styles.form}>
                        <Text adjustsFontSizeToFit style={styles.formTitle}>Nama Lengkap</Text>
                        <View style={styles.formItem}>
                            <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{name === "" ? "" : name}</Text>
                            <Text adjustsFontSizeToFit style={styles.ubah}>{name === "" ? "Tambah" : "Ubah"}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback> */}
                <View style={styles.form}>
                    <Text adjustsFontSizeToFit style={styles.formTitle}>Nama Lengkap</Text>
                    <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                        <TextInput
                            style={styles.inputbox}
                            placeholder=""
                            value={name}
                            onFocus={() => settextInputColor(Colors.biruJaja)}
                            onBlur={() => settextInputColor('#C0C0C0')}
                            keyboardType="default"
                            maxLength={25}
                            onChangeText={(text) => setname(text)}
                            theme={{
                                colors: {
                                    primary: Colors.biruJaja,
                                },
                            }}
                        />
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={() => showDatePicker('start')}>
                    <View style={styles.form}>
                        <Text adjustsFontSizeToFit style={styles.formTitle}>Tanggal Lahir</Text>
                        <View style={styles.formItem}>
                            <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{date === null ? "Pilih Tanggal Lahir" : date}</Text>
                            <Text adjustsFontSizeToFit style={styles.ubah}>{date === null === "" ? "Tambah" : "Ubah"}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <Text adjustsFontSizeToFit style={styles.formTitle}>Jenis Kelamin</Text>
                <View style={{ flex: 0, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: '4%' }}>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <RadioButton
                            value="first"

                            color={Colors.biruJaja}
                            status={checked === 'first' ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked('first')
                                setgender("pria")
                            }}
                        />
                        <Text adjustsFontSizeToFit style={Style.font14}>Laki - Laki</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <RadioButton
                            value="second"
                            status={checked === 'second' ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked('second')
                                setgender("wanita")
                            }}
                        />
                        <Text adjustsFontSizeToFit style={Style.font14}>Perempuan</Text>
                    </View>
                </View>
                {/* <View style={styles.form}>
                    <Text adjustsFontSizeToFit style={styles.formTitle}>Nomor Telephone</Text>
                    <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor2, borderBottomWidth: 1 }]}>
                        <TextInput
                            style={styles.inputbox}
                            placeholder="Input nomor telephone"
                            value={telephone}
                            onFocus={() => settextInputColor2(Colors.biruJaja)}
                            onBlur={() => settextInputColor2('#C0C0C0')}
                            keyboardType="numeric"
                            maxLength={13}
                            onChangeText={(text) => settelephone(text)}
                            theme={{
                                colors: {
                                    primary: Colors.biruJaja,
                                },
                            }}
                        />
                    </View>
                </View> */}
                <TouchableWithoutFeedback onPress={() => handleEdit("Password")}>
                    <View style={styles.form}>
                        <Text adjustsFontSizeToFit style={styles.formTitle}>Password</Text>
                        <View style={styles.formItem}>
                            <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{view === true ? "********" : "-"}</Text>
                            <Text adjustsFontSizeToFit style={styles.ubah}>{view === true ? "Ubah" : "Tambah"}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>


            <ActionSheet closeOnTouchBackdrop={false} onClose={() => handleUpdate(date, photo)} footerHeight={80} containerStyle={{ paddingHorizontal: '4%', paddingTop: '1%' }}
                ref={actionSheetRef}>
                <View style={Style.actionSheetHeader}>
                    <Text adjustsFontSizeToFit style={Style.actionSheetTitle}>Atur Pofile</Text>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}  >
                        <Image
                            style={Style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.actionSheetBody}>
                    {open === "Nama Lengkap" ?
                        <View style={styles.form}>
                            <Text adjustsFontSizeToFit style={styles.formTitle}>{open}</Text>
                            <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                                <TextInput
                                    style={styles.inputbox}
                                    placeholder=""
                                    value={name}
                                    onFocus={() => settextInputColor(Colors.biruJaja)}
                                    onBlur={() => settextInputColor('#C0C0C0')}
                                    keyboardType="default"
                                    maxLength={25}
                                    onChangeText={(text) => setname(text)}
                                    theme={{
                                        colors: {
                                            primary: Colors.biruJaja,
                                        },
                                    }}
                                />
                            </View>
                        </View>
                        : open === "Nomor Telephone" ?
                            <View style={styles.form}>
                                <Text adjustsFontSizeToFit style={styles.formTitle}>{open}</Text>
                                <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                                    {/* <Text adjustsFontSizeToFit style={styles.formPlaceholder}>Testing toko</Text> */}
                                    <TextInput
                                        style={styles.inputbox}
                                        placeholder="Input nomor telephone"
                                        value={telephone}
                                        onFocus={() => settextInputColor(Colors.biruJaja)}
                                        onBlur={() => settextInputColor('#C0C0C0')}
                                        keyboardType="numeric"
                                        maxLength={13}
                                        onChangeText={(text) => settelephone(text)}
                                        theme={{
                                            colors: {
                                                primary: Colors.biruJaja,
                                            },
                                        }}
                                    />
                                    {/* <Image /> */}
                                </View>
                            </View>
                            : open === "Jenis Kelamin" ?
                                <View style={{ flex: 0, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                                    <View style={{ flex: 0, alignItems: 'center', flexDirection: 'row' }}>
                                        <RadioButton
                                            value="first"
                                            status={checked === 'first' ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('first')
                                                setgender("pria")
                                            }}
                                        />
                                        <Text adjustsFontSizeToFit style={Style.font14}>Laki - Laki</Text>
                                    </View>
                                    <View style={{ flex: 0, alignItems: 'center', flexDirection: 'row' }}>
                                        <RadioButton
                                            value="second"
                                            status={checked === 'second' ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('second')
                                                setgender("wanita")
                                            }}
                                        />
                                        <Text adjustsFontSizeToFit style={Style.font14}>Perempuan</Text>
                                    </View>
                                </View>
                                : view === true ?
                                    <View style={styles.form}>
                                        <Text adjustsFontSizeToFit style={styles.formTitle}>Kata sandi lama</Text>
                                        <View style={[styles.formItem, { paddingBottom: '0%', borderBottomColor: oldcolor, borderBottomWidth: 1 }]}>
                                            <TextInput
                                                style={styles.inputbox}
                                                placeholder="Input kata sandi lama"
                                                onChangeText={(text) => setoldpassword(text & setalertOldPassword(""))}
                                                onFocus={() => setoldcolor(Colors.biruJaja)}
                                                onBlur={() => setoldcolor('#C0C0C0')}
                                                keyboardType="default"
                                                maxLength={20}
                                                theme={{
                                                    colors: {
                                                        primary: Colors.biruJaja,
                                                    },
                                                }}
                                            />
                                            {/* <Image /> */}
                                        </View>
                                        <Text adjustsFontSizeToFit style={[Style.font_12, Style.mb, { color: Colors.redNotif }]}>{alertOldPassword}</Text>

                                        <Text adjustsFontSizeToFit style={styles.formTitle}>Kata sandi baru</Text>
                                        <View style={[styles.formItem, { paddingBottom: '0%', borderBottomColor: passwordcolor, borderBottomWidth: 1 }]}>
                                            <TextInput
                                                style={styles.inputbox}
                                                placeholder="Input kata sandi baru"
                                                secureTextEntry
                                                onFocus={() => setpasswordcolor(Colors.biruJaja)}
                                                onBlur={() => setpasswordcolor('#C0C0C0')}
                                                keyboardType="default"
                                                onChange={handlePassword}
                                                theme={{
                                                    colors: {
                                                        primary: Colors.biruJaja,
                                                    },
                                                }}
                                            />
                                            {/* <Image /> */}
                                        </View>
                                        <Text adjustsFontSizeToFit style={[Style.font_12, Style.mb, { color: Colors.redNotif }]}>{alertTextPassword1}</Text>
                                        <Text adjustsFontSizeToFit style={Style.font_14}>Konfirmasi kata sandi baru</Text>
                                        <View style={[styles.formItem, { paddingBottom: '0%', borderBottomColor: confirmcolor, borderBottomWidth: 1 }]}>
                                            <TextInput
                                                style={styles.inputbox}
                                                placeholder="Konfirmasi kata sandi baru"
                                                secureTextEntry
                                                onFocus={() => setconfrimcolor(Colors.biruJaja)}
                                                onBlur={() => setconfrimcolor('#C0C0C0')}
                                                keyboardType="default"
                                                maxLength={13}
                                                onChange={confirmPassword}
                                                theme={{
                                                    colors: {
                                                        primary: Colors.biruJaja,
                                                    },
                                                }}
                                            />
                                            {/* <Image /> */}
                                        </View>
                                        <Text adjustsFontSizeToFit style={[Style.font_12, Style.mb, { color: Colors.redNotif }]}>{alertTextPassword}</Text>

                                        <Button color={Colors.biruJaja} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={handleReset}>
                                            Simpan
                                        </Button>
                                    </View>
                                    :
                                    <View style={styles.form}>
                                        <Text adjustsFontSizeToFit style={Style.font_14}>Kata sandi baru</Text>
                                        <View style={[styles.formItem, { paddingBottom: '0%', borderBottomColor: passwordcolor, borderBottomWidth: 1 }]}>
                                            <TextInput
                                                style={styles.inputbox}
                                                placeholder="Input kata sandi baru"
                                                secureTextEntry
                                                onFocus={() => setpasswordcolor(Colors.biruJaja)}
                                                onBlur={() => setpasswordcolor('#C0C0C0')}
                                                keyboardType="default"
                                                onChange={handlePassword}
                                                theme={{
                                                    colors: {
                                                        primary: Colors.biruJaja,
                                                    },
                                                }}
                                            />
                                            {/* <Image /> */}
                                        </View>
                                        <Text adjustsFontSizeToFit style={[Style.font_12, Style.mb, { color: Colors.redNotif }]}>{alertTextPassword1}</Text>
                                        <Text adjustsFontSizeToFit style={styles.formTitle}>Konfirmasi kata sandi baru</Text>
                                        <View style={[styles.formItem, { paddingBottom: '0%', borderBottomColor: confirmcolor, borderBottomWidth: 1 }]}>
                                            <TextInput
                                                style={styles.inputbox}
                                                placeholder="Konfirmasi kata sandi baru"
                                                secureTextEntry
                                                onFocus={() => setconfrimcolor(Colors.biruJaja)}
                                                onBlur={() => setconfrimcolor('#C0C0C0')}
                                                keyboardType="default"
                                                maxLength={13}
                                                onChange={confirmPassword}
                                                theme={{
                                                    colors: {
                                                        primary: Colors.biruJaja,
                                                    },
                                                }}
                                            />
                                            {/* <Image /> */}
                                        </View>
                                        <Text adjustsFontSizeToFit style={[Style.font_12, Style.mb, { color: Colors.redNotif }]}>{alertTextPassword}</Text>

                                        <Button color={Colors.biruJaja} labelStyle={[Style.font_12, Style.semi_bold, { color: Colors.white }]} mode="contained" onPress={handleAdd}>
                                            Simpan
                                        </Button>
                                    </View>}
                </View>
            </ActionSheet>
            <ActionSheetCamera
                ref={imageRef}
                title={'Select a Photo'}
                options={['Take Photo', 'Choose Photo Library', 'Cancel']}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={(index) => {
                    if (index == 0) {
                        goToPicFromCameras();
                    } else if (index == 1) {
                        goToPickImage();
                    } else {
                        null;
                    }
                }} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(text) => handleConfirmDate(text)}
                onCancel={() => hideDatePicker()}
            />
        </SafeAreaView >
    );
}


