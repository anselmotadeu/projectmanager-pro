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
  const filterStatus = document.getElementById('filterStatus');
  const logoutModal = document.getElementById('logoutModal'); // Modal de logout
  let currentProjectIndex = null;
  let currentTaskIndex = null;

  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const selectedFilter = localStorage.getItem('selectedFilter') || 'all'; // Persistência do filtro de status

  filterStatus.value = selectedFilter; // Define o valor do filtro para o estado salvo

  // Função para filtrar tarefas
  filterStatus.addEventListener('change', function () {
    localStorage.setItem('selectedFilter', filterStatus.value); // Salva o filtro selecionado
    displayProjects();
  });

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

      const taskList = li.querySelector('.taskList');
      const input = li.querySelector('.projectNameInput');
      const addTaskIcon = li.querySelector('.addTaskIcon');

      // Eventos de edição, exclusão e adição de tarefas
      bindProjectEvents(li, project, index);

      // Exibir as tarefas associadas ao projeto, aplicando o filtro
      displayTasks(project.tasks, taskList);
    });
  }

  function displayTasks(tasks, taskList) {
    taskList.innerHTML = '';
    const selectedFilter = filterStatus.value;

    tasks
      .filter((task) => {
        // Aplicar o filtro de status
        if (selectedFilter === 'all') {
          return true;
        } else {
          return task.status === selectedFilter;
        }
      })
      .forEach((task, index) => {
        const taskLi = document.createElement('li');
        taskLi.innerHTML = `
          <input type="checkbox" ${task.status === 'complete' ? 'checked' : ''}>
          <span class="taskName">${task.name}</span> <span class="taskResponsavel">(${task.responsavel})</span> <!-- Exibir responsável -->
          <span class="taskName">${task.name}</span>
          <select class="statusSelect">
            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pendente</option>
            <option value="inProgress" ${task.status === 'inProgress' ? 'selected' : ''}>Em Andamento</option>
            <option value="complete" ${task.status === 'complete' ? 'selected' : ''}>Concluído</option>
          </select>
          <i class="fas fa-trash-alt deleteIcon"></i>
        `;
        taskList.appendChild(taskLi);

        // Atualizar o status da tarefa ao mudar o select
        taskLi
          .querySelector('.statusSelect')
          .addEventListener('change', function () {
            task.status = this.value;
            localStorage.setItem('projects', JSON.stringify(projects));
            displayTasks(tasks, taskList);
          });

        // Alterar status para pending ou complete ao marcar/desmarcar o checkbox
        taskLi
          .querySelector('input[type="checkbox"]')
          .addEventListener('change', function () {
            task.status = this.checked ? 'complete' : 'pending'; // Definir como 'pending' ao desmarcar
            localStorage.setItem('projects', JSON.stringify(projects));
            displayTasks(tasks, taskList);
          });

        taskLi
          .querySelector('.deleteIcon')
          .addEventListener('click', function () {
            currentTaskIndex = index;
            showTaskDeleteModal(currentTaskIndex, tasks, taskList);
          });
      });
  }

  function bindProjectEvents(li, project, index) {
    const input = li.querySelector('.projectNameInput');
    const deleteIcon = li.querySelector('.deleteIcon');
    const addTaskIcon = li.querySelector('.addTaskIcon');

    input.addEventListener('click', function () {
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
      if (project.tasks.length > 0) {
        showDeleteProjectWithTasksModal(index);
      } else {
        showModal('deleteModal', index);
      }
    });

    addTaskIcon.addEventListener('click', function () {
      currentProjectIndex = index;
      addTaskModal.style.display = 'flex';
    });
  }

  function bindTaskEvents(taskLi, tasks, taskIndex, taskList) {
    const checkbox = taskLi.querySelector('input[type="checkbox"]');
    const deleteIcon = taskLi.querySelector('.deleteIcon');
    const statusSelect = taskLi.querySelector('.statusSelect');

    checkbox.addEventListener('change', function () {
      tasks[taskIndex].status = this.checked ? 'complete' : 'pending'; // Corrigido para 'pending'
      localStorage.setItem('projects', JSON.stringify(projects));
      displayTasks(tasks, taskList);
    });

    statusSelect.addEventListener('change', function () {
      tasks[taskIndex].status = this.value;
      localStorage.setItem('projects', JSON.stringify(projects));
      displayTasks(tasks, taskList);
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
    const taskResponsavel = document.getElementById('taskResponsavel').value; // Captura o nome do responsável

    if (taskName && currentProjectIndex !== null) {
      const newTask = {
        name: taskName,
        status: 'pending',
        responsavel: taskResponsavel,
      }; // Inclui o responsável na tarefa
      projects[currentProjectIndex].tasks.push(newTask);
      localStorage.setItem('projects', JSON.stringify(projects));
      displayProjects();
      taskForm.reset(); // Limpa o campo do formulário
      addTaskModal.style.display = 'none'; // Fecha o modal automaticamente
    }
  });

  closeTaskModal.addEventListener('click', function () {
    addTaskModal.style.display = 'none';
  });

  function showDeleteProjectWithTasksModal(projectIndex) {
    const modal = document.getElementById('deleteModal');
    const message = document.getElementById('deleteModalMessage');
    message.textContent =
      'Este projeto contém tarefas. Se excluir, todas as tarefas serão removidas permanentemente. Tem certeza de que deseja excluir este projeto?';
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

  function showModal(modalId, projectIndex) {
    const modal = document.getElementById(modalId);
    const message = document.getElementById('deleteModalMessage');
    message.textContent = 'Tem certeza de que deseja excluir este projeto?';
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
