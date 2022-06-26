import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { CardStack } from 'react-native-swiping-card-stack';
import CardContent from './components/CardContent';
import CardPattern from './components/CardPattern';
import type { CardData } from './components/shared';

const DEFAULT_DATA: CardData = {
  id: 'id',
  left: { text: 'Left' },
  right: { text: 'Right' },
};

export default function App() {
  const [statement, setStatement] = useState<CardData | undefined>(DEFAULT_DATA);
  const statements = useRef([
    { ...DEFAULT_DATA, id: 'id1' },
    { ...DEFAULT_DATA, id: 'id2' },
    { ...DEFAULT_DATA, id: 'id3' },
    { ...DEFAULT_DATA, id: 'id4' },
  ]);

  const setNext = () => setStatement(statements.current.shift());
  return (
    <View style={styles.container}>
      <CardStack
        currentCardId={statement?.id}
        cardData={statement}
        onLeft={setNext}
        onRight={setNext}
        createContent={(d, s, p) => <CardContent size={s} pointer={p} statement={d} />}
        cardBack={<CardPattern />}
        aspectRatio={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
});
