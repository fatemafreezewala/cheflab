import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {COLORS, icons, images, SIZES} from '../../constants/index';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import WhatsMind, {
  WhatsMindSkeleton,
  WhatsMindTitleSkeleton,
} from '../../utils/WhatsMind';

import {useDispatch, useSelector} from 'react-redux';
import {updateCartCount} from '../../redux/actions';
import {ShowMessage} from '../../utils/Utility';
import style from './style';
import ChefTopRated, {ChefTopRatedSkeleton} from './utils/ChefTopRated';

const Chef = ({navigation}) => {
  const image = [
    {
      image:
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
      desc: 'Silent Waters in the mountains in midst of Himilayas',
    },
    {
      image:
        'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      desc: 'Red fort in India New Delhi is a magnificent masterpiece of humans',
    },
    {
      image:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
      desc: 'Red fort in India New Delhi is a magnificent masterpiece of humans',
    },
  ];

  const [mindData, setMindData] = useState([
    {image: images.poha, title: 'Poha'},
    {image: images.pizza, title: 'Pizza'},
    {image: images.burger, title: 'Burger'},
    {image: images.sandwich, title: 'Sandwich'},
    {image: images.poha, title: 'Chinese'},
    {image: images.pizza, title: 'Pizza'},
    {image: images.burger, title: 'Burger'},
    {image: images.sandwich, title: 'Sandwich'},
    {image: images.poha, title: 'Chinese'},
  ]);

  const [changeOne, setChangeOne] = useState(true);
  const [changeTwo, setChangeTwo] = useState(false);
  const [changeThree, setChangeThree] = useState(false);

  const [onceMore, setOnceMore] = useState([
    {
      image: images.domino,
      title: `Domino's Pizza`,
      distance: '2.5KM',
      star: '4.5',
    },
    {image: images.sai_kripa, title: 'Sai Kripa', distance: '1 KM', star: '5'},
    {
      image: images.guru_kripa,
      title: 'Guru Kripa',
      distance: '2.5KM',
      star: '4.5',
    },
    {
      image: images.guru_kripa,
      title: 'Guru Kripa',
      distance: '2.5KM',
      star: '4.5',
    },
  ]);

  const [foodyRest, setFoodyRest] = useState([
    {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSubpIg_ZcywmfoAgtYPdhR7zWB1wvlCTLqsQ&usqp=CAU',
      name: 'Shree Maya',
      distance: '2.5 KM',
      star: '3.5',
      favorite: true,
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHgr74kTlCidBNXmgzQhhqNdSHE9nalyBjAQ&usqp=CAU',
      name: 'Radisson Blu',
      distance: '5 KM',
      star: '5',
      favorite: false,
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRICWIiZ_UhzgiXQkYc1HKw7m_bdFPSyiAbmA&usqp=CAU',
      name: 'Sayaji Restaurant',
      distance: '3.5 KM',
      star: '4.2',
      favorite: false,
    },
  ]);

  const [featuredRest, setFeaturedRest] = useState([
    {
      image:
        'data:image/jpeg;base64,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',
      name: 'Pizza Hut',
      distance: '2.5 KM',
      star: '3.5',
      favorite: true,
    },
    {
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAZlBMVEXqAAD/wwDpAAD0oaH/xgD/zAD/yAD/ygDuQADrHQDsKQD2iAD8rgD/wQD6pAD8sgDsMQD5nAD+uwD1fgDuRwD9twDyZgD7qgDxXgD0dwDwVQDzcgDyawD4lQD3jgDvTQD/0gD60tLmHV6dAAAK5ElEQVR4nO2d53rjuA6GLcaS7NiOe3rx3P9NrltiolDCR2p3DnOIP/vsRBD5sqCRSkZ/7n63/Bndud8td0fC0W+WQpi/FML8pRDmL4UwfymE+UshzF8KYf5SCPOXQpi/FML8pRDmL4UwfymE+UshzF8KYf5SCPOXQpi/FML8pRDmL4UwfymE+UshzF8KYcQbr/J31JUXDkvo3Oplvdzvnz7epzGvdaPnz6f9ZrneToaCHJbQPS7rZjyuqnHT1g+v6IvdZF23zUl93NSbt2EYhyR0k3177N63jOv5Cnm1m65rT71qF/AQqa8djtDNSAfPjDP7u917y9Srej1A1wYknLeVkHZu7si6lurNJmo30xcPRTjdNLKHx2lcGPu41NXH0ELXZCjC6YIvse8+VveW9+9VwNM0piIORbgJAJ4Qp/292AfVq/F9Ws+GIXRz34Y2bevPyHjTr+4/f1QnJnmR2LchCN2HZ2Ta5ftkt628Po/n3S0Q9XEz+5o8P9R29b7ODUDoHr3+1C8nR+3c2ofudBru3VNv5hf1V7N6b+8GIJx6vamfr287ekfvX7t898oH/PaAbuK/dJfQxQEI/U3Yvvy8zH34CzXchvOMlLcg3asHvvirhO7tNtrjB+9dvoEkP6DqM38T+uqz2wg1H/F9TCf012hDfuIvv5/VyyX8kNt4P5lE9y+Z0K3VNXr+0cx3AnorbulN9BNV99bpeB/dyWTCXdd28dxaoxrEY7jtTdSK/dDf4O/RKXUioT8H7Rt7k9t6k1hrsYnzJnksMgl/9AJrwNDDNEL33NkJ55tTxdiQdSyHwB++ZhvZzVRCzxoofaAE0lo4347KEXDPQSsGdDGJ0D3620iJsKd+9PXEG3Kf/gB8Ke/3Foi+kQ19TCP0plB1ee7BMzb1jv3U5682mrq/BiInMYmQrKJWi8xIfMknkfZf3WckoovbiWmESz/LUV/jrzOxE/2yh7bGWQtx5jSJ0LfmYz2wIluN+gPiS+QmvTzz4j0T5xNTCP1w5rhI9YeITyMTRaa3CfSebNWowCaFkLQeyh7cwufw7CGxw1UdUveXqWZueyWBkK6yUGmTLFN/K9FNrC9SayOd3Uwg9GenfQy9xbem/mMTfwU0LyF18lgd081oQuIIgquMRm5eiksSZD1ovTxHVnlwIDr6GU/o25mOahFx+jcUAq66++tzH2PTc+F+xq9SssrCIZV7a5QHqZ1pPsPq1CDhmXA0Ie1422HlVuRA4ppDuidyzNRRqSIWu2Mogh2NJpyTLna8g+ykb4tP+t1pQdzefxKPa6IJqTMMGftzE2QnXWIfEqtU42WXOnE3ocCiQz+SkHaxM7Nx78SonEMDGm92q5ONGAgOu3oaS0gXaefI0o14fvae/lOoEHcWuqA7Kq+BnkYS2vcRC0DPs0BXQCCv+FEn+xheppGE1JL2hMTEc1YnY0FXQI+Xo+qwNY0lfJLWI/zwlgxH++XYwutRpxOOVvhjVynpYij1+ZYvcsJ/tCvU9jS8CslkR9RRpx9HSMoXx1npa5ReQtiwZYupo8WMSMIP2sWeN/gFq9MsTOmhfThqv6oTn48emEYSkh52Ouzz43TOxux/e9XpePYNCNeOIpwglkLYioqaVlQ9nIrq2jGEzDj2WQqWBXPpV6eWCgxr4gif6DbklV4h1Dsw6cpLrkLVMX8RR0inpL+2QMMSJv37iqnzU7ge5RhCumoMY0rzfCawev+yJsoRhGwbhs/obxozamrS1LGSWxQh3YaGQyEWxFSp6v86IV2kfTHbSXZhYxqhDm3EGELWXr8pPTYTNqYWdWZMLYNyaxon5P7bEmPQIAhXp8YU8ogxhCzds+wKtnVT1ZGyaQwhG1BLJMxCy1R1JDSNIKQ1FtuSYQ4GVmcbAyll4IQsN7Tla1wpUR3JESMImfe2hfqTEGGUuiFKuPUXJ2S7vjdDv0jIXUSq/6uEbEfZdn3QXXRXEn/UFzFaF1WYcMWG01aiZfXDmzRR6l1HOVwVJaRFdkMN4qrGnei32G4fcHXA1OCEzNAYA/1QdmG0GZGtnlVhQpbqGa+bsSL5Td1WwhbZhT2qwQnZnjcerbtAqca63Li6/c4CbmmYoek+N7pJwCFaC2crpm7KSM4CE35FNhUoRhnKUBdh6vZKBkoo9pPVMzl9DsPXTJg6M8X2IyiY8DPK4YvKPqxOT/O7z9WpJkrIEz1r8TKUIVrVebXOXDSFCZkpNZ+T6C7f/B2FSDDNKSJsaXjMZnW9uss3JwlC3WxMUUJu9M07Xs+BzRUXYeHM5zMgIY9K7QEi+Trmpm69gC9SaLsmSMhnwl7YU4Ma+2VDXnG1bw+QkNsLexqjBjX2s8B7bgBsOQ1OyNM8Y4qudPE6QOamubr16hBKyLtojUmULmIDxEsL9mAKtKW8m/bKpegiNkAiJrIODkgoNpP9mpkatgFJkNgfxi2MEcosD8hEl0pQY6vSnNV52Gb1UyAh97vA5Rb1HNh+JC/CNmusARLy2AkozWqBqdnkJzQNEvJeAudcIu+qkBxIxhrWoB0k5Nsd+OxRC72Rkpk4KDcaOZCQ3xpB6pYvCiGwBMTZjtEOg4TcHQIXP7TbCsiXr7xAZD3NxwhFOQm4Y6YdsCGnZMIVG4tYGKFsBTiqVJIL5DsmEdcaRxcilA7fXrZUb5xAlyrEDjHWoiFCsZWQmy28qFvZy8nnxgWh8TwBIhSVCOAcT0ufoPN4rmw9E4IIhdNGPnlUbg0hi1xE7tZjK4hQBF7QtQ+FELh3LyJ3Y1CDEcqqLkIo9yGQPyunyLawHSPc8y5Cl5MEILSNZW5ivEEAEfKgDfrVP8pFYWgbR24RjFBUg5BvH+QKwLaxuDhmc1VYTCMIgZs7WpLf9ykKURe5ic0SQ4TCo0H3kZULJ8jHhAqhyZtChLIOBV30lJYY+a5Ahhu2wBQiFAkM9JvilEINZIpFfmlL3RBCmf9Av9lIKdRAplgExbbcCyKUbaQRAoUo5djL2DpEKNcJ8i2gNPcYoVxBpj0CEYq9Dv0mDoUQ+pRQJKc2Sw4RCnsNfZ8jMxOgmDhS7JzNG0OEoovYhw9igKCAQdYIbAMEEYplBn3smEoovbFpkUOEwhgiVYhkQlkFMTkbiFC4bOCqrkoIfYQmqyCmgAEiFGEX9CscUgmVu3+DE4rQ2Xyz8KwunE0q4e30sePvmkCEIsFDKknJhLLO851eutH2mJk96WYPIhTn1EglKZlQXnW4Erpd/bEbudf5RiuKQISiDPG3CS//PjnspqvJxB0b0JpFCHkLIOHsUDMZZJW66t2tq+X+cPyP8kKIUGQ/2Hfj03suQKlNJTzpu+fKufXWudfG3R8UNYRQHABihImiEJ7Kre7j40L43Di3kCEIRCiCCqSimyyB5t3DkW69WC7rR+fmMtmBCPVB/K8ksITcenYk/FzVK3f0ZzIVyJqwPRO+Ld2J8vFU1jrIbZNICJmKRJGG7kw4coeJezjO43Lmtkosnjfh2Vm5t8o9HwPk++3qoHivX0B4CulfT2Hp20H9hdtIvfTQMjn8p4R1zZu/Tpn7WtbzZf2g/mUprOYtBIq6UkU2/zPAbjQJ/TnBgf/+4f+gFML8pRDmL4UwfymE+UshzF8KYf5SCPOXQpi/FML8pRDmL4UwfymE+UshzF8KYf5SCPOXQpi/FML8pRDmL4UwfymE+UshzF8KYf7yf0L4u+Vu9Ofud8uffwAUnXi39h6OJAAAAABJRU5ErkJggg==',
      name: 'Mc Donalds',
      distance: '1.5 KM',
      star: '4.5',
      favorite: false,
    },
    {
      image:
        'data:image/png;base64,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',
      name: `La Pino'z Pizza`,
      distance: '3.5 KM',
      star: '4.2',
      favorite: false,
    },
  ]);

  const [featuredDish, setFeaturedDish] = useState([
    {
      image: images.dal_bati,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: true,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.sandwich,
      name: 'Chole Bhature',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: false,
      amount: '180',
    },
    {
      image: images.poha,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.dal_bati,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: true,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.sandwich,
      name: 'Chole Bhature',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: false,
      amount: '180',
    },
    {
      image: images.poha,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.dal_bati,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: true,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.sandwich,
      name: 'Chole Bhature',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: false,
      amount: '180',
    },
    {
      image: images.poha,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.dal_bati,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: true,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.sandwich,
      name: 'Chole Bhature',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: false,
      amount: '180',
    },
    {
      image: images.poha,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.dal_bati,
      name: 'Dal bati Churma',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: true,
      reviewCount: 125,
      customize: true,
      amount: '180',
    },
    {
      image: images.sandwich,
      name: 'Chole Bhature',
      siteName: 'North Indian',
      restName: 'Radisson Blu',
      star: '3.5',
      favorite: false,
      reviewCount: 125,
      customize: false,
      amount: '180',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [cuisinesData, setCuisinesData] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    getInfoFromStorage();
    if (isFocused) {
      getInfoFromStorage();
    }
    setLoading(false);
  }, []);

  const renderDynamicBlogPromotion = ({item, index}) => {
    return item?.vendors?.length != 0 && item?.vendors != undefined ? (
      <>
        {item?.vendors?.length > 0 ? (
          <ChefTopRated
            smallText={item?.blog?.name + ''}
            heading={item?.blog?.blog_type == '1' ? 'Featured' : 'Sponsored'}
            loading={item?.vendors?.length <= 0}
            items={item?.vendors}
          />
        ) : null}
      </>
    ) : item?.products?.length != 0 && item?.products != undefined ? (
      <>
        {item?.products.length <= 0 ? null : (
          <>
            <Text
              style={[
                style.smallText,
                {
                  marginTop: 12,
                },
              ]}>
              {item?.blog?.name}
            </Text>
            <Text style={styles.moodText}>
              {item?.blog?.blog_type == '1' ? 'Featured' : 'Sponsored'}
            </Text>
          </>
        )}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={item?.products[1]}
          extraData={item?.products[1]}
          renderItem={renderFeaturedDish}
          // renderItem={renderBlogFlatList}
        />
      </>
    ) : null;
  };

  const updateCart = async i => {
    console.log(
      'add to cart rec item-> ',
      JSON.stringify(i) + 'cartId => ' + cartId + ' userId -> ' + userId,
    );

    let body = {
      cart_id: cartId,
      // cart_id: '1',
      user_id: userId,
      vendor_id: i?.vendor_id + '',
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: i.cart_qty,
        },
      ],
    };

    if (i.options) {
      // const itemss = i.options?.find(x => x.variant_qty > 1);
      const itemss = i.options?.reduce(function (acc, cur) {
        if (selectedOption?.id == cur.id) {
          // if (cur.variant_qty > 1) {
          var o = {
            variant_id: cur?.id + '',
            variant_qty: cur.variant_qty + '',
          };
          //   acc.push(o);
          // } else {
          // var o = {variant_id: cur?.id, variant_qty: '1'};
          acc.push(o);
          // }
        }
        return acc;
      }, []);
      if (itemss) {
        // Object.assign(body, {variants: itemss});
        let temp = Object.assign({}, body.products[0]);
        temp.variants = itemss || [];
        console.log(
          'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
        );
        body.products[0] = temp;
      }
    }

    if (i?.addons) {
      // let ads = i?.addons?.map(item => {
      //   if (item?.selected) {
      //     return {
      //       addon_id: item?.id,
      //       addon_qty: '1',
      //     };
      //   }
      // });

      let ads = i?.addons?.reduce(function (acc, cur) {
        if (cur.selected) {
          var o = {addon_id: cur?.id + '', addon_qty: '1'};
          acc.push(o);
        }
        return acc;
      }, []);

      if (ads) {
        // Object.assign(body, {addons: ads});
        let temp = Object.assign({}, body.products[0]);

        temp.addons = ads || [];

        body.products[0] = temp;
      }
    }

    // cartArray.push(body);
    // cartArray.push(body.products);

    console.log(
      'final add to cart array  update cart api last body = > ',
      JSON.stringify(body),
    );

    ApiCall('post', body, API_END_POINTS.updateCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'add to caret api resoinse p  updateCart r--> ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          // ShowMessage(response?.data?.message);

          getUserCartCount(apiToken, userId);
        } else {
          ShowMessage(response?.data?.error + '');
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      });
  };

  const onAddModalPlus = (action, index, arr, data, idx) => {
    let t = 0;

    let a = arr?.map((item, i) => {
      let temp = Object.assign({}, item);
      if (index == temp.id) {
        if (action == 'more') {
          // setOptionListCount(optionListCount + 1);
          temp.variant_qty = parseInt(temp?.variant_qty) + 1;
          t = totalMoney + parseInt(temp?.variant_price);
        }
      }
      return temp;
    });

    setTotalMoney(t + '');

    setPData({
      ...pData,
      options: a,
    });

    restHomePageDataFoody[newCartIndex] = {
      ...pData,
      options: a,
    };

    setRestHomePageDataFoody(restHomePageDataFoody);
  };

  const onAddModalMinus = (action, index, arr, d, idx) => {
    let t = 0;
    let a = arr?.map((item, i) => {
      let temp = Object.assign({}, item);

      if (index == temp.id + '') {
        if (action == 'less') {
          if (parseInt(temp?.variant_qty) == 1) {
            t = totalMoney;
            setTotalMoney(t + '');
          } else if (parseInt(temp?.variant_qty) > 1) {
            temp.variant_qty = parseInt(temp?.variant_qty) - 1;
            t = totalMoney - parseInt(temp?.variant_price);
            setTotalMoney(t + '');
          }
        }
      }

      return temp;
    });

    setPData({
      ...pData,
      options: a,
    });
  };

  const [cartId, setCartId] = useState(null);

  const newMinusOut = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign({}, item);
      if (productId == temp.product_id + '') {
        // console.log(JSON.stringify(temp.qty), ' dasta ');

        temp.cart_qty = parseInt(temp.cart_qty) - 1;
        // checkArray();
        updateCart(temp);
      }
      return temp;
    });

    setRestHomePageDataFoody(b);
  };

  const [restaurantAllData, setAllRestaurantData] = useState([]);
  const [loadNextData, setLoadNextData] = useState(false);
  const [blogPromotionData, setBlogPromotionData] = useState([]);

  const [pData, setPData] = useState({});

  const [showItemExist, setShowItemExist] = useState(false);

  const [itemExistData, setItemExistData] = useState({});

  const [cartItemIndex, setCartItemIndex] = useState(0);
  const [newCartIndex, setNewCartIndex] = useState(0);
  const [totalMoney, setTotalMoney] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionListCount, setOptionListCount] = useState(1);
  const [addonPrice, setAddonPrice] = useState(0);

  const addToCart = async i => {
    console.log('add to cart rec item-> ', JSON.stringify(i));

    // if (cartArray.length == 0) {
    let body = {
      user_id: userId,
      vendor_id: i?.vendor_id + '',
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: i.cart_qty || i?.qty || 1,
        },
      ],
    };

    if (i.options) {
      // const itemss = i.options?.find(x => x.variant_qty > 1);
      const itemss = i.options?.reduce(function (acc, cur) {
        if (selectedOption?.id == cur.id) {
          // if (cur.variant_qty > 1) {
          var o = {
            variant_id: cur?.id + '',
            variant_qty: cur.variant_qty + '',
          };
          //   acc.push(o);
          // } else {
          // var o = {variant_id: cur?.id, variant_qty: '1'};
          acc.push(o);
          // }
        }
        return acc;
      }, []);
      if (itemss) {
        // Object.assign(body, {variants: itemss});
        let temp = Object.assign({}, body.products[0]);
        temp.variants = itemss || [];
        console.log('temp.variants item => ' + JSON.stringify(temp));
        body.products[0] = temp;
      }
    }

    if (i?.addons) {
      let ads = i?.addons?.reduce(function (acc, cur) {
        if (cur.selected) {
          var o = {addon_id: cur?.id + '', addon_qty: '1'};
          acc.push(o);
        }
        return acc;
      }, []);

      if (ads) {
        // Object.assign(body, {addons: ads});
        let temp = Object.assign({}, body.products[0]);

        temp.addons = ads || [];

        body.products[0] = temp;
      }
    }

    console.log('add to cart rec itemsdsssssss-> ', JSON.stringify(body));

    console.log(
      'add to cart rece item temp inb lasrt body else statement  --> ',
      JSON.stringify(body),
    );
    // setCartArray(body);

    ApiCall('post', body, API_END_POINTS.productAddToCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'add to caret api resoinse p --> ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          // ShowMessage(response?.data?.message);
          setCartId(response?.data?.response?.cart_id);
          AsyncStorage.setItem(
            'cart_id',
            JSON.stringify(response?.data?.response?.cart_id),
          );
          // setCartId(response?.data?.response?.cart_id);
          getUserCartCount(apiToken, userId);
          // checkCartAndDataArray(restHomePageDataFoody, cartData);
        } else {
          ShowMessage(response?.data?.error + '');
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      });
    setLoading(false);
    // } else {
    //   let body = {
    //     cart_id: cartId,
    //     user_id: userId,
    //     vendor_id: i?.vendor_id + '',
    //     products: cartArray.push({
    //       product_id: parseInt(i.product_id),
    //       product_qty: i.qty,
    //     }),
    //   };

    //   if (i.options) {
    //     // const itemss = i.options?.find(x => x.variant_qty >22 1);
    //     const itemss = i.options?.reduce(function (acc, cur) {
    //       if (selectedOption?.id == cur.id) {
    //         // if (cur.variant_qty > 1) {
    //         var o = {
    //           variant_id: cur?.id + '',
    //           variant_qty: cur.variant_qty + '',
    //         };
    //         //   acc.push(o);
    //         // } else {
    //         // var o = {variant_id: cur?.id, variant_qty: '1'};
    //         acc.push(o);
    //         // }
    //       }
    //       return acc;
    //     }, []);
    //     if (itemss) {
    //       // Object.assign(body, {variants: itemss});
    //       let temp = Object.assign({}, body.products[0]);
    //       temp.variants = itemss || [];
    //       console.log(
    //         'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
    //       );
    //       body.products[0] = temp;
    //     }
    //   }

    //   if (i?.addons) {
    //     // let ads = i?.addons?.map(item => {
    //     //   if (item?.selected) {
    //     //     return {
    //     //       addon_id: item?.id,
    //     //       addon_qty: '1',
    //     //     };
    //     //   }
    //     // });

    //     let ads = i?.addons?.reduce(function (acc, cur) {
    //       if (cur.selected) {
    //         var o = {addon_id: cur?.id + '', addon_qty: '1'};
    //         acc.push(o);
    //       }
    //       return acc;
    //     }, []);

    //     if (ads) {
    //       // Object.assign(body, {addons: ads});
    //       let temp = Object.assign({}, body.products[0]);

    //       temp.addons = ads || [];

    //       body.products[0] = temp;
    //     }
    //   }

    //   // cartArray.push(body);
    //   cartArray.push(body.products);

    //   console.log('fibnal add to cart array = > ', JSON.stringify(cartArray));

    //   ApiCall('post', body, API_END_POINTS.updateCart, {
    //     Authorization: `Bearer ${apiToken}`,
    //   })
    //     .then(response => {
    //       console.log(
    //         'add to caret api resoinse p  updateCart r--> ',
    //         JSON.stringify(response?.data),
    //       );
    //       if (response?.data?.status) {
    //         ShowMessage(response?.data?.message);
    //         AsyncStorage.setItem('cart_id', response?.data?.response?.cart_id);
    //         setCartId(response?.data?.response?.cart_id);
    //         getUserCartCount(apiToken, userId);
    //         checkCartAndDataArray(restHomePageDataFoody, cartData);
    //       } else {
    //         ShowMessage(response?.data?.error + '');
    //       }
    //     })
    //     .catch(error => {
    //       console.log('ERROR IN ADD TO CART API =-> ', error);
    //     });
    //   setLoading(false);
    // }
  };

  const newPlus = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        // console.log('item -> ', JSON.stringify(itemss));
        temp.cart_qty = parseInt(itemss?.variant_qty) || 1;
        addToCart(temp);
        getUserCartCount(apiToken, userId);
      } else {
        // temp.cart_qty = 1;
        // addToCart(temp);
        // getUserCartCount(apiToken, userId);
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const addItemAddon = (arr, id, mainData) => {
    let t = 0;
    let b = 0;
    let a = arr.map(item => {
      var temp = Object.assign({}, item);

      if (temp.addon === id) {
        temp.selected = !temp.selected;

        if (temp.selected) {
          t = parseInt(totalMoney) + parseInt(temp.price) + 0.0;
          b = parseInt(temp.price) + parseInt(addonPrice);
        } else {
          t = parseInt(totalMoney) - parseInt(temp.price) + 0.0;
          b = parseInt(addonPrice) - parseInt(temp.price);
        }
      }
      setTotalMoney(t + '');
      setAddonPrice(b);
      return temp;
    });

    setPData({...pData, addons: a});

    restHomePageDataFoody[newCartIndex] = {
      ...pData,
      addons: a,
    };

    setRestHomePageDataFoody(restHomePageDataFoody);
  };

  const onSelect = item => {
    let t = 0;
    if (selectedOption && selectedOption.variant_name === item.variant_name) {
      t = totalMoney;
      setTotalMoney(t + '');
    } else {
      setSelectedOption(item);
      t = parseInt(item?.product_price) + 0.0;
      setOptionListCount(1);
      // setTotalMoney(t + parseInt(addonPrice));
      setTotalMoney(parseInt(item?.product_price) + '');
    }
  };

  const closeAddModal = () => {
    setShowAdd(!showAdd);
    setPData({});
    setAddonPrice(0);
  };

  const renderItemExist = () => {
    return (
      <Modal
        visible={showItemExist}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowItemExist(false)}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowItemExist(!showItemExist)}
            style={{flex: 1}}></TouchableOpacity>
          <View style={style.additemView}>
            <View
              style={[
                {
                  elevation: 10,
                  backgroundColor: COLORS.white,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                },
                style.addItemHeader,
              ]}>
              <View
                style={[
                  // style.rowView,
                  {
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Segoe UI Bold',
                      color: COLORS.black,
                    }}>
                    Item in cart
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowItemExist(!showItemExist)}>
                  <Image
                    source={icons.cancel}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              style={[
                style.middleView,
                {
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                },
              ]}>
              <Text
                style={[
                  {
                    fontSize: 15,
                    fontFamily: 'Segoe UI',
                    color: COLORS.black,
                    marginEnd: 10,
                    marginStart: 15,
                    marginTop: 15,
                  },
                ]}>
                Wait, you have some products of other restaurant. Do you want to
                continue ?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowItemExist(false);
                  }}
                  activeOpacity={0.8}
                  style={{
                    borderColor: COLORS.primary,
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                    borderRadius: 10,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    borderWidth: 1,
                  }}>
                  <Text
                    style={[
                      {
                        color: COLORS.primary,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                      },
                    ]}>
                    {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    // setShowItemExist(false);
                    // await removeItemFromCart();
                    // getUserCartCount(apiToken, userId);

                    setShowItemExist(false);
                    await removeItemFromCart();
                    getUserCartCount(apiToken, userId);

                    newItemExistPlus(itemExistData?.product_id);
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.primary,
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                    borderRadius: 10,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    marginHorizontal: 10,
                  }}>
                  {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                  <Text
                    style={[
                      // style.addressText,
                      {
                        color: COLORS.white,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                        // marginVertical: 10,
                      },
                    ]}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAddModal = () => {
    return (
      <Modal
        visible={showAdd}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => closeAddModal()}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeAddModal()}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              // backgroundColor: COLORS.cartCountBgColor,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => closeAddModal()}>
              <Image
                source={icons.cancel}
                style={{
                  width: 40,
                  height: 40,
                  margin: 10,
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={style.additemView}>
            <ScrollView
              style={[
                style.middleView,
                {
                  paddingTop: 10,
                },
              ]}>
              <View
                style={
                  {
                    // paddingBottom: 10,
                  }
                }></View>
              <View
                style={{
                  elevation: 10,
                  backgroundColor: COLORS.white,
                  marginHorizontal: 10,
                  borderRadius: 15,
                  width: '95%',
                  // height: 350,
                }}>
                <Image
                  source={{
                    uri: pData?.image,
                  }}
                  style={{
                    width: '95%',
                    height: 250,
                    margin: 10,
                    resizeMode: 'stretch',
                    borderRadius: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    updateFavUnFav(newCartIndex);
                  }}
                  style={{
                    borderRadius: 50,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 50,
                    borderWidth: 1,
                    right: 15,
                    top: 15,
                    position: 'absolute',
                  }}>
                  <Image
                    source={pData?.is_like ? icons.favorite : icons.unfavorite}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {}}
                style={{
                  // backgroundColor: '#e7e7e7',
                  flexDirection: 'row',
                  width: '100%',
                  // borderTopRightRadius: 15,
                  // borderTopLeftRadius: 15,
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 18,
                        fontFamily: 'Segoe UI Bold',
                        // marginBottom: 5,
                        marginTop: 5,
                        marginEnd: 8,
                        marginStart: 20,

                        paddingBottom: pData?.product_rating == 0 ? 10 : 0,
                      }}>
                      {pData?.product_name}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 14,
                      fontFamily: 'Segoe UI',
                      marginEnd: 8,
                      marginStart: 20,
                      maxWidth: Dimensions.get('screen').width - 50,
                    }}>
                    {pData?.dis}
                  </Text>

                  <View
                    style={{
                      alignSelf: 'flex-start',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 15,
                      // marginBottom: 5,
                      marginStart: 20,
                      // backgroundColor: COLORS.primary,
                    }}>
                    {/* <AntDesign name="staro" color={'gold'} />
                    <AntDesign name="staro" color={'gold'} />
                    <AntDesign name="staro" color={'gold'} />
                    <AntDesign name="staro" color={'gold'} />
                    <AntDesign name="staro" color={'gold'} /> */}
                    <AirbnbRating
                      isDisabled={true}
                      count={5}
                      showRating={false}
                      defaultRating={parseInt(pData?.product_rating)}
                      size={10}
                    />
                    {pData?.product_rating != 0 ? (
                      <>
                        <Text
                          style={{
                            marginHorizontal: 3,
                            fontFamily: 'Segoe UI Bold',
                            fontSize: 12,
                            color: COLORS.black,
                            // marginTop: 0,
                            alignSelf: 'center',
                            marginVertical: 2,
                          }}>
                          {pData.product_rating}
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
                          {/* ({item?.reviewCount})12 Reviews */}(
                          {pData.product_rating}) Reviews
                        </Text>
                      </>
                    ) : null}
                  </View>
                  {/* <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: 1,
                      fontFamily: 'Segoe UI',
                      // marginTop: 5,
                      marginStart: 20,
                    }}>
                   South Indian 
                  </Text> */}
                  {/* <Text
                    style={{
                      color: COLORS.darkGray,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                      marginTop: 5,
                      marginStart: 20,
                      paddingBottom: 10,
                    }}>
                    ₹ {pData?.product_price}
                  </Text> */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    closeAddModal();
                    setSelectedOption(null);
                    // setTotalMoney(0)
                  }}>
                  {/* <Image
                    source={icons.cancel}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 10,
                      marginRight: 10,
                      // alignSelf: 'flex-end',
                      // position: 'absolute',
                      // right: 15,
                    }}
                  /> */}
                  {pData?.type == 'veg' ? (
                    <Image
                      source={icons.pure_veg}
                      style={{
                        width: 8,
                        height: 8,
                        marginTop: 5,
                        marginEnd: 15,
                        // marginStart: 5,
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              </TouchableOpacity>

              {pData?.options?.length >= 1 ? (
                <>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI',
                      marginTop: 15,
                      marginStart: 20,
                    }}>
                    Options
                  </Text>

                  <RadioButtons
                    selectedOption={selectedOption}
                    onSelect={onSelect}
                    options={pData?.options}
                    var_count={optionListCount}
                    onPlus={onAddModalPlus}
                    onMinus={onAddModalMinus}
                    mainData={pData}
                    itemIndex={cartItemIndex}
                  />
                </>
              ) : // <View
              //   style={{
              //     marginTop: 15,
              //   }}>
              //   <ShimmerPlaceHolder
              //     LinearGradient={LinearGradient}
              //     height={15}
              //     width={Dimensions.get('window').width * 0.5}
              //     style={{
              //       borderRadius: 5,
              //       marginStart: 15,
              //     }}
              //   />
              //   <ShimmerPlaceHolder
              //     LinearGradient={LinearGradient}
              //     height={15}
              //     width={Dimensions.get('window').width * 0.93}
              //     style={{
              //       borderRadius: 5,
              //       marginStart: 15,
              //       marginTop: 5,
              //     }}
              //   />
              //   <ShimmerPlaceHolder
              //     LinearGradient={LinearGradient}
              //     height={15}
              //     width={Dimensions.get('window').width * 0.93}
              //     style={{
              //       marginTop: 5,
              //       borderRadius: 5,
              //       marginStart: 15,
              //     }}
              //   />

              //   <ShimmerPlaceHolder
              //     LinearGradient={LinearGradient}
              //     height={15}
              //     width={Dimensions.get('window').width * 0.5}
              //     style={{
              //       marginTop: 10,
              //       borderRadius: 5,
              //       marginStart: 15,
              //     }}
              //   />
              //   <ShimmerPlaceHolder
              //     LinearGradient={LinearGradient}
              //     height={15}
              //     width={Dimensions.get('window').width * 0.93}
              //     style={{
              //       borderRadius: 5,
              //       marginStart: 15,
              //       marginTop: 5,
              //     }}
              //   />
              //   <ShimmerPlaceHolder
              //     LinearGradient={LinearGradient}
              //     height={15}
              //     width={Dimensions.get('window').width * 0.93}
              //     style={{
              //       marginTop: 5,
              //       borderRadius: 5,
              //       marginStart: 15,
              //     }}
              //   />
              // </View>
              null}
              {pData?.addons?.length >= 1 ? (
                <>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI',
                      marginTop: 15,
                      marginStart: 20,
                    }}>
                    Addons
                  </Text>
                  <FlatList
                    data={pData?.addons}
                    renderItem={({item, index}) => {
                      return (
                        <View style={[{paddingLeft: 24, paddingRight: 6}]}>
                          <View style={[style.rowView, {marginTop: 15}]}>
                            <View style={{flex: 1, paddingRight: 10}}>
                              <Text style={[style.sizeText]}>
                                {item?.addon}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => {
                                addItemAddon(pData?.addons, item?.addon, pData);
                              }}
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text style={[style.sizeText, {marginEnd: 10}]}>
                                ₹ {item?.price}
                              </Text>

                              <Image
                                source={
                                  item?.selected
                                    ? icons.checked
                                    : icons.unchecked
                                }
                                style={style.checkbox}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />

                  <View
                    style={{
                      padding: 10,
                    }}></View>
                </>
              ) : null}
            </ScrollView>
            <View
              style={{
                // flex: 1,
                backgroundColor: COLORS.lightGray,
                paddingTop: 10,
                borderTopColor: COLORS.grey,
                // borderWidth: 0.5,
                borderTopWidth: 0.5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('address - > ', '');
                  if (cartVendorId == pData?.vendor_id) {
                    console.log(
                      'address - cartVendorId > ',
                      cartVendorId + '' + cartVendorId == pData?.vendor_id,
                    );

                    newPlus(pData?.product_id + '');
                    setPData({});
                    setShowAdd(false);
                  } else if (cartArrayCount == '') {
                    console.log(
                      'address - > cartArrayCount',
                      '' + cartArrayCount,
                    );

                    newPlus(pData?.product_id + '');
                    setPData({});
                    setShowAdd(false);
                  } else {
                    console.log(
                      'address - > cartArrayCount',
                      '' + cartVendorId + ' ' + '  ' + pData?.vendor_id,
                    );
                    // newPlus(pData?.product_id + '');
                    setItemExistData(pData);
                    setPData({});
                    setShowAdd(false);
                    setShowItemExist(true);
                  }
                  // setTotalMoney(0);
                }}
                activeOpacity={0.8}
                style={{
                  height: 50,
                  paddingHorizontal: 25,
                  backgroundColor: COLORS.primary,
                  marginTop: 1,
                  marginBottom: 10,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 18,
                    fontFamily: 'Segoe UI Bold',
                  }}>
                  {/* Add Item ₹ {parseInt(totalMoney)} */}
                  {/* Add Item ₹ {totalMoney} */}
                  Add Item ₹ {pData?.product_price}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const getAllVendorRatingReview = value => {
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,
      // lat: 23.1793,
      // lng: 75.784912,
      lat: userLatitude,
      lng: userLongitude,
      limit: 10,
      offset: 0,
    };

    ApiCall('post', body, API_END_POINTS.getAllVendorRatingReview, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log(
        //   'getAllVendorRatingReview ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
        //   JSON.stringify(response),
        // );
        if (response?.data?.status) {
          setAllRestaurantData(response?.data?.response);
        } else {
          setAllRestaurantData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  const getBlogPromotion = () => {
    setLoadNextData(true);
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,
      lat: userLatitude,
      lng: userLongitude,
      vendor_type: 2,
    };
    ApiCall('post', body, API_END_POINTS.getBlogPromotion, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          JSON.stringify(response?.data),
          ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
        );
        if (response?.data?.status) {
          setBlogPromotionData(response?.data?.response);
        } else {
          setBlogPromotionData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoadNextData(false);
      });
  };

  const getInfoFromStorage = async () => {
    let t = '';

    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setApiToken(value);
            getHomeBanner(value);
            getCuisines(value);
            getCategories(value);
            getChefHomePage(value);
            t = value;
          } else {
            setApiToken('');
          }
        }
      });
      await AsyncStorage.getItem('userId', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setUserId(value);
            getUserCartCount(t, value);
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {}
  };

  const getCuisines = value => {
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,
      lat: userLatitude,
      lng: userLongitude,
    };

    ApiCall('post', body, API_END_POINTS.getAllCuisines, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log(
        //   'getCuisines response =-> ',
        //   JSON.stringify(response?.data) + ' tt =>' + value,
        // );
        if (response?.data?.status) {
          setCuisinesData(response?.data?.response);
        } else {
          setCuisinesData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };
  const [categoryData, setCategoryData] = useState([]);

  const getCategories = value => {
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,

      lat: userLatitude,
      lng: userLongitude,
    };

    ApiCall('post', body, API_END_POINTS.getAllFoodCategories, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log(
        //   'getCuisines response =-> ',
        //   JSON.stringify(response?.data) + ' tt =>' + value,
        // );
        if (response?.data?.status) {
          setCategoryData(response?.data?.response);
        } else {
          setCategoryData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };
  const [restHomePageData, setRestHomePageData] = useState([]);
  const [userId, setUserId] = useState('');

  const dispatch = useDispatch();

  const [cartVendorId, setCartVendorId] = useState('');
  const [cartArrayCount, setCartArrayCount] = useState('');

  const removeItemFromCart = async () => {
    let body = {
      user_id: userId + '',
    };
    let a = await ApiCall('post', body, API_END_POINTS.removeEmptyCart, {
      Authorization: `Bearer ${apiToken}`,
    });
    AsyncStorage.setItem('cart_id', '');
  };

  const newItemExistPlus = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        // console.log('item -> ', JSON.stringify(itemss));
        temp.cart_qty = parseInt(itemss?.variant_qty) || 1;
        addToCart(temp);
        getUserCartCount(apiToken, userId);
      } else {
        temp.cart_qty = 0;
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const getUserCartCount = (t, value) => {
    let body = {
      user_id: value,
    };

    ApiCall('post', body, API_END_POINTS.get_cart_count, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setCartVendorId(response?.data?.response?.cart?.vendor_id);
          // console.log(
          //   'address  dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd  - > ' +
          //     response?.data?.response?.cart?.vendor_id,
          // );
          // setCartArrayCount(
          //   response?.data?.response?.cart?.total_product_in_cart,
          // );
          setCartArrayCount(response?.data?.response?.cart?.products_count);
          setCartId(response?.data?.response?.cart?.id);

          dispatch(
            updateCartCount(
              // response?.data?.response?.cart?.total_product_in_cart,
              response?.data?.response?.cart?.products_count,
            ),
          );
        } else {
          setCartArrayCount('');
          dispatch(updateCartCount(0));
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const newPlusOut = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        temp.cart_qty = parseInt(temp.cart_qty) + 1;
        updateCart(temp);
        // addToCart(temp);
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const newPlusOutAdd = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        temp.cart_qty = parseInt(temp.cart_qty) + 1;
        // updateCart(temp);
        addToCart(temp);
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const updateFavUnFav = idx => {
    let a = restHomePageData?.products?.map((item, index) => {
      let temp = Object.assign({}, item);
      console.log('repoasanfa  fav sfd ap response -> ', JSON.stringify(temp));
      if (index == idx) {
        if (temp.is_like) {
          temp.is_like = false;
          let body = {user_id: userId, product_id: parseInt(temp?.product_id)};
          ApiCall('post', body, API_END_POINTS.productRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            console.log(
              'repoasanfa  fav sfd ap repoisn -> ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
            }
          });
          let b = {
            ...pData,
            is_like: false,
          };
          setPData(b);
        } else {
          let body = {user_id: userId, product_id: parseInt(temp?.product_id)};

          ApiCall('post', body, API_END_POINTS.productAddFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            console.log(
              'repoasanfa  fav sfd ap repoisn -> ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
            }
          });
          temp.is_like = true;

          let b = {
            ...pData,
            is_like: true,
          };
          setPData(b);
        }
      }
      return temp;
    });
    setRestHomePageDataFoody(a);
  };

  const [restHomePageDataFoody, setRestHomePageDataFoody] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const renderFeaturedDish = ({item, index}) => {
    // console.log(
    //   'itemm 0<  renderFeaturedDishrenderFeaturedDishrenderFeaturedDish ',
    //   JSON.stringify(item),
    // );
    let chilli = [];

    for (let i = 0; i < parseInt(item?.chili_level); i++) {
      // console.log('push method executres ->>>> ', item?.chili_level);
      chilli.push(
        <View key={i}>
          <Image
            source={icons.chilli_level}
            style={{
              width: 10,
              height: 10,
            }}
          />
        </View>,
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (item?.customizable == 'true') {
            setShowAdd(true);

            setPData(item);

            setTotalMoney(parseInt(item?.product_price) + '');
            console.log(
              'item customizable -> ',
              JSON.stringify(item?.product_price),
            );

            setNewCartIndex(index);
            if (item?.options && item?.options?.length >= 0) {
              onSelect(item?.options[0]);
              // setTotalMoney(a[0]?.variant_price);
            } else {
              setTotalMoney(item?.product_price + '');
            }
          } else {
            setShowAdd(true);
            setPData(item);
            setTotalMoney(item?.product_price + '');

            console.log(
              'item customizable -> ',
              JSON.stringify(item?.product_price),
            );
            setNewCartIndex(index);
            if (item?.options && item?.options?.length >= 0) {
              onSelect(item?.options[0]);
              // setTotalMoney(a[0]?.variant_price);
            } else {
              setTotalMoney(item?.product_price + '');
            }
          }
        }}
        activeOpacity={0.8}
        style={{
          width: 190,
          marginTop: 10,
          backgroundColor: COLORS.white,
          elevation: 10,
          borderRadius: 10,
          marginBottom: 15,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd:
            index == restHomePageData?.products?.length - 1
              ? SIZES.padding + 2
              : 0,
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            height: 140,
            borderRadius: 5,
            width: 180,
            margin: 5,
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            console.log('update styatedsfdsfjdsklfsdfdksfjkl');
            updateFavUnFav(index);
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
            source={item?.is_like ? icons.favorite : icons.unfavorite}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}> */}
        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI Bold',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 8,
            alignSelf: 'center',
          }}
          numberOfLines={2}>
          {item?.product_name}
          {chilli}
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 12,
            color: COLORS.grey,
            marginVertical: 5,
            textAlign: 'center',
          }}
          numberOfLines={2}
          ellipsizeMode="tail">
          {/* {item?.product_name} */}
          {item?.dis}
        </Text>
        {/* <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.grey,
            marginVertical: 2,
            alignSelf: 'center',
          }}>
          {item?.name}
        </Text> */}

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
            defaultRating={parseInt(item?.product_rating)}
            size={10}
          />

          {item?.product_rating == '0' ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
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
                {item.product_rating}
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
                ({item.product_rating}) Reviews
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 10,
            marginTop: item?.customizable == 'true' ? 15 : 15,
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            bottom: item?.customizable == 'true' ? 0 : 5,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            {item?.customizable == 'true' ? (
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  // position: 'relative',
                  alignSelf: 'center',
                  marginStart: item?.qty > 1 ? 8 : 0,
                  marginBottom: 2,
                }}>
                Customizable
              </Text>
            ) : null}

            {parseInt(item?.cart_qty) || parseInt(item?.qty) >= 1 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: 10,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  width: 85,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    // onMinus('less', item.product_id, item);
                    newMinusOut(item.product_id);
                  }}>
                  <View
                    style={[
                      {
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingEnd: 3,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginStart: -1,
                      },
                    ]}>
                    <Image
                      source={icons.minus}
                      style={{
                        width: 20,
                        height: 20,
                        marginStart: 3,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    paddingHorizontal: 5,
                  }}>
                  {parseInt(item?.cart_qty)}
                  {/* {count} */}
                </Text>
                <TouchableOpacity
                  style={{
                    // paddingStart: 2,
                    flexDirection: 'row',
                    // paddingEnd: 3,
                  }}
                  onPress={() => {
                    newPlusOut(item.product_id);
                  }}>
                  <View
                    style={[
                      {
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingStart: 3,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginEnd: -1,
                      },
                    ]}>
                    <Image
                      source={icons.plus}
                      style={{
                        width: 20,
                        height: 20,
                        marginEnd: 3,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  marginHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 20,
                  width: 85,
                }}
                onPress={() => {
                  if (item?.customizable == 'true') {
                    setShowAdd(true);

                    setPData(item);
                    console.log('item customizable -> ', JSON.stringify(item));

                    setNewCartIndex(index);
                    if (item?.options && item?.options?.length >= 0) {
                      onSelect(item?.options[0]);
                      // setTotalMoney(a[0]?.variant_price);
                    }
                  } else {
                    newPlusOutAdd(item.product_id);
                  }
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: COLORS.primary,
                    paddingHorizontal: 10,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Segoe UI Bold',
              fontSize: 18,
              marginTop: item?.customizable == 'true' ? 10 : 0,
              marginEnd: 10,
              color: COLORS.black,
            }}>
            ₹{item?.product_price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getChefHomePage = value => {
    let body = {
      // lat: 23.1765,
      // lng: 75.7885,
      // lat: 22.72418,
      // lng: 75.887257,
      lat: userLatitude,
      lng: userLongitude,
    };
    ApiCall('post', body, API_END_POINTS.getChefHomePage, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log(
        //   'getRestaurantHomePage response getChefHomePage =-> ',
        //   // JSON.stringify(value),
        //   JSON.stringify(response?.data),
        // );
        if (response?.data?.status) {
          setRestHomePageData(response?.data?.response);

          let addons = [];
          let o = [];
          let a = response?.data?.response?.products?.map(item => {
            let temp = Object.assign({}, item);

            if (temp?.options && temp?.options?.length >= 1) {
              o = temp?.options?.map(o => {
                return {
                  ...o,
                  variant_qty: 1,
                };
              });
            }

            if (temp?.addons && temp?.addons?.length >= 1) {
              addons = temp?.addons?.map(o => {
                return {
                  ...o,
                  addon_qty: 1,
                  selected: false,
                };
              });
            }

            return {
              ...item,
              options: o,
              addons: addons,
            };
          });

          // console.log(
          //   JSON.stringify(a),
          //   ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
          // );
          setRestHomePageDataFoody(a);
        } else {
          setRestHomePageData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };

  const [refreshing, setRefreshing] = useState(false);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = () => {
    setRefreshing(true);
    setRestHomePageData([]);
    setCuisinesData([]);
    setCategoryData([]);
    // wait(2000).then(() => setRefreshing(false));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    getCuisines(apiToken);
    getCategories(apiToken);
    getChefHomePage(apiToken);
  };

  const [banner, setBanner] = useState([]);

  const getHomeBanner = t => {
    let body = {
      for: 'chef',
    };
    ApiCall('post', body, API_END_POINTS.getHomeBanner, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setBanner(response?.data?.response);
        } else {
          setBanner([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <ScrollView
      style={style.mainContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          getBlogPromotion();
          getAllVendorRatingReview(apiToken);
        }
      }}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      {/* <View style={style.header}>
        <Image
          source={icons.location}
          style={[
            style.headerImage,
            {
              marginStart: 15,
            },
          ]}
        />
        <View
          style={{
            flexGrow: 1,
          }}>
          <View style={style.headerInnerContainer}>
            <Text style={style.placeText}>Home</Text>
            <Image
              source={icons.location_change}
              style={{
                resizeMode: 'center',
                marginStart: -8,
              }}
            />
          </View>
          <Text style={style.locationText} numberOfLines={1}>
            432-B Prem Trade Center, Maharani Road, Indore
          </Text>
        </View>
        <Image
          source={icons.cart}
          style={[
            style.headerImage,
            {
              marginEnd: 20,
            },
          ]}
        />
      </View>

      <TouchableOpacity
        style={{
          height: 35,
          width: '95%',
          borderColor: '#707070',
          borderWidth: 1,
          borderRadius: 5,
          alignItems: 'center',
          // justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 15,
          flexDirection: 'row',
        }}
        activeOpacity={0.8}>
        <Text
          style={{
            flex: 1,
            color: COLORS.darkGray,
            paddingStart: 10,
            fontFamily: 'Segoe UI',
          }}
          numberOfLines={1}>
          Search by Chef or Dish...
        </Text>
        <View
          style={{
            marginStart: 8,
            backgroundColor: 'rgba(112, 112, 112, 255)',
            height: 18,
            width: 1,
            marginEnd: 7,
          }}
        />
        <Image
          source={icons.search}
          style={[
            {
              width: 20,
              height: 20,
              resizeMode: 'center',
              marginEnd: 10,
            },
          ]}
        />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          // flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <ChefOrderBookTable
          title={'Chef'}
          onPress={chefOnPress}
          paddingHorizontal={0}
          height={35}
          backgroundColor={changeOne ? COLORS.primary : '#e7e7e7'}
          borderRadius={10}
          marginHorizontal={10}
          marginVertical={10}
          alignItems={'center'}
          justifyContent={'center'}
          textColor={changeOne ? COLORS.white : COLORS.darkGray}
        />
        <ChefOrderBookTable
          title={'Restaurant'}
          onPress={restaurantOnPress}
          paddingHorizontal={5}
          height={35}
          backgroundColor={changeTwo ? COLORS.primary : '#e7e7e7'}
          borderRadius={10}
          marginHorizontal={10}
          marginVertical={10}
          alignItems={'center'}
          textColor={changeTwo ? COLORS.white : COLORS.darkGray}
          justifyContent={'center'}
        />
        <ChefOrderBookTable
          title={'Dining'}
          onPress={diningOnPress}
          paddingHorizontal={0}
          height={35}
          backgroundColor={changeThree ? COLORS.primary : '#e7e7e7'}
          borderRadius={10}
          marginHorizontal={10}
          marginVertical={10}
          textColor={changeThree ? COLORS.white : COLORS.darkGray}
          alignItems={'center'}
          justifyContent={'center'}
        />
      </View> */}

      {banner.length <= 0 ? (
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}
          width={Dimensions.get('window').width - 20}
          height={200}></ShimmerPlaceHolder>
      ) : (
        <View style={style.sliderMainContainer}>
          <SwiperFlatList
            autoplay
            autoplayDelay={3}
            autoplayLoop
            showPagination
            data={banner}
            paginationStyleItem={style.paginationStyleItem}
            paginationDefaultColor={'#e4e4e4'}
            paginationActiveColor={'#707070'}
            renderItem={({item}) => (
              <View
                style={{
                  width: SIZES.width,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <ImageBackground
                  source={{
                    uri: item.image,
                  }}
                  style={[style.sliderImage]}></ImageBackground>
                <View style={style.sliderInnerContainer}>
                  <Text style={style.innerText} numberOfLines={1}>
                    {/* Welcome to ChefLab */}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {cuisinesData.length <= 0 ? (
        <View
          style={{
            marginTop: 20,
            paddingBottom: 1,
          }}>
          <WhatsMindTitleSkeleton />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <WhatsMindSkeleton />
          </View>
        </View>
      ) : (
        <View>
          <Text style={style.moodText}>Browse by Cuisines</Text>
          <View
            style={{
              flexGrow: 1,
            }}>
            <FlatList
              data={cuisinesData}
              horizontal
              style={{
                marginTop: 10,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <WhatsMind
                    id={item?.id}
                    marginStart={index == 0 ? SIZES.padding + 5 : 8}
                    marginEnd={
                      index == cuisinesData?.length - 1 ? SIZES.padding + 2 : 0
                    }
                    image={item.image}
                    title={item.name}
                    fromRestaurant={false}
                  />
                );
              }}
            />
          </View>
        </View>
      )}
      {categoryData.length <= 0 ? (
        <View
          style={{
            marginTop: 20,
            paddingBottom: 1,
          }}>
          <WhatsMindTitleSkeleton />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <WhatsMindSkeleton />
          </View>
        </View>
      ) : (
        <View>
          <Text style={style.moodText}>What's in your mind ?</Text>
          <View
            style={{
              flexGrow: 1,
            }}>
            <FlatList
              data={categoryData}
              horizontal
              style={{
                marginTop: 10,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <WhatsMind
                    id={item?.id}
                    marginStart={index == 0 ? SIZES.padding + 5 : 8}
                    marginEnd={
                      index == categoryData?.length - 1 ? SIZES.padding + 2 : 0
                    }
                    image={item.image}
                    title={item.name}
                    fromRestaurant={false}
                  />
                );
              }}
            />
          </View>
        </View>
      )}

      {/* <Text style={style.moodText}>Try Once More !</Text>
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          data={onceMore}
          horizontal
          style={{
            flex: 1,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <ChefOnceMore
                image={item.image}
                star={item.star}
                distance={item.distance}
                title={item.title}
                marginStart={index == 0 ? SIZES.padding + 5 : 10}
                marginEnd={index == onceMore.length - 1 ? SIZES.padding : 0}
              />
            );
          }}
        />
      </View> */}
      {/* <ChefTopRatedSkeleton /> */}

      {restHomePageData.length >= 0 ? (
        <ChefTopRatedSkeleton />
      ) : (
        <View>
          <ChefTopRated
            // heading={'Top Rated Chef'}
            // heading={'Top Rated'}
            heading={'Top Rated Chef'}
            smallText={''}
            items={restHomePageData?.vendors}
            // marginStart={index == 0 ? SIZES.padding + 5 : 10}
            // marginEnd={index == onceMore.length - 1 ? SIZES.padding : 0}
          />
        </View>
      )}

      {restHomePageData.length >= 0 ? (
        <ChefTopRatedSkeleton />
      ) : (
        <View>
          {/* <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text style={style.moodText}>Top Rated Chef</Text>
            <Text style={[style.viewAll, {marginEnd: 15}]}>View All</Text>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={restHomePageData?.vendors}
              horizontal
              style={{
                flex: 1,
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <ChefTopRated
                    item={item}
                    marginStart={index == 0 ? SIZES.padding + 5 : 10}
                    marginEnd={index == onceMore.length - 1 ? SIZES.padding : 0}
                  />
                );
              }}
            />
          </View> */}
          <ChefTopRated
            // heading={'Top Rated Chef'}
            heading={'Featured Chef'}
            // heading={'Top Rated Chef'}
            smallText={'Sponsored'}
            items={restHomePageData?.vendors}
            // marginStart={index == 0 ? SIZES.padding + 5 : 10}
            // marginEnd={index == onceMore.length - 1 ? SIZES.padding : 0}
          />
        </View>
      )}

      <View>
        {restHomePageData?.products?.length > 0 ? (
          <>
            <Text
              style={[
                {
                  marginTop: 15,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 10,
                  color: '#707070',
                  marginStart: 16,
                  marginTop: 40,
                },
              ]}>
              {/* {'Sponsored'} */}
              Sponsored
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text
                style={[
                  style.moodText,
                  {
                    marginTop: 0,
                  },
                ]}>
                Featured Dishes
              </Text>
            </View>
          </>
        ) : null}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={restHomePageDataFoody}
          extraData={restHomePageDataFoody}
          renderItem={renderFeaturedDish}
        />
      </View>

      {restHomePageData.length >= 0 ? (
        <ChefTopRatedSkeleton />
      ) : (
        <View>
          <ChefTopRated
            // heading={'Top Rated Chef'}
            // heading={'Top Rated'}
            heading={'Top Rated Chef'}
            smallText={''}
            items={restHomePageData?.vendors}
            // marginStart={index == 0 ? SIZES.padding + 5 : 10}
            // marginEnd={index == onceMore.length - 1 ? SIZES.padding : 0}
          />
        </View>
      )}

      <View>
        {restHomePageData?.products?.length > 0 ? (
          <>
            <Text
              style={[
                {
                  marginTop: 15,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 10,
                  color: '#707070',
                  marginStart: 16,
                  marginTop: 40,
                },
              ]}>
              {/* {'Sponsored'} */}
              {/* Sponsored */}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text
                style={[
                  style.moodText,
                  {
                    marginTop: 0,
                  },
                ]}>
                Top Rated Dishes
              </Text>
            </View>
          </>
        ) : null}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          extraData={restHomePageDataFoody}
          data={restHomePageDataFoody}
          renderItem={renderFeaturedDish}
        />
      </View>

      {/* <View
        style={{
          marginTop: 15,
        }}></View>
      {blogPromotionData.length > 0 ? (
        <FlatList
          // horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={blogPromotionData}
          extraData={blogPromotionData}
          renderItem={renderDynamicBlogPromotion}
        />
      ) : null} */}

      {loadNextData ? (
        <ActivityIndicator
          color={COLORS.primary}
          size={'large'}
          style={{
            alignSelf: 'center',
            marginVertical: 10,
          }}
        />
      ) : null}

      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          paddingVertical: 30,
          opacity: 0.5,
        }}>
        <Image style={style.logo} source={images.app_logo} />

        <Text style={style.copyRightText}>
          © 2022, ChefLab.All Rights Reserved
        </Text>
      </View>

      {renderAddModal()}
      {renderItemExist()}
    </ScrollView>
  );
};

export default Chef;
