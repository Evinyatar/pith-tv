import React from "react";

import {
    Dimensions,
    FlatList, StyleSheet,
    Text, View
} from "react-native";
import {PithChannel, PithDirectory, PithItem, PithService, PithStreamDetails} from "../services/PithService";
import VlcPlayer from 'react-native-vlc-player';

export class Player extends React.Component {
    constructor(...rest) {
        super(...rest);
    }

    render() {
        return (<View style={[styles.container]}><VlcPlayer
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }}
            autoplay={true}
            paused={false}
            source={{
                uri: this.props.navigation.getParam("stream").stream.url,
                autoplay: true,
                initOptions: ['--codec=avcodec']
            }}
        /></View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
    },
});
