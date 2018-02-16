const { createStore } = Redux;
const store = createStore(todoListManager)

const render = () => {
  var currHolding = store.getState().currentViewing;
  ReactDOM.render(
    [<TodoList
      value={Object.keys(store.getState().toDoLists)}
    />,
    <TodoListItems
      value={store.getState().currentViewing}
    />,
  ],
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
