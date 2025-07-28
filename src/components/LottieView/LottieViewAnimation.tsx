import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

type animationType = 'SandyLoading' | 'shoppingcart' | 'Loading';
type Props = {
  animation: animationType;
  position: 'top' | 'center' | 'bottom';
  visible: boolean;
  onFinish?: () => void;
  size?: number;
};

const LottieViewAnimation = ({ animation, position, visible, onFinish, size = 200 }: Props) => {
  const animationRef = useRef<LottieView>(null);
  useEffect(() => {
    if (visible) {
      animationRef.current?.play();
    }
  }, [visible]);
  if (!visible) return null;
  return (
    <View testID="lottie-container" style={[styles.container, styles[position]]}>
      <LottieView
        testID="lottie-animation"
        ref={animationRef}
        source={getAnimationSource(animation)}
        autoPlay
        loop={false}
        style={{ width: size, height: size }}
        onAnimationFinish={onFinish}
      />
    </View>
  );
};

const getAnimationSource = (name: animationType) => {
  switch (name) {
    case 'SandyLoading':
      return require('../../../assets/animations/SandyLoading.json');
    case 'shoppingcart':
      return require('../../../assets/animations/shoppingcart.json');
    case 'Loading':
      return require('../../../assets/animations/Loading.json');
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    zIndex: 999,
  },
  top: {
    top: 50,
  },
  center: {
    top: Dimensions.get('window').height / 2 - 100,
  },
  bottom: {
    bottom: 5,
  },
});

export default LottieViewAnimation;
