const todoListManager = (state ={currentViewing:'', toDoLists:{todoname:[],todoname2:[{"todo":"brush Teeth","completed":false},{"todo":"brush Teeths","completed":false},{"todo":"brush Teethss","completed":false}]}}, action) => {
  var immutableStore = Immutable.fromJS(state)
  switch (action.type) {
    // add TodoList
    case 'NEWTODOLIST':
      return immutableStore
          .setIn(['toDoLists', action.name] , [])
          .toJS()
    // remove todoList
    case 'REMTODOLIST':
      // resets the viewing
      if (store.getState().currentViewing == action.name) {
        immutableStore = immutableStore.set('currentViewing' , "")
      }
      // need the name of the todolist to be removed
      return immutableStore
          .deleteIn(['toDoLists', action.name])
          .toJS()
    // add todoItem
    case 'ADDTODOITEM':
      return immutableStore
          .updateIn(['toDoLists', action.todoListName], arr => arr.push({todo: action.todoItem, completed:false}))
          .toJS()
      // complete todo Item
      case 'TOGGLECOMPLETION':
        // get the value
        var x = immutableStore.getIn(['toDoLists', action.todoListName, action.arrayPosition, 'completed'])
        return immutableStore
            .setIn(['toDoLists', action.todoListName, action.arrayPosition, 'completed'], !x)
            .toJS()
    // remove todoItem
    case 'REMTODO':
      return immutableStore
          .deleteIn(['toDoLists', action.todoListName, action.arrayPosition])
          .toJS()

    // currently VIEWING
    case 'UPDATECURRENTLYVIEWING':
      return immutableStore
          .set('currentViewing' , action.whatViewing)
          .toJS()
    default:
      return state;
  }
}
