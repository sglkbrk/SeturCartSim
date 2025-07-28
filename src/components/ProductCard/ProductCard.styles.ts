import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 16,
    width: '48%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    position: 'relative',
    borderRadius: 8,
    paddingVertical: 20,
    // backgroundColor: '#f5f5f5',
  },
  image: {
    width: 120,
    height: 140,
    resizeMode: 'contain',
  },
  favIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 20,
    elevation: 2,
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default styles;
