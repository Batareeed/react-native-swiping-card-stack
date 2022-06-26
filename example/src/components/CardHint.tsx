import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  COLOR_HINT_BACKGROUND,
  COLOR_TEXT_WHITE,
  CARD_FINAL_ANGLE,
  CARD_HINT_THRESHOLD as END,
  CARD_FINAL_POINTER_POSITION,
} from './shared';

type ChoiceFragment = {
  text: string;
};

type CardHintProps = {
  left?: boolean;
  width: number;
  choice: ChoiceFragment;
  pointer: Animated.Value;
};

const CardHint: React.FC<CardHintProps> = ({ left, width, choice, pointer }) => {
  const absAngle = CARD_FINAL_ANGLE;
  const innerAngle = Math.atan(HEIGHT / width);
  // const outerAngle = angle - innerAngle;
  const y = width / 2 / Math.cos(innerAngle);
  const i = y * Math.cos(absAngle + innerAngle);
  const marginLeft = width / 2 - i;
  const marginTop = (width / 2 - marginLeft) * Math.tan(absAngle);

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.container,
          left
            ? {
                // transform: [{rotate: `${absAngle}rad`}],
                transform: [
                  {
                    rotate: pointer.interpolate({
                      inputRange: [-CARD_FINAL_POINTER_POSITION, -END],
                      outputRange: [`${absAngle}rad`, `${(absAngle * END) / CARD_FINAL_POINTER_POSITION}rad`],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
                marginTop: -marginTop,
                marginRight: -marginLeft,
                paddingRight: marginLeft * 3,
              }
            : {
                // transform: [{rotate: `-${absAngle}rad`}],
                transform: [
                  {
                    rotate: pointer.interpolate({
                      inputRange: [END, CARD_FINAL_POINTER_POSITION],
                      outputRange: [`-${(absAngle * END) / CARD_FINAL_POINTER_POSITION}rad`, `-${absAngle}rad`],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
                marginTop: -marginTop,
                marginLeft: -marginLeft,
                paddingLeft: marginLeft * 2.5,
              },
          {
            opacity: pointer.interpolate({
              inputRange: [-END - 10, -END, END, END + 10],
              outputRange: [left ? 1 : 0, 0, 0, left ? 0 : 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <Text style={[styles.title, left ? styles.textLeft : null]} numberOfLines={2}>
          {choice.text}
        </Text>
      </Animated.View>
    </View>
  );
};

const HEIGHT = 120;

export default React.memo(CardHint);

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    bottom: undefined,
    height: HEIGHT,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: `${COLOR_HINT_BACKGROUND}9c`,
  },
  title: {
    color: COLOR_TEXT_WHITE,
    width: '60%',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 18,
  },
  textLeft: {
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
});
