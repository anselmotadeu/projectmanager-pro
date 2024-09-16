document.addEventListener('DOMContentLoaded', function () {
  const username = localStorage.getItem('loggedInUser');

  if (!username) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('usernameDisplay').textContent = username;
  }

  const projectForm = document.getElementById('projectForm');
  const projectList = document.getElementById('projectList');
  const addTaskModal = document.getElementById('addTaskModal');
  const closeTaskModal = document.getElementById('closeTaskModal');
  const taskForm = document.getElementById('taskForm');
  const logoutModal = document.getElementById('logoutModal'); // Modal de logout
  let currentProjectIndex = null;
  let currentTaskIndex = null;

  const projects = JSON.parse(localStorage.getItem('projects')) || [];

  function displayProjects() {
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="text" value="${project.name}" readonly class="projectNameInput">
        <i class="fas fa-pencil-alt editIcon"></i>
        <i class="fas fa-trash-alt deleteIcon"></i>
        <i class="fas fa-plus-circle addTaskIcon"></i>
        <ul class="taskList"></ul>
      `;
      projectList.appendChild(li);

      bindProjectEvents(li, project, index);
    });
  }

  function bindProjectEvents(li, project, index) {
    const input = li.querySelector('.projectNameInput');
    const taskList = li.querySelector('.taskList');
    const editIcon = li.querySelector('.editIcon');
    const deleteIcon = li.querySelector('.deleteIcon');
    const addTaskIcon = li.querySelector('.addTaskIcon');

    editIcon.addEventListener('click', function () {
      input.removeAttribute('readonly');
      input.focus();

      input.addEventListener('blur', function () {
        input.setAttribute('readonly', true);
        project.name = input.value;
        localStorage.setItem('projects', JSON.stringify(projects));
        displayProjects();
      });
    });

    deleteIcon.addEventListener('click', function () {
      showModal('deleteModal', index);
    });

    addTaskIcon.addEventListener('click', function () {
      currentProjectIndex = index;
      addTaskModal.style.display = 'flex';
    });

    displayTasks(project.tasks, taskList);
  }

  function displayTasks(tasks, taskList) {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskLi = document.createElement('li');
      taskLi.innerHTML = `
        <input type="checkbox" ${task.status === 'complete' ? 'checked' : ''}>
        <span>${task.name}</span>
        <i class="fas fa-trash-alt deleteIcon"></i>
      `;
      taskList.appendChild(taskLi);

      bindTaskEvents(taskLi, tasks, index, taskList);
    });
  }

  function bindTaskEvents(taskLi, tasks, taskIndex, taskList) {
    const checkbox = taskLi.querySelector('input[type="checkbox"]');
    const deleteIcon = taskLi.querySelector('.deleteIcon');

    checkbox.addEventListener('change', function () {
      tasks[taskIndex].status = this.checked ? 'complete' : 'incomplete';
      localStorage.setItem('projects', JSON.stringify(projects));
    });

    deleteIcon.addEventListener('click', function () {
      currentTaskIndex = taskIndex;
      showTaskDeleteModal(currentTaskIndex, tasks, taskList);
    });
  }

  projectForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    if (projectName) {
      const newProject = { name: projectName, tasks: [] };
      projects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));
      displayProjects();
      projectForm.reset();
    }
  });

  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    if (taskName && currentProjectIndex !== null) {
      const newTask = { name: taskName, status: 'incomplete' };
      projects[currentProjectIndex].tasks.push(newTask);
      localStorage.setItem('projects', JSON.stringify(projects));
      displayProjects();
      addTaskModal.style.display = 'none';
      taskForm.reset();
    }
  });

  closeTaskModal.addEventListener('click', function () {
    addTaskModal.style.display = 'none';
  });

  function showModal(modalId, projectIndex) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';

    document.getElementById('confirmDelete').onclick = function () {
      projects.splice(projectIndex, 1);
      localStorage.setItem('projects', JSON.stringify(projects));
      modal.style.display = 'none';
      displayProjects();
    };

    document.getElementById('cancelDelete').onclick = function () {
      modal.style.display = 'none';
    };
  }

  function showTaskDeleteModal(taskIndex, tasks, taskList) {
    const modal = document.getElementById('deleteTaskModal');
    modal.style.display = 'flex';

    document.getElementById('confirmDeleteTask').onclick = function () {
      tasks.splice(taskIndex, 1);
      localStorage.setItem('projects', JSON.stringify(projects));
      modal.style.display = 'none';
      displayTasks(tasks, taskList);
    };

    document.getElementById('cancelDeleteTask').onclick = function () {
      modal.style.display = 'none';
    };
  }

  // Adicionar evento para abrir o modal de logout
  document.getElementById('logoutBtn').addEventListener('click', function () {
    logoutModal.style.display = 'flex'; // Exibe o modal de logout
  });

  // Função para confirmar ou cancelar o logout
  document.getElementById('confirmLogout').onclick = function () {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
  };

  document.getElementById('cancelLogout').onclick = function () {
    logoutModal.style.display = 'none'; // Fecha o modal de logout
  };

  displayProjects();
});
