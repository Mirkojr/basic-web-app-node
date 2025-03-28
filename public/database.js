// Função para adicionar um usuário ao banco de dados
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
  
    // Enviar os dados para o backend
    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome: name, email: email })
    })
    .then((response) => {
      if (!response.ok) {
        // Se a resposta não for OK, converta para JSON e lance um erro
        return response.json().then((error) => {
          throw new Error(error.error); // "error.error" vem da mensagem do backend
        });
      }
      return response.json(); // Caso contrário, continue com o fluxo
    })
    .then(() => {
      // Limpar os campos do formulário
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      
      // Atualizar a lista de usuários
      loadUsers();
    })
    .catch(error => {
      console.error('Erro ao adicionar o usuário:', error);
    });
  });

// Função para resetar o banco de dados
document.getElementById('userForm').addEventListener('reset', function() {
  // Confirmar com o usuário antes de apagar todos os dados
  if (confirm('Tem certeza que deseja apagar todos os dados?')) {
    fetch('/reset', {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message); // Exibe a resposta do servidor
      loadUsers(); // Atualizar a lista de usuários após o reset
    })
    .catch(error => {
      console.error('Erro ao resetar o banco de dados:', error);
    });
  }
});

// Função para carregar os usuários existentes
function loadUsers() {
  fetch('/users')
    .then(response => response.json())
    .then(users => {
      const userTable = document.getElementById('userTable');
      userTable.innerHTML = ''; // Limpar a tabela antes de adicionar os novos usuários
      
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${user.nome}</td><td>${user.email}</td>`;
        userTable.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os usuários:', error);
    });
}


// Carregar os usuários ao abrir a página
loadUsers();
  