import { TodosModule } from "./todos.js";
import { AuthLogin } from "./login.js";
import { element } from "./utils.js";
import { bus } from "./eventEmitter.js";


const auth = new AuthLogin();
const app = element("#app");

auth.init(
    () => {
        initApp();
    },
    (loginComp) => {
        console.log(loginComp);
        const login = element("#login");
        login.appendChild(loginComp);
        bus.on("isAuth", (data) => {
            console.log("success", data);
            login.remove();
            initApp();
        });
    }
);


function initApp() {
        const todoModule = new TodosModule();
        app.innerHTML = todoModule.todosAppHTML();

        const todoName_domElm = element("#todo_name");
        const isLoading_domElm = element("#loader");
        const search_domElm = element("#search_todos");
        const sort_domElm = element("#sort_todos");
        const todoStatus_domElm = element("#todo_status");

        let todo_name = "";
        todoModule.fetchTodos().then((_todos) => {
            isLoading_domElm.style.display = "none";
            todoModule.todos = _todos;
            todoModule.renderTodos(_todos);
        });

        todoName_domElm.addEventListener("input", (event) => {
            todo_name = event.target.value.trim();
        });

        todoName_domElm.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                if (todo_name.trim().length > 0) {
                    event.target.value = "";
                    const todo = todoModule.createTodo(todo_name);
                    todoModule.todos.unshift(todo);
                    todoModule.saveTodos();
                    todoModule.renderTodos();
                    todo_name = "";
                }
            }

            if (event.key === "Escape") {
                event.target.value = "";
                event.target.blur();
                todo_name = "";
            }
        });

        search_domElm.addEventListener("input", (event) => {
            todoModule.filters.search = event.target.value;
            todoModule.renderTodos();
        });

        todoStatus_domElm.addEventListener("change", (event) => {
            todoModule.filters.status = isNaN(event.target.value)
                ? event.target.value
                : +event.target.value;
            todoModule.renderTodos();
        });
        sort_domElm.addEventListener("change", (event) => {
            todoModule.sortBy = event.target.value;
            todoModule.renderTodos();
        });
}
