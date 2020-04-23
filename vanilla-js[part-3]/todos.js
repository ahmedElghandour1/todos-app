function TodosModule () {
    this.todos = []
    this.filters = {
        search: '',
        status: 'all'
    }
    console.log(this)
    this.fetchTodos = function() {
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
    }
    this.saveTodos = function () {
        window.localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    this.createTodo = function (todo_name) {
        return {
            name: todo_name,
            id: uuidv4(),
            date: Date.now(),
            is_completed: 0
        }
    }
    this.deleteTodo = function (todo) {
        const index = this.todos.findIndex((element) => element.id === todo.id);
        if (index > -1) {
            this.todos.splice(index, 1);
        }
    }

    /* handle no todos message */
    this.handleNoTodos = function () {
        const noTodos_domElm = document.querySelector('#noTodos');
        if (this.todos.length === 0) {
            noTodos_domElm.style.display = 'block';
        } else {
            noTodos_domElm.style.display = 'none';
        }
    }
    /* render single todo to the DOM */
    this.renderTodo = function (todo) {
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
            this.deleteTodo(todo, this.todos);
            this.saveTodos(this.todos);
            this.renderTodos(this.todos, this.filters);
        });
        status_checkbox.addEventListener('change', (event) => {
            console.log(event);
            if (event.target.checked) {
                todo.is_completed = 1
            } else {
                todo.is_completed = 0
            }
            this.saveTodos(this.todos);
        });
        return template.content;
    }

    this.renderTodos = function (todos) {
        console.log(this)
        const todosContainer_domElm = document.querySelector('#todos');
        const filteredTodos = this.handleFilterTodos(this.todos, this.filters);
        todosContainer_domElm.innerHTML = '';
        filteredTodos.forEach(element => {
            todosContainer_domElm.appendChild(this.renderTodo(element, this.todos, this.filters));
        });
        this.handleNoTodos(this.todos);
    }

    this.handleFilterTodos = function () {
        return this.todos.filter((element) => {
            let todosStatus;
            if (this.filters.status === 'all') {
                todosStatus = true;
            } else {
                todosStatus = this.filters.status === element.is_completed;
            }
            return element.name.toLowerCase().includes(this.filters.search.toLowerCase().trim()) && todosStatus;
        })

    }

};