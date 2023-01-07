import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/index';

export default StyleSheet.create({
  wrapper: {
    height: 45,
    // paddingHorizontal: 5,
    marginTop: 5,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  textInput: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    // fontFamily: 'Quicksand-Medium',
    color: COLORS.black,
    borderRadius: 30,
    // borderColor: COLORS.blue,
    // borderWidth: 1,
    paddingStart: 8,
    paddingEnd: 8,
    fontFamily: 'Segoe UI',
    // fontFamily: 'Quicksand-Regular',
  },
  error: {
    color: COLORS.red,
    paddingTop: 4,
    fontSize: 13,
    // fontFamily: 'Quicksand-Medium',
    // fontFamily: 'Quicksand-Regular',
  },
  label: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: 'Segoe UI Bold',
    // fontFamily: 'Quicksand-Medium',
  },
});
