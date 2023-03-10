import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../constants/index';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tagline: {
    color: COLORS.grey,
    marginTop: 5,
    fontFamily: 'Segoe UI',
    fontSize: 14,
    marginStart: 15,
  },
  additemView: {
    maxHeight: SIZES.height * 0.8,
  },
  addItemHeader: {
    paddingLeft: 24,
    paddingRight: 6,
    paddingTop: 17,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    elevation: 10,
  },
  middleView: {
    backgroundColor: COLORS.lightGray,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    // marginBottom: 10,
    paddingBottom: 10,
    // paddingTop: 5,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: COLORS.white,
    elevation: 10,
    alignItems: 'center',
  },
  headerImage: {width: 25, height: 25, resizeMode: 'center'},
  locationText: {
    fontSize: 12,
    fontFamily: 'Segoe UI',
    color: COLORS.black,
    marginStart: 10,
  },
  placeText: {
    fontSize: 18,
    fontFamily: 'Segoe UI Bold',
    color: COLORS.black,
  },
  headerInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 10,
  },
  sliderMainContainer: {
    height: 220,
    // width: SIZES.width - 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderImage: {
    width: SIZES.width - 20,
    height: 200,
    overflow: 'hidden',
    borderRadius: 15,
  },
  sliderInnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  innerText: {
    fontSize: 22,
    fontFamily: 'Segoe UI Bold',
    color: COLORS.white,
  },
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginStart: 15,
    marginTop: 28,
  },
  paginationStyleItem: {
    height: 6,
    width: 6,
    borderRadius: 5,
    marginTop: 25,
  },
  copyRightText: {
    fontFamily: 'Segoe UI',
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 255)',
  },
  logo: {
    width: 150,
    height: 60,
  },
  viewAll: {
    fontFamily: 'Segoe UI',
    fontSize: 14,
    color: '#0638ff',
    alignSelf: 'flex-end',
    marginVertical: 2,
    textDecorationLine: 'underline',
  },
  fav: {
    right: 10,
    top: 10,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    elevation: 10,
  },
});
