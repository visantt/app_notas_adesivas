let taskIdToDelete = null;

// ─── TEMAS ────────────────────────────────────────────────────────────────────
window.setTheme = function(theme) {
    const body = document.body;
    body.classList.remove('theme-blue', 'theme-dark', 'theme-sunset');
    if (theme !== 'rose') body.classList.add(`theme-${theme}`);

    const email = localStorage.getItem('lastLoggedUser');
    if (email) {
        const userData = JSON.parse(localStorage.getItem(email)) || {};
        userData.theme = theme;
        localStorage.setItem(email, JSON.stringify(userData));
    }
};

function applyUserTheme() {
    const email = localStorage.getItem('lastLoggedUser');
    if (!email) return;
    const userData = JSON.parse(localStorage.getItem(email));
    if (userData && userData.theme) setTheme(userData.theme);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(id) {
    const toast = document.getElementById(id);
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
}

// ─── RENDERIZAR TAREFAS ───────────────────────────────────────────────────────
window.renderTasks = function() {
    const email = localStorage.getItem('lastLoggedUser');
    const tasks = JSON.parse(localStorage.getItem(`tasks_${email}`)) || [];

    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');

    todoList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';

        const colorBadge = task.color
            ? `<span style="width:10px;height:10px;border-radius:50%;background:${task.color};display:inline-block;margin-right:8px;flex-shrink:0;"></span>`
            : '';

        const dateBadge = task.date
            ? `<span style="font-size:11px;opacity:0.6;margin-left:6px;">(${task.date})</span>`
            : '';

        item.innerHTML = `
            <div style="display:flex;align-items:center;flex:1;min-width:0;">
                ${colorBadge}
                <span style="${task.completed ? 'text-decoration:line-through;opacity:0.5;' : ''}white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${task.text}
                </span>
                ${dateBadge}
            </div>
            <div class="task-actions">
                ${!task.completed ? `<i class="fas fa-edit" title="Editar" onclick="editTask(${task.id})"></i>` : ''}
                <i class="fas fa-trash" title="Excluir" onclick="deleteTask(${task.id})"></i>
                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}" title="${task.completed ? 'Desfazer' : 'Concluir'}" onclick="toggleTask(${task.id})"></i>
            </div>
        `;

        if (task.completed) {
            completedList.appendChild(item);
        } else {
            todoList.appendChild(item);
        }
    });
};

// ─── ADICIONAR TAREFA ─────────────────────────────────────────────────────────
window.addNote = function() {
    const input = document.getElementById('task-input');
    const email = localStorage.getItem('lastLoggedUser');

    if (!input.value.trim()) return;

    const selectedColor = document.querySelector('input[name="category"]:checked');
    const taskDate = document.getElementById('task-date').value;

    const tasks = JSON.parse(localStorage.getItem(`tasks_${email}`)) || [];
    tasks.push({
        id: Date.now(),
        text: input.value.trim(),
        completed: false,
        color: selectedColor ? selectedColor.value : '#DB7093',
        date: taskDate || ''
    });
    localStorage.setItem(`tasks_${email}`, JSON.stringify(tasks));

    input.value = '';
    document.getElementById('task-date').value = '';
    renderTasks();
};

// ─── EDITAR TAREFA ────────────────────────────────────────────────────────────
window.editTask = function(id) {
    const email = localStorage.getItem('lastLoggedUser');
    let tasks = JSON.parse(localStorage.getItem(`tasks_${email}`));
    const task = tasks.find(t => t.id === id);
    const novoTexto = prompt("Edite sua tarefa:", task.text);

    if (novoTexto && novoTexto.trim() !== "") {
        task.text = novoTexto.trim();
        localStorage.setItem(`tasks_${email}`, JSON.stringify(tasks));
        renderTasks();
    }
};

// ─── EXCLUIR TAREFA ───────────────────────────────────────────────────────────
window.deleteTask = function(id) {
    const skipConfirm = localStorage.getItem('skipDeleteConfirm') === 'true';
    if (skipConfirm) {
        executeDeletion(id);
    } else {
        taskIdToDelete = id;
        document.getElementById('delete-modal-container').style.display = 'flex';
    }
};

function executeDeletion(id) {
    const email = localStorage.getItem('lastLoggedUser');
    let tasks = JSON.parse(localStorage.getItem(`tasks_${email}`));
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(`tasks_${email}`, JSON.stringify(tasks));
    document.getElementById('delete-modal-container').style.display = 'none';
    renderTasks();
}

// ─── CONCLUIR / DESFAZER ──────────────────────────────────────────────────────
window.toggleTask = function(id) {
    const email = localStorage.getItem('lastLoggedUser');
    let tasks = JSON.parse(localStorage.getItem(`tasks_${email}`));
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem(`tasks_${email}`, JSON.stringify(tasks));
    renderTasks();
};

// ─── MODAL DE PERFIL ──────────────────────────────────────────────────────────
window.openProfileModal = function() {
    const email = localStorage.getItem('lastLoggedUser');
    const userData = JSON.parse(localStorage.getItem(email));

    document.getElementById('edit-name').value = userData.nome || '';
    document.getElementById('edit-password').value = '';

    const preview = document.getElementById('profile-preview');
    preview.src = (userData.foto && userData.foto.startsWith('data:'))
        ? userData.foto
        : 'https://via.placeholder.com/100';

    document.getElementById('profile-modal').style.display = 'flex';
};

window.closeProfileModal = function() {
    document.getElementById('profile-modal').style.display = 'none';
};

// ─── PREVIEW DA FOTO ──────────────────────────────────────────────────────────
document.getElementById('image-input').addEventListener('change', function(e) {
    if (!e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('profile-preview').src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// ─── SALVAR PERFIL ────────────────────────────────────────────────────────────
window.saveProfile = function() {
    const email = localStorage.getItem('lastLoggedUser');
    let userData = JSON.parse(localStorage.getItem(email));

    const novoNome = document.getElementById('edit-name').value.trim();
    const novaSenha = document.getElementById('edit-password').value.trim();
    const novaFoto = document.getElementById('profile-preview').src;

    if (!novoNome) { alert("O nome não pode estar vazio!"); return; }

    userData.nome = novoNome;
    if (novaSenha !== "") userData.senha = novaSenha;
    if (novaFoto && novaFoto.startsWith('data:')) userData.foto = novaFoto;

    localStorage.setItem(email, JSON.stringify(userData));

    updateUserDisplay();
    closeProfileModal();
    showToast('profile-success-toast');
};

// ─── ATUALIZAR HEADER ─────────────────────────────────────────────────────────
function updateUserDisplay() {
    const email = localStorage.getItem('lastLoggedUser');
    const userData = JSON.parse(localStorage.getItem(email));

    if (userData) {
        document.getElementById('welcome-name').innerText = `Tarefas de ${userData.nome}`;

        const headerImg = document.getElementById('header-avatar');
        const headerIcon = document.getElementById('header-icon');

        if (userData.foto && userData.foto.startsWith('data:')) {
            headerImg.src = userData.foto;
            headerImg.style.display = 'block';
            headerIcon.style.display = 'none';
        } else {
            headerImg.style.display = 'none';
            headerIcon.style.display = 'inline';
        }
    }
}

// ─── SELEÇÃO DE COR ───────────────────────────────────────────────────────────
function initColorDots() {
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
}

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('lastLoggedUser');
    if (!email) { window.location.href = 'index.html'; return; }

    const userData = JSON.parse(localStorage.getItem(email));
    if (userData) {
        document.getElementById('welcome-name').innerText = `Tarefas de ${userData.nome}`;
        document.getElementById('user-display-name').innerText = `Olá, ${userData.nome}!`;
    }

    applyUserTheme();
    updateUserDisplay();

    // Toast de boas-vindas
    setTimeout(() => showToast('welcome-toast'), 500);

    // Botão adicionar
    document.getElementById('add-task-btn').onclick = addNote;

    // Enter no campo de tarefa
    document.getElementById('task-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); addNote(); }
    });

    // Modal de exclusão
    document.getElementById('confirm-delete-btn').onclick = () => {
        if (document.getElementById('dont-show-again').checked) {
            localStorage.setItem('skipDeleteConfirm', 'true');
        }
        executeDeletion(taskIdToDelete);
    };

    document.getElementById('cancel-delete-btn').onclick = () => {
        document.getElementById('delete-modal-container').style.display = 'none';
    };

    // Fechar modais clicando no overlay
    document.getElementById('delete-modal-container').addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });

    document.getElementById('profile-modal').addEventListener('click', function(e) {
        if (e.target === this) closeProfileModal();
    });

    initColorDots();
    renderTasks();
});
