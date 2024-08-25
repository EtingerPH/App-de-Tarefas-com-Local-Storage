// Função para adicionar tarefas ao DOM
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;
    if (completed) {
        li.classList.add('completed');
    }
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = completed ? 'Undo' : 'Complete';

    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(li);

    deleteBtn.addEventListener('click', () => {
        document.getElementById('task-list').removeChild(li);
        removeTaskFromLocalStorage(taskText);
    });

    toggleBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskInLocalStorage(taskText, li.classList.contains('completed'));
        toggleBtn.textContent = li.classList.contains('completed') ? 'Undo' : 'Complete';
    });
}

// Função para salvar tarefas no Local Storage
function saveTaskToLocalStorage(taskText, completed = false) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para atualizar tarefas no Local Storage
function updateTaskInLocalStorage(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.text === taskText ? { ...task, completed: completed } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para remover tarefas do Local Storage
function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do Local Storage ao iniciar
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTask(task.text, task.completed);
    });
}

// Função para verificar duplicidade de tarefas
function isDuplicateTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.some(task => task.text === taskText);
}

// Função para filtrar e pesquisar tarefas
function filterAndSearchTasks(filter, searchText) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        const matchesSearch = task.textContent.toLowerCase().includes(searchText);
        const matchesFilter = (filter === 'all') ||
                              (filter === 'completed' && task.classList.contains('completed')) ||
                              (filter === 'pending' && !task.classList.contains('completed'));

        if (matchesSearch && matchesFilter) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Variável global para rastrear o filtro atual
let currentFilter = 'all';

// Event listener para adicionar nova tarefa
document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    const errorMessage = document.getElementById('error-message');
    taskInput.classList.remove('error');
    errorMessage.textContent = '';

    if (taskText === '') {
        errorMessage.textContent = 'Please enter a valid task.';
        taskInput.classList.add('error');
        return;
    }

    if (isDuplicateTask(taskText)) {
        errorMessage.textContent = 'This task already exists.';
        taskInput.classList.add('error');
        return;
    }

    addTask(taskText);
    saveTaskToLocalStorage(taskText);
    taskInput.value = '';
    filterAndSearchTasks(currentFilter, document.getElementById('search-task').value.toLowerCase());
});

// Event listener para filtrar tarefas
document.getElementById('filter-all').addEventListener('click', () => {
    currentFilter = 'all';
    filterAndSearchTasks(currentFilter, document.getElementById('search-task').value.toLowerCase());
});

document.getElementById('filter-completed').addEventListener('click', () => {
    currentFilter = 'completed';
    filterAndSearchTasks(currentFilter, document.getElementById('search-task').value.toLowerCase());
});

document.getElementById('filter-pending').addEventListener('click', () => {
    currentFilter = 'pending';
    filterAndSearchTasks(currentFilter, document.getElementById('search-task').value.toLowerCase());
});

// Event listener para pesquisar tarefas
document.getElementById('search-task').addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    filterAndSearchTasks(currentFilter, searchText);
});

// Carregar tarefas do Local Storage ao carregar a página
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
