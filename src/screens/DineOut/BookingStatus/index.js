import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, icons} from '../../../constants';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import style from './style';

const BookingStatus = ({navigation, route}) => {
  const [receivedItem, setReceivedItem] = useState({});

  useEffect(() => {
    let {fullItem} = route.params;
    // ShowConsole(JSON.stringify(fullItem));
    /** {"name":"golu","mobile":"8827915701","selectedGuestNumber":"3",
     * "selectedGuestNumber":"9 Oct 2022","selectedTimeSlot":"10:00 - 11:00 Am","
     * receivedItem":{"name":"vikas test",
     * "image":"https://web10technologies.com/Chelab_full_project/public/v
     * endors/logo-LhqrXSXLpx6339473623d44.jpeg","
     * vendor_ratings":0,"id":4,"lat":24.476385,"long":74.862409,
     * "deal_categories":"1,4","is_like":0,"distance":1.8,"categories":["Pizza one","Chat"]}} */
    setReceivedItem(fullItem);
  }, []);

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            elevation: 10,
          }}>
          <ToolbarWithIcon showShare={false} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
              flexGrow: 1,
              maxWidth: Dimensions.get('window').width / 2 + 15,
            }}
            numberOfLines={1}>
            {/* {toolBarTitle} */}
            Booking Status
          </Text>
        </View>

        <View
          style={{
            marginTop: 25,
            marginStart: 15,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {receivedItem?.receivedItem?.name}
          </Text>

          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              flexGrow: 1,
            }}
            numberOfLines={1}>
            Indore
            {/* city name */}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 30,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              maxWidth: 100,
            }}>
            <Image
              source={icons.rest_req_accept}
              style={{
                height: 25,
                width: 25,
                resizeMode: 'center',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Segoe UI',
                color: COLORS.grey,
                marginTop: 5,
              }}
              numberOfLines={1}>
              Request Sent
            </Text>
          </View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginStart: 10,
              marginBottom: 15,
            }}></View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginBottom: 15,

              marginHorizontal: 2,
            }}></View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginHorizontal: 2,
              marginBottom: 15,
            }}></View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginBottom: 15,

              marginHorizontal: 2,
            }}></View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginBottom: 15,

              marginHorizontal: 2,
            }}></View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginHorizontal: 2,
              marginBottom: 15,
            }}></View>
          <View
            style={{
              height: 3,
              width: 15,
              backgroundColor: COLORS.grey,
              borderRadius: 10,
              marginBottom: 15,

              marginEnd: 10,
              marginStart: 2,
            }}></View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              maxWidth: 100,
            }}>
            <Image
              source={icons.waiting}
              style={{
                height: 25,
                width: 25,
                resizeMode: 'center',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Segoe UI',
                color: COLORS.grey,
                marginTop: 5,
              }}
              numberOfLines={1}>
              Waiting
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Segoe UI',
            color: COLORS.grey,
            textAlign: 'center',
            marginHorizontal: 10,
          }}>
          Waiting for restaurant confirmation,{'\n'}It may take up to 5 minutes
          {/* {'\n'}
          {'\n'}
          Domino's Pizza has booked your table, Please report restaurant on
          scheduled date and time.
          {'\n'}
          {'\n'}
          It looks like Domino's Pizza is unavailable for table booking, Please
          try to book with any other restaurant. */}
        </Text>
        {/* <Text
          style={{
            fontSize: 10,
            fontFamily: 'Segoe UI',
            color: COLORS.grey,
            textAlign: 'center',
            marginTop: 10,
            marginHorizontal: 10,
          }}>
          If unavailable waiting logo changed to cancelled, if available waiting
          logo changed to booked and status also changes
        </Text> */}

        <View
          style={{
            marginTop: 25,
            marginStart: 15,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            Booking Details
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              marginTop: 25,
            }}
            numberOfLines={1}>
            Name
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {receivedItem?.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              marginTop: 25,
            }}
            numberOfLines={1}>
            Phone Number
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {receivedItem?.mobile}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              marginTop: 25,
            }}
            numberOfLines={1}>
            No. of guests
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {receivedItem?.selectedGuestNumber}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              marginTop: 25,
            }}
            numberOfLines={1}>
            Date &amp; Time
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {receivedItem?.selectedBookingDate},{' '}
            {/* {receivedItem?.selectedTimeSlot} */}
            {new Date().getFullYear()}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              marginTop: 25,
            }}
            numberOfLines={1}>
            Restaurant Details
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {receivedItem?.receivedItem?.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
            }}
            numberOfLines={1}>
            {/* 432, Prem Trade Centre, Indore */}
            {/* address will show here */}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('BookingStatus');
            navigation.reset({
              index: 0,
              routes: [{name: 'MainContainer'}],
            });
          }}
          activeOpacity={0.8}
          style={{
            paddingHorizontal: 50,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 10,
            marginVertical: 25,
            // position: 'relative',
            // bottom: 15,
            width: '90%',
          }}>
          <Text
            style={{
              fontFamily: 'Segoe UI Bold',
              fontSize: 22,
              color: COLORS.white,
            }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingStatus;

const styles = StyleSheet.create({});
