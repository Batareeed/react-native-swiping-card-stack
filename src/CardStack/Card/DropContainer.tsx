import React, { ReactNode } from 'react';
import { Dimensions, Animated } from 'react-native';

type DropContainerProps = {
  value: Animated.Value;
  children: ReactNode | null;
};

const DropContainer: React.FC<DropContainerProps> = ({ value, children }) => (
  <Animated.View
    style={[
      {
        transform: [
          {
            translateX: value.interpolate({
              inputRange: [-1, 1],
              outputRange: [-Dimensions.get('window').width * 2, Dimensions.get('window').width * 2],
            }),
          },
          {
            translateY: value.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [200, 0, 200],
            }),
          },
          {
            rotate: value.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: ['-3rad', '0rad', '3rad'],
            }),
          },
        ],
      },
    ]}
  >
    {children}
  </Animated.View>
);

export default React.memo(DropContainer);
