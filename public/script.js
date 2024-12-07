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
    .then(response => response.json())
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
  