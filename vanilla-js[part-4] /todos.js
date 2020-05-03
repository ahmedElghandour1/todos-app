import  './uuid.js';

export class TodosModule {
    constructor() {
        this.todos = []
        this.filters = {
            search: '',
            status: 'all'
        }
        this.sortBy = '' /* name, status*/
        console.log(this)
    }
    todosAppHTML() {
        return /* html */ `
            <div style="max-width: 700px;margin-top: 20vh;" class="card mr-auto ml-auto">
                <h5 class="card-header text-center">Todos</h5>
                <div class="card-body">
                    <div class="form-group pb-3 border-bottom">
                        <input 
                        autofocus 
                        id="todo_name" 
                        type="text" 
                        placeholder="What need to be done?" 
                        class="form-control">
                    </div>
                    <div class="form-group d-flex mb-0">
                        <input 
                        type="text" 
                        id="search_todos"
                        placeholder="Search for a todo.." 
                        class="form-control w-50 mr-2">
                        <select 
                        class="form-control w-25 mr-2" 
                        id="todo_status">
                            <option hidden selected>Status</option>
                            <option value="all">All</option>
                            <option value="0">Active</option>
                            <option value="1">Completed</option>
                        </select>
                        <select 
                        class="form-control w-25" 
                        id="sort_todos">
                            <option hidden selected>Sort by</option>
                            <option value="name">Name</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
            </div>
        </div>
        <div class="text-center mt-3" id="loader">
            Loading ...
        </div>
        <div class="text-center mt-3" id="noTodos">
            No Todos found!
        </div>
        <ul 
        id="todos" 
        style="max-width: 700px;" 
        class="list-group mt-3 mr-auto ml-auto">
        </ul>
        `
    }
    fetchTodos() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const todos = window.localStorage.getItem('todos')
                if (todos) {
                    resolve(JSON.parse(todos))
                }
                else {
                    resolve([])
                }
            }, 1000)
        })
    }
    saveTodos() {
        window.localStorage.setItem('todos', JSON.stringify(this.todos))
    }
    createTodo(todo_name) {
        return {
            name: todo_name,
            id: uuidv4(),
            date: Date.now(),
            is_completed: 0
        }
    }
    deleteTodo(todo) {
        const index = this.todos.findIndex((element) => element.id === todo.id)
        if (index > -1) {
            this.todos.splice(index, 1)
        }
    }
    /* handle no todos message */
    handleNoTodos() {
        const noTodos_domElm = document.querySelector('#noTodos')
        if (this.todos.length === 0) {
            noTodos_domElm.style.display = 'block'
        }
        else {
            noTodos_domElm.style.display = 'none'
        }
    }
    /* render single todo to the DOM */
    renderTodo(todo) {
        const template = document.createElement('template')
        template.innerHTML = /*html*/ `
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
    `
        const delete_btn = template.content.querySelector('button.delete-btn')
        const status_checkbox = template.content.querySelector(`input#status_${todo.id}`)
        if (todo.is_completed) {
            status_checkbox.checked = true
        }
        delete_btn.addEventListener('click', () => {
            this.deleteTodo(todo, this.todos)
            this.saveTodos(this.todos)
            this.renderTodos(this.todos, this.filters)
        })
        status_checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                todo.is_completed = 1
            }
            else {
                todo.is_completed = 0
            }
            this.saveTodos(this.todos)
            this.renderTodos(this.todos, this.filters)
        })
        return template.content
    }
    renderTodos() {
        const todosContainer_domElm = document.querySelector('#todos')
        let filteredTodos = this.handleFilterTodos();
        if(this.sortBy.length > 0) {
            let fn = this.sortBy === 'status' ? compareByStatus.bind(this) : compareByName.bind(this); 
            filteredTodos = this.sortTodos(filteredTodos, fn);
        }
        todosContainer_domElm.innerHTML = ''
        filteredTodos.forEach(element => {
            todosContainer_domElm.appendChild(this.renderTodo(element, this.todos, this.filters))
        })
        this.handleNoTodos(this.todos)
    }
    handleFilterTodos() {
        return this.todos.filter((element) => {
            let todosStatus
            if (this.filters.status === 'all') {
                todosStatus = true
            }
            else {
                todosStatus = this.filters.status === element.is_completed
            }
            return element.name.toLowerCase().includes(this.filters.search.toLowerCase().trim()) && todosStatus
        })
    }
    sortTodos(arr, fn) {
        return arr.sort(fn)
    }
}
const compareByName = (a, b) => {
    if (a.name > b.name) {
        return 1;
    }
    if (b.name > a.name) {
        return -1;
    }
    return 0;
}

const compareByStatus = (a, b) => {
    if (a.is_completed) {
        return 1;
    }
    if (b.is_completed) {
        return -1;
    }
    return 0;
}
