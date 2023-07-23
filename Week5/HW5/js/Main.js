// 할 일 목록 데이터를 저장하는 배열
let todolist = [];

// 화면에 할 일 목록을 표시하는 함수
function renderTodoList() {
    const list = document.getElementById("todo-list");
    list.innerHTML = ""; // 기존 목록 초기화

    todolist.forEach((item, index) => {
        const li = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.status === 'o';
        checkbox.addEventListener("change", () => {
            const status = checkbox.checked ? 'o' : 'x';
            // TODO: 서버에 PATCH 요청 보내기
            fetch('/api/todolist', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: status + '|' + text
            }).then(res => {
                if (res.status === 200) {
                    todolist = todolist.map(item => {
                        if (item.text === text) {
                          return { status, text };
                        }
                        return item;
                    });
                    renderTodoList();
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
        deleteButton.addEventListener("click", () => {
            // TODO: 서버에 DELETE 요청 보내기
            fetch('/api/todolist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: text
            }).then(res => {
                if (res.status === 200) {
                    todolist = todolist.filter(item => item.text !== text);
                    renderTodoList();
                }
                else if (res.status === 400) {
                    alert('invalid status');
                }
            });
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

// 할 일을 추가하는 함수
function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === '') {
        alert("빈 내용은 추가하지 못합니다.");
        return;
    }
    fetch('/api/todolist', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: text
    }).then(res => {
            if (res.status === 201) {
                todolist = [...todolist, { status: 'x', text }];
                renderTodoList()
            }
            else if (res.status === 409) {
                alert('already exists');
            }
        });
    input.value = '';
}

// 초기화 작업
function init() {
    fetch('/api/todolist')
        .then((res) => res.json())
        .then((data) => {
            if (data.trim() === '') {
                todolist = []; // 빈 배열로 초기화
            } else {
                todolist = data.trim().split('\n').map((item) => {
                    const [status, text] = item.split('|');
                    return { status, text };
                });
            }
            renderTodoList(); // 화면에 할 일 목록 렌더링
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

// 페이지가 로드되면 초기화 작업 수행
window.onload = init;