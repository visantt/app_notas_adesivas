document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');

    function showToast(id) {
        const toast = document.getElementById(id);
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const senha = document.getElementById('signup-password').value;

            signupBtn.innerText = 'Salvando...';
            signupBtn.disabled = true;

            const usuario = { nome, email, senha, foto: "" };
            localStorage.setItem(email, JSON.stringify(usuario));

            showToast('signup-success-toast');

            setTimeout(() => {
                window.location.href = 'index.html?success=true';
            }, 2500);
        });
    }
});
