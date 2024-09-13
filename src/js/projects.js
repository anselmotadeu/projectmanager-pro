document.addEventListener('DOMContentLoaded', function() {
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
  let currentProjectIndex = null; // Para armazenar o índice do projeto

  // Carregar os projetos do localStorage
  const projects = JSON.parse(localStorage.getItem('projects')) || [];

  // Exibir os projetos na lista
  function displayProjects() {
    projectList.innerHTML = ''; // Limpar a lista antes de exibir novamente
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

      const input = li.querySelector('.projectNameInput');
      const taskList = li.querySelector('.taskList');
      const addTaskIcon = li.querySelector('.addTaskIcon');

      // Botão de editar (edição inline)
      li.querySelector('.editIcon').addEventListener('click', function() {
        input.removeAttribute('readonly'); // Permite a edição
        input.focus(); // Coloca o cursor no campo de texto

        input.addEventListener('blur', function() {
          input.setAttribute('readonly', true); // Desativa a edição
          project.name = input.value; // Atualiza o nome do projeto
          localStorage.setItem('projects', JSON.stringify(projects));
          displayProjects(); // Atualiza a lista
        });
      });

      // Botão de excluir (abre o modal)
      li.querySelector('.deleteIcon').addEventListener('click', function() {
        showModal(index); // Exibe o modal de confirmação de exclusão
      });

      // Adicionar nova tarefa (abrir modal)
      addTaskIcon.addEventListener('click', function() {
        currentProjectIndex = index; // Guarda o índice do projeto atual
        addTaskModal.style.display = 'flex'; // Abre o modal de tarefas
      });

      // Exibir as tarefas associadas ao projeto
      displayTasks(project.tasks, taskList);
    });
  }

  // Exibir as tarefas dentro de um projeto
  function displayTasks(tasks, taskList) {
    taskList.innerHTML = ''; // Limpa a lista de tarefas
    tasks.forEach((task, index) => {
      const taskLi = document.createElement('li');
      taskLi.innerHTML = `
        <input type="checkbox" ${task.status === 'complete' ? 'checked' : ''}>
        <span>${task.name}</span>
        <i class="fas fa-trash-alt deleteIcon"></i>
      `;
      taskList.appendChild(taskLi);

      // Marcar como completa ou incompleta
      taskLi.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        task.status = this.checked ? 'complete' : 'incomplete'; // Atualiza o status
        localStorage.setItem('projects', JSON.stringify(projects)); // Salva no localStorage
      });

      // Botão de excluir tarefa
      taskLi.querySelector('.deleteIcon').addEventListener('click', function() {
        tasks.splice(index, 1); // Remove a tarefa
        localStorage.setItem('projects', JSON.stringify(projects)); // Salva no localStorage
        displayTasks(tasks, taskList); // Atualiza a lista de tarefas
      });
    });
  }

  // Adicionar novo projeto
  projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    if (projectName) {
      const newProject = { name: projectName, tasks: [] }; // Projeto sem tarefas no início
      projects.push(newProject); // Adiciona o novo projeto
      localStorage.setItem('projects', JSON.stringify(projects));
      displayProjects(); // Atualiza a lista
      projectForm.reset();
    }
  });

  // Lidar com a submissão do modal de adicionar tarefa
  taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    if (taskName && currentProjectIndex !== null) {
      const newTask = { name: taskName, status: 'incomplete' };
      projects[currentProjectIndex].tasks.push(newTask); // Adiciona a nova tarefa
      localStorage.setItem('projects', JSON.stringify(projects));
      displayProjects(); // Atualiza a lista de projetos e tarefas
      addTaskModal.style.display = 'none'; // Fecha o modal
      taskForm.reset(); // Limpa o campo do formulário
    }
  });

  // Fechar o modal de tarefas
  closeTaskModal.addEventListener('click', function() {
    addTaskModal.style.display = 'none'; // Fecha o modal
  });

  displayProjects();

  // Função de logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
  });

  // Função para exibir o modal de confirmação de exclusão
  function showModal(projectIndex) {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex'; // Exibe o modal

    // Quando o usuário clica em "Excluir"
    document.getElementById('confirmDelete').onclick = function() {
      projects.splice(projectIndex, 1); // Remove o projeto da lista
      localStorage.setItem('projects', JSON.stringify(projects));
      modal.style.display = 'none'; // Fecha o modal
      displayProjects(); // Atualiza a lista
    };

    // Quando o usuário clica em "Cancelar"
    document.getElementById('cancelDelete').onclick = function() {
      modal.style.display = 'none'; // Fecha o modal
    };
  }
});
