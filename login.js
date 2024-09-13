document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
  
    const storedPassword = localStorage.getItem(username);
  
    if (storedPassword === null) {
      messageDiv.textContent = 'Usuário não encontrado.';
      messageDiv.style.color = 'red';
    } else if (storedPassword === password) {
      messageDiv.textContent = 'Login bem-sucedido!';
      messageDiv.style.color = 'green';
      
      // Armazenar o usuário logado no localStorage
      localStorage.setItem('loggedInUser', username);
      
      // Redirecionar para a página principal
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      messageDiv.textContent = 'Senha incorreta.';
      messageDiv.style.color = 'red';
    }
  });
  