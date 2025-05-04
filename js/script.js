// Simulação de banco de dados local via localStorage

const STORAGE_KEYS = {
    USERS: "ppf_users",
    PROJECTS: "ppf_projects",
    APPLICATIONS: "ppf_applications",
    TASKS: "ppf_tasks",
  };
  
  function lerUsuarios() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  }
  
  function salvarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usuarios));
  }
  
  function lerProjetos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || [];
  }
  
  function salvarProjetos(projetos) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projetos));
  }
  
  function lerCandidaturas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || [];
  }
  
  function salvarCandidaturas(candidaturas) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(candidaturas));
  }
  
  function lerTarefas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
  }
  
  function salvarTarefas(tarefas) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tarefas));
  }
  
  // Variável para usuário logado
  let usuarioLogado = null;
  
  // -----------------------
  // Controles de Navegação
  const btnLogin = document.getElementById("btn-login");
  const btnRegister = document.getElementById("btn-register");
  const btnProjects = document.getElementById("btn-projects");
  const btnDashboard = document.getElementById("btn-dashboard");
  const btnSubmitProject = document.getElementById("btn-submit-project");
  const btnLogout = document.getElementById("btn-logout");
  
  const sectionLogin = document.getElementById("section-login");
  const sectionRegister = document.getElementById("section-register");
  const sectionProjects = document.getElementById("section-projects");
  const sectionDashboard = document.getElementById("section-dashboard");
  const sectionSubmitProject = document.getElementById("section-submit-project");
  
  btnLogin.addEventListener("click", () => mostrarSecao("login"));
  btnRegister.addEventListener("click", () => mostrarSecao("register"));
  btnProjects.addEventListener("click", () => mostrarSecao("projects"));
  btnDashboard.addEventListener("click", () => mostrarSecao("dashboard"));
  btnSubmitProject.addEventListener("click", () =>
    mostrarSecao("submit-project")
  );
  btnLogout.addEventListener("click", logout);
  
  function mostrarSecao(secao) {
    console.log(`Exibindo a seção: ${secao}`);
    // Esconder todas as seções
    [
      sectionLogin,
      sectionRegister,
      sectionProjects,
      sectionDashboard,
      sectionSubmitProject,
    ].forEach((s) => {
      s.classList.remove("active-section");
      s.classList.add("hidden-section");
    });
  
    // Ativar botão/aba
    [btnLogin, btnRegister, btnProjects, btnDashboard, btnSubmitProject].forEach(
      (btn) => btn.classList.remove("active")
    );
  
    switch (secao) {
      case "login":
        sectionLogin.classList.add("active-section");
        btnLogin.classList.add("active");
        break;
      case "register":
        sectionRegister.classList.add("active-section");
        btnRegister.classList.add("active");
        break;
      case "projects":
        sectionProjects.classList.add("active-section");
        btnProjects.classList.add("active");
        carregarProjetos();
        break;
      case "dashboard":
        sectionDashboard.classList.add("active-section");
        btnDashboard.classList.add("active");
        carregarDashboard();
        break;
      case "submit-project":
        sectionSubmitProject.classList.add("active-section");
        btnSubmitProject.classList.add("active");
        break;
    }
  }
  
  // -----------------------
  // Registro de usuários
  const formRegister = document.getElementById("form-register");
  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = formRegister["register-username"].value.trim();
    const password = formRegister["register-password"].value;
    const role = formRegister["register-role"].value;
  
    if (!username || !password || !role) {
      alert("Preencha todos os campos.");
      return;
    }
  
    let usuarios = lerUsuarios();
    if (
      usuarios.find((u) => u.username.toLowerCase() === username.toLowerCase())
    ) {
      alert("Usuário já existe. Escolha outro nome.");
      return;
    }
  
    usuarios.push({
      username,
      password, // Em app real, deve ser criptografado (hash) - aqui em texto puro só por simplicidade
      role,
    });
  
    salvarUsuarios(usuarios);
  
    alert("Usuário registrado com sucesso! Agora faça login.");
    formRegister.reset();
    mostrarSecao("login");
  });
  
  // -----------------------
  // Login de usuário
  const formLogin = document.getElementById("form-login");
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = formLogin["login-username"].value.trim();
    const password = formLogin["login-password"].value;
  
    const usuarios = lerUsuarios();
    const usuario = usuarios.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );
  
    if (!usuario) {
      alert("Usuário ou senha inválidos.");
      return;
    }
  
    usuarioLogado = usuario;
    alert(`Bem-vindo(a), ${usuarioLogado.username}!`);
    formLogin.reset();
    aposLogin();
  });
  
  // -----------------------
  // Após login
  function aposLogin() {
    // Ajusta botões conforme perfil
    btnLogin.style.display = "none";
    btnRegister.style.display = "none";
    btnLogout.style.display = "inline-block";
  
    if (usuarioLogado.role === "aluno") {
      btnProjects.style.display = "inline-block";
      btnDashboard.style.display = "inline-block";
      btnSubmitProject.style.display = "none";
      mostrarSecao("projects");
    } else if (usuarioLogado.role === "instituicao") {
      btnProjects.style.display = "none";
      btnDashboard.style.display = "none";
      btnSubmitProject.style.display = "inline-block";
      mostrarSecao("submit-project");
    }
  }
  
  // Logout
  function logout() {
    usuarioLogado = null;
    btnLogin.style.display = "inline-block";
    btnRegister.style.display = "inline-block";
    btnLogout.style.display = "none";
    btnProjects.style.display = "none";
    btnDashboard.style.display = "none";
    btnSubmitProject.style.display = "none";
    mostrarSecao("login");
  }
  
  // -----------------------
  // Projetos - carregamento e candidatura
  const projectsList = document.getElementById("projects-list");
  
  function carregarProjetos() {
    projectsList.innerHTML = "";
    const projetos = lerProjetos();
  
    if (projetos.length === 0) {
      projectsList.innerHTML =
        '<p class="empty-message">Nenhum projeto disponível no momento.</p>';
      return;
    }
  
    // Carregar candidaturas do usuário para marcação
    const candidaturas = lerCandidaturas().filter(
      (c) => c.username === usuarioLogado.username
    );
  
    projetos.forEach((proj) => {
      const card = document.createElement("div");
      card.classList.add("project-card");
  
      const isApplied = candidaturas.some((c) => c.projectId === proj.id);
  
      card.innerHTML = `
          <h3>${proj.title}</h3>
          <p>${proj.description}</p>
          <small>Prazo: ${proj.deadline}</small>
          <br/>
          <button class="btn-apply" ${isApplied ? "disabled" : ""} data-id="${
        proj.id
      }">
            ${isApplied ? "Candidatura Enviada" : "Candidatar-se"}
          </button>
        `;
  
      projectsList.appendChild(card);
    });
  
    // Adicionar event listeners para os botões
    Array.from(document.getElementsByClassName("btn-apply")).forEach((btn) => {
      btn.addEventListener("click", aplicarProjeto);
    });
  }
  
  function aplicarProjeto(event) {
    const projectId = event.target.dataset.id;
  
    const candidaturas = lerCandidaturas();
    if (
      candidaturas.find(
        (c) => c.projectId === projectId && c.username === usuarioLogado.username
      )
    ) {
      alert("Você já se candidatou a este projeto.");
      return;
    }
  
    candidaturas.push({
      projectId,
      username: usuarioLogado.username,
      status: "Em avaliação",
      appliedAt: new Date().toLocaleDateString(),
    });
  
    salvarCandidaturas(candidaturas);
    alert("Candidatura enviada com sucesso!");
    carregarProjetos();
  }
  
  // -----------------------
  // Dashboard do aluno
  const myApplicationsDiv = document.getElementById("my-applications");
  const myTasksDiv = document.getElementById("my-tasks");
  
  function carregarDashboard() {
    if (!usuarioLogado) return;
  
    // Candidaturas do usuário
    const candidaturas = lerCandidaturas().filter(
      (c) => c.username === usuarioLogado.username
    );
    const projetos = lerProjetos();
  
    myApplicationsDiv.innerHTML = "";
    if (candidaturas.length === 0) {
      myApplicationsDiv.innerHTML =
        '<p class="empty-message">Você não possui candidaturas no momento.</p>';
    } else {
      candidaturas.forEach((c) => {
        const proj = projetos.find((p) => p.id === c.projectId);
        const div = document.createElement("div");
        div.classList.add("application-item");
        div.innerHTML = `
            <h4>${proj ? proj.title : "Projeto removido"}</h4>
            <p>Status: ${c.status}</p>
            <small>Candidatura em: ${c.appliedAt}</small>
          `;
        myApplicationsDiv.appendChild(div);
      });
    }
  
    // Tarefas simuladas (em um app real seriam dinâmicas)
    const tarefas = lerTarefas().filter(
      (t) => t.username === usuarioLogado.username
    );
    myTasksDiv.innerHTML = "";
    if (tarefas.length === 0) {
      myTasksDiv.innerHTML =
        '<p class="empty-message">Nenhuma tarefa atribuída no momento.</p>';
    } else {
      tarefas.forEach((t) => {
        const div = document.createElement("div");
        div.classList.add("task-item");
        div.innerHTML = `
            <h4>${t.title}</h4>
            <p>Prazo: ${t.deadline}</p>
            <p>Status: ${t.status}</p>
          `;
        myTasksDiv.appendChild(div);
      });
    }
  }
  
  // -----------------------
  // Submissão de projetos (Instituições)
  const formSubmitProject = document.getElementById("form-submit-project");
  formSubmitProject.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!usuarioLogado || usuarioLogado.role !== "instituicao") {
      alert("Somente instituições podem submeter projetos.");
      return;
    }
  
    const title = formSubmitProject["project-title"].value.trim();
    const description = formSubmitProject["project-description"].value.trim();
    const deadline = formSubmitProject["project-deadline"].value;
  
    if (!title || !description || !deadline) {
      alert("Preencha todos os campos.");
      return;
    }
  
    const projetos = lerProjetos();
    const novoProjeto = {
      id: "p" + Date.now(),
      title,
      description,
      deadline,
      submittedBy: usuarioLogado.username,
    };
  
    projetos.push(novoProjeto);
    salvarProjetos(projetos);
  
    alert("Projeto submetido com sucesso!");
    formSubmitProject.reset();
  });
  
  // -----------------------
  // Inicialização do app
  function inicializarApp() {
    // Para demonstração, criar 2 usuários padrões se não existirem
    let usuarios = lerUsuarios();
    if (usuarios.length === 0) {
      usuarios = [
        { username: "aluno1", password: "1234", role: "aluno" },
        { username: "empresa1", password: "1234", role: "instituicao" },
      ];
      salvarUsuarios(usuarios);
    }
  
    // Criar alguns projetos de exemplo se não houver
    let projetos = lerProjetos();
    if (projetos.length === 0) {
      projetos = [
        {
          id: "p1001",
          title: "App de Sustentabilidade",
          description:
            "Desenvolver um aplicativo que promova ações sustentáveis na comunidade.",
          deadline: "2023-12-31",
          submittedBy: "empresa1",
        },
        {
          id: "p1002",
          title: "Sistema de Gestão de Eventos",
          description:
            "Criar um sistema para gerenciar inscrições e atividades de eventos acadêmicos.",
          deadline: "2023-11-30",
          submittedBy: "empresa1",
        },
      ];
      salvarProjetos(projetos);
    }
  
    // Criar tarefas simuladas para aluno1
    let tarefas = lerTarefas();
    if (tarefas.length === 0) {
      tarefas = [
        {
          id: "t1",
          username: "aluno1",
          title: "Entregar protótipo inicial",
          deadline: "2023-09-10",
          status: "Pendente",
        },
        {
          id: "t2",
          username: "aluno1",
          title: "Apresentação para o mentor",
          deadline: "2023-09-17",
          status: "Em andamento",
        },
      ];
      salvarTarefas(tarefas);
    }
  
    // Verificar se está logado (sessão)
    // Por enquanto não tem persistência real da sessão
  }
  
  window.onload = () => {
    inicializarApp();
    mostrarSecao("login");
  };