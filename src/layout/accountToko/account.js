import React, { useState, useEffect, createRef } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert, TextInput, ToastAndroid } from "react-native";
import { Button } from 'react-native-paper';
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from 'react-native-actions-sheet';
import ActionSheets from "react-native-actionsheet";
import ImgToBase64 from 'react-native-image-base64';
import { styles } from "../../styles/setting";
import { Colors, Loading, Wp, Hp, Style, Utils } from '../../export'
export default function account(props) {
    const actionSheetRef = createRef();
    const imageRef = createRef();
    const [loading, setLoading] = useState(false);

    const [state, setstate] = useState(props.data)
    const [showButton, setshowButton] = useState(false)
    const [dashboard, setdashboard] = useState(props.dashboard)
    const [textInputColor, settextInputColor] = useState("#C0C0C0");
    const [deskripsiLenght, setdeskripsiLenght] = useState(0);
    const [changeName, setchangeName] = useState(props.data.change_name)
    const [name, setname] = useState(props.data.nama_toko)
    const [deskripsi, setdeskripsi] = useState(props.data.deskripsi_toko)
    const [foto, setFoto] = useState(props.data.foto)
    const [foto64, setFoto64] = useState("")

    const [open, setOpen] = useState("Toko")

    const handleEdit = (e) => {
        if (e === "Toko") {
            setOpen("Toko")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        } else if (e === "Deskripsi") {
            actionSheetRef.current?.setModalVisible(false)
            setTimeout(() => setOpen("Deskripsi"), 50);
        }
    }

    const handleSave = () => {
        if (changeName === true && name !== props.data.nama_toko) {
            Alert.alert(
                "Jaja.id",
                "Anda yakin ingin mengganti nama toko?", [
                {
                    text: "Ok",
                    onPress: () => handleUpdate(),
                    style: "cancel"
                },
            ],
                { cancelable: false }
            );
        } else {
            handleUpdate()
        }
    }

    const handleUpdate = async () => {
        setshowButton(false)
        setLoading(true)
        let parseB64 = "";
        if (foto !== null) {
            await ImgToBase64.getBase64String(foto).then(res => {
                parseB64 = res
            })
        }
        let base64 = foto64 !== "" ? foto64.data : foto !== null ? parseB64 : ""
        var formdata = new FormData();
        formdata.append("foto", base64)
        formdata.append("greeting_message", "");
        formdata.append("deskripsi_toko", deskripsi);
        formdata.append("nama_toko", name);
        formdata.append("id_toko", state.id_toko);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/pengaturan/profil/", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: account.js ~ line 81 ~ handleUpdate ~ result", result)
                if (result.status === 200) {
                    props.handleLoading(false)
                    setTimeout(() => Utils.alertPopUp("Toko berhasil di perbahrui"))
                    setTimeout(() => setLoading(false), 3000);
                } else {
                    setLoading(false)
                    setTimeout(() => ToastAndroid.show(result.status.message, ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);

                }
            }).catch(error => {
                setLoading(false)
                setTimeout(() => ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER), 1000);
            });
    }

    const goToPicFromCameras = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true,
            // compressImageQuality: 1,
        }).then(image => {
            setFoto64(image)
            setshowButton(true)
        });

    }
    const goToPickImage = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
            includeBase64: true,
            compressImageQuality: 1,
        }).then(image => {
            setFoto64(image)
            setshowButton(true)
        });
    }

    useEffect(() => {

    }, [props])

    const handleChange = (text) => {
        let warningText = String('shopee shope lazada tokoped tokopedia jd.id jdid bukalapak whatsapp').split(" ")
        let word = text
        var words = text.split(" ");
        words.map(res => {
            warningText.map(result => {
                if (res.toLowerCase() === result.toLowerCase()) {
                    console.log("true")
                    word = word.replace(res, '***')
                    console.log("🚀 ~ file: edit.js ~ line 285 ~ handleUpdate ~ word", word)
                } else {
                    console.log("false")
                }
            })
        })
        setdeskripsiLenght(word.length)
        setdeskripsi(word)
    }

    return (
        <View style={styles.card}>
            {loading ? <Loading /> : null}
            {open === "Deskripsi" ?
                <View style={styles.actionSheetBody}>
                    <View style={styles.form}>
                        <Text adjustsFontSizeToFit style={[styles.formTitle, { color: Colors.blackgrayScale, marginBottom: '2%' }]}>Deskripsi Toko</Text>
                        <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1, borderColor: textInputColor, borderWidth: 1 }]}>
                            {/* <Text adjustsFontSizeToFit style={styles.formPlaceholder}>Testing toko</Text> */}
                            <TextInput
                                textAlignVertical="top"
                                multiline={true}
                                numberOfLines={3}
                                maxHeight={Hp('40%')}
                                style={styles.inputbox}
                                placeholder="Input deskripsi toko anda"
                                value={deskripsi}
                                onFocus={() => settextInputColor(Colors.biruJaja)}
                                onBlur={() => settextInputColor('#C0C0C0')}
                                keyboardType="default"
                                maxLength={1000}
                                onChangeText={(text) => handleChange(text)}
                                theme={{
                                    colors: {
                                        primary: Colors.biruJaja,
                                    },
                                }}
                            />
                        </View>
                        <Text adjustsFontSizeToFit style={[Style.smallTextAlert, { textAlign: 'right', marginBottom: '3%' }]}>{deskripsiLenght}/1000</Text>
                        <Button mode="contained" color={Colors.biruJaja} labelStyle={{ color: Colors.white }} onPress={() => setOpen("Toko") & setshowButton(true)}>Simpan</Button>
                    </View>
                </View> :
                <>
                    <TouchableWithoutFeedback>
                        <View style={styles.form}>
                            <Text adjustsFontSizeToFit style={styles.formTitle}>Pengunjung</Text>
                            <View style={styles.formItem}>
                                <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{dashboard.pengunjung}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.form}>
                            <Text adjustsFontSizeToFit style={styles.formTitle}>Produk Dilihat</Text>
                            <View style={styles.formItem}>
                                <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{dashboard.produk_dilihat}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.form}>
                            <Text adjustsFontSizeToFit style={styles.formTitle}>Rating Toko</Text>
                            <View style={styles.formItem}>
                                <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{dashboard.average_all_rating}/5.0</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => changeName === true ? handleEdit("Toko") : null}>
                        <View style={styles.form}>
                            <Text adjustsFontSizeToFit style={styles.formTitle}>Nama Toko</Text>
                            <View style={styles.formItem}>
                                <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{name}</Text>
                                <Text adjustsFontSizeToFit style={styles.ubah}>{changeName === true ? "Ubah" : ""}</Text>
                            </View>
                            <Text adjustsFontSizeToFit style={Style.smallTextAlert}>Nama toko dapat diganti hanya sekali</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handleEdit("Deskripsi")}>
                        <View style={[styles.form]}>
                            <Text adjustsFontSizeToFit style={styles.formTitle}>Deskripsi Toko</Text>
                            <View style={styles.formItem}>
                                <Text adjustsFontSizeToFit style={[styles.formPlaceholder, { maxHeight: Hp('20%'), width: '80%' }]}>{String(deskripsi).substr(0, 400)}</Text>
                                <Text adjustsFontSizeToFit style={styles.ubah}>Ubah</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.form}>
                        <Text adjustsFontSizeToFit style={[styles.formTitle, { marginBottom: '2%' }]}>Gambar Toko</Text>
                        <View style={[styles.formItem, { borderBottomWidth: 0 }]}>
                            <Image style={styles.image} source={foto64 === "" ? foto === null ? require('../../icon/add.png') : { uri: foto } : { uri: foto64.path }} />
                            <View style={Style.column_center}>
                                <Button mode="contained" color={Colors.biruJaja} labelStyle={{ color: Colors.white }} contentStyle={{ width: Wp('30%') }} onPress={() => imageRef.current.show()}>Ganti</Button>
                                <Button mode="contained" color={Colors.kuningJaja} labelStyle={{ color: Colors.white }} contentStyle={{ width: Wp('30%') }} onPress={() => {
                                    foto64 !== "" ? setFoto64("") : foto !== null ? setFoto(null) : null
                                    setshowButton(true)
                                }}>Hapus</Button>
                            </View>
                        </View>
                    </View>
                    {showButton ? <Button mode="contained" color={Colors.biruJaja} labelStyle={{ color: Colors.white }} onPress={handleSave}>Simpan</Button> : null}
                </>
            }
            <ActionSheet footerHeight={80} containerStyle={{ paddingHorizontal: '4%', paddingTop: '1%' }}
                ref={actionSheetRef}>
                <View style={Style.actionSheetHeader}>
                    <Text adjustsFontSizeToFit style={Style.actionSheetTitle}>Atur Pofile Toko</Text>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}  >
                        <Image
                            style={Style.actionSheetClose}
                            source={require('../../icon/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.actionSheetBody}>
                    <View style={styles.form}>
                        <Text adjustsFontSizeToFit style={styles.formTitle}>Nama Toko</Text>
                        <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                            {/* <Text adjustsFontSizeToFit style={styles.formPlaceholder}>Testing toko</Text> */}
                            <TextInput
                                style={styles.inputbox}
                                placeholder=""
                                value={name}
                                onFocus={() => settextInputColor(Colors.biruJaja)}
                                onBlur={() => settextInputColor('#C0C0C0')}
                                keyboardType="default"
                                maxLength={35}
                                onChangeText={(text) => setname(text) & setshowButton(true)}
                                theme={{
                                    colors: {
                                        primary: Colors.biruJaja,
                                    },
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ActionSheet>
            <ActionSheets ref={imageRef}
                title={"Select a Photo"}
                options={["Take Photo", "Choose Photo Library", "Cancel"]}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={index => {
                    if (index == 0) {
                        goToPicFromCameras();
                    } else if (index == 1) {
                        goToPickImage();
                    } else {
                        null;
                    }
                }} />
        </View>
    )
}
