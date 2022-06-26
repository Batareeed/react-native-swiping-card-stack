# react-native-swiping-card-stack

Card Stack Swiper

## Installation

1. `yarn add react-native-swiping-card-stack`
2. `yarn add react-native-gesture-handler` install peer dependencies


## Usage

```js
import { CardStack } from "react-native-swiping-card-stack";

// ...
const cardData = {
  id: 'card1',
}
// ...
<View style={styles.container}>
  <CardStack
    currentCardId={cardData.id}
    cardData={cardData}
    onLeft={setNext}
    onRight={setNext}
    createContent={(d, s, p) => <CardContent size={s} pointer={p} statement={d} />}
    cardBack={<CardPattern />}
    aspectRatio={1}
  />
</View>
// ...
```

## More information
This library is built on top of the following open-source projects:

- react-native-gesture-handler (https://github.com/software-mansion/react-native-gesture-handler)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
