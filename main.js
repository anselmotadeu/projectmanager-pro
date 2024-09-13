// Exibir o nome do usuário logado
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('loggedInUser');
    if (username) {
      document.getElementById('usernameDisplay').textContent = username;
    } else {
      // Se o usuário não estiver logado, redirecionar para a página de login
      window.location.href = 'login.html';
    }
  });
  
  // Função de logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
  });
  