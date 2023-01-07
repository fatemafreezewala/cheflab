import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants/index';
import {horizScale} from '../../../constants/themes';
const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  no_data_found: {
    fontSize: horizScale(20),
    fontFamily: 'Segoe UI',
    color: COLORS.black,
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
    height: 180,
    width: SIZES.width - 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  sliderImage: {
    width: SIZES.width - 20,
    height: 150,
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
    fontSize: horizScale(20),

    color: 'rgba(0, 0, 0, 255)',
    marginStart: 15,
    marginTop: 28,
  },
  paginationStyleItem: {
    height: 6,
    width: 6,
    borderRadius: 5,
    marginTop: 20,
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
  additemView: {
    maxHeight: height * 0.7,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addHeaderText: {
    fontSize: 20,
    fontFamily: 'Segoe UI Bold',
    color: COLORS.black,
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
    backgroundColor: '#FFF',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  sizeText: {
    color: COLORS.black,
    fontFamily: 'Segoe UI',
    fontSize: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  // shadow: {
  //   backgroundColor: 'white',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 5,
  //   },
  //   shadowOpacity: 0.39,
  //   shadowRadius: 8.3,
  //   elevation: 5,
  // },
  // listView: {
  //   paddingTop: 6,
  //   paddingBottom: 10,
  // },
});
