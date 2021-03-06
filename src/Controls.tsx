import {Component} from 'react'
import * as React from 'react'
import {Platform, StyleSheet, View, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const isAndroid = Platform.OS === 'android';

interface Props {
    overlay: {
        opacity,
        backgroundColor,
    },
    width: number,
    height: number,
    controls: {
        pause,
        toggle
    },
    onOverlay: () => void,
    onPlay: () => void,
    onOrientation: () => void
}

interface State {

}

export default class Controls extends Component<Props, State> {
    render() {
        const {overlay, height, width, controls} = this.props;

        return (
            <TouchableWithoutFeedback onPress={this._handleOverlay}>
                <View
                    style={[styles.overlay, {
                        backgroundColor: overlay.backgroundColor,
                        height: height,
                        width: width,
                        opacity: this.props.overlay.opacity
                    }]}>

                    <TouchableNativeFeedback
                        background={isAndroid ? TouchableNativeFeedback.SelectableBackground() : null}
                        onPress={this._handlePlay}>
                        <View
                            style={styles.containerPlay}>
                            <Icon
                                color='white'
                                name={controls.pause ? 'md-play' : 'md-pause'}
                                size={30}/>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback
                        background={isAndroid ? TouchableNativeFeedback.SelectableBackground() : null}
                        onPress={this._handleOrientation}>
                        <View
                            style={styles.containerToggle}>
                            <Icon color='white' name={controls.toggle} size={30}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _handleOverlay = () => {
        this.props.onOverlay()
    };

    _handlePlay = () => {
        this.props.onPlay()
    };

    _handleOrientation = () => {
        this.props.onOrientation()
    };
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute'
    },
    containerPlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '100%',
        margin: 10
    },
    containerToggle: {
        position: 'absolute',
        margin: 10,
        bottom: 0,
        right: 0
    }
});
