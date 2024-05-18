import React, { useState, useEffect, createRef } from 'react'
import { View, Text, Image, TouchableOpacity, ToastAndroid, LogBox, ScrollView } from "react-native";
import { Button } from 'react-native-paper';
import ActionSheets from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import ImgToBase64 from 'react-native-image-base64';
import { styles } from "../../styles/setting";
import { Colors, Loading, Style, Wp, Utils } from '../../export'

export default function banner(props) {
    const imageRef = createRef();
    const [loading, setLoading] = useState(false);

    const [showButton, setshowButton] = useState(false)
    const [pickImage, setPickImage] = useState(0)
    const [id, setId] = useState("")

    const [banner, setbanner] = useState("")
    const [banner_1, setbanner1] = useState("")
    const [banner_2, setbanner2] = useState("")
    const [banner_3, setbanner3] = useState("")
    const [banner_4, setbanner4] = useState("")
    const [banner_5, setbanner5] = useState("")

    const [banner64, setbanner64] = useState("")
    const [banner_164, setbanner164] = useState("")
    const [banner_264, setbanner264] = useState("")
    const [banner_364, setbanner364] = useState("")
    const [banner_464, setbanner464] = useState("")
    const [banner_564, setbanner564] = useState("")

    const handleSave = async () => {
        setLoading(true)
        let parseB64 = "";
        if (banner !== null) {
            await ImgToBase64.getBase64String(banner).then(res => {
                parseB64 = res
            })
        }
        let base64 = banner64 !== "" ? banner64.data : banner !== null ? parseB64 : "";

        let parseB641 = "";
        if (banner_1 !== null) {
            await ImgToBase64.getBase64String(banner_1).then(res => {
                parseB641 = res
            })
        }
        let base641 = banner_164 !== "" ? banner_164.data : banner_1 !== null ? parseB641 : "";

        let parseB642 = "";
        if (banner_2 !== null) {
            await ImgToBase64.getBase64String(banner_2).then(res => {
                parseB642 = res
            })
        }
        let base642 = banner_264 !== "" ? banner_264.data : banner_2 !== null ? parseB642 : "";

        let parseB643 = "";
        if (banner_3 !== null) {
            await ImgToBase64.getBase64String(banner_3).then(res => {
                parseB643 = res
            })
        }
        let base643 = banner_364 !== "" ? banner_364.data : banner_3 !== null ? parseB643 : "";

        let parseB644 = "";
        if (banner_4 !== null) {
            await ImgToBase64.getBase64String(banner_4).then(res => {
                parseB644 = res
            })
        }
        let base644 = banner_464 !== "" ? banner_464.data : banner_4 !== null ? parseB644 : "";

        let parseB645 = "";
        if (banner_5 !== null) {
            await ImgToBase64.getBase64String(banner_5).then(res => {
                parseB645 = res
            })
        }
        let base645 = banner_564 !== "" ? banner_564.data : banner_5 !== null ? parseB645 : "";
        var formdata = new FormData();
        formdata.append("banner", base64);
        formdata.append("banner_1", base641);
        formdata.append("banner_2", base642);
        formdata.append("banner_3", base643);
        formdata.append("banner_4", base644);
        formdata.append("banner_5", base645);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/pengaturan/banner/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                // props.handleLoading(true)
                props.handleLoading(false)
                setTimeout(() => Utils.alertPopUp('Toko berhasil di perbahrui'), 1500)
                setTimeout(() => setLoading(false), 2000);

                setshowButton(false)
            })
            .catch(error => {
                props.handleLoading(false);
                setshowButton(false)
                alert(error);
            });
    }

    useEffect(() => {
        LogBox.ignoreAllLogs();
        if (props.data) {
            let prop = props.data;
            setId(prop.id_toko)
            if (prop.banner) {
                setbanner(prop.banner.banner)
                setbanner1(prop.banner.banner_1)
                setbanner2(prop.banner.banner_2)
                setbanner3(prop.banner.banner_3)
                setbanner4(prop.banner.banner_4)
                setbanner5(prop.banner.banner_5)
            } else {
                setbanner(null)
                setbanner1(null)
                setbanner2(null)
                setbanner3(null)
                setbanner4(null)
                setbanner5(null)
            }
        }
    }, [props])


    function goToPicFromCameras() {
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
        }).then(image => {
            if (pickImage === 0) {
                setbanner64(image)
            } else if (pickImage === 1) {
                setbanner164(image)
            } else if (pickImage === 2) {
                setbanner264(image)
            } else if (pickImage === 3) {
                setbanner364(image)
            } else if (pickImage === 4) {
                setbanner464(image)
            } else {
                setbanner564(image)
            }
            setshowButton(true)
        });


    }

    function goToPickImage() {
        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
            compressImageQuality: 1,
        }).then(image => {
            if (pickImage === 0) {
                setbanner64(image)
            } else if (pickImage === 1) {
                setbanner164(image)
            } else if (pickImage === 2) {
                setbanner264(image)
            } else if (pickImage === 3) {
                setbanner364(image)
            } else if (pickImage === 4) {
                setbanner464(image)
            } else {
                setbanner564(image)
            }
            setshowButton(true)

        });
    }

    const handlePickImage = (param) => {
        setPickImage(param)
        imageRef.current.show()
    }

    return (
        <View style={[styles.body, Style.py_3, Style.px_2]}>
            {loading ? <Loading /> : null}
            <View style={[styles.form, { height: Wp('47%') }]}>
                <Text style={[styles.formTitle, Style.mb_2]}>Banner Utama (Ukuran 1080 * 540 atau 2 : 1)</Text>
                <View style={styles.formBannerUtama}>
                    <TouchableOpacity onPress={() => handlePickImage(0)}>
                        {banner64 || banner ?
                            <Image source={banner64 ? { uri: banner64.path } : { uri: banner }} style={styles.bannerUtama} />
                            :
                            <Image source={require('../../icon/add.png')} style={{ width: Wp('25%'), height: Wp('25%'), resizeMode: 'center' }} />
                        }
                    </TouchableOpacity>
                    {banner64 !== "" || banner !== null ?
                        <TouchableOpacity style={styles.deleteBannerUtama} onPress={() => {
                            banner64 !== "" ? setbanner64("") : banner !== null ? setbanner(null) : null
                            setshowButton(true)
                        }}>
                            <Image source={require("../../icon/close.png")} style={styles.iconDeleteImage} />
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
            <View style={[styles.form, { height: Wp('55%') }]}>
                <Text style={[styles.formTitle, Style.mb_2]}>Banner Kedua/ (Slide ukuran 1080 * 540 atau 2 : 1)</Text>
                <View style={styles.formPromo}>
                    <View style={[Style.row, { width: Wp('48%'), height: Wp('24%') }]}>
                        <TouchableOpacity onPress={() => handlePickImage(1)} style={{ width: Wp('48%'), height: Wp('24%'), justifyContent: 'center', alignItems: 'center', backgroundColor: 'silver' }}>
                            {banner_164 || banner_1 ?
                                <Image source={banner_164 ? { uri: banner_164.path } : { uri: banner_1 }} style={[styles.bannerKedua, { resizeMode: 'cover' }]} />
                                :
                                <Image source={require('../../icon/add.png')} style={{ width: Wp('11%'), height: Wp('11%'), resizeMode: 'center', alignSelf: 'center' }} />
                            }
                        </TouchableOpacity>
                        {banner_164 !== "" || banner_1 !== null ?
                            <TouchableOpacity style={styles.deleteBannerKedua} onPress={() => {
                                banner_164 !== "" ? setbanner164("") : banner_1 !== null ? setbanner1(null) : null
                                setshowButton(true)
                            }}>
                                <Image source={require("../../icon/close.png")} style={styles.iconDeleteKedua} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    <View style={[Style.row, { width: Wp('48%'), height: Wp('24%') }]}>
                        <TouchableOpacity onPress={() => handlePickImage(2)} style={{ width: Wp('48%'), height: Wp('24%'), justifyContent: 'center', alignItems: 'center', backgroundColor: 'silver' }}>
                            {banner_264 || banner_2 ?
                                <Image source={banner_264 ? { uri: banner_264.path } : { uri: banner_2 }} style={[styles.bannerKedua, { resizeMode: 'cover' }]} />
                                :
                                <Image source={require('../../icon/add.png')} style={{ width: Wp('11%'), height: Wp('11%'), resizeMode: 'center', alignSelf: 'center' }} />
                            }
                        </TouchableOpacity>
                        {banner_264 !== "" || banner_2 !== null ?
                            <TouchableOpacity style={styles.deleteBannerKedua} onPress={() => {
                                banner_264 !== "" ? setbanner264("") : banner_2 !== null ? setbanner2(null) : null
                                setshowButton(true)
                            }}>
                                <Image source={require("../../icon/close.png")} style={styles.iconDeleteKedua} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>
                <View style={[Style.row, { width: Wp('48%'), height: Wp('24%') }]}>
                    <TouchableOpacity onPress={() => handlePickImage(3)} style={{ width: Wp('48%'), height: Wp('24%'), justifyContent: 'center', alignItems: 'center', backgroundColor: 'silver' }}>
                        {banner_364 || banner_3 ?
                            <Image source={banner_364 ? { uri: banner_364.path } : { uri: banner_3 }} style={[styles.bannerKedua, { resizeMode: 'cover' }]} />
                            : <Image source={require('../../icon/add.png')} style={{ width: Wp('11%'), height: Wp('11%'), resizeMode: 'center', alignSelf: 'center' }} />
                        }
                    </TouchableOpacity>
                    {banner_364 !== "" || banner_3 !== null ?
                        <TouchableOpacity style={styles.deleteBannerKedua} onPress={() => {
                            banner_364 !== "" ? setbanner364("") : banner_3 !== null ? setbanner3(null) : null
                            setshowButton(true)
                        }}>
                            <Image source={require("../../icon/close.png")} style={styles.iconDeleteKedua} />
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>
            <View style={[styles.form, { height: Wp('45%') }]}>
                <Text style={[styles.formTitle, Style.mb_2]}>Banner Ketiga (Ukuran 1080 * 1080 atau 1 : 1)</Text>
                <View style={[Style.row, { width: Wp('80%'), height: Wp('40%'), backgroundColor: 'silver' }]}>
                    <View style={[Style.row, { width: Wp('40%'), height: Wp('40%') }]}>
                        <TouchableOpacity onPress={() => handlePickImage(4)} style={{ width: Wp('40%'), height: Wp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                            {banner_464 || banner_4 ?
                                <Image source={banner_464 ? { uri: banner_464.path } : { uri: banner_4 }} style={{ width: Wp('40%'), height: Wp('40%') }} />
                                : <Image source={require('../../icon/add.png')} style={{ width: Wp('25%'), height: Wp('25%'), resizeMode: 'center', alignSelf: 'center' }} />
                            }
                        </TouchableOpacity>
                        {banner_464 !== "" || banner_4 !== null ?
                            <TouchableOpacity style={styles.deleteBannerKetiga} onPress={() => {
                                banner_464 !== "" ? setbanner464("") : banner_4 !== null ? setbanner4(null) : null
                                setshowButton(true)
                            }}>
                                <Image source={require("../../icon/close.png")} style={styles.iconDeleteImage} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                    <View style={[Style.row, { width: Wp('40%'), height: Wp('40%'), backgroundColor: 'siver' }]}>
                        <TouchableOpacity onPress={() => handlePickImage(5)} style={{ width: Wp('40%'), height: Wp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                            {banner_564 || banner_5 ?
                                <Image source={banner_564 ? { uri: banner_564.path } : { uri: banner_5 }} style={{ width: Wp('40%'), height: Wp('40%') }} />
                                : <Image source={require('../../icon/add.png')} style={{ width: Wp('25%'), height: Wp('25%'), resizeMode: 'center', alignSelf: 'center' }} />
                            }
                        </TouchableOpacity>
                        {banner_564 !== "" || banner_5 !== null ?
                            <TouchableOpacity style={styles.deleteBannerKetiga} onPress={() => {
                                banner_564 !== "" ? setbanner564("") : banner_5 !== null ? setbanner5(null) : null
                                setshowButton(true)
                            }}>
                                <Image source={require("../../icon/close.png")} style={styles.iconDeleteImage} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>
                {/* {!showButton ? */}

            </View>
            {showButton ?
                <View style={{ position: 'relative', bottom: 0, zIndex: 100, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
                    <Button mode="contained" color={Colors.biruJaja} style={{ width: '98%' }} labelStyle={{ color: Colors.white }} onPress={handleSave}>Simpan</Button>
                </View>
                : null
            }

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
        </View >
    )
}
