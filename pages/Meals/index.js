import React, {useLayoutEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Button, StyleSheet, Text, View} from 'react-native'
import {SwipeListView} from 'react-native-swipe-list-view'

import {DeleteMealDialog} from '../../components'
import {Meal} from '../../redux/types'
import {deleteMeal} from '../../redux/actions'

import MealCell from './MealCell'
import Stats from './Stats'

const styles = StyleSheet.create({
  fill: {flex: 1},
  rowBehind: {backgroundColor: 'red', flexDirection: 'row', alignItems: 'center', paddingRight: 10},
  deleteText: {color: 'white', marginLeft: 'auto'},
})

// eslint-disable-next-line react/prop-types
const renderItem = props => ({item}) => <MealCell {...props} {...item} meal={item} />

function renderHiddenItem() {
  return (
		<View style={[styles.rowBehind, styles.fill]}>
			<Text style={styles.deleteText}>Delete</Text>
		</View>
  )
}

// references to Animated.Values that belong to each meal row
const animatedValues = {}

function Meals(props) {
  const [isEditMode, setEditMode] = useState(false)
  // a reference to the meal that pending the confirmation dialog before delete
  const [stagedDeleteMeal, setStagedDeleteMeal] = useState(null)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Button title="Edit" onPress={() => setEditMode(!isEditMode)} />
    })
  })

  const onConfirmDelete = () => {
    props.deleteMeal(stagedDeleteMeal)
    // TODO: fix race condition so there's no flash of missing meal name
    setStagedDeleteMeal(null)
  }

  const onSwipeValueChange

  const meals = props.meals.map((meal, key) => meal.addKey(`${key}`))
  return (
    <View style={styles.fill}>
      <DeleteMealDialog
        meal={stagedDeleteMeal}
        onConfirm={onConfirmDelete}
        onCancel={() => setStagedDeleteMeal(null)}
        visible={!!stagedDeleteMeal}
      />
      <Stats meals={meals} />
      <SwipeListView
        disableRightSwipe
        data={meals}
        contentContainerStyle={styles.fill}
        renderItem={renderItem({onDelete: setStagedDeleteMeal, showDeleteButton: isEditMode})}
        renderHiddenItem={renderHiddenItem}
      />
    </View>
  )
}

Meals.propTypes = {
  deleteMeal: PropTypes.func.isRequired,
  meals: PropTypes.arrayOf(PropTypes.instanceOf(Meal)),
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
}

export default connect(state => ({meals: state.meals}), {deleteMeal})(Meals)
