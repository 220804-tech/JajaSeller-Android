import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native'
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import { Button, Appbar, RadioButton } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warna from "../../../../config/Warna";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Galery from '../galery';
import Kamera from '../kamera';

const initialLayout = { width: Dimensions.get('window').width };

const GaleryRoute = () => <Galery />;
const KameraRoute = () => <Kamera />;


export default function AddProdukFoto() {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Galery' },
        { key: 'second', title: 'Kamera' }
    ]);

    const renderScene = SceneMap({
        first: GaleryRoute,
        second: KameraRoute
    });




    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <TouchableOpacity style={styles.iconHeader} onPress={() => navigation.navigate("User")}>
                    <Image
                        source={require('../../../../icon/arrow.png')}
                        style={styles.appBarIcon}
                    />
                </TouchableOpacity>
            </Appbar.Header>
            <TabView
                // indicatorStyle={{ backgroundColor: 'white' }}
                // style={{ backgroundColor: 'pink' }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        // indicatorStyle={{ backgroundColor: 'white' }}
                        // scrollEnabled={true}
                        style={{ backgroundColor: 'white' }}
                        tabStyle={{ minHeight: 50, minWidth: 100, borderBottomColor: Warna.biruJaja }} // here
                        renderLabel={({ route, focused, color }) => (
                            <Text style={{ color: 'black', margin: 3, fontSize: 11, width: 66, textAlign: 'center', padding: '-5%' }}>
                                {route.title}
                            </Text>
                        )}
                    />
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    appBar: {
        backgroundColor: '#64B0C9',
        height: hp('5%'),
        color: 'white',
        paddingHorizontal: wp('5%'),
        marginBottom: hp('1%')
    },
    iconHeader: {
        width: 50
    },
    appBarIcon: {
        tintColor: Warna.white,
        width: 27,
        height: 27
    },
})