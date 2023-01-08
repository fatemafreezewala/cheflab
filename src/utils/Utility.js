import {Alert, Platform, ToastAndroid} from 'react-native';

export const ShowMessage = msg => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  } else {
    Alert.alert(msg);
  }
};

export const ShowConsole = (msg, m = '') => {
  console.log(msg + ' ' + m);
};

export const validatePassword = text => {
  // console.log(text);
  let reg =
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,16}$/;
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
  if (reg.test(text) === false) {
    console.log('Password is Not Correct');
    return false;
  } else {
    console.log('Password is Correct');
    return true;
  }
};

export const validateEmail = text => {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(text) === false) {
    console.log('Email is Not Correct');
    return false;
  } else {
    console.log('Email is Correct');
    return true;
  }
};

export const validateMobileNumber = text => {
  var reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    // alert("message");
    return true;
  }
};

export const validateFieldNotEmpty = text => {
  if (text === '') {
    return true;
  } else {
    return false;
  }
};

export const validateVehicleNumber = text => {
  var reg = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
};

export const dateTime = val => {
  // console.log('val p-p-p ===> ', val);
  // let dat = new Date(val);
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  var halfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var d = new Date(val);
  // console.log('= new Date(val);   -> ', d);

  var dayName = days[d.getDay()];
  var halfDayName = halfDays[d.getDay()];

  let timestampMilli = val;
  // console.log('timestampMilli -> ', timestampMilli + ' ' + d.getDay());
  // let timestampMilli = dat.getTime();

  let cMonthWord = '';
  switch (new Date(timestampMilli).getMonth() + 1) {
    case 1: {
      cMonthWord = 'Jan';
      // setCurrentMonth('Jan');
      break;
    }
    case 2: {
      cMonthWord = 'Feb';
      // setCurrentMonth('Feb');
      break;
    }
    case 3: {
      cMonthWord = 'Mar';
      // setCurrentMonth('Mar');
      break;
    }
    case 4: {
      cMonthWord = 'Apr';
      // setCurrentMonth('Apr');
      break;
    }
    case 5: {
      cMonthWord = 'May';
      // setCurrentMonth('May');
      break;
    }
    case 6: {
      cMonthWord = 'Jun';
      // setCurrentMonth('Jun');
      break;
    }
    case 7: {
      cMonthWord = 'Jul';
      // setCurrentMonth('Jul');
      break;
    }
    case 8: {
      cMonthWord = 'Aug';
      // setCurrentMonth('Aug');
      break;
    }
    case 9: {
      cMonthWord = 'Sep';
      // setCurrentMonth('Sep');
      break;
    }
    case 10: {
      cMonthWord = 'Oct';
      // setCurrentMonth('Oct');
      break;
    }
    case 11: {
      cMonthWord = 'Nov';
      // setCurrentMonth('Nov');
      break;
    }
    case 12: {
      cMonthWord = 'Dec';
      // setCurrentMonth('Dec');
      break;
    }
    default: {
      cMonthWord = '';
      // setCurrentMonth('');
      break;
    }
  }

  let startDate =
    new Date(timestampMilli).getDate() +
    ' ' +
    cMonthWord +
    ' ' +
    new Date(timestampMilli).getFullYear();

  let monthStart = cMonthWord + ' ' + new Date(timestampMilli).getDate() + '';
  let monthStartYear =
    cMonthWord +
    ' ' +
    // new Date(timestampMilli).getDate() +
    timestampMilli.substring(8, 10) +
    ' ' +
    new Date(timestampMilli).getFullYear();

  let monthStartYearComma =
    cMonthWord +
    ' ' +
    // new Date(timestampMilli).getDate() +
    timestampMilli.substring(8, 10) +
    ', ' +
    new Date(timestampMilli).getFullYear();

  // console.log(
  //   ' new Date(timestampMilli).getDate() ===> ',
  //   timestampMilli +
  //     ' ' +
  //     new Date(timestampMilli).getDate() +
  //     ' ---> ' +
  //     timestampMilli.substring(8, 10),
  // );
  // timestampMilli.substring(9, 10);

  // let endTime = item.endtime;
  // let eDate = new Date(endTime);
  // let endTimestampMilli = eDate.getTime();
  // /** logout time  */

  // var endate, enTimeType, enhour, enminutes, enseconds, enloginTime;

  // endate = new Date(endTimestampMilli);

  // enhour = endate.getHours();

  // if (enhour <= 11) {
  //   enTimeType = 'AM';
  // } else {
  //   enTimeType = 'PM';
  // }
  // if (enhour > 12) {
  //   enhour = enhour - 12;
  // }

  // if (enhour == 0) {
  //   enhour = 12;
  // }

  // enminutes = endate.getMinutes();

  // if (enminutes < 10) {
  //   enminutes = '0' + enminutes.toString();
  // }
  // enseconds = endate.getSeconds();

  // if (enseconds < 10) {
  //   enseconds = '0' + enseconds.toString();
  // }

  // enloginTime =
  //   enhour.toString() +
  //   ':' +
  //   enminutes.toString() +
  //   ':' +
  //   enseconds.toString() +
  //   ' ' +
  //   enTimeType.toString();
  // /** logout time  */

  var date, TimeType, hour, minutes, seconds, loginTime;

  date = new Date(timestampMilli);

  hour = date.getHours();

  if (hour <= 11) {
    TimeType = 'AM';
  } else {
    TimeType = 'PM';
  }
  if (hour > 12) {
    hour = hour - 12;
  }

  if (hour == 0) {
    hour = 12;
  }

  minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = '0' + minutes.toString();
  }
  seconds = date.getSeconds();

  if (seconds < 10) {
    seconds = '0' + seconds.toString();
  }

  loginTime =
    hour.toString() +
    ':' +
    minutes.toString() +
    // ':' +
    // seconds.toString() +
    ' ' +
    TimeType.toString();

  return {
    loginTime,
    startDate,
    monthStart,
    monthStartYear,
    dayName,
    halfDayName,
    monthStartYearComma,
  };
};

export const dateTimeCustom = (h, m) => {
  var endate, enTimeType, enhour, enminutes, enseconds, enloginTime;

  enhour = parseInt(h);

  if (enhour <= 11) {
    enTimeType = 'AM';
  } else {
    enTimeType = 'PM';
  }
  if (enhour > 12) {
    enhour = enhour - 12;
  }

  if (enhour == 0) {
    enhour = 12;
  }

  enminutes = parseInt(m);

  if (enminutes < 10) {
    enminutes = '0' + enminutes.toString();
  }

  enloginTime =
    enhour.toString() +
    ':' +
    enminutes.toString() +
    ' ' +
    enTimeType.toString();

  enseconds = enhour.toString() + ':' + enminutes.toString();

  /** logout time  */
  return {
    enloginTime,
    enseconds,
  };
};

export const timeToTime = time => {
  let h = time.split(' ')[1];
  let ch = h.split(':')[0];
  let m = time.split(':')[1];

  let s = dateTimeCustom(ch, m).enseconds;
  let e = dateTimeCustom(ch, m).enloginTime;

  return {s, e};
};
