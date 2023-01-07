import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';
export default StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    paddingTop: 150,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  copyRightText: {
    fontFamily: 'Segoe UI',
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 255)',
    // marginStart: 96,
    // marginTop: 231,
    position: 'absolute',
    bottom: 60,
  },
  logo: {
    width: 360,
    height: 360,
  },
});
