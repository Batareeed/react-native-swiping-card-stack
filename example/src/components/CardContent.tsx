import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import CardHint from './CardHint';
import Svg, { Path, Rect } from 'react-native-svg';
import type { CardData } from './shared';

type CardProps = {
  pointer: Animated.Value;
  statement: CardData;
  size: {
    width: number;
    height: number;
  };
};

const CardContent: React.FC<CardProps> = ({ size, pointer, statement }) => (
  <View style={[styles.container]}>
    <Svg width={size.width} height={size.height} viewBox="0 0 5 5" preserveAspectRatio="none">
      <Rect width="5" height="5" />
      <Path d="M0,0V5H1V0zM2,0V5H3V0zM4,0V5H5V0zM0,0H5V1H0zM0,2H5V3H0zM0,4H5V5H0z" fill="#fff" fillRule="evenodd" />
    </Svg>
    <CardHint width={size.width} choice={statement.right} pointer={pointer} />
    <CardHint left width={size.width} choice={statement.left} pointer={pointer} />
  </View>
);

export default CardContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
