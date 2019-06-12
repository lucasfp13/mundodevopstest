import React from 'react'
import {
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  View,
  FlatList,
  ScrollView,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'  
import { filters } from 'mundodevopstest/src/data/filters'
import { exercises } from 'mundodevopstest/src/data/exercises'
import _ from 'lodash'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
const iconBike = require('mundodevopstest/assets/images/ic_bike.png')
const iconBalance = require('mundodevopstest/assets/images/ic_balance.png')
const iconTime = require('mundodevopstest/assets/images/ic_time.png')

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedFilters: [],
      selectedWhen: []
    }

    this.renderFilterItem = this._renderFilterItem.bind(this);
    this.renderExerciseItem = this._renderExerciseItem.bind(this);
    this.renderNoneExercises = this._renderNoneExercises.bind(this);
  }

  showAlert (kind) {
    Alert.alert(`Ação: abrir ${kind}`)
  }

  toggleWhen (id) {
    let arr = this.state.selectedWhen

    if (arr.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      this.setState({selectedWhen: arr})
    } else {
      arr.push(id)
      this.setState({selectedWhen: arr})
    }
  }

  selectedFilters (filter) {
    if (this.state.selectedFilters.includes(filter)) {
      return (
        <View style={styles.done}>
          <Icon
            size={15}
            name={'done'} 
            color={'white'} />
        </View>
      )
    }
  }

  actionFilters (filter) {
    let array = this.state.selectedFilters

    if (array.includes(filter)) {
      array.splice(array.indexOf(filter), 1);
      this.setState({selectedFilters: array})
    } else {
      array.push(filter)
      this.setState({selectedFilters: array})
    }
  }

  _renderFilterItem (info) {
    return (
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity onPress={() => this.actionFilters(info.item.name)}>
          <LinearGradient
            start={{x: 1, y: 1}} end={{ x: -1, y: -1 }}
            locations={[0, 0.4]}
            colors={['#F22B48', '#7F38F4']}
            style={styles.overlay}>
            
            <Image source={info.item.image} />
          </LinearGradient>
        </TouchableOpacity>
        {this.selectedFilters(info.item.name)}
      </View>
    )
  }

  renderTime (time) {
    const hour = time / 60

    if ((time % 60) === 0) {
      return (
        <Text style={{paddingLeft: 5, fontFamily: 'MontserratAlternates-SemiBold', fontSize: 12, color: '#FEFFFF'}}>{hour} h</Text>
      )
    } else {
      return (
        <Text style={{paddingLeft: 5, fontFamily: 'MontserratAlternates-SemiBold', fontSize: 12, color: '#FEFFFF'}}>{time} m</Text>
      )
    }
  }

  renderWhenColor (when) {
    if (when === 'hoje') { return '#FD3C29' }
    if (when === 'ontem') { return '#19B996' }
  }

  renderWhen (when, id) {
    if (_.isEmpty(when)) { return null }

    const whenArray = this.state.selectedWhen
    return (
      <View style={{flexDirection: 'row', paddingVertical: 5}}>
        <TouchableOpacity
          onPress={() => this.toggleWhen(id)}
          style={[styles.whenButton, {
            backgroundColor: whenArray.includes(id) ? this.renderWhenColor(when) : 'transparent',
            borderColor: whenArray.includes(id) ? this.renderWhenColor(when) : 'gray'
          }]}>
          <Text style={[styles.whenText, {
            color: whenArray.includes(id) ? '#FEFFFF' : 'gray'
          }]}>{when.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderNoneExercises () {
    return (
      <View style={{height: 50, justifyContent: 'center'}}>
        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, color: '#FEFFFF', textAlign: 'center'}}>Não há exercícios para esta categoria.</Text>
      </View>
    )
  }

  _renderExerciseItem (info) {
    return (
      <View style={styles.exercisesList}>
        <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
          <View style={{backgroundColor: '#2C343F', justifyContent: 'center', alignItems: 'center', height: 90, width: 90, borderRadius: 45}} >
            <Image style={{bottom: 5}} source={info.item.image} />
          </View>
          <View style={{right: 0, height: 90, width: '62%'}}>
            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 20, color: '#FEFFFF'}}>{info.item.name.toUpperCase()}</Text> 

            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <View style={{flexDirection: 'row', paddingRight: 15, alignItems: 'center'}}>
                <Image style={{height: 15, width: 15}} source={iconBike} />
                <Text style={{fontFamily: 'MontserratAlternates-SemiBold', fontSize: 12, color: '#FEFFFF'}}> {info.item.calories} Kcal</Text>
              </View>
              <View style={{flexDirection: 'row', paddingRight: 15, alignItems: 'center'}}>
                <Image style={{height: 15, width: 15}} source={iconTime} />
                {this.renderTime(info.item.time)}
              </View>
              <View style={{flexDirection: 'row', paddingRight: 15, alignItems: 'center'}}>
                <Image style={{height: 15, width: 15}} source={iconBalance} />
                <Text style={{fontFamily: 'MontserratAlternates-SemiBold', fontSize: 12, color: '#FEFFFF'}}> {info.item.weight} Kg</Text>
              </View>
            </View>

            {this.renderWhen(info.item.when, info.index)}
          </View>
        </View>
      </View>
    )
  }

  render() {
    let filteredItems = _.filter(exercises, item => {
      const arr = this.state.selectedFilters
      if (_.isEmpty(arr)) { return item }
      if (arr.includes(item.categorie)) { return item }
    })

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.showAlert('menu')}>
            <Icon
              size={25}
              name={'menu'} 
              color={'#fff'} />
          </TouchableOpacity>

          <Text style={styles.mainTitle}>MEU PERFIL</Text>

          <TouchableOpacity onPress={() => this.showAlert('configurações')}>
            <Icon
              size={25}
              name={'brightness-high'}
              color={'#fff'} />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersList}>
          <FlatList
            horizontal
            extraData={this.state}
            showsHorizontalScrollIndicator={false}
            data={filters}
            renderItem={this.renderFilterItem} />
        </View>
        
        <FlatList
          style={{height: '100%'}}
          extraData={this.state}
          showsVerticalScrollIndicator={false}
          data={filteredItems}
          renderItem={this.renderExerciseItem}
          ListEmptyComponent={this.renderNoneExercises} />
      </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#262F38',
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  mainTitle: {
    fontFamily: 'Montserrat-Light',
    fontSize: 26,
    color: '#FEFFFF',
    textAlign: 'center'
  },
  filtersList: {
    padding: 10,
    height: 95,
    width: '100%',
    backgroundColor: '#323C47',
    borderRadius: 10,
    marginBottom: 30
  },
  overlay: {
    height: 68,
    width: 68,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 34
  },
  done: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#19B996',
    borderWidth: 1.5,
    borderColor: 'white',
    position: 'absolute',
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10
  },
  exercisesList: {
    height: 120,
    marginBottom: 20,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#323C47',
    borderRadius: 10,
  },
  whenButton: {
    borderWidth: 1,
    width: 80,
    borderRadius: 35
  },
  whenText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium'
  }
});
