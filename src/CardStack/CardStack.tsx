import React, { createRef, ReactNode } from 'react';
import { Dimensions, Animated, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { COLOR_BLACK } from './constants';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Card from './Card/Card';
import { CARD_DROP_THRESHOLD } from './constants';
import DropContainer from './Card/DropContainer';
import CardBack from './Card/CardBack';

type Data = {
  id: string;
};

type Props<T extends Data> = {
  currentCardId: string | undefined;
  cardData: T | undefined;
  onLeft: () => void;
  onRight: () => void;
  createContent: (data: T, cardSize: { width: number; height: number }, pointer: Animated.Value) => ReactNode;
  cardBack: ReactNode;
  aspectRatio: number;
  style?: StyleProp<ViewStyle>;
};

type StateType<T extends Data> = {
  enabled: boolean;
  currentCardData: T | undefined;
  cardSize: { height: number; width: number } | undefined;
};

class CardStack<T extends Data> extends React.Component<Props<T>, StateType<T>> {
  pointerPosition = 0;
  pan = new Animated.Value(0);
  pointer = new Animated.Value(0);
  drop = new Animated.Value(0);
  prevCardDataId: string | undefined = undefined;

  pagerRef = createRef<PanGestureHandler>();

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      enabled: true,
      currentCardData: props.cardData,
      cardSize: undefined,
    };
  }

  onDrop = (left: boolean, velocityX: number) => {
    const { onLeft, onRight } = this.props;
    const { currentCardData } = this.state;
    this.setState({ enabled: false });
    const duration = Math.abs(((Dimensions.get('window').width * 2) / velocityX) * 1000);
    Animated.timing(this.drop, {
      duration: Math.min(duration, 300),
      toValue: left ? -1 : 1,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ currentCardData: undefined, enabled: true });
      this.drop.setValue(0);
      this.pan.setValue(0);
    });
    const nextId = currentCardData?.id;
    if (nextId) {
      if (left) onLeft();
      else onRight();
    }
  };

  onMove = (event: PanGestureHandlerGestureEvent) => {
    this.pointerPosition = event.nativeEvent.translationX;
  };
  onEnd = (velocityX: number) => {
    if ((this.pointerPosition > 0 && velocityX < -100) || (this.pointerPosition < 0 && velocityX > 100)) {
      Animated.timing(this.pan, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if (this.pointerPosition > CARD_DROP_THRESHOLD) {
      this.onDrop(false, velocityX);
    } else if (this.pointerPosition < -CARD_DROP_THRESHOLD) {
      this.onDrop(true, velocityX);
    } else {
      Animated.timing(this.pan, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: this.pan,
          x: this.pointer,
        },
      },
    ],
    {
      useNativeDriver: true,
      listener: (event: PanGestureHandlerGestureEvent) => this.onMove(event),
    }
  );
  onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    const { state } = event.nativeEvent;
    if (state === State.END || state === State.CANCELLED) {
      const { velocityX } = event.nativeEvent;
      this.onEnd(velocityX);
    }
  };
  componentDidUpdate(prevProps: Props<T>, prevState: StateType<T>) {
    if (prevProps.cardData !== this.props.cardData || prevState.currentCardData !== this.state.currentCardData) {
      const { currentCardData } = this.state;
      const { cardData } = this.props;
      if (!currentCardData && cardData && this.prevCardDataId !== cardData.id) {
        this.setState({ currentCardData: cardData });
        this.prevCardDataId = cardData.id;
      }
    }
  }

  render() {
    const { createContent, cardBack, style, aspectRatio } = this.props;
    const { enabled, currentCardData, cardSize } = this.state;

    return (
      <View
        style={[styles.container, style]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          let cardHeight = height;
          let cardWidth = width;
          if (width / height > aspectRatio) cardWidth = height * aspectRatio;
          else cardHeight = width / aspectRatio;
          this.setState({ cardSize: { height: cardHeight, width: cardWidth } });
        }}
      >
        {!!cardSize && (
          <>
            <Animated.View style={[styles.card, cardSize]}>
              <CardBack cardSize={cardSize}>{cardBack}</CardBack>
              <View style={styles.stackOverlay} />
            </Animated.View>
            {currentCardData ? (
              <PanGestureHandler
                ref={this.pagerRef}
                enabled={enabled}
                onGestureEvent={this.onPanGestureEvent}
                onHandlerStateChange={this.onHandlerStateChange}
                activeOffsetX={[-30, 30]}
                key={currentCardData.id}
                failOffsetY={[-40, 40]}
              >
                <Animated.View style={styles.cardContainer}>
                  <DropContainer value={this.drop}>
                    <Card
                      pointer={this.pan}
                      createContent={(p) => createContent(currentCardData, cardSize, p)}
                      cardBack={cardBack}
                      cardSize={cardSize}
                    />
                  </DropContainer>
                </Animated.View>
              </PanGestureHandler>
            ) : null}
          </>
        )}
      </View>
    );
  }
}

export default CardStack;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // aspectRatio:2.5,
    // backgroundColor:'#f0f'
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
  },
  stackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR_BLACK,
    opacity: 0.2,
  },
});
