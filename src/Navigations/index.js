import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

// Screens
import Main from '../Screens/Main';

const Navigations = createStackNavigator(
  {
    Main: {
      screen: Main,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'Main',
  },
);

const AppContainer = createAppContainer(Navigations);

class RootContainer extends Component {
  render() {
    return <AppContainer {...this.props} />;
  }
}

export default RootContainer;
