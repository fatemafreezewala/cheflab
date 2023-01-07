import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../constants/index';
const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fav: {
    right: -10,
    top: 0,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    elevation: 10,
  },
  backBG: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.darkGray,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    left: 15,
    top: 15,
    position: 'absolute',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    maxHeight: Dimensions.get('screen').height * 0.6,
    width: Dimensions.get('screen').width * 0.9,
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-around',
  },
  addressText: {
    fontSize: 20,
    fontFamily: 'Segoe UI Bold',
    textAlign: 'center',
    // marginVertical: 10,
    color: COLORS.black,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  bkBtn: {
    width: 35,
    height: 35,
    tintColor: COLORS.white,
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

  image: {
    width: 70,
    height: 70,
    marginTop: 5,
    resizeMode: 'cover',
  },
  distance_logo: {
    width: 15,
    height: 15,
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
    fontSize: 16,
    marginStart: 15,
  },
  distance: {
    color: COLORS.black,
    marginTop: 0,
    fontFamily: 'Segoe UI',
    fontSize: 14,
    marginStart: 5,
  },
  starText: {
    color: COLORS.white,
    // marginTop: 5,
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    marginStart: 5,
  },
  resStarView: {
    marginStart: 15,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    color: COLORS.grey,
    marginTop: 5,
    fontFamily: 'Segoe UI',
    fontSize: 14,
    marginStart: 15,
  },
  resImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    padding: 10,
  },
  resImageBg: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resCard: {
    padding: 10,
    flexDirection: 'row',
    // backgroundColor: COLORS.white,
    marginEnd: 15,
    marginStart: 15,
    // elevation: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    // position: 'relative',
    // bottom: 20,
  },
  menuBtn: {
    position: 'absolute',
    bottom: 75,
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
});

/**
 * 
 * 
 https://www.facebook.com/auntyacid/

https://www.instagram.com/epicfunnypage/?hl=en

https://www.youtube.com/watch?v=RsgLwqIAJ1g

is tarike se dalenge backend se url
 */
