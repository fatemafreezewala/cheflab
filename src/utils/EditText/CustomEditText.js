import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {COLORS} from '../../constants/index';
import styles from './styles';

const CustomEditText = ({
  onChangeText,
  iconPosition,
  icon,
  style,
  value,
  label,
  error,
  star,
  keyBoardType,
  maxLength,
  secureTextEntry,
  backgroundColor,
  borderWidth,
  borderRadius,
  borderColor,
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);

  const getFlexDirection = () => {
    if (icon && iconPosition) {
      if (iconPosition === 'left') {
        return 'row';
      } else if (iconPosition === 'right') {
        return 'row-reverse';
      }
    }
  };

  const getBorderColor = () => {
    if (error) {
      return COLORS.red;
    }

    if (focused) {
      return COLORS.white;
    } else {
      return COLORS.white;
    }
  };

  const getShadowColor = () => {
    if (error) {
      return COLORS.red;
    }

    if (focused) {
      return COLORS.white;
    } else {
      return COLORS.transparent;
    }
  };

  const getBgColor = () => {
    if (error) {
      return COLORS.white;
    }

    if (focused) {
      return COLORS.white;
    } else {
      return COLORS.white;
    }
  };
  return (
    <View style={[styles.inputContainer]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {star}
        </Text>
      )}
      <View
        style={[
          styles.wrapper,
          {alignItems: icon ? 'center' : 'baseline'},
          {borderColor: getBorderColor(), flexDirection: getFlexDirection()},
          {shadowColor: getShadowColor()},
          {shadowOpacity: 10},
          {
            shadowOffset: {
              width: 10,
              height: 10,
            },
            shadowRadius: 10,
            elevation: 10,
          },
          {
            backgroundColor: getBgColor(),
            borderColor: borderColor,
            borderBottomWidth: borderWidth,
            borderRadius: borderRadius,
          },
        ]}>
        <View>{icon && icon}</View>
        <TextInput
          autoCapitalize="none"
          style={[styles.textInput, style]}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.grey}
          value={value}
          keyboardType={keyBoardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          {...props}
        />
      </View>
      {/* {error && <Text style={styles.error}>{error} </Text>} */}
      {/* {error === '' ? null : <Text style={styles.error}>{error}</Text>} */}
    </View>
  );
};

export default CustomEditText;
