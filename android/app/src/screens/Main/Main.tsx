import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const sections: string[] = ['상의', '하의', '아우터', '원피스'];
const boxes: {text: string; image: any}[] = [
  {text: '스트릿 \nStreet', image: require('../../assets/img/main/street.png')},
  {text: '캐주얼 \nCasual', image: require('../../assets/img/main/street.png')},
  {text: '스트릿 \nStreet', image: require('../../assets/img/main/street.png')},
  {text: '스트릿 \nStreet', image: require('../../assets/img/main/street.png')},
];

const ProductCard: React.FC<{
  title: string;
  description: string;
  price: string;
}> = ({title, description, price}) => {
  return (
    <View style={styles.productCardContainer}>
      <View style={styles.topRectangle}>
        <Text style={styles.brandText}>Musinsa</Text>
      </View>
      <View style={styles.middleRectangle}>
        <Image
          source={require('../../assets/img/main/polo.png')}
          style={styles.productImage}
        />
      </View>
      <View style={styles.bottomRectangle}>
        <View style={styles.productTextContainer}>
          <View style={styles.leftText}>
            <Text style={styles.productTitle}>{title}</Text>
            <Text style={styles.productDescription}>{description}</Text>
          </View>
          <Text style={styles.priceText}>{price}</Text>
        </View>
      </View>
    </View>
  );
};

export default class Main extends Component {
  state = {
    selectedSection: '',
    showProductGrid: false,
    products: [
      {
        title: '폴로 랄프 로렌',
        description: '데님 셔츠 - 블루',
        price: '219.000₩',
      },
      {
        title: '폴로 랄프 로렌2',
        description: '데님 셔츠 - 블루2',
        price: '319.000₩',
      },
      {
        title: '폴로 랄프 로렌3',
        description: '데님 셔츠 - 블루3',
        price: '419.000₩',
      },
      {
        title: '폴로 랄프 로렌4',
        description: '데님 셔츠 - 블루4',
        price: '519.000₩',
      },
    ],
  };

  renderProductGrid = () => {
    if (this.state.showProductGrid) {
      return (
        <View style={styles.productGrid}>
          {this.state.products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              price={product.price}
            />
          ))}
        </View>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerText}>FitPin</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Image
                  source={require('../../assets/img/main/camera.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image
                  source={require('../../assets/img/main/shop.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />
          <Text style={styles.subtitle}>
            000님의 체형과 취향 모두를 만족하는 옷이에요
          </Text>
          <View style={styles.sections}>
            {boxes.map((box, index) => (
              <View key={index} style={styles.roundedBox}>
                <View style={styles.boxContent}>
                  <Text style={styles.boxText}>{box.text}</Text>
                  <Image source={box.image} style={styles.boxImage} />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.sections}>
            {sections.map(section => (
              <TouchableOpacity
                key={section}
                style={styles.sectionButton}
                onPress={() =>
                  this.setState({
                    selectedSection: section,
                    showProductGrid: true,
                  })
                }>
                <Text
                  style={[
                    styles.sectionText,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      color:
                        this.state.selectedSection === section
                          ? '#000'
                          : '#919191',
                    },
                  ]}>
                  {section}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {this.renderProductGrid()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '4%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '3%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: '2%',
  },
  subtitle: {
    fontSize: 17,
    color: '#000',
    marginTop: '2%',
    marginBottom: '4%',
    fontWeight: 'bold',
  },
  sections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sectionButton: {
    padding: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  roundedBox: {
    width: '49%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: '7.5%',
    marginBottom: '3%',
    alignItems: 'center',
  },
  boxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    fontWeight: 'bold',
  },
  boxImage: {
    width: '60%',
    height: '232%',
    resizeMode: 'contain',
    left: '20%',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  productCardContainer: {
    width: '48%',
    backgroundColor: '#fff',
    marginBottom: '2%',
  },
  topRectangle: {
    position: 'relative',
    backgroundColor: '#000',
    height: '12%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middleRectangle: {
    position: 'relative',
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
  },
  bottomRectangle: {
    position: 'relative',
    height: 80,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    bottom: 10,
  },
  brandText: {
    position: 'relative',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    left: '7%',
    bottom: '-20%',
  },
  productImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    bottom: -20,
  },
  priceText: {
    fontSize: 13,
    color: '#0000ff',
    bottom: -11,
    left: 3.5,
  },
  productDescription: {
    fontSize: 14,
    color: '#3D3D3D',
    bottom: -22,
  },
  productTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  leftText: {
    flex: 1,
  },
});
