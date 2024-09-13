document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log("Formulário enviado!");
  
    // Pegando os valores do formulário
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log(`Usuário: ${username}, Senha: ${password}`);
  
    // Div para exibir mensagens
    const messageDiv = document.getElementById('message');
  
    // Verificando se o usuário está registrado e a senha está correta
    const storedPassword = localStorage.getItem(username);
    console.log(`Senha armazenada para ${username}: ${storedPassword}`);
  
    if (storedPassword === null) {
      messageDiv.textContent = 'Usuário não encontrado.';
      messageDiv.style.color = 'red';
    } else if (storedPassword === password) {
      messageDiv.textContent = 'Login bem-sucedido!';
      messageDiv.style.color = 'green';
      // Redirecionando para a página principal após o login
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      messageDiv.textContent = 'Senha incorreta.';
      messageDiv.style.color = 'red';
    }
  });
  