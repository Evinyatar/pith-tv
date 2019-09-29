import React from "react";

import {
    FlatList,
    Text
} from "react-native";
import {PithChannel, PithDirectory, PithItem, PithService, PithStreamDetails} from "../services/PithService";
import VlcPlayer from 'react-native-vlc-player';

export class ChannelSelector extends React.Component {
    private pithService: PithService;

    constructor(...rest) {
        super(...rest);
        const serviceLocation = this.props.navigation.getParam("serviceLocation");
        this.pithService = new PithService(serviceLocation);
    }

    state: {
        channels: PithChannel[]
    } = {
        channels: []
    };

    async selectChannel(channel: PithChannel) {
        this.props.navigation.navigate('Browser', {channel: channel, directory: channel.rootDirectory});
    }

    async componentDidMount() {
        this.setState({channels: await this.pithService.listChannels()});
    }

    render() {
        return (<><Text>Channels</Text>
            <FlatList data={this.state.channels} renderItem={({item}) =>
                <Text onPress={() => this.selectChannel(item)}>{item.title}</Text>
            }
                      keyExtractor={item => item.id}
            />
        </>);
    }
}
