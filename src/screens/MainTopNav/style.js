import {StatusBar} from 'react-native';
import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../constants/index';

export default StyleSheet.create({
  sizeText: {
    fontFamily: 'Segoe UI',
    fontSize: 15,
    padding: 5,
  },
  addressText: {
    fontSize: 20,
    fontFamily: 'Segoe UI Bold',
    textAlign: 'center',
    // marginVertical: 10,
    color: COLORS.black,
  },
  logo: {
    width: 150,
    height: 60,
  },
  copyRightText: {
    fontFamily: 'Segoe UI',
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 255)',
  },
  content: {
    paddingLeft: 10,
    borderRadius: 10,
    margin: 10,
    elevation: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
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
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
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
    marginTop: 24,
  },
  moodContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '93%',
    height: 80,
    borderRadius: 10,
    alignSelf: 'center',
    // marginVertical: 15,
    marginTop: 15,
    backgroundColor: '#8a9e62',
    justifyContent: 'space-between',
  },
  moodInnerText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 20,
    color: COLORS.white,
    marginStart: 20,
  },
  moodInnerImage: {
    width: 70,
    height: 70,
    resizeMode: 'center',
    marginEnd: 20,
  },
  paginationStyleItem: {
    height: 6,
    width: 6,
    borderRadius: 5,
    marginTop: 20,
  },
  orderStatus: {
    fontFamily: 'Segoe UI',
    fontSize: 13,
    color: COLORS.red,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  orderName: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 13,
    color: COLORS.black,
    marginTop: 10,
  },
  status: {
    fontFamily: 'Segoe UI',
    fontSize: 12,
    color: '#0638ff',
    marginTop: 10,
  },
  willText: {
    fontFamily: 'Segoe UI',
    fontSize: 12,
    color: COLORS.black,
    marginTop: 10,
  },
  mins: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 12,
    color: COLORS.black,
    paddingEnd: 5,
  },
  countContainer: {
    backgroundColor: '#ffff',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 5,
  },
  liveOrderInner: {
    backgroundColor: '#e1e9fb',
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  liveOrderOuter: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  container: {
    flex: 1,
    marginTop: StatusBar.length || 0,
    backgroundColor: 'white',
    margin: 10,
    flexDirection: 'column',
  },
  create: {
    fontSize: 25,
    marginTop: 70,
    fontWeight: 'bold',
    marginStart: 15,
  },
  editText: {
    height: 56,
    marginStart: 10,
    margin: 20,
    fontSize: 16,
  },
  editTextBox: {
    flexDirection: 'row',
    borderRadius: 5,
    marginTop: 30,
    elevation: 10,
    height: 50,
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'white',
  },
  edit: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'white',
  },
  fullNameImage: {
    height: 30,
    width: 30,
    marginStart: 10,
  },
  signArrow: {
    height: 30,
    width: 30,
    marginStart: 20,
  },
  back: {
    height: 30,
    width: 30,
    marginStart: 10,
    marginTop: 40,
  },
  signUpBtn: {
    flexDirection: 'row',
    height: 48,
    alignSelf: 'flex-end',
    borderRadius: 30,
    width: 160,
    marginTop: 20,
    marginEnd: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  already: {
    marginTop: 20,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex: 1,
  },

  select: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '93%',
    height: 80,
    borderRadius: 10,
    alignSelf: 'center',
    // marginVertical: 15,
    marginTop: 15,
    elevation: 10,
    backgroundColor: '#fccfcf',
    borderWidth: 1,
    borderColor: '#ff0000',
  },

  unselect: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '93%',
    height: 80,
    borderRadius: 10,
    alignSelf: 'center',
    // marginVertical: 15,
    marginTop: 15,
    elevation: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
});
