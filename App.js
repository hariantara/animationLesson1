import React from 'react';
import {View, StyleSheet} from 'react-native';
import Navigations from './src/Navigations';

class App extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Navigations {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
