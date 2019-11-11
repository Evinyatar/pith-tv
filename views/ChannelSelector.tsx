import {
    FlatList,
    Text, ViewProps
} from "react-native";
import {PithChannel, PithService} from "../services/PithService";
import {Component} from "react";
import * as React from "react";

interface Props extends ViewProps {
    navigation
}

interface State {

}

export class ChannelSelector extends Component<Props, State> {
    private pithService: PithService;

    constructor(props) {
        super(props);
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
