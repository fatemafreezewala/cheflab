import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../constants';

import {Rating, AirbnbRating} from 'react-native-elements';

const ChefLabSpecial = ({items, smallText, heading}) => {
  const [showAdd, setShowAdd] = useState(false);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          marginVertical: 10,
          backgroundColor: COLORS.white,
          elevation: 10,
          borderRadius: 10,
          margin: 5,
          // flex: 1,
          // marginStart: index == 0 ? SIZES.padding + 5 : 10,
          // marginEnd: index == items?.length - 1 ? SIZES.padding + 2 : 0,
        }}>
        {/* <View
          style={{
            margin: 5,
            elevation: 10,
            backgroundColor: COLORS.white,
            borderRadius: 10,
            // opacity: 10,
            shadowColor: COLORS.grey,
            shadowOpacity: 0.5,
          }}> */}
        <Image
          // source={{
          //   uri: item.image,
          // }}
          source={item.image}
          style={{
            height: 180,
            width: 180,
            borderRadius: 10,
            resizeMode: 'cover',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            // setFavorite(!favorite);
          }}
          style={{
            right: 5,
            top: 5,
            position: 'absolute',
            borderRadius: 50,
            backgroundColor: '#f5f5f5',
            alignSelf: 'flex-end',
          }}>
          <Image
            source={icons.favorite}
            style={{
              width: 30,
              height: 30,
              tintColor: item?.favorite ? '#ff0000' : '#707070',
            }}
          />
        </TouchableOpacity>
        {/* <View
          style={{
            marginEnd: 5,
            bottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#829bff',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}>
          <Image source={icons.star} style={styles.star_logo} />
          <Text style={styles.starText} numberOfLines={1}>
            {item?.star}
          </Text>
         </View> 
        </View> */}
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI Bold',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 0,
            alignSelf: 'center',
          }}>
          {item?.name}
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 12,
            color: COLORS.grey,
            // marginTop: 0,
            alignSelf: 'center',
            marginVertical: 2,
          }}>
          ({item?.siteName})
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.grey,
            marginVertical: 2,
            alignSelf: 'center',
          }}>
          {item?.restName}
        </Text>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {/* <Image source={icons.star} style={styles.star_logo} /> */}
          {/* <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} /> */}
          <AirbnbRating
            isDisabled={true}
            count={5}
            showRating={false}
            defaultRating={parseInt(item.star)}
            size={10}
          />
          <Text
            style={{
              marginHorizontal: 3,
              fontFamily: 'Segoe UI Bold',
              fontSize: 14,
              color: COLORS.black,
              // marginTop: 0,
              alignSelf: 'center',
              marginVertical: 2,
            }}>
            {item.star}
          </Text>
          <Text
            style={{
              // marginHorizontal: 10,
              fontFamily: 'Segoe UI',
              fontSize: 10,
              color: '#0638ff',
              // marginTop: 0,
              alignSelf: 'center',
              marginVertical: 2,
            }}>
            ({item?.reviewCount}) Reviews
          </Text>
        </View>
        <View
          style={{
            // justifyContent: 'space-evenly',
            // alignItems: 'center',
            flexDirection: 'row',
            paddingBottom: 10,
            marginTop: 15,
            // position: 'relative',
            // bottom: 0,
          }}>
          {/* <View>*/}
          {item?.customize ? (
            <Text
              style={{
                // marginHorizontal: 10,
                fontFamily: 'Segoe UI',
                fontSize: 10,
                color: '#0638ff',
                position: 'absolute',
                alignSelf: 'center',
                marginVertical: 2,
                top: -15,
                left: 15,
              }}>
              Customizable
            </Text>
          ) : null}

          {showAdd ? (
            <View
              style={{
                height: 30,
                width: 70,
                backgroundColor: COLORS.primary,
                marginStart: 12,
                borderRadius: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.white,
                }}>
                -
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.white,
                }}>
                1
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.white,
                }}>
                +
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setShowAdd(!showAdd);
              }}>
              <Text
                style={{
                  marginHorizontal: 10,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 16,
                  // marginTop: 0,
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  alignSelf: 'center',
                  // marginVertical: 2,
                  color: COLORS.primary,
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 15,
                }}>
                Add
              </Text>
            </TouchableOpacity>
          )}
          {/* </View> */}
          <Text
            style={{
              fontFamily: 'Segoe UI Bold',
              fontSize: 18,
              position: 'absolute',
              bottom: 10,
              right: 15,
              marginTop: 0,
              paddingVertical: 5,
              alignSelf: 'flex-end',
              marginVertical: 2,
              color: COLORS.black,
            }}>
            ₹{item?.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={styles.smallText}>{smallText}</Text>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
        }}>
        <Text style={styles.moodText}>{heading}</Text>
        {/* <TouchableOpacity
          style={{
            position: 'absolute',
            right: 20,
          }}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={items}
        numColumns={2}
        style={{
          alignSelf: 'center',
          flexGrow: 1,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ChefLabSpecial;

const styles = StyleSheet.create({
  distance: {
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Segoe UI',
    fontSize: 12,
    marginStart: 10,
    // paddingBottom: 15,
  },
  distance_logo: {
    // paddingBottom: 15,
    width: 15,
    height: 15,
    resizeMode: 'cover',
  },
  star_logo: {
    width: 12,
    height: 12,

    resizeMode: 'cover',
  },
  starText: {
    color: COLORS.white,
    // marginTop: 5,
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    marginStart: 5,
  },
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginStart: 15,
    // marginTop: 28,
  },
  smallText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    color: '#707070',
    marginStart: 16,
    marginTop: 28,
  },
  viewAll: {
    fontFamily: 'Segoe UI',
    fontSize: 14,
    color: '#0638ff',
    alignSelf: 'flex-end',
    marginVertical: 2,
    textDecorationLine: 'underline',
  },
});
