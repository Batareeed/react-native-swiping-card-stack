import React, { Component, ReactNode } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

const inter = (value: Animated.Value, deg: number) => ({
  transform: [
    {
      rotateY: value.interpolate({
        inputRange: [0, 180],
        outputRange: [`${deg}deg`, `${deg + 180}deg`],
      }),
    },
  ],
});

const flipCard = (position: number, animatedValue: Animated.Value) => {
  if (position >= 90) {
    Animated.spring(animatedValue, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  } else {
    Animated.spring(animatedValue, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }
};

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  style?: ViewStyle;
};

class FlipCard extends Component<FlipCardProps> {
  position = 0;
  animatedValue = new Animated.Value(0);
  componentDidMount() {
    this.animatedValue.addListener(({ value }) => {
      this.position = value;
    });
    flipCard(this.position, this.animatedValue);
  }

  render() {
    const { front, back } = this.props;
    const frontAnimatedStyle = inter(this.animatedValue, 0);
    const backAnimatedStyle = inter(this.animatedValue, 180);
    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                scale: this.animatedValue.interpolate({
                  inputRange: [0, 90, 180],
                  outputRange: [1, 1.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>{front}</Animated.View>
        <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>{back}</Animated.View>
      </Animated.View>
    );
  }
}

export default FlipCard;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  flipCard: {
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
  },
});
