import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export default StyleSheet.create({
  noAccount: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(0, 0, 0, 255)',
  },
  mainContainer: {
    // paddingStart: 16,
    // paddingTop: 320,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logo: {
    alignSelf: 'center',
    marginVertical: 15,
  },
  header: {
    height: 56,
    width: '100%',
    backgroundColor: COLORS.white,
    elevation: 10,
    justifyContent: 'center',
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
  edit: {
    width: 18,
    height: 18,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizLine: {
    backgroundColor: 'rgba(112, 112, 112, 255)',
    width: '90%',
    height: 1,
  },
  reqOtpText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 255)',
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
  donText: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  signup: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 12,
    letterSpacing: 2,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: 'rgba(240, 79, 95, 255)',
    marginStart: 5,
  },
});
