import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default styles;
