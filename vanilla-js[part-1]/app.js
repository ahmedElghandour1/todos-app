document.body.onload = () => {
    const todoName_domElm = document.querySelector('#todo_name');
    const isLoading_domElm = document.querySelector('#loader');
    const search_domElm = document.querySelector('#search_todos');
    const todoStatus_domElm = document.querySelector('#todo_status');

    let todo_name = '';
    let todos = [];
    const filters = {
        search: '',
        status: 'all'
    }

    fetchTodos().then((_todos) => {

        isLoading_domElm.style.display = 'none';
        todos = _todos;
       renderTodos(todos, filters);

    });

    todoName_domElm.addEventListener('input', (event) => {

        todo_name = event.target.value.trim();

    })

    todoName_domElm.addEventListener('keyup', (event) => {

        if (event.key === 'Enter') {
            if (todo_name.trim().length > 0) {
                event.target.value = '';
                const todo = createTodo(todo_name);
                todos.unshift(todo);
                saveTodos(todos);
                renderTodos(todos, filters);
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

        filters.search = event.target.value;
        renderTodos(todos, filters);
    })

    todoStatus_domElm.addEventListener('change', (event) => {

        filters.status = isNaN(event.target.value) ? 
        event.target.value : +event.target.value;
        renderTodos(todos, filters);

    })

}