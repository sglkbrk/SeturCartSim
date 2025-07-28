import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    gap: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backIcon: {
    padding: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeAddress: {
    marginTop: 4,
  },
  cartContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  selectAll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  cartheaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
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
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'right',
    fontFamily: 'Poppins_600SemiBold',
  },
  contentContainer: {
    padding: 5,
  },
  buy: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  buyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
