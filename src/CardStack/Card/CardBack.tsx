import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLOR_CARD_BACK } from '../constants';

type CardBackProps = PropsWithChildren<{
  cardSize: { height: number; width: number };
}>;

const CardBack: React.FC<CardBackProps> = ({ cardSize, children }) => (
  <View style={[styles.card, cardSize]}>{children}</View>
);

export default CardBack;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR_CARD_BACK,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
