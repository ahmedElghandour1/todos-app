/* fetch todos */
const fetchTodos = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const todos = window.localStorage.getItem('todos');
            if (todos) {
                resolve(JSON.parse(todos));
            } else {
                resolve([]);
            }
        }, 1000)
    })
};

/* save todos */
const saveTodos = (todos) => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
};


/* create todo obj */
const createTodo = (todo_name) => {
    return {
        name: todo_name,
        id: uuidv4(),
        date: Date.now(),
        is_completed: 0
    }
};

/* delete todo */
const deleteTodo = (todo, todos) => {
    const index = todos.findIndex((element) => element.id === todo.id);
    if (index > -1) {
        todos.splice(index, 1);
    }
}

/* handle no todos message */
const handleNoTodos = (todos) => {
    const noTodos_domElm = document.querySelector('#noTodos');
    if (todos.length === 0) {
        noTodos_domElm.style.display = 'block';
    } else {
        noTodos_domElm.style.display = 'none';
    }
}
/* render single todo to the DOM */
const renderTodo = (todo, todos, filters) => {
    const template = document.createElement('template');
    template.innerHTML =  /*html*/ `
    <li style="background-color: #f8f9fa;" class="list-group-item">
        <div class="custom-control custom-checkbox">
            <input 
            type="checkbox" 
            class="custom-control-input" 
            id="status_${todo.id}">
            <label 
            class="custom-control-label" 
            for="status_${todo.id}">${todo.name}</label>
            <button 
            style="float: right" 
            class="btn btn-danger btn-sm delete-btn">DELETE</button>
        </div>
    </li>
    `;
    const delete_btn = template.content.querySelector('button.delete-btn');
    const status_checkbox = template.content.querySelector(`input#status_${todo.id}`);
    if (todo.is_completed) {
        status_checkbox.checked = true
    }
    delete_btn.addEventListener('click', () => {
        console.log(todo.id)
        deleteTodo(todo, todos);
        saveTodos(todos);
        renderTodos(todos, filters);
    });
    status_checkbox.addEventListener('change', (event) => {
        console.log(event);
        if (event.target.checked) {
            todo.is_completed = 1
        } else {
            todo.is_completed = 0
        }
        saveTodos(todos);
    });
    return template.content;
};

const renderTodos = (todos, filters) => {
    const todosContainer_domElm = document.querySelector('#todos');
    const filteredTodos = handleFilterTodos(todos, filters);
    todosContainer_domElm.innerHTML = '';
    filteredTodos.forEach(element => {
        todosContainer_domElm.appendChild(renderTodo(element, todos, filters));
    });
    handleNoTodos(todos);
}

const handleFilterTodos = (todos, filters) => {
    return todos.filter((element) => {
        let todosStatus;
        if (filters.status === 'all') {
            todosStatus = true;
        } else {
            todosStatus = filters.status === element.is_completed;
        }
        return element.name.toLowerCase().includes(filters.search.toLowerCase().trim()) && todosStatus;
    })

}

