import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'


export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 0,
            selected: [],
        };
    }

    onSelectedImages = (images, current) => {
        var num = images.length;

        this.setState({
            num: num,
            selected: images,
        });

        console.log(current);
        console.log(this.state.selected);
    }
    openCamera = () => {
        console.log("open camera here");
    }
    render() {
        return (
            <View style={styles.container}>

            </View>
        );
    }
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    content: {
        marginTop: 15,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#F6AE2D',

    },
    text: {
        fontSize: 16,
        alignItems: 'center',
        color: '#fff',
    },
    bold: {
        fontFamily: 'Poppins-SemiBold',
    },
    info: {
        fontSize: 12,
    },
});