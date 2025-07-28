import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 50,
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGalleryContainer: {},
  image: {
    width: screenWidth,
    height: 300,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
  },
  ratingContainer: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignContent: 'center',
  },
  categoryText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Poppins_400Regular',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 8,
  },
  description: {
    fontSize: 15,
    marginBottom: 12,
  },
  brand: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  priceContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  price: {
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  installment: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  discountContainer: {
    flex: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  discount: {
    fontSize: 14,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  stockContainer: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  stock: {
    fontSize: 14,
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
