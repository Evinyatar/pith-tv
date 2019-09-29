import React from "react";

import {
    FlatList,
    Text
} from "react-native";
import {PithChannel, PithDirectory, PithItem, PithService} from "../services/PithService";

export class Browser extends React.Component {
    private pithService: PithService;

    constructor(...rest) {
        super(...rest);
        const serviceLocation = this.props.navigation.getParam("serviceLocation");
        this.pithService = new PithService(serviceLocation);
    }

    state: {
        channels: PithChannel[],
        contents: PithItem[]
    } = {
        channels: [],
        contents: []
    };

    async selectChannel(channel) {
        let contents = await channel.rootDirectory.listContents();
        this.setState(previousState => ({...previousState, channel: channel, contents: contents}));
    }

    async selectItem(item: PithItem) {
        if(item instanceof PithDirectory) {
            let contents = await item.listContents();
            this.setState(previousState => ({...previousState, contents: contents}));
        }
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
            <Text>Contents</Text>
            <FlatList data={this.state.contents} renderItem={({item}) => <Text onPress={() => this.selectItem(item)}>{item.title}</Text>}/>
        </>);
    }
}
