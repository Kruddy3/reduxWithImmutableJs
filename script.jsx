const counter = (state = {currentViewing:'',toDoLists:{}}, action) => {
  var immutableStore = Immutable.fromJS(state)
  switch (action.type) {
    // add TodoList
    case 'NEWTODOLIST':
      return immutableStore
          .setIn(['toDoLists', action.name] , [])
          .toJS()
    // remove todoList
    case 'REMTODOLIST':
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
                            // viewing: TODOITEM_ID
    default:
      return state;
  }
}

// add todo
expect(counter(
  {currentViewing:'', toDoLists:{}}, { type: 'NEWTODOLIST', name: "todoname"})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});
// add second todo
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'NEWTODOLIST', name: "todoname2"})
).toEqual({currentViewing:'', toDoLists:{todoname:[],todoname2:[]}});
// adding a todo when it already exists
expect(counter(
  {currentViewing:'', toDoLists:{todoname:["ANYTHING HERE WILL BE WIPED"]}}, { type: 'NEWTODOLIST', name: "todoname"})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});

// remove
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'REMTODOLIST', name: "todoname"})
).toEqual({currentViewing:'', toDoLists:{}});
// remove item that isnt there
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'REMTODOLIST' ,todoName: "todonames"})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});

// adding todo item
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[]}}, { type: 'ADDTODOITEM', todoListName: "todoname", todoItem: "brush Teeth"})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}});
// adding second todo item
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}}, { type: 'ADDTODOITEM', todoListName: "todoname", todoItem: "brush Teeth"})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false},{todo:"brush Teeth", completed:false}]}});

// toggling todo item's completed status
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}}, { type: 'TOGGLECOMPLETION', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:true}]}});
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:true}]}}, { type: 'TOGGLECOMPLETION', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}});

// delete todo item
expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false}]}}, { type: 'REMTODO', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[]}});

expect(counter(
  {currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:false},{todo:"brush Teeth", completed:true}]}}, { type: 'REMTODO', todoListName: "todoname", arrayPosition: 0})
).toEqual({currentViewing:'', toDoLists:{todoname:[{todo:"brush Teeth", completed:true}]}});



console.log('Test passed');
