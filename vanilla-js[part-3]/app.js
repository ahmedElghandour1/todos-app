document.body.onload = () => {
    const todoName_domElm = document.querySelector('#todo_name');
    const isLoading_domElm = document.querySelector('#loader');
    const search_domElm = document.querySelector('#search_todos');
    const todoStatus_domElm = document.querySelector('#todo_status');

    let todo_name = '';
    const todoModule = new TodosModule();
    console.log(todoModule)
    todoModule.fetchTodos().then((_todos) => {

        isLoading_domElm.style.display = 'none';
        todoModule.todos = _todos;
        todoModule.renderTodos(_todos);

    });

    todoName_domElm.addEventListener('input', (event) => {

        todo_name = event.target.value.trim();

    })

    todoName_domElm.addEventListener('keyup', (event) => {

        if (event.key === 'Enter') {
            if (todo_name.trim().length > 0) {
                event.target.value = '';
                const todo = todoModule.createTodo(todo_name);
                todoModule.todos.unshift(todo);
                todoModule.saveTodos();
                todoModule.renderTodos();
                todo_name = '';
            }
        }

        if (event.key === 'Escape') {
            event.target.value = '';
            event.target.blur();
            todo_name = '';
        }
    })

    search_domElm.addEventListener('input', (event) => {

        todoModule.filters.search = event.target.value;
        todoModule.renderTodos();
    })

    todoStatus_domElm.addEventListener('change', (event) => {

        todoModule.filters.status = isNaN(event.target.value) ? 
        event.target.value : +event.target.value;
        todoModule.renderTodos();

    })

}