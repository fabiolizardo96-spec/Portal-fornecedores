"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type TipoAcesso = "colaborador" | "fornecedor" | "cadastro";
type ModoFormulario = "login" | "recuperar_senha" | "suporte";

const MISSAO_EMPRESA =
  "Conectar empresas, indústrias e parceiros estratégicos em cadeias de suprimento transparentes, eficientes e sustentáveis — transformando cada negociação em grandes conexões e grandes negócios.";

const CONFIG_POR_TIPO: Record<
  TipoAcesso,
  {
    boasVindas: string;
    tituloPagina: string;
    subtitulo: string;
    badge: string;
    imagem: string;
    imagemFallback: string;
    altImagem: string;
    corDestaque: string;
    botaoPrincipal: string;
    destaqueLateralTitulo: string;
    destaqueLateralTexto: string;
    pontosChave: string[];
  }
> = {
  colaborador: {
    boasVindas: "Bem-vindo de volta à mesa de decisões",
    tituloPagina: "Acesso do Colaborador",
    subtitulo:
      "Entre com suas credenciais corporativas para gerenciar requisições, cotações, POs e contratos.",
    badge: "EQUIPE INTERNA • COMPRAS & GOVERNANÇA",
    imagem: "/images/login-colaborador.jpg",
    imagemFallback: "/images/acesso-colaborador.jpg",
    altImagem: "Reunião e negociação estratégica entre profissionais na Atlas Supply",
    corDestaque: "bg-blue-600 hover:bg-blue-500",
    botaoPrincipal: "Entrar na Mesa de Compras",
    destaqueLateralTitulo: "Aqui construímos grandes conexões e grandes negócios.",
    destaqueLateralTexto:
      "Cada cotação, análise de TCO e aprovação de contrato fortalece relações comerciais sólidas e impulsiona resultados reais para a operação.",
    pontosChave: [
      "Esteira Procure-to-Pay (RFQ → REQ → PO) com controle de alçada",
      "Simulador fiscal (ICMS, IPI, PIS/COFINS, DIFAL) e cálculo de TCO",
      "Acesso segmentado para Compradores, Requisitantes e ADM / Owner",
    ],
  },
  fornecedor: {
    boasVindas: "Seja bem-vindo ao nosso ecossistema de parceiros",
    tituloPagina: "Portal do Fornecedor",
    subtitulo:
      "Acesse sua conta homologada para consultar pedidos aprovados (PO), anexar documentos e falar com Compras.",
    badge: "PARCEIRO HOMOLOGADO • B2B",
    imagem: "/images/login-fornecedor.jpg",
    imagemFallback: "/images/acesso-fornecedor.jpg",
    altImagem: "Parceiro comercial e abastecimento operacional na Atlas Supply",
    corDestaque: "bg-emerald-600 hover:bg-emerald-500",
    botaoPrincipal: "Acessar Portal do Parceiro",
    destaqueLateralTitulo: "Parcerias que geram grandes conexões e grandes negócios.",
    destaqueLateralTexto:
      "Acreditamos em relações duradouras baseadas em clareza comercial, previsibilidade de pedidos e crescimento conjunto ao longo de toda a cadeia.",
    pontosChave: [
      "Consulta rápida de POs aprovadas para vinculação na NF-e",
      "Repositório de contratos, anexos comerciais e dados bancários",
      "Canal direto para alinhamento de entregas, prazos e contestações",
    ],
  },
  cadastro: {
    boasVindas: "Bem-vindo ao início de uma nova parceria",
    tituloPagina: "Quero me Cadastrar",
    subtitulo:
      "Inicie o processo de pré-homologação para fornecer produtos, insumos ou serviços logísticos para a Atlas Supply.",
    badge: "ONBOARDING & HOMOLOGAÇÃO DE PARCEIROS",
    imagem: "/images/login-cadastro.jpg",
    imagemFallback: "/images/parceria-comercial.jpg",
    altImagem: "Estrutura corporativa e expansão de negócios da Atlas Supply",
    corDestaque: "bg-amber-600 hover:bg-amber-500",
    botaoPrincipal: "Enviar Solicitação de Homologação",
    destaqueLateralTitulo: "Grandes negócios começam com boas conexões.",
    destaqueLateralTexto:
      "Estamos sempre abertos a novos parceiros locais, nacionais e operadores de comércio exterior que unem excelência operacional, ética e visão de futuro.",
    pontosChave: [
      "Análise cadastral e fiscal estruturada pela equipe de Sourcing",
      "Oportunidades em operações locais, nacionais e Comex (Import/Export)",
      "Acompanhamento transparente das etapas de qualificação",
    ],
  },
};

function AcessoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo");

  const tipoAtivo: TipoAcesso =
    tipoParam === "fornecedor"
      ? "fornecedor"
      : tipoParam === "cadastro"
      ? "cadastro"
      : "colaborador";

  const config = CONFIG_POR_TIPO[tipoAtivo];

  const [imgSrc, setImgSrc] = useState<string>(config.imagem);
  useEffect(() => {
    setImgSrc(config.imagem);
    setModo("login");
    setMensagemFeedback(null);
  }, [config.imagem, tipoAtivo]);

  const [modo, setModo] = useState<ModoFormulario>("login");

  // Estados de Login
  const [perfilInterno, setPerfilInterno] = useState<"colaborador" | "adm">(
    "colaborador"
  );
  const [emailLogin, setEmailLogin] = useState<string>(
    tipoAtivo === "fornecedor"
      ? "mariana.costa@packsul.com.br"
      : "compras@atlassupply.com.br"
  );
  const [senhaLogin, setSenhaLogin] = useState<string>("••••••••••••");
  const [lembrarAcesso, setLembrarAcesso] = useState<boolean>(true);

  useEffect(() => {
    if (tipoAtivo === "fornecedor") {
      setEmailLogin("mariana.costa@packsul.com.br");
    } else if (tipoAtivo === "colaborador") {
      setEmailLogin(
        perfilInterno === "adm"
          ? "fabio.lizardo@atlassupply.com.br"
          : "compras@atlassupply.com.br"
      );
    }
  }, [tipoAtivo, perfilInterno]);

  // Estados de Novo Cadastro (Pré-Homologação)
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpjCadastro, setCnpjCadastro] = useState("");
  const [segmentoCadastro, setSegmentoCadastro] = useState(
    "Embalagens & Manufatura"
  );
  const [escopoCadastro, setEscopoCadastro] = useState("Nacional");
  const [cidadeUfCadastro, setCidadeUfCadastro] = useState("");
  const [contatoCadastro, setContatoCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [telefoneCadastro, setTelefoneCadastro] = useState("");

  // Estados de Redefinição de Senha & Suporte
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [nomeSuporte, setNomeSuporte] = useState("");
  const [emailSuporte, setEmailSuporte] = useState("");
  const [assuntoSuporte, setAssuntoSuporte] = useState(
    "Dúvida de acesso / Credenciais"
  );
  const [mensagemSuporte, setMensagemSuporte] = useState("");

  const [mensagemFeedback, setMensagemFeedback] = useState<{
    tipo: "sucesso" | "info";
    texto: string;
  } | null>(null);

  function alternarTipo(novoTipo: TipoAcesso) {
    router.push(`/acesso?tipo=${novoTipo}`);
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    const destinoPerfil =
      tipoAtivo === "fornecedor"
        ? "fornecedor"
        : perfilInterno === "adm"
        ? "adm"
        : "colaborador";

    const usuarioFinal =
      emailLogin.trim() ||
      (destinoPerfil === "fornecedor"
        ? "mariana.costa@packsul.com.br"
        : destinoPerfil === "adm"
        ? "fabio.lizardo@atlassupply.com.br"
        : "compras@atlassupply.com.br");

    router.push(
      `/operacoes?perfil=${destinoPerfil}&usuario=${encodeURIComponent(
        usuarioFinal
      )}`
    );
  }

  function handleCadastroSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!razaoSocial.trim() || !cnpjCadastro.trim() || !emailCadastro.trim()) {
      return;
    }
    const protocolo = `HOM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setMensagemFeedback({
      tipo: "sucesso",
      texto: `Solicitação ${protocolo} registrada para ${razaoSocial} (${cnpjCadastro}). A equipe de Homologação & Sourcing enviará os próximos passos para ${emailCadastro}.`,
    });
    setRazaoSocial("");
    setCnpjCadastro("");
    setCidadeUfCadastro("");
    setContatoCadastro("");
    setEmailCadastro("");
    setTelefoneCadastro("");
  }

  function handleRecuperarSenhaSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailRecuperacao.trim()) return;
    setMensagemFeedback({
      tipo: "sucesso",
      texto: `Instruções de redefinição de senha enviadas para ${emailRecuperacao}. Verifique sua caixa de entrada e spam.`,
    });
    setEmailRecuperacao("");
  }

  function handleSuporteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailSuporte.trim() || !mensagemSuporte.trim()) return;
    const chamado = `SUP-${Math.floor(10000 + Math.random() * 90000)}`;
    setMensagemFeedback({
      tipo: "sucesso",
      texto: `Chamado ${chamado} aberto com sucesso. Nossa equipe responderá para ${emailSuporte} em até 2 horas úteis.`,
    });
    setNomeSuporte("");
    setEmailSuporte("");
    setMensagemSuporte("");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row">
      {/* ==================== LADO ESQUERDO: BOAS-VINDAS, MISSÃO & IMAGEM ==================== */}
      <aside className="relative lg:w-1/2 xl:w-[54%] min-h-[340px] lg:min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden">
        <img
          src={imgSrc}
          alt={config.altImagem}
          onError={() => {
            if (imgSrc !== config.imagemFallback) {
              setImgSrc(config.imagemFallback);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/65" />

        {/* Topo do painel esquerdo: Logo + Nome da Empresa */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base shadow-md ring-2 ring-amber-300/30">
              AS
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Atlas Supply &amp; Comércio
              </p>
              <p className="text-[11px] text-amber-200/80 font-medium">
                Conexões Estratégicas • Negócios de Alto Impacto
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← Início
          </Link>
        </div>

        {/* Centro/Base do painel esquerdo: Boas-vindas, Mensagem de Conexões/Negócios & Missão */}
        <div className="relative z-10 max-w-xl space-y-5 mt-10 lg:mt-0">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wide">
              {config.boasVindas}
            </p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-200">
              {config.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
            {config.destaqueLateralTitulo}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {config.destaqueLateralTexto}
          </p>

          {/* Bloco de Missão da Empresa com o emblema AS */}
          <div className="rounded-2xl bg-white/8 backdrop-blur-xs border border-white/15 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black inline-flex items-center justify-center text-[10px]">
                AS
              </span>
              <span>Nossa Missão</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed italic">
              “{MISSAO_EMPRESA}”
            </p>
          </div>

          <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-slate-200">
            {config.pontosChave.map((ponto) => (
              <li key={ponto} className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>{ponto}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>© 2026 Atlas Supply &amp; Comércio S.A.</span>
          <span>Operações Nacionais &amp; Comércio Exterior</span>
        </div>
      </aside>

      {/* ==================== LADO DIREITO: FORMULÁRIOS DE ACESSO ==================== */}
      <main className="lg:w-1/2 xl:w-[46%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          {/* Seletor superior das 3 jornadas */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => alternarTipo("colaborador")}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tipoAtivo === "colaborador"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Colaborador
            </button>
            <button
              type="button"
              onClick={() => alternarTipo("fornecedor")}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tipoAtivo === "fornecedor"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fornecedor
            </button>
            <button
              type="button"
              onClick={() => alternarTipo("cadastro")}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tipoAtivo === "cadastro"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quero me Cadastrar
            </button>
          </div>

          {/* Título dinâmico do lado direito */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {modo === "recuperar_senha"
                ? "Redefinir Senha"
                : modo === "suporte"
                ? "Suporte & Contato"
                : config.tituloPagina}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {modo === "recuperar_senha"
                ? "Informe o e-mail cadastrado para receber um link seguro de redefinição de senha."
                : modo === "suporte"
                ? "Precisa de ajuda com acesso, homologação ou faturamento? Fale diretamente com nossa equipe."
                : config.subtitulo}
            </p>
          </div>

          {mensagemFeedback && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl p-3.5 text-xs leading-relaxed">
              {mensagemFeedback.texto}
            </div>
          )}

          {/* ==================== MODO 1: LOGIN (COLABORADOR OU FORNECEDOR) ==================== */}
          {modo === "login" && tipoAtivo !== "cadastro" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {tipoAtivo === "colaborador" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nível de Acesso Interno
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPerfilInterno("colaborador")}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold text-left transition-colors cursor-pointer ${
                        perfilInterno === "colaborador"
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Comprador / Sourcing
                    </button>
                    <button
                      type="button"
                      onClick={() => setPerfilInterno("adm")}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold text-left transition-colors cursor-pointer ${
                        perfilInterno === "adm"
                          ? "border-amber-600 bg-amber-50 text-amber-950"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      ADM &amp; Owner
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {tipoAtivo === "colaborador"
                    ? "E-mail Corporativo ou Matrícula"
                    : "E-mail do Parceiro ou CNPJ"}
                </label>
                <input
                  type="text"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  placeholder={
                    tipoAtivo === "colaborador"
                      ? "nome@atlassupply.com.br"
                      : "contato@empresa.com.br"
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMensagemFeedback(null);
                      setModo("recuperar_senha");
                    }}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-600 cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={senhaLogin}
                  onChange={(e) => setSenhaLogin(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lembrarAcesso}
                    onChange={(e) => setLembrarAcesso(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Manter sessão ativa neste dispositivo</span>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl text-white text-sm font-bold transition-colors cursor-pointer shadow-xs ${config.corDestaque}`}
              >
                {config.botaoPrincipal} →
              </button>

              {tipoAtivo === "fornecedor" && (
                <p className="text-xs text-center text-slate-500 pt-1">
                  Ainda não é fornecedor homologado?{" "}
                  <button
                    type="button"
                    onClick={() => alternarTipo("cadastro")}
                    className="font-bold text-slate-900 underline cursor-pointer"
                  >
                    Solicitar cadastro agora
                  </button>
                </p>
              )}
            </form>
          )}

          {/* ==================== MODO 2: QUERO ME CADASTRAR (PRÉ-HOMOLOGAÇÃO) ==================== */}
          {modo === "login" && tipoAtivo === "cadastro" && (
            <form onSubmit={handleCadastroSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razão Social da Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Ex.: NovaLog Transportes e Armazenagem Ltda"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={cnpjCadastro}
                    onChange={(e) => setCnpjCadastro(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cidade / UF *
                  </label>
                  <input
                    type="text"
                    required
                    value={cidadeUfCadastro}
                    onChange={(e) => setCidadeUfCadastro(e.target.value)}
                    placeholder="Ex.: Campinas / SP"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Segmento Principal
                  </label>
                  <select
                    value={segmentoCadastro}
                    onChange={(e) => setSegmentoCadastro(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
                  >
                    <option>Embalagens &amp; Manufatura</option>
                    <option>Insumos Industriais</option>
                    <option>Comex &amp; Logística</option>
                    <option>TI &amp; Software</option>
                    <option>Facilities &amp; Manutenção</option>
                    <option>Agro &amp; Alimentos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Escopo de Atendimento
                  </label>
                  <select
                    value={escopoCadastro}
                    onChange={(e) => setEscopoCadastro(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
                  >
                    <option>Local / Regional</option>
                    <option>Nacional</option>
                    <option>Importação</option>
                    <option>Exportação</option>
                    <option>Importação &amp; Exportação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Responsável Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={contatoCadastro}
                    onChange={(e) => setContatoCadastro(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={telefoneCadastro}
                    onChange={(e) => setTelefoneCadastro(e.target.value)}
                    placeholder="(11) 99999-0000"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail Corporativo para Contato *
                </label>
                <input
                  type="email"
                  required
                  value={emailCadastro}
                  onChange={(e) => setEmailCadastro(e.target.value)}
                  placeholder="comercial@suaempresa.com.br"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl text-white text-sm font-bold transition-colors cursor-pointer ${config.corDestaque}`}
              >
                {config.botaoPrincipal}
              </button>
            </form>
          )}

          {/* ==================== MODO 3: REDEFINIÇÃO DE SENHA ==================== */}
          {modo === "recuperar_senha" && (
            <form onSubmit={handleRecuperarSenhaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail cadastrado
                </label>
                <input
                  type="email"
                  required
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  placeholder="seuemail@empresa.com.br"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
              >
                Enviar link de redefinição
              </button>

              <button
                type="button"
                onClick={() => {
                  setMensagemFeedback(null);
                  setModo("login");
                }}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Voltar para o login
              </button>
            </form>
          )}

          {/* ==================== MODO 4: SUPORTE & CONTATO ==================== */}
          {modo === "suporte" && (
            <form onSubmit={handleSuporteSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeSuporte}
                    onChange={(e) => setNomeSuporte(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail para Retorno
                  </label>
                  <input
                    type="email"
                    required
                    value={emailSuporte}
                    onChange={(e) => setEmailSuporte(e.target.value)}
                    placeholder="email@empresa.com.br"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assunto
                </label>
                <select
                  value={assuntoSuporte}
                  onChange={(e) => setAssuntoSuporte(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
                >
                  <option>Dúvida de acesso / Credenciais</option>
                  <option>Homologação de Novo Fornecedor</option>
                  <option>Suporte Fiscal / Emissão de NF-e e PO</option>
                  <option>Contato Comercial com Suprimentos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  rows={3}
                  required
                  value={mensagemSuporte}
                  onChange={(e) => setMensagemSuporte(e.target.value)}
                  placeholder="Descreva como nossa equipe pode ajudar..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
              >
                Enviar solicitação de suporte
              </button>

              <button
                type="button"
                onClick={() => {
                  setMensagemFeedback(null);
                  setModo("login");
                }}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Voltar para o acesso
              </button>
            </form>
          )}

          {/* Rodapé de utilidades do formulário */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => {
                setMensagemFeedback(null);
                setModo(modo === "suporte" ? "login" : "suporte");
              }}
              className="font-semibold text-slate-700 hover:text-slate-950 underline cursor-pointer"
            >
              {modo === "suporte"
                ? "Voltar ao login"
                : "Suporte & Entrar em Contato"}
            </button>

            <span>Atendimento: (11) 4000-8920</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AcessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-600">
          Carregando portal de acesso Atlas Supply &amp; Comércio...
        </div>
      }
    >
      <AcessoConteudo />
    </Suspense>
  );
}