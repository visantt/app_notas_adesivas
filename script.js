document.addEventListener('DOMContentLoaded', () => {
    // Seletores de Login
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    // Seletores de Cadastro
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');

    // Função para mostrar qualquer Toast
    window.showToast = function(id) {
        const toast = document.getElementById(id);
        if (toast) {
            toast.classList.add('show');
            // Remove a classe após 4 segundos
            setTimeout(() => toast.classList.remove('show'), 4000);
        }
    };

    // --- LÓGICA DE CADASTRO ---
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const senha = document.getElementById('signup-password').value;

            signupBtn.innerText = 'Salvando...';
            signupBtn.disabled = true;

            // Salva os dados
            const usuario = { nome, email, senha, foto: "" };
            localStorage.setItem(email, JSON.stringify(usuario));

            // MOSTRA A CAIXA DE SUCESSO
            showToast('signup-success-toast');

            // Espera a animação e redireciona
            setTimeout(() => {
                window.location.href = 'index.html?success=true';
            }, 2500);
        });
    }

    // --- LÓGICA DE LOGIN ---
    if (loginForm) {
        // Se veio do cadastro, mostra o toast de sucesso na index também
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
            showToast('signup-success-toast');
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('username').value;
            const senha = document.getElementById('password').value;

            submitBtn.innerText = 'Verificando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const usuarioSalvo = localStorage.getItem(email);
                if (usuarioSalvo) {
                    const dados = JSON.parse(usuarioSalvo);
                    if (dados.senha === senha) {
                        localStorage.setItem('lastLoggedUser', email);
                        window.location.href = 'dashboard.html';
                    } else {
                        alert("Senha incorreta!");
                        submitBtn.innerText = 'Sign In';
                        submitBtn.disabled = false;
                    }
                } else {
                    // Mostra seu modal de erro caso o email n exista
                    const modal = document.getElementById('error-modal');
                    if(modal) modal.style.display = 'flex';
                    submitBtn.innerText = 'Sign In';
                    submitBtn.disabled = false;
                }
            }, 800);
        });
    }
});

// Função para fechar o modal de erro (Global)
window.closeErrorModal = function() {
    const modal = document.getElementById('error-modal');
    if(modal) modal.style.display = 'none';
};