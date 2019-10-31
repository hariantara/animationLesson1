/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Images} from '../Utils/Images';
// import Animated from 'react-native-reanimated';

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const images = [
  {
    id: 1,
    uri: Images.img1,
  },
  {
    id: 2,
    uri: Images.img2,
  },
  {
    id: 3,
    uri: Images.img3,
  },
  {
    id: 4,
    uri: Images.img4,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const HEADER_HEIGHT = 100;

const scrollY = new Animated.Value(0);
const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
const headerY = diffClampScrollY.interpolate({
  inputRange: [0, HEADER_HEIGHT],
  outputRange: [0, -HEADER_HEIGHT + 55],
});

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      activeImage: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.allImages = {};
    this.oldPosition = {};
    this.position = new Animated.ValueXY();
    this.dimensions = new Animated.ValueXY();
    this.animation = new Animated.Value(0);
    this.activeImageStyle = null;
  }

  openImage = index => {
    this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
      this.oldPosition.x = pageX;
      this.oldPosition.y = pageY;
      this.oldPosition.width = width;
      this.oldPosition.height = height;

      this.position.setValue({
        x: pageX,
        y: pageY,
      });

      this.dimensions.setValue({
        x: width,
        y: height,
      });

      this.setState(
        prevState => ({
          ...prevState,
          activeImage: images[index],
        }),
        () => {
          this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
            Animated.parallel([
              Animated.timing(this.position.x, {
                toValue: dPageX,
                duration: 400,
              }),
              Animated.timing(this.position.y, {
                toValue: dPageY,
                duration: 400,
              }),
              Animated.timing(this.dimensions.x, {
                toValue: dWidth,
                duration: 400,
              }),
              Animated.timing(this.dimensions.y, {
                toValue: dHeight,
                duration: 400,
              }),
              Animated.timing(this.animation, {
                toValue: 1,
                duration: 400,
              }),
            ]).start();
          });
        },
      );
    });
  };

  closeImage = () => {
    Animated.parallel([
      Animated.timing(this.position.x, {
        toValue: this.oldPosition.x,
        duration: 400,
      }),
      Animated.timing(this.position.y, {
        toValue: this.oldPosition.y,
        duration: 400,
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPosition.width,
        duration: 400,
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPosition.height,
        duration: 400,
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 400,
      }),
    ]).start(() => {
      this.setState({
        activeImage: null,
      });
    });
  };

  render() {
    const activeImageStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      left: this.position.x,
      top: this.position.y,
    };

    const animatedContentY = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-150, 0],
    });

    const animatedContentOpacity = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1],
    });

    const animatedContentStyle = {
      opacity: animatedContentOpacity,
      transform: [
        {
          translateY: animatedContentY,
        },
      ],
    };

    const animatedCrossOpacity = {
      opacity: this.animation,
    };
    return (
      <View style={{flex: 1}}>
        {this.state.activeImage ? null : (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: HEADER_HEIGHT,
              backgroundColor: '#526869',
              zIndex: 1000,
              elevation: 1000,
              transform: [{translateY: headerY}],
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 40,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
              Header Text
            </Text>
          </Animated.View>
        )}
        <AnimatedFlatList
          bounces={false}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddinggBottom: 200,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ])}
          data={images}
          keyExtractor={(item, index) => String(index)}
          renderItem={({item, index}) => {
            return (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => this.openImage(index)}>
                <Animated.View
                  style={{
                    height: SCREEN_HEIGHT - 150,
                    width: SCREEN_WIDTH,
                    padding: 15,
                  }}>
                  <Image
                    ref={image => {
                      this.allImages[index] = image;
                    }}
                    source={item.uri}
                    style={{
                      flex: 1,
                      height: null,
                      width: null,
                      borderRadius: 10,
                      resizeMode: 'cover',
                    }}
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          }}
        />
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeImage ? 'auto' : 'none'}>
          <View
            style={{flex: 2, zIndex: 1001}}
            ref={view => (this.viewImage = view)}>
            <Animated.Image
              source={
                this.state.activeImage ? this.state.activeImage.uri : null
              }
              style={[
                {
                  resizeMode: 'cover',
                  top: 0,
                  left: 0,
                  height: null,
                  width: null,
                },
                activeImageStyle,
              ]}
            />
            <TouchableWithoutFeedback onPress={() => this.closeImage()}>
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 45,
                    right: 20,
                    height: 45,
                    width: 45,
                    backgroundColor: 'blacktransparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 45/2
                  },
                  animatedCrossOpacity,
                ]}>
                <Text
                  style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>
                  X
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View
            style={[
              {
                flex: 1,
                zIndex: 1000,
                backgroundColor: 'white',
                padding: 20,
                paddingTop: 50,
              },
              animatedContentStyle,
            ]}>
            <Text style={{fontSize: 24, paddingBottom: 10}}>Latihan Men</Text>
            <Text>
              Eiusmod consectetur cupidatat dolor Lorem excepteur excepteur.
              Nostrud sint officia consectetur eu pariatur laboris est velit.
              Laborum non cupidatat qui ut sit dolore proident.
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }
}
