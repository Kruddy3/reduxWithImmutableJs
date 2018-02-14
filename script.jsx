const todoListManager = (state ={currentViewing:'', toDoLists:{todoname:[],todoname2:[]}}, action) => {
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
    case 'UPDATECURRENTLYVIEWING':
      return immutableStore
          .set('currentViewing' , action.whatViewing)
          .toJS()
    default:
      return state;
  }
}


var todoListNameHolder = "";
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.currentlyViewingChanger = this.currentlyViewingChanger.bind(this);
  }
  handleClick(e) {
    console.log( e.currentTarget.dataset.id )
    this.currentlyViewingChanger(e.currentTarget.dataset.id )
  }
  currentlyViewingChanger(e){
    store.dispatch({
        type: 'UPDATECURRENTLYVIEWING', whatViewing: e
    })
  }
  render() {
    todoListNameHolder = "";
    todoListNameHolder = this.props.value.map((z) =>
      <li data-id={z} onClick={this.handleClick.bind(this)}>
        {z}
      </li>
    );
    return <ul>{todoListNameHolder}</ul>;
  }
}

const Counter = ({
  value,
  todoAdder,
  todoRemover,
  todoItemAdder,
  todoItemRemover,
  toggleComplete,
  currentlyViewingChanger
}) => (
  <div>
    <button onClick={todoAdder}>Add Todo</button>
    <button onClick={todoRemover}>Remove Todo</button>
    <button onClick={todoItemAdder}>Add Todo Item</button>
    <button onClick={toggleComplete}>Toggle Completion</button>
    <button onClick={todoItemRemover}>Remove Todo Item</button>
    <button onClick={currentlyViewingChanger}>Change Currently Viewing</button>
    <h1>{value}</h1>
  </div>
);



const { createStore } = Redux;
const store = createStore(todoListManager)

const render = () => {
  ReactDOM.render(
    [<TodoList
      value={Object.keys(store.getState().toDoLists)}
    />,<Counter
      value={JSON.stringify(store.getState())}
      todoAdder={() =>
        store.dispatch({
          type: 'NEWTODOLIST', name: "todoname"
        })
      }
      todoRemover={() =>
        store.dispatch({
           type: 'REMTODOLIST', name: "todoname"
        })
      }
      todoItemAdder={() =>
        store.dispatch({
           type: 'ADDTODOITEM', todoListName: "todoname", todoItem: "brush Teeth"
        })
      }
      toggleComplete={() =>
        store.dispatch({
           type: 'TOGGLECOMPLETION', todoListName: "todoname", arrayPosition: 0
        })
      }
      todoItemRemover={() =>
        store.dispatch({
            type: 'REMTODO', todoListName: "todoname", arrayPosition: 0
        })
      }
      currentlyViewingChanger={() =>
        store.dispatch({
            type: 'UPDATECURRENTLYVIEWING', whatViewing: "listYouAreViewing"
        })
      }
    />],




    document.getElementById('root')
  );
};

store.subscribe(render);
render();













/*
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

//update currently viewing
expect(counter(
  {currentViewing:'', toDoLists:{}}, { type: 'UPDATECURRENTLYVIEWING', whatViewing: "listYouAreViewing"})
).toEqual({currentViewing:'listYouAreViewing', toDoLists:{}});

console.log('Test passed');
*/
