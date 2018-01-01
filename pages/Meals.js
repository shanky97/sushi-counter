import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FlatList, StyleSheet, Text, View} from 'react-native'

import {Meal} from '../redux/types'

const styles = StyleSheet.create({
  mealCell: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-around',
    backgroundColor: '#fcfcfc',
    borderBottomColor: '#333',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  center: {
    textAlign: 'center',
  },
})

const MealCell = props => (
  <View style={styles.mealCell}>
    <Text>{props.date.toDateString()}</Text>
    <Text style={styles.center}>{props.value}</Text>
  </View>
)

MealCell.propTypes = {
  value: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
}

// eslint-disable-next-line react/prop-types
const renderItem = ({item}) => <MealCell {...item} />

class Meals extends React.Component {
  static propTypes = {
    meals: PropTypes.arrayOf(PropTypes.instanceOf(Meal)),
  }

  static navigationOptions = {
    title: 'Meal History',
  }

  state = {
    meals: this.props.meals.map((meal, key) => meal.addKey(key)),
  }

  componentWillReceiveProps(newProps) {
    if (this.props.meals !== newProps.meals) {
      this.setState({meals: newProps.meals.map((meal, key) => meal.addKey(key))})
    }
  }

  render() {
    return <FlatList data={this.state.meals} renderItem={renderItem} />
  }
}

export default connect(state => ({meals: state.meals}))(Meals)
