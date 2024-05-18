import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, BackHandler, Alert, Platform, StatusBar } from 'react-native';
import { TextInput, Button, Appbar, Paragraph } from 'react-native-paper';
import Warna from '../../config/Warna';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '../../component/loading'
import { SafeAreaView } from 'react-native';
import style from '../../styles/style';
import { Colors, Style } from '../../export';
export default class VertifikasiEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step1: false,
            step2: true,
            code: '',
            timeOut: 120,
            button: false,
            password: '',
            confirmPassword: '',
            alertTextPssword: '',
            alertTextPssword1: '',
            accPassword: false,
            accPassword1: false,
            email: '',

            loading: false,
        };
    }

    backAction = () => {
        this.props.navigation.navigate('Login')
        return true;
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.timerID = setInterval(() => this.setTime(), 1000);

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }


    handleKirim = () => {
        this.setState({ loading: true })
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "email": this.state.email });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/auth/forgot_password", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: index.js ~ line 62 ~ index ~ result", result.status)
                if (result.status.code === 200) {
                    this.setState({ loading: false })
                    setTimeout(() => {
                        this.setState({
                            step1: false,
                            step2: true,
                            timeOut: 120,
                            button: false,
                        });
                        this.timerID = setInterval(() => this.setTime(), 1000);
                        console.log(this.state.email, 'ini email lupa password');
                    }, 50);
                } else {
                    this.setState({ loading: false })
                    setTimeout(() => alert("Error with status code : " + result.status.code), 100);
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                setTimeout(() => alert("Code 4 : " + JSON.stringify(error)), 100);
            });



        // this.setState({
        //   step1: false,
        //   step2: true,
        //   timeOut: 5,
        //   button: false,
        // });
        // this.timerID = setInterval(() => this.setTime(), 1000);

        // const credentials = {
        //   email: this.state.email,
        // };
        // console.log(credentials, 'ini email lupa password');
    };


    setTime() {
        let time = this.state.timeOut - 1;
        this.setState({
            timeOut: time,
        });
        if (time < 0) {
            clearInterval(this.timerID);
            this.setState({
                timeOut: 0,
            });
            this.setState({
                button: true,
            });
        }
    }

    handleOtp = (code) => {
        console.log("🚀 ~ file: index.js ~ line 147 ~ index ~ code", code)
        console.log("🚀 ~ file: index.js ~ line 147 ~ index ~ props.email", this.props.route.params.email)
        this.setState({ loading: true })
        var formdata = new FormData();
        formdata.append("email", this.props.route.params.email);
        formdata.append("code", code);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jsonx.jaja.id/core/seller/auth/verification/register", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    setTimeout(() => {
                        this.setState({ loading: false })
                    }, 500);
                    setTimeout(() => {
                        this.setState({

                            step1: true,
                            step2: false,
                        });
                    }, 550);
                } else if (result.status.code === 409) {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Periksa email anda untuk melihat kode verifikasi!", [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 600);
                } else if (result.status.code === 404) {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Anda belum mengirim email vertifikasi!", [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        loading: false
                                    });
                                },
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 300);
                } else if (result.status.code === 400) {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Kode vertifikasi tidak benar!", [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        step1: false,
                                        step2: true,
                                        loading: false
                                    });
                                },
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 200);
                } else {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message, [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        step1: false,
                                        step2: true,
                                        loading: false
                                    });
                                },
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 200);
                }
            })
            .catch(error => {
                setTimeout(() => {
                    Alert.alert(
                        "Jaja.id",
                        error, [
                        {
                            text: "Ok",
                            onPress: () => {
                                this.setState({
                                    step1: false,
                                    step2: true,
                                    loading: false
                                });
                            },
                            style: "cancel"
                        }
                    ],
                        { cancelable: false }
                    );
                }, 200);
            });

    };

    render() {
        // step 1 kirim email
        let view = null;

        if (this.state.step1 === true) {
            view = (
                <View style={styles.containerVerfified}>
                    <Image style={styles.iconMarket} source={require('../../ilustrations/verified.png')} />
                    <Paragraph style={styles.textJajakan}>Success<Text style={styles.textCenter}>, email anda berhasil di vertifikasi, lanjutkan ke pendaftaran toko</Text></Paragraph>
                    <Button
                        labelStyle={{ color: 'white' }}
                        onPress={() => this.props.navigation.navigate("RegistrasiToko")}
                        mode="contained"
                        contentStyle={styles.contentButton}
                        color={Warna.kuningJaja}
                        style={styles.button}>
                        Lanjutkan
                    </Button>
                </View>
            );
            // step 2 kirim otp ulang
        } else if (this.state.step2 === true) {
            let button = (
                <Button style={styles.button2} labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.blackgrayScale }]} disabled mode="contained">
                    Kirim kode otp ulang ({this.state.timeOut})
                </Button>
            );
            if (this.state.button === true) {
                button = (
                    <Button
                        style={styles.button2}
                        color={Warna.white}
                        labelStyle={[Style.font_13, Style.semi_bold, { color: Colors.white }]}
                        mode="contained"
                        onPress={this.handleKirim}>
                        Kirim kode otp ulang
                    </Button>
                );
            }
            view = (
                <>
                    <Text style={styles.text2}>
                        Buka email anda untuk melihat kode otp yang kami kirim
                    </Text>
                    <OTPInputView
                        style={styles.kodeOtp}
                        pinCount={6}
                        autoFocusOnLoad={true}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code) => {
                            this.handleOtp(code);
                        }}
                    />
                    {button}
                </>
            );
        }
        return (
            <SafeAreaView style={[style.container]}>
                {this.state.loading ?
                    <Loading /> : null
                }
                <StatusBar translucent={false} hidden={false} backgroundColor={Colors.biruJaja} barStyle="dark-content" />

                <Appbar.Header style={styles.appBar}>
                    <TouchableOpacity style={styles.iconHeader} onPress={() => this.props.navigation.navigate("Login")}>
                        <Image
                            source={require('../../icon/arrow.png')}
                            style={styles.appBarIcon}
                        />
                    </TouchableOpacity>
                </Appbar.Header>
                <View style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? Colors.white : null }]}>{view}</View>

            </SafeAreaView>
        );
    }
    onChangeMail = (text) => {
        this.setState({
            email: text,
        });
    };

    onChangePass = (pass) => {
        this.setState({ login: '' });
        console.log(pass, 'onchange');

        this.setState({
            password: pass,
        });
    };

    confirmPassword = (e) => {
        this.setState({ alertTextPssword: 'password tidak sama!' });
        console.log(e.nativeEvent.text, ' confirm password');
        if (e.nativeEvent.text === this.state.password) {
            this.setState({
                alertTextPssword: '',
                accPassword: true,
            });
        }
        this.setState({ confirmPassword: e.nativeEvent.text });
    };
    handlePassword = (e) => {
        console.log(e.nativeEvent.text, ' password');

        if (this.state.accPassword === true) {
            if (this.state.confirmPassword !== this.state.password) {
                this.setState({
                    alertTextPssword: 'password tidak sama!',
                    accPassword: false,
                });
            } else {
                this.setState({
                    alertTextPssword: '',
                    accPassword: true,
                });
            }
        }
        const str = e.nativeEvent.text;
        if (str.length < 6) {
            this.setState({
                alertTextPssword1: 'password terlalu pendek',
                accPassword1: false,
            });
        } else {
            this.setState({
                alertTextPssword1: '',
                accPassword1: true,
            });
        }
        console.log(e.nativeEvent.text, ' password', this.state.accPassword);
        this.setState({ password: e.nativeEvent.text });
    };

    handleSubmit = () => {
        if (this.state.password.length >= 6) {
            this.setState({ loading: true });
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=v7fluv5q2mcvpte0hu330c9nhna0q75v");

            var raw = JSON.stringify({ "email": this.state.email, "new_password": this.state.password, "confirm_new_password": this.state.confirmPassword });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jsonx.jaja.id/core/seller/auth/change_password/forgot", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: index.js ~ line 497 ~ index ~ result", result)

                    if (result.status.code === 200) {
                        setTimeout(() => this.setState({ loading: false }), 500);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                "Sandi anda berhasil diubah!", [
                                {
                                    text: "Login",
                                    onPress: () => {

                                        this.props.navigation.goBack()
                                    },
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 600);
                    } else if (result.status.code === 400) {
                        setTimeout(() => this.setState({ loading: false }), 100);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                error, [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("Pressed"),
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 150);
                    } else {
                        setTimeout(() => this.setState({ loading: false }), 100);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                result.status.message + " : " + result.status.code, [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("Pressed"),
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 150);
                    }
                })
                .catch(error => {
                    setTimeout(() => this.setState({ loading: false }), 100);
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            error, [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 150);
                });
        }
    };
}

const styles = StyleSheet.create({
    iconHeader: {
        width: 50
    },
    backIncon: {
        width: '40%',
        height: 250,
        flex: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        flexDirection: "column",
        paddingTop: '3%',
        width: wp('100%'),
        alignSelf: 'center'
    },
    text: {
        color: 'black',
        width: wp('85%'),
        marginTop: '10%',
        alignSelf: "center",
        fontSize: 14
    },
    textInput: {
        alignSelf: "center",
        width: wp('85%'),
        marginVertical: wp('3%'),
    },
    flex: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    button: {
        alignSelf: "center",
    },
    header: {
        backgroundColor: 'blue',
        marginTop: '0',
    },

    // step2
    text2: {
        marginVertical: '3%',

        width: wp('85%'),
        color: 'black',
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Poppins-Italic'
    },
    borderStyleBase: {
        width: 30,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: '#03DAC6',
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        color: 'black',
    },
    kodeOtp: {
        width: wp('85%'),
        height: hp('20%'),
        alignSelf: 'center',
        color: 'red',
    },
    underlineStyleHighLighted: {
        borderColor: '#03DAC6',
    },
    button2: {
        backgroundColor: Warna.biruJaja,
        width: wp('85%'),
        marginTop: '5%',
        alignSelf: 'center',

    },
    appBar: {
        backgroundColor: Warna.biruJaja,
        height: hp('5%'),
        color: 'white',
        paddingHorizontal: wp('5%')
    },
    appBarIcon: {
        tintColor: Warna.white,
        width: 27,
        height: 27
    },
    appBarText: {
        color: 'white',
        fontSize: 20,
        fontWeight: "bold",
    },
    backIcon: {
        tintColor: 'white',
        height: 23,
        width: 23,
        marginRight: "-5%"
    },
    // step 3
    inputBox: {
        alignSelf: "center",
        width: wp('85%'),
    },
    button3: {
        backgroundColor: Warna.kuningJaja, width: wp('85%'), alignSelf: "center",
    },
    text3: {
        // color: 'black',
        // width: wp('85%'),
        // marginTop: '10%',
        // alignSelf: "center",
        // fontSize: 14
        width: wp('85%'),
        color: 'black',
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Poppins-Italic',
        backgroundColor: 'pink'
    },
    containerVerfified: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Warna.black, fontFamily: 'Poppins-Regular', marginVertical: hp("2%") },
    textCenter: { fontSize: 18, color: Warna.black, fontFamily: 'Poppins-SemiBold' },

});
