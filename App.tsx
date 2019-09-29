/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, FlatList,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {PithDiscovery, PithDiscoveryResult} from "./services/PithDiscovery";
import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer, NavigationActions} from "react-navigation";
import {Browser} from "./views/Browser";
import {ChannelSelector} from "./views/ChannelSelector";
import {Player} from "./views/Player";

class ServerSelection extends React.Component {
    private discovery: PithDiscovery;
    constructor(...rest) {
        super(...rest);
        this.discovery = new PithDiscovery();
        this.discovery.start();
    }

    openServer(item: PithDiscoveryResult) {
        console.log("Opening", item);
        this.props.navigation.navigate("ChannelSelector", {serviceLocation: item});
    };

    render() {
        return (
            <>
                <SafeAreaView>
                    <Text>Pick a server:</Text>
                    <FlatList data={this.discovery.deviceList}
                              renderItem={({item}) => <Text onPress={() => this.openServer(item)}>{item.name}</Text>}
                              keyExtractor={(item, index) => item.host}/>
                </SafeAreaView>
            </>
        );
    }
}

const MainNavigator = createStackNavigator({
    Home: {screen: ServerSelection},
    ChannelSelector: {screen: ChannelSelector},
    Browser: {screen: Browser},
    Player: {screen: Player}
});

const App = createAppContainer(MainNavigator);


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
