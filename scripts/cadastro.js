document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById("registerForm");
    const microsoftButton = document.getElementById("microsoftRegister");
    const toggleButton = document.getElementById("toggleRegisterForm");
    const errorMessage = document.getElementById("errorMessage");
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById("password");

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle entre Microsoft e cadastro tradicional
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            const isFormVisible = registerForm.style.display !== 'none';
            
            if (isFormVisible) {
                // Mostrar botão Microsoft, ocultar formulário
                registerForm.style.display = 'none';
                microsoftButton.style.display = 'flex';
                toggleButton.textContent = 'Usar cadastro tradicional';
            } else {
                // Mostrar formulário, ocultar botão Microsoft
                registerForm.style.display = 'block';
                microsoftButton.style.display = 'none';
                toggleButton.textContent = 'Usar Microsoft';
            }
        });
    }

    // Cadastro Microsoft
    if (microsoftButton) {
        microsoftButton.addEventListener('click', handleMicrosoftRegister);
    }

    // Cadastro tradicional
    if (registerForm) {
        registerForm.addEventListener("submit", handleTraditionalRegister);
    }

    // Se já estiver autenticado, redireciona para o formulário
    if (localStorage.getItem('student_authenticated') === 'true') {
        window.location.href = "/views/formulario.html";
    }
});

// Função para cadastro Microsoft
async function handleMicrosoftRegister() {
    const button = document.getElementById("microsoftRegister");
    const originalText = button.innerHTML;
    
    try {
        // Estado de loading
        button.classList.add('loading');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
        
        // Simula cadastro Microsoft (substitua pela implementação real)
        await simulateMicrosoftRegister();
        
        // Sucesso
        showSuccess('Cadastro realizado com sucesso!');
        
        // Redireciona para o formulário após um breve delay
        setTimeout(() => {
            window.location.href = "/views/formulario.html";
        }, 1000);
        
    } catch (error) {
        console.error("Erro no cadastro Microsoft:", error);
        showError('Erro no cadastro Microsoft. Por favor, tente novamente.');
    } finally {
        // Restaura o botão
        button.classList.remove('loading');
        button.innerHTML = originalText;
    }
}

// Função para simular cadastro Microsoft
function simulateMicrosoftRegister() {
    return new Promise((resolve, reject) => {
        // Simula um delay de cadastro
        setTimeout(() => {
            // Simula sucesso 90% das vezes
            if (Math.random() > 0.1) {
                // Simula dados do usuário Microsoft
                const microsoftUser = {
                    id: 'ms_' + Date.now(),
                    email: 'estudante@escola.edu.br',
                    nome: 'Estudante Microsoft',
                    rm: 'MS' + Math.floor(Math.random() * 10000),
                    provider: 'microsoft'
                };
                
                // Salva dados de autenticação
                localStorage.setItem('student_authenticated', 'true');
                localStorage.setItem('student_email', microsoftUser.email);
                localStorage.setItem('student_name', microsoftUser.nome);
                localStorage.setItem('student_provider', microsoftUser.provider);
                
                // Salva no localStorage como usuário registrado
                let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
                usuarios.push({
                    nome: microsoftUser.nome,
                    email: microsoftUser.email,
                    rm: microsoftUser.rm,
                    senha: 'microsoft_auth', // Senha especial para usuários Microsoft
                    provider: 'microsoft'
                });
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                
                resolve(microsoftUser);
            } else {
                reject(new Error('Falha no cadastro'));
            }
        }, 2000);
    });
}

// Função para cadastro tradicional
function handleTraditionalRegister(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const rm = document.getElementById("rm").value.trim();
    const senha = document.getElementById("password").value.trim();

    // Validação dos campos
    if (!nome || !email || !rm || !senha) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Por favor, insira um email válido.');
        return;
    }

    // Validação de senha
    if (senha.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
        // Busca usuários existentes
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        // Verifica se o email já está cadastrado
        const emailExistente = usuarios.find(user => user.email === email);
        if (emailExistente) {
            showError('Este email já está cadastrado.');
            return;
        }

        // Verifica se a matrícula já está cadastrada
        const rmExistente = usuarios.find(user => user.rm === rm);
        if (rmExistente) {
            showError('Esta matrícula já está cadastrada.');
            return;
        }

        // Adiciona novo usuário
        const novoUsuario = {
            nome: nome,
            email: email,
            rm: rm,
            senha: senha,
            provider: 'traditional'
        };

        usuarios.push(novoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Login automático após cadastro
        localStorage.setItem('student_authenticated', 'true');
        localStorage.setItem('student_email', email);
        localStorage.setItem('student_name', nome);
        localStorage.setItem('student_provider', 'traditional');

        showSuccess('Cadastro realizado com sucesso! Você será redirecionado automaticamente.');

        // Redireciona para o formulário após um breve delay
        setTimeout(() => {
            window.location.href = "/views/formulario.html";
        }, 1500);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        showError('Erro ao realizar cadastro. Por favor, tente novamente.');
    }
}

// Função para mostrar mensagem de erro
function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.style.color = 'var(--danger-color)';
        errorMessage.textContent = message;

        // Limpa a mensagem após 5 segundos
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 5000);
    } else {
        alert(message);
    }
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.style.color = 'var(--success-color)';
        errorMessage.textContent = message;
    } else {
        alert(message);
    }
}

// Função para implementar cadastro Microsoft real (Azure AD)
function setupMicrosoftRegister() {
    // Configuração do Azure AD
    const msalConfig = {
        auth: {
            clientId: "YOUR_CLIENT_ID", // Substitua pelo seu Client ID
            authority: "https://login.microsoftonline.com/common",
            redirectUri: window.location.origin + "/views/formulario.html"
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: false
        }
    };

    // Inicializar MSAL (Microsoft Authentication Library)
    // Nota: Você precisará incluir a biblioteca MSAL no seu projeto
    // <script src="https://alcdn.msauth.net/browser/2.0.0/js/msal-browser.min.js"></script>
    
    /*
    const msalInstance = new msal.PublicClientApplication(msalConfig);
    
    // Função para fazer cadastro
    async function registerWithMicrosoft() {
        try {
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["user.read"]
            });
            
            // Processar resposta de login
            const user = loginResponse.account;
            
            // Verificar se o usuário já existe
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const usuarioExistente = usuarios.find(u => u.email === user.username);
            
            if (usuarioExistente) {
                showError('Este email já está cadastrado. Faça login em vez de cadastro.');
                return;
            }
            
            // Adicionar novo usuário Microsoft
            const novoUsuario = {
                nome: user.name || 'Usuário Microsoft',
                email: user.username,
                rm: 'MS' + Math.floor(Math.random() * 10000),
                senha: 'microsoft_auth',
                provider: 'microsoft'
            };
            
            usuarios.push(novoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            
            // Salvar dados de autenticação
            localStorage.setItem('student_authenticated', 'true');
            localStorage.setItem('student_email', user.username);
            localStorage.setItem('student_name', novoUsuario.nome);
            localStorage.setItem('student_provider', 'microsoft');
            
            // Redirecionar para o formulário
            window.location.href = "/views/formulario.html";
            
        } catch (error) {
            console.error("Erro no cadastro Microsoft:", error);
            showError('Erro no cadastro Microsoft. Por favor, tente novamente.');
        }
    }
    
    return registerWithMicrosoft;
    */
}
                            