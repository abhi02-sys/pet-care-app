document.addEventListener('DOMContentLoaded', async function () {
    const addTaskButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // const selectedPet = JSON.parse(localStorage.getItem('selectedPet'));
    // console.log("Selected Pet");
    // if (!selectedPet || !selectedPet.id) {
    //     alert('No pet selected.');
    //     return;
    // }
    // const petId = selectedPet.id;

    let selectedPet = JSON.parse(localStorage.getItem("selectedPet"));
if (!selectedPet || !selectedPet.id) {
    const fallbackPetId = localStorage.getItem("selectedPetId");
    if (fallbackPetId) {
        selectedPet = { id: parseInt(fallbackPetId), name: "Your Pet" }; // optionally fetch real name
    }else {
        alert("No pet selected.");
        return;
    }
}

const petId = selectedPet.id;



    // Load existing tasks from backend
    await loadTasks();

    addTaskButton.addEventListener('click', async function () {
        const taskValue = taskInput.value.trim();
        if (taskValue === '') {
            alert('Please enter a task!');
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, task: taskValue })
            });

            const data = await response.json();
            if (data.success) {
                addTaskToDOM(taskValue, data.todoId);
                taskInput.value = '';
            } else {
                alert('Failed to add task.');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    async function loadTasks() {
        try {
            const res = await fetch(`/api/todos/${petId}`);
            const data = await res.json();
            if (data.success) {
                data.todos.forEach(todo => addTaskToDOM(todo.task, todo.id));
            } else {
                taskList.innerHTML = '<li>Failed to load tasks</li>';
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    function addTaskToDOM(taskText, todoId) {
        const newTask = document.createElement('li');
        newTask.textContent = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', async function () {
            try {
                const res = await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
                const result = await res.json();
                if (result.success) {
                    taskList.removeChild(newTask);
                } else {
                    alert('Failed to delete task');
                }
            } catch (err) {
                console.error('Error deleting task:', err);
            }
        });

        newTask.appendChild(deleteButton);
        taskList.appendChild(newTask);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', async function () {
    try {
        const res = await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            taskList.removeChild(newTask);
        } else {
            alert('Failed to delete task');
        }
    } catch (err) {
        console.error('Error deleting task:', err);
    }
});

});
