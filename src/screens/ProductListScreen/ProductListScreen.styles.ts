import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  topSpacer: {
    borderBottomWidth: 1,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressContainer: {
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 12,
  },
  addressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    padding: 10,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchWrapper: {
    marginTop: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    fontFamily: 'Poppins_500Medium_Italic',
  },
  category: {
    width: '100%',
    marginTop: 8,
  },
  categoryList: {
    marginTop: 8,
  },

  categoryItemWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    marginRight: 8,
  },
  categoryIconWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 18,
    borderRadius: 50,
  },
  categoryText: {
    width: 60,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  productHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins_500Medium_Italic',
  },
  productList: {
    marginTop: 15,
  },
  productListContent: {
    paddingBottom: 400,
  },
  productColumn: {
    justifyContent: 'space-between',
  },
});

export default styles;
