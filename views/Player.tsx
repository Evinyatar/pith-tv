import {Component} from "react";
import * as React from "react";

import {
    Dimensions,
    FlatList, StyleSheet,
    Text, View
} from "react-native";

import {VlcPlayer} from "../src/VlcPlayer";

interface Props {
    navigation
}
interface State {}

export class Player extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (<View style={[styles.container]}><VlcPlayer
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }}
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
