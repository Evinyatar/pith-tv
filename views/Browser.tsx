import {Component} from "react";
import * as React from "react"

import {
    Image,
    Text, TouchableOpacity
} from "react-native";
import {PithChannel, PithDirectory, PithItem} from "../services/PithService";
import {FlatGrid} from "react-native-super-grid";

const CELL_WIDTH = 130;
const CELL_HEIGHT = CELL_WIDTH / 2 * 3;

interface State {
    contents: PithItem[]
}

export class Browser extends Component<{navigation: any}, State> {
    private directory: PithDirectory;
    private channel: PithChannel;

    state: State = {
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

    renderItem(item: PithItem) {
        if(item.poster) {
            const url = item.service.getImage(item.poster, CELL_WIDTH, CELL_HEIGHT);
            return (<TouchableOpacity onPress={() => this.selectItem(item)}><Image source={{uri: url}} style={{width: CELL_WIDTH, height: CELL_HEIGHT}} /></TouchableOpacity>);
        }
        return (<Text onPress={() => this.selectItem(item)}>{item.title}</Text>);
    }

    render() {
        return (
            <>
                <Text>Contents</Text>
                <FlatGrid items={this.state.contents} itemDimension={CELL_WIDTH}
                          renderItem={({item}) => this.renderItem(item)}/>
            </>);
    }
}
