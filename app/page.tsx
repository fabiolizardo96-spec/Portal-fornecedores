"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PerfilAcesso = "fornecedor" | "colaborador" | "cadastro" | null;

export default function HomePage() {
  const router = useRouter();
  const [perfilAtivo, setPerfilAtivo] = useState<PerfilAcesso>(null);

  // Estado do login simulado
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");
  const [mensagemLogin, setMensagemLogin] = useState<string | null>(null);

  // Estado do pré-cadastro simulado
  const [empresa, setEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [porte, setPorte] = useState("Micro / Pequeno Produtor");
  const [categoria, setCategoria] = useState("Mercadorias, Alimentos e Consumo");
  const [mensagemCadastro, setMensagemCadastro] = useState<string | null>(null);

  function abrirPerfil(perfil: PerfilAcesso) {
    setPerfilAtivo(perfil);
    setMensagemLogin(null);
    setMensagemCadastro(null);

    if (perfil === "fornecedor") {
      setEmailLogin("parceiro@fornecedor-exemplo.com.br");
      setSenhaLogin("••••••••••••");
    } else if (perfil === "colaborador") {
      setEmailLogin("compras@atlassupply-exemplo.com.br");
      setSenhaLogin("••••••••••••");
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailLogin.trim() || !senhaLogin.trim()) {
      setMensagemLogin("Preencha o e-mail e a senha de demonstração para continuar.");
      return;
    }
    const tipo = perfilAtivo === "colaborador" ? "colaborador" : "fornecedor";
    router.push(`/operacoes?perfil=${tipo}&usuario=${encodeURIComponent(emailLogin)}`);
  }

  function handleCadastroSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!empresa.trim() || !responsavel.trim() || !emailCadastro.trim()) {
      setMensagemCadastro("Preencha empresa, responsável e e-mail para simular o envio.");
      return;
    }
    setMensagemCadastro(
      `Solicitação de cadastro registrada (demonstração) para ${empresa} — ${porte} (${categoria}). A equipe comercial da Atlas Supply & Comércio retornaria em ${emailCadastro}.`
    );
    setEmpresa("");
    setResponsavel("");
    setEmailCadastro("");
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Faixa superior de contexto */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            Atlas Supply &amp; Comércio • Portal de Compras, Indústria e Comex (Ambiente de demonstração)
          </span>
          <Link
            href="/operacoes"
            className="underline underline-offset-4 hover:text-amber-300 transition-colors"
          >
            Ir direto para Operações →
          </Link>
        </div>
      </div>

      {/* Cabeçalho */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm tracking-wide">
              AS
            </div>
            <div>
              <p className="font-bold text-stone-900 leading-tight">
                Atlas Supply &amp; Comércio
              </p>
              <p className="text-xs text-stone-500">
                Do micro fornecedor à escala industrial • Mercado nacional e Comex
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-stone-600">
            <a href="#perfis" className="hover:text-stone-900 transition-colors">
              Acesso
            </a>
            <a href="#quem-somos" className="hover:text-stone-900 transition-colors">
              Quem somos
            </a>
            <a href="#rotina" className="hover:text-stone-900 transition-colors">
              Operação real
            </a>
            <a href="#suporte" className="hover:text-stone-900 transition-colors">
              Suporte
            </a>
          </nav>
        </div>
      </header>

      {/* Hero corporativo e humanizado */}
      <section className="relative bg-stone-900 text-white">
        <img
          src="/images/parceria-comercial.jpg"
          alt="Parceria comercial e análise de documentos na mesa"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/30" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl space-y-5">
            <span className="inline-block text-xs font-medium uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              Do micro produtor à indústria • Importação &amp; Exportação
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Parceria próxima com quem produz, vende e abastece em qualquer escala.
            </h1>
            <p className="text-stone-200 text-base sm:text-lg leading-relaxed">
              Na Atlas Supply &amp; Comércio, conectamos fornecedores locais, plantas industriais
              e operações internacionais em um fluxo direto, transparente e humano.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#perfis"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                Escolher meu acesso
              </a>
              <Link
                href="/operacoes"
                className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-3 rounded-lg border border-white/25 transition-colors"
              >
                Abrir painel de operações
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1">
        {/* Bloco 1: Três cartões principais */}
        <section id="perfis" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-stone-900">Como você acessa hoje?</h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Selecione o seu perfil abaixo para abrir o acesso ou iniciar seu cadastro na Atlas Supply &amp; Comércio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Fornecedor */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                  Parceiro comercial
                </span>
                <h3 className="text-xl font-bold text-stone-900">Eu sou um fornecedor</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Consulte demandas de compra, alinhe lotes de produção, prazos de entrega e
                  acompanhe negociações nacionais ou de comércio exterior.
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirPerfil("fornecedor")}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Entrar como fornecedor
              </button>
            </div>

            {/* Card 2: Colaborador */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
                  Equipe interna
                </span>
                <h3 className="text-xl font-bold text-stone-900">Sou colaborador</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Acesse a mesa de compras da Atlas Supply, conduza etapas com fornecedores e
                  organize os registros da operação.
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirPerfil("colaborador")}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Entrar como colaborador
              </button>
            </div>

            {/* Card 3: Quero me cadastrar */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  Novos parceiros
                </span>
                <h3 className="text-xl font-bold text-stone-900">Quero me cadastrar</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Do pequeno produtor à grande indústria: apresente sua operação, capacidade
                  produtiva ou linha de importação/exportação.
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirPerfil("cadastro")}
                className="w-full py-2.5 px-4 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-900 text-sm font-semibold transition-colors cursor-pointer"
              >
                Solicitar cadastro
              </button>
            </div>
          </div>

          {/* Área interativa de Login ou Pré-Cadastro */}
          {perfilAtivo && (
            <div className="bg-white rounded-2xl border border-stone-300 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Atlas Supply &amp; Comércio • Simulação de ambiente
                  </p>
                  <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                    {perfilAtivo === "fornecedor" && "Acesso — Fornecedor Parceiro"}
                    {perfilAtivo === "colaborador" && "Acesso — Colaborador Atlas Supply"}
                    {perfilAtivo === "cadastro" && "Pré-cadastro de Fornecedor / Indústria"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPerfilAtivo(null)}
                  className="text-sm text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              {perfilAtivo === "cadastro" ? (
                <form onSubmit={handleCadastroSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Razão social / Nome da empresa
                    </label>
                    <input
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Ex.: Indústria AgroSul S.A."
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Contato principal
                    </label>
                    <input
                      type="text"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      placeholder="Ex.: Carla Mendes — Comercial / Comex"
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      E-mail corporativo
                    </label>
                    <input
                      type="email"
                      value={emailCadastro}
                      onChange={(e) => setEmailCadastro(e.target.value)}
                      placeholder="comercial@empresa.com.br"
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Escala de operação
                    </label>
                    <select
                      value={porte}
                      onChange={(e) => setPorte(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option>Micro / Pequeno Produtor</option>
                      <option>Médio Porte / Distribuidor Regional</option>
                      <option>Escala Industrial / Grande Porte</option>
                      <option>Operador Internacional (Importação / Exportação)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Segmento principal
                    </label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option>Mercadorias, Alimentos e Consumo</option>
                      <option>Insumos Industriais e Matéria-Prima</option>
                      <option>Embalagens, Manufatura e Equipamentos</option>
                      <option>Logística, Carga e Comércio Exterior (Comex)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Enviar solicitação (simulada)
                    </button>
                    <Link
                      href="/operacoes?perfil=fornecedor"
                      className="text-sm font-medium text-amber-800 hover:underline px-2 py-2"
                    >
                      Simular acesso ao painel como fornecedor →
                    </Link>
                  </div>
                  {mensagemCadastro && (
                    <p className="sm:col-span-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
                      {mensagemCadastro}
                    </p>
                  )}
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                      placeholder="seu.email@exemplo.com.br"
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={senhaLogin}
                      onChange={(e) => setSenhaLogin(e.target.value)}
                      placeholder="Digite sua senha"
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Entrar e abrir operação →
                    </button>
                  </div>
                  {mensagemLogin && (
                    <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
                      {mensagemLogin}
                    </p>
                  )}
                </form>
              )}
            </div>
          )}
        </section>

        {/* Bloco 2: Quem somos nós, Como iniciamos no mercado e Fundadores */}
        <section id="quem-somos" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Institucional
              </span>
              <h2 className="text-2xl font-bold text-stone-900">Quem somos nós?</h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                A <strong>Atlas Supply &amp; Comércio</strong> nasceu para aproximar a gestão
                corporativa de suprimentos da realidade de quem produz, transforma e entrega.
                Atuamos de ponta a ponta: apoiamos desde o micro e pequeno fornecedor regional até
                operações industriais de grande porte e fluxos de importação e exportação.
              </p>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Acreditamos que compras e cadeia de suprimentos não são apenas números em tela —
                são acordos claros, previsibilidade de entrega, respeito à margem de quem produz e
                comunicação direta sem ruído.
              </p>
            </div>

            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nossa trajetória
              </span>
              <h2 className="text-2xl font-bold text-stone-900">Como iniciamos no mercado</h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Nossa origem vem do chão da operação comercial — acompanhando de perto balcões de
                abastecimento, negociações diretas com produtores e o desafio diário de manter
                estoque, preço justo e qualidade na ponta.
              </p>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Ao perceber que pequenos produtores tinham dificuldade para acessar grandes redes e
                que indústrias precisavam de mais agilidade na homologação e no Comex, estruturamos
                a Atlas Supply para unir processo, tecnologia e relacionamento humano em um só portal.
              </p>
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-3 py-1 rounded-full">
                Fundadores &amp; Liderança
              </span>
              <h3 className="text-2xl font-bold">
                Visão construída por quem vive a operação
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                A Atlas Supply &amp; Comércio é idealizada e conduzida com foco em unir
                eficiência operacional, transparência comercial e crescimento sustentável para
                fornecedores de todos os portes.
              </p>
            </div>

            <div className="lg:col-span-5 bg-stone-800/90 border border-stone-700 rounded-xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 font-bold text-lg flex items-center justify-center shrink-0">
                FL
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight">
                  Fabio Lizardo
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mt-0.5">
                  Project Owner &amp; Fundador
                </p>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  Liderança de produto, estratégia comercial, relacionamento com fornecedores e
                  expansão industrial &amp; Comex.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bloco 3: A operação real além da planilha */}
        <section
          id="rotina"
          className="bg-white rounded-2xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-6">
            <img
              src="/images/operacao-mercado.jpg"
              alt="Corredor de abastecimento com produtos, etiquetas de preço e circulação de pessoas"
              className="w-full h-72 lg:h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Operação do micro ao macro
            </span>
            <h3 className="text-2xl font-bold text-stone-900">
              Por trás de cada pedido existe produção, logística e gente trabalhando
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Seja no abastecimento direto do balcão, na linha industrial ou no embarque de
              carga internacional, a compra acontece na conferência de lote, no prazo cumprido
              e na parceria próxima entre quem fabrica e quem distribui.
            </p>
            <div className="pt-1">
              <Link
                href="/operacoes"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-amber-700 transition-colors"
              >
                Ver fluxo da página de operações →
              </Link>
            </div>
          </div>
        </section>

        {/* Bloco 4: Suporte fictício para dar contexto */}
        <section id="suporte" className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900">
              Canais de Atendimento Atlas Supply (dados fictícios de exemplo)
            </h3>
            <p className="text-sm text-stone-600">
              Informações ilustrativas para compor o contexto institucional do portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Homologação &amp; Fornecedores
              </p>
              <p className="font-semibold text-stone-900">
                fornecedores@atlassupply-exemplo.com.br
              </p>
              <p className="text-xs text-stone-500">
                Cadastro de micro produtores, distribuidores e indústrias (fictício).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Mesa de Operações &amp; Comex
              </p>
              <p className="font-semibold text-stone-900">(11) 4000-8920 • Ramal 204</p>
              <p className="text-xs text-stone-500">
                Seg. a sex., das 8h às 18h — agendas, lotes e importação/exportação (fictício).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Suporte Interno de Compras
              </p>
              <p className="font-semibold text-stone-900">
                suporte-compras@atlassupply-exemplo.com.br
              </p>
              <p className="text-xs text-stone-500">
                Apoio a compradores e colaboradores da Atlas Supply &amp; Comércio (fictício).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 sm:px-6 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            Atlas Supply &amp; Comércio • Project Owner: Fabio Lizardo
          </span>
          <span>Login, cadastro e contatos exibidos são simulados/fictícios</span>
        </div>
      </footer>
    </div>
  );
}