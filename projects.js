document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('loggedInUser');
    
    if (!username) {
      window.location.href = 'login.html';
    } else {
      document.getElementById('usernameDisplay').textContent = username;
    }
  
    const projectForm = document.getElementById('projectForm');
    const projectList = document.getElementById('projectList');
    
    // Carregar os projetos do localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
  
    // Exibir os projetos na lista
    function displayProjects() {
      projectList.innerHTML = ''; // Limpar a lista antes de exibir novamente
      projects.forEach((project, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="text" value="${project}" readonly class="projectNameInput">
          <i class="fas fa-pencil-alt editIcon"></i>
          <i class="fas fa-trash-alt deleteIcon"></i>
        `;
        projectList.appendChild(li);
  
        const input = li.querySelector('.projectNameInput');
  
        // Botão de editar (edição inline)
        li.querySelector('.editIcon').addEventListener('click', function() {
          input.removeAttribute('readonly'); // Permite a edição
          input.focus(); // Coloca o cursor no campo de texto
  
          // Quando o usuário pressiona Enter, salva a alteração
          input.addEventListener('blur', function() {
            input.setAttribute('readonly', true); // Desativa a edição
            projects[index] = input.value; // Atualiza o projeto
            localStorage.setItem('projects', JSON.stringify(projects));
          });
        });
  
        // Botão de excluir (abre o modal)
        li.querySelector('.deleteIcon').addEventListener('click', function() {
          showModal(index); // Exibe o modal de confirmação de exclusão
        });
      });
    }
  
    // Adicionar novo projeto
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const projectName = document.getElementById('projectName').value;
      if (projectName) {
        projects.push(projectName); // Adiciona o novo projeto
        localStorage.setItem('projects', JSON.stringify(projects));
        displayProjects(); // Atualiza a lista
        projectForm.reset();
      }
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
      modal.style.display = 'block'; // Exibe o modal
  
      // Quando o usuário clica em "Excluir"
      document.getElementById('confirmDelete').addEventListener('click', function() {
        projects.splice(projectIndex, 1); // Remove o projeto da lista
        localStorage.setItem('projects', JSON.stringify(projects));
        modal.style.display = 'none'; // Fecha o modal
        displayProjects(); // Atualiza a lista
      });
  
      // Quando o usuário clica em "Cancelar"
      document.getElementById('cancelDelete').addEventListener('click', function() {
        modal.style.display = 'none'; // Fecha o modal
      });
    }
  });
  