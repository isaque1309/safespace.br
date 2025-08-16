document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("loginForm");
    const microsoftButton = document.getElementById("microsoftLogin");
    const toggleButton = document.getElementById("toggleLoginForm");
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

    // Toggle entre Microsoft e login tradicional
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            const isFormVisible = loginForm.style.display !== 'none';
            
            if (isFormVisible) {
                // Mostrar botão Microsoft, ocultar formulário
                loginForm.style.display = 'none';
                microsoftButton.style.display = 'flex';
                toggleButton.textContent = 'Usar login tradicional';
            } else {
                // Mostrar formulário, ocultar botão Microsoft
                loginForm.style.display = 'block';
                microsoftButton.style.display = 'none';
                toggleButton.textContent = 'Usar Microsoft';
            }
        });
    }

    // Autenticação Microsoft
    if (microsoftButton) {
        microsoftButton.addEventListener('click', handleMicrosoftLogin);
    }

    // Login tradicional
    if (loginForm) {
        loginForm.addEventListener("submit", handleTraditionalLogin);
    }

    // Se já estiver autenticado, redireciona para o formulário
    if (localStorage.getItem('student_authenticated') === 'true') {
        window.location.href = "/views/formulario.html";
    }
});

// Função para autenticação Microsoft
async function handleMicrosoftLogin() {
    const button = document.getElementById("microsoftLogin");
    const originalText = button.innerHTML;
    
    try {
        // Estado de loading
        button.classList.add('loading');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
        
        // Simula autenticação Microsoft (substitua pela implementação real)
        await simulateMicrosoftAuth();
        
        // Sucesso
        showSuccess('Login realizado com sucesso!');
        
        // Redireciona para o formulário após um breve delay
        setTimeout(() => {
            window.location.href = "/views/formulario.html";
        }, 1000);
        
    } catch (error) {
        console.error("Erro na autenticação Microsoft:", error);
        showError('Erro na autenticação Microsoft. Por favor, tente novamente.');
    } finally {
        // Restaura o botão
        button.classList.remove('loading');
        button.innerHTML = originalText;
    }
}

// Função para simular autenticação Microsoft
function simulateMicrosoftAuth() {
    return new Promise((resolve, reject) => {
        // Simula um delay de autenticação
        setTimeout(() => {
            // Simula sucesso 90% das vezes
            if (Math.random() > 0.1) {
                // Simula dados do usuário Microsoft
                const microsoftUser = {
                    id: 'ms_' + Date.now(),
                    email: 'estudante@escola.edu.br',
                    nome: 'Estudante Microsoft',
                    provider: 'microsoft'
                };
                
                // Salva dados de autenticação
                localStorage.setItem('student_authenticated', 'true');
                localStorage.setItem('student_email', microsoftUser.email);
                localStorage.setItem('student_name', microsoftUser.nome);
                localStorage.setItem('student_provider', microsoftUser.provider);
                
                resolve(microsoftUser);
            } else {
                reject(new Error('Falha na autenticação'));
            }
        }, 2000);
    });
}

// Função para login tradicional
function handleTraditionalLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    // Validação simples
    if (!email || !senha) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Por favor, insira um email válido.');
        return;
    }

    try {
        // Busca usuários no localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

        if (usuarioValido) {
            // Login bem-sucedido
            localStorage.setItem('student_authenticated', 'true');
            localStorage.setItem('student_email', email);
            localStorage.setItem('student_name', usuarioValido.nome);
            localStorage.setItem('student_provider', 'traditional');
            
            showSuccess('Login realizado com sucesso!');
            
            // Redireciona para o formulário após um breve delay
            setTimeout(() => {
                window.location.href = "/views/formulario.html";
            }, 1000);
        } else {
            throw new Error('Credenciais inválidas');
        }
    } catch (error) {
        showError('Email ou senha incorretos.');
        document.getElementById("loginForm").reset();
        // Garante que não há autenticação em caso de erro
        localStorage.removeItem('student_authenticated');
        localStorage.removeItem('student_email');
        localStorage.removeItem('student_name');
        localStorage.removeItem('student_provider');
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

// Função para implementar autenticação Microsoft real (Azure AD)
function setupMicrosoftAuth() {
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
    
    // Função para fazer login
    async function loginWithMicrosoft() {
        try {
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["user.read"]
            });
            
            // Processar resposta de login
            const user = loginResponse.account;
            
            // Salvar dados de autenticação
            localStorage.setItem('student_authenticated', 'true');
            localStorage.setItem('student_email', user.username);
            localStorage.setItem('student_name', user.name);
            localStorage.setItem('student_provider', 'microsoft');
            
            // Redirecionar para o formulário
            window.location.href = "/views/formulario.html";
            
        } catch (error) {
            console.error("Erro na autenticação Microsoft:", error);
            showError('Erro na autenticação Microsoft. Por favor, tente novamente.');
        }
    }
    
    return loginWithMicrosoft;
    */
}
                    