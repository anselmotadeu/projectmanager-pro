document
  .getElementById('registerForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();

    // Pegando os valores do formulário
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Div para exibir mensagens
    const messageDiv = document.getElementById('message');

    // Verificando se o usuário já existe
    if (localStorage.getItem(username)) {
      messageDiv.textContent = 'Usuário já registrado.';
      messageDiv.style.color = 'red';
    } else {
      // Armazenando os dados no localStorage
      localStorage.setItem(username, password);
      messageDiv.textContent = 'Usuário registrado com sucesso!';
      messageDiv.style.color = 'green';

      // Redirecionando para a página de login após 2 segundos
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 2000);
    }
  });
