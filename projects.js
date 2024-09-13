document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('loggedInUser');
    
    // Verifica se o usuário está logado, caso contrário redireciona
    if (username) {
      document.getElementById('usernameDisplay').textContent = username;
    } else {
      window.location.href = 'login.html';
    }
  
    const projectForm = document.getElementById('projectForm');
    const projectList = document.getElementById('projectList');
  
    // Carregar os projetos do localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
  
    // Exibir os projetos na lista
    function displayProjects() {
      projectList.innerHTML = '';
      projects.forEach((project, index) => {
        const li = document.createElement('li');
        li.textContent = project;
        projectList.appendChild(li);
      });
    }
  
    // Adicionar novo projeto
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const projectName = document.getElementById('projectName').value;
      projects.push(projectName);
      localStorage.setItem('projects', JSON.stringify(projects));
      displayProjects();
      projectForm.reset();
    });
  
    displayProjects();
  
    // Função de logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    });
  });
