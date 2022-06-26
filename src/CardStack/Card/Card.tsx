import React, { ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  CARD_FINAL_ANGLE,
  CARD_FINAL_POINTER_POSITION,
  CARD_FINAL_POSITION,
  COLOR_CARD_BACK,
  COLOR_SHADOW_DARK,
} from '../constants';
import FlipCard from './FlipCard';
import CardBack from './CardBack';

type Props = {
  pointer: Animated.Value;
  createContent: (pointer: Animated.Value) => ReactNode;
  cardBack: ReactNode;
  cardSize: { width: number; height: number };
};

const Card: React.FC<Props> = ({ pointer, cardSize, cardBack, createContent }) => (
  <FlipCard
    front={<CardBack cardSize={cardSize}>{cardBack}</CardBack>}
    back={
      <Animated.View
        style={[
          styles.cardShadow,
          {
            transform: [
              {
                translateX: pointer.interpolate({
                  inputRange: [
                    -CARD_FINAL_POINTER_POSITION - 20,
                    -CARD_FINAL_POINTER_POSITION,
                    0,
                    CARD_FINAL_POINTER_POSITION,
                    CARD_FINAL_POINTER_POSITION + 20,
                  ],
                  outputRange: [
                    -CARD_FINAL_POSITION - 3,
                    -CARD_FINAL_POSITION,
                    0,
                    CARD_FINAL_POSITION,
                    CARD_FINAL_POSITION + 3,
                  ],
                }),
              },
              {
                rotate: pointer.interpolate({
                  inputRange: [-CARD_FINAL_POINTER_POSITION, 0, CARD_FINAL_POINTER_POSITION],
                  outputRange: [`-${CARD_FINAL_ANGLE}rad`, '0rad', `${CARD_FINAL_ANGLE}rad`],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.card, cardSize]}>{createContent(pointer)}</View>
      </Animated.View>
    }
  />
);

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: COLOR_CARD_BACK,
    overflow: 'hidden',
  },
  cardShadow: {
    shadowColor: COLOR_SHADOW_DARK,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
});
