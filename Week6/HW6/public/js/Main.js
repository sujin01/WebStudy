// 할 일 목록 데이터를 저장하는 배열
let todolist = [];

// 화면에 할 일 목록을 표시하는 함수
function updateTodoList() {
    const list = document.getElementById("todo-list");
    list.innerHTML = ""; 

    todolist.forEach((item, index) => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.status === 'o';

        checkbox.addEventListener("change", (event) => {
            const listItem=event.target.parentElement;
            const newtext = listItem.textContent;
            const text = newtext.replace('Delete', '').trim();
            console.log(text);
            const status = checkbox.checked ? 'o' : 'x';
            // TODO: 서버에 PATCH 요청 보내기
            fetch('http://localhost:3000/api/todolist', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify({ status, text }),
                mode: 'cors'
            }).then(res => {
                if (res.status === 200) {
                    todolist = todolist.map(item => {
                        if (item.text === text) {
                          return { status, text };
                        }
                        return item;
                    });
                    updateTodoList();
                }
                else if (res.status === 400) {
                    alert('invalid status');
                }
            });
        });

        const label = document.createElement("label");
        label.textContent = item.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("id", "delete-button");

        deleteButton.addEventListener("click", (event) => {
            const listItem=event.target.parentElement;
            const newtext = listItem.textContent;
            const text = newtext.replace('Delete', '').trim();
            // TODO: 서버에 DELETE 요청 보내기
            fetch('http://localhost:3000/api/todolist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify({ text }),
                mode: 'cors' 
            })
                .then(res => {
                    if (res.status === 200) {
                        todolist = todolist.filter(item => item.text !== text);
                        updateTodoList();
                    }
                    else if (res.status === 400) {
                        alert('invalid status');
                    }
                });
        });
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(label);
        todoItem.appendChild(deleteButton);
        list.appendChild(todoItem);
        

    });
}

// 할 일을 추가하는 함수
function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    console.log(text);
    if (text === '') {
        alert("빈 내용은 추가하지 못합니다.");
        return;
    }
    fetch('http://localhost:3000/api/todolist', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify({ text })
    })
        .then(res => {
            if (res.status === 201) {
                todolist = [...todolist, { status: 'x', text }];
                updateTodoList()
            }
            else if (res.status === 409) {
                alert('already exists');
            }
        });
    input.value = '';
}

// 초기화 작업
function init() {
    fetch('http://localhost:3000/api/todolist', {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain'
        },
    })
        .then((res) => res.text())
        .then((data) => {
            const obj = JSON.parse(data);
            if (obj.length === 0) {
                todolist = []; 
            } else {
                todolist = obj.map((item) => {
                    const { status, text } = item;
                    return { status, text };
                });
                updateTodoList(); 
            }
            
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

// 페이지가 로드되면 초기화 작업 수행
window.onload = init;