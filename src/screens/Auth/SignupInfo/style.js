import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';
export default StyleSheet.create({
  mainContainer: {
    // alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    height: 56,
    width: '100%',
    backgroundColor: COLORS.white,
    elevation: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    // paddingStart: 15,
  },
  loginHeader: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 20,
    color: 'rgba(0, 0, 0, 255)',
    paddingStart: 20,
  },
  line: {
    height: 0.5,
    backgroundColor: COLORS.darkGray,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  edit: {
    width: 15,
    height: 15,
    marginStart: 20,
    resizeMode: 'center',
  },
  faltuText: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 22,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 15,
  },
  code: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 255)',
    marginStart: 10,
  },
  textInput: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 16,
    letterSpacing: 0.5,
    color: 'rgba(112, 112, 112, 255)',
    marginStart: 16,
    width: '75%',
  },
  vertLine: {
    marginStart: 8,
    backgroundColor: 'rgba(112, 112, 112, 255)',
    height: 30,
    width: 1,
  },
  horizLine: {
    backgroundColor: 'rgba(112, 112, 112, 255)',
    width: '90%',
    height: 1,
    alignSelf: 'center',
  },
  reqOtpBtn: {
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 45,
    borderRadius: 10,
    backgroundColor: 'rgba(240, 79, 95, 255)',
  },
  reqOtpText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 255)',
  },
});
