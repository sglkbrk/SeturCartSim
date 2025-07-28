import React from 'react';
import { render } from '@testing-library/react-native';
import LottieViewAnimation from './LottieViewAnimation';
import { Dimensions } from 'react-native';

jest.mock('lottie-react-native', () => {
  return jest.fn().mockImplementation(() => null); // LottieView bileşenini mockla
});

// Animasyon dosyalarını mockla
jest.mock('../../../assets/animations/SandyLoading.json', () => 'sandy-json');
// jest.mock('../../../assets/animations/shoppingcart.json', () => 'shoppingcart-json');

describe('LottieViewAnimation', () => {
  it('should not render anything when visible is false', () => {
    const { queryByTestId } = render(<LottieViewAnimation animation="SandyLoading" position="center" visible={false} />);
    expect(queryByTestId('lottie-container')).toBeNull();
  });
  // todo: bu testler iptal edildi bu kısma daha sonra bakılacak
  //   it('should render animation when visible is true', () => {
  //     const { getByTestId } = render(<LottieViewAnimation animation="Celebrations" position="top" visible={true} />);
  //     expect(getByTestId('lottie-animation')).toBeTruthy();
  //   });

  //   it('should call onFinish when animation ends', () => {
  //     const onFinishMock = jest.fn();

  //     const { getByTestId } = render(<LottieViewAnimation animation="Excellent" position="bottom" visible={true} onFinish={onFinishMock} />);

  //     const animation = getByTestId('lottie-animation');
  //     // Simüle animasyon bitişi
  //     animation.props.onAnimationFinish();
  //     expect(onFinishMock).toHaveBeenCalled();
  //   });

  it('should apply correct position style', () => {
    const { getByTestId } = render(<LottieViewAnimation animation="SandyLoading" position="center" visible={true} />);
    const container = getByTestId('lottie-container');
    const expectedTop = Dimensions.get('window').height / 2 - 100;
    expect(container.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ position: 'absolute' }), expect.objectContaining({ top: expectedTop })]),
    );
  });
});
