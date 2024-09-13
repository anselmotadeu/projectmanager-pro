document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    console.log("Formulário enviado!");
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log(`Usuário: ${username}, Senha: ${password}`);
  
    const messageDiv = document.getElementById('message');
    const storedPassword = localStorage.getItem(username);
  
    console.log(`Senha armazenada para ${username}: ${storedPassword}`);
  
    if (storedPassword === null) {
      messageDiv.textContent = 'Usuário não encontrado.';
      messageDiv.style.color = 'red';
      console.log('Usuário não encontrado.');
    } else if (storedPassword === password) {
      messageDiv.textContent = 'Login bem-sucedido!';
      messageDiv.style.color = 'green';
      console.log('Login bem-sucedido!');
      
      // Armazenar o usuário logado no localStorage
      localStorage.setItem('loggedInUser', username);
      console.log('Usuário logado armazenado:', username);
      
      // Redirecionar para a página de projetos
      setTimeout(function() {
        console.log('Redirecionando para projects.html');
        window.location.href = 'projects.html';
      }, 2000);
    } else {
      messageDiv.textContent = 'Senha incorreta.';
      messageDiv.style.color = 'red';
      console.log('Senha incorreta.');
    }
  });
  