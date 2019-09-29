import React from "react";

import {
    FlatList,
    Text
} from "react-native";
import {PithChannel, PithDirectory, PithItem} from "../services/PithService";

export class Browser extends React.Component {
    private directory: PithDirectory;
    private channel: PithChannel;

    constructor(...rest) {
        super(...rest);
    }

    state: {
        contents: PithItem[]
    } = {
        contents: []
    };

    async selectChannel(channel) {
        let contents = await channel.rootDirectory.listContents();
        this.setState(previousState => ({...previousState, channel: channel, contents: contents}));
    }

    async selectItem(item: PithItem) {
        if (item instanceof PithDirectory) {
            this.props.navigation.push("Browser", {channel: this.channel, directory: item});
        } else if (item.playable) {
            const stream = await item.getStreamDetails();
            this.props.navigation.navigate("Player", {stream: stream});
        }
    }

    async componentDidMount() {
        this.directory = this.props.navigation.getParam("directory");
        this.channel = this.props.navigation.getParam("channel");
        this.setState({contents: await this.directory.listContents()});
    }

    render() {
        return (
            <>
                <Text>Contents</Text>
                <FlatList data={this.state.contents}
                          renderItem={({item}) => <Text onPress={() => this.selectItem(item)}>{item.title}</Text>}/>
            </>);
    }
}
