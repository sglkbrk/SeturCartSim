import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  info: {
    flex: 1,
    height: 70,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 13,
    color: '#444',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qty: {
    marginHorizontal: 8,
    fontSize: 14,
  },
});

export default styles;
