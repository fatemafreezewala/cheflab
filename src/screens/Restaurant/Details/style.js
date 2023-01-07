import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants/index';
import {horizScale, vertScale} from '../../../constants/themes';
const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fav: {
    right: 15,
    top: 15,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
  },
  backBG: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff80',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    left: 15,
    top: 15,
    position: 'absolute',
  },
  bkBtn: {
    width: 35,
    height: 35,
    tintColor: COLORS.black,
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
    height: 250,
    // width: SIZES.width - 20,
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
    fontSize: 18,
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
    backgroundColor: COLORS.lightGray,
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

  image: {
    width: 70,
    height: 70,
    marginTop: 5,
    resizeMode: 'cover',
  },
  distance_logo: {
    width: 10,
    height: 10,
    resizeMode: 'cover',
  },
  star_logo: {
    width: 10,
    height: 10,

    resizeMode: 'cover',
  },
  text: {
    color: COLORS.black,
    fontFamily: 'Segoe UI Bold',
    fontSize: horizScale(16),

    marginStart: 15,
  },
  distance: {
    color: COLORS.black,
    marginTop: 0,
    fontFamily: 'Segoe UI',
    fontSize: horizScale(10),

    marginStart: 5,
  },
  open_close_status: {
    fontFamily: 'Segoe UI',
    fontSize: horizScale(12),
    color: '#0638ff',
  },
  blue_text: {
    marginHorizontal: 5,
    fontFamily: 'Segoe UI',
    fontSize: horizScale(10),
    color: '#0638ff',
    alignSelf: 'center',
    marginVertical: 2,
  },
  close_time: {
    fontFamily: 'Segoe UI',
    fontSize: horizScale(12),
    color: COLORS.grey,
  },
  round_circle: {
    width: horizScale(4),
    height: horizScale(4),
    backgroundColor: COLORS.grey,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  starText: {
    color: COLORS.white,
    // marginTop: 5,
    fontFamily: 'Segoe UI Bold',
    fontSize: horizScale(10),

    marginStart: 5,
  },
  resStarView: {
    marginStart: 15,
    marginTop: vertScale(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    color: COLORS.grey,
    marginTop: 5,
    fontFamily: 'Segoe UI',
    fontSize: horizScale(13),

    marginStart: 15,
  },
  resImage: {
    width: 80,
    height: 80,
    // resizeMode: 'center',
    padding: 5,
    borderRadius: 10,
  },
  resImageBg: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  resCard: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginEnd: 10,
    marginStart: 15,
    elevation: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    position: 'relative',
    bottom: 20,
  },
  menuBtn: {
    position: 'absolute',
    // bottom: 75,
    bottom: 40,
    alignItems: 'center',
    backgroundColor: '#000000',
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 19,
    flexDirection: 'row',
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Segoe UI Bold',
    color: '#FFF',
    paddingLeft: 6,
    paddingVertical: 3,
  },
  leafImage: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000080',
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.white,
    // height: Dimensions.get('screen').width - 150,
    width: Dimensions.get('screen').width - 50,
    borderRadius: 10,
    // display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-around',
    marginHorizontal: 10,
    // marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
