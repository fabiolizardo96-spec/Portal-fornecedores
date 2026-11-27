"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AtlasParaEmpresasPage() {
  const [nomeExecutivo, setNomeExecutivo] = useState("");
  const [cargoExecutivo, setCargoExecutivo] = useState("");
  const [empresaNome, setEmpresaNome] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");
  const [telefoneContato, setTelefoneContato] = useState("");
  const [escopoInteresse, setEscopoInteresse] = useState(
    "Implantação Completa (P2P + TCO + Contratos)"
  );
  const [contextoOperacao, setContextoOperacao] = useState("");
  const [protocoloEnviado, setProtocoloEnviado] = useState<string | null>(null);

  function handleAgendamentoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeExecutivo.trim() || !empresaNome.trim() || !emailCorporativo.trim()) {
      return;
    }
    const codigo = `EXEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setProtocoloEnviado(
      `Solicitação ${codigo} encaminhada diretamente para a Diretoria Executiva (CEO) e Arquitetura de Suprimentos da Atlas Supply & Comércio. Retornaremos para ${emailCorporativo} para agendar a sessão de alinhamento técnico.`
    );
    setNomeExecutivo("");
    setCargoExecutivo("");
    setEmpresaNome("");
    setEmailCorporativo("");
    setTelefoneContato("");
    setContextoOperacao("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Barra Superior */}
      <header className="border-b border-white/10 bg-slate-950/95 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              AS
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white group-hover:text-amber-300 transition-colors block leading-none">
                Atlas Supply &amp; Comércio
              </span>
              <span className="text-[11px] text-indigo-300 font-medium">
                Divisão Enterprise • Arquitetura de Suprimentos B2B
              </span>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <Link
              href="/"
              className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              ← Voltar ao Início
            </Link>
            <a
              href="#contato-executivo"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              Falar com a Liderança Atlas
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Executivo */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 border-b border-white/10 overflow-hidden">
        <img
          src="/images/login-cadastro.jpg"
          alt="Arquitetura Corporativa Atlas para Empresas"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 brightness-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/85 to-slate-950 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/35 text-indigo-200">
            <span>ATLAS ENTERPRISE • SOLUÇÃO MULTI-TENANT DE PROCUREMENT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight max-w-4xl">
            O motor de Strategic Sourcing e Procure-to-Pay da Atlas operando
            com a sua própria carteira de fornecedores.
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 leading-relaxed max-w-3xl">
            Estruture a governança de compras da sua empresa sem romper com os
            parceiros homologados que já sustentam a sua operação. Implantamos
            um ambiente dedicado onde sua equipe conduz cotações (RFQ),
            equalização tributária (TCO), aprovações por alçada e gestão
            contratual de 12 meses.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#contato-executivo"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors shadow-lg"
            >
              Agendar Reunião com o CEO &amp; Especialistas →
            </a>
            <a
              href="#arquitetura-modulos"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 text-sm font-semibold transition-colors"
            >
              Conhecer a Arquitetura Técnica
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1">
        {/* Bloco 1: Tese Operacional (Base Própria + Benchmark) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              MODELO DE OPERAÇÃO HÍBRIDA
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Preservação do legado comercial com ganho imediato de compliance.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Em projetos tradicionais de transformação em Suprimentos, o maior
              gargalo está na resistência operacional em migrar fornecedores
              críticos. Na arquitetura <strong>Atlas para Empresas</strong>, a
              implantação parte da sua base vigente.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                1. Carteira Própria Isolada
              </p>
              <h3 className="text-base font-bold text-white">
                Seus fornecedores, suas regras
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Migramos seu cadastro mestre de fornecedores (Vendor Master),
                tabelas de preços, SLAs acordados e histórico de pedidos para um
                ambiente segregado, mantendo o relacionamento direto da sua
                empresa.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-white/10 p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                2. Benchmark Inteligente (Opcional)
              </p>
              <h3 className="text-base font-bold text-white">
                Acesso sob demanda à Rede Atlas
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sempre que precisar testar aderência de mercado ou suprir uma
                ruptura de abastecimento, sua mesa de compras pode convidar
                fornecedores homologados da Rede Atlas como benchmark na RFQ.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco 2: Detalhamento Técnico dos 4 Pilares */}
        <section id="arquitetura-modulos" className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              ESCOPO FUNCIONAL &amp; TÉCNICO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              O que entregamos para a sua operação de Suprimentos
            </h2>
            <p className="text-sm text-slate-300">
              Cada módulo foi desenhado para eliminar controles paralelos em
              planilhas e dar visibilidade auditável da requisição ao
              faturamento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pilar 1 */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300">
                  MÓDULO 01 • ESTEIRA PROCURE-TO-PAY (P2P)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Rastreabilidade ponta a ponta: RFQ → REQ → PO → NF-e
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fluxo estruturado com trilha de auditoria completa, impedindo
                compras sem cobertura orçamentária ou pedidos emitidos fora da
                política de alçadas.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                <li>
                  • <strong>Equalização de Propostas (RFQ):</strong> mapa
                  comparativo técnico e comercial entre múltiplos fornecedores.
                </li>
                <li>
                  • <strong>Workflow de Alçadas:</strong> aprovação escalonada
                  por centro de custo, categoria e faixa de valor.
                </li>
                <li>
                  • <strong>Portal do Fornecedor Dedicado:</strong> consulta de
                  Purchase Orders (PO) aprovadas para vinculação obrigatória na
                  NF-e.
                </li>
              </ul>
            </div>

            {/* Pilar 2 */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300">
                  MÓDULO 02 • ENGENHARIA FISCAL &amp; TCO
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Decisão pelo Custo Total de Aquisição (Total Cost of Ownership)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O menor preço unitário nem sempre representa o menor desembolso
                líquido. Nosso motor calcula o impacto tributário real de cada
                fornecedor antes do fechamento.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                <li>
                  • <strong>Créditos Recuperáveis:</strong> apuração automática
                  de créditos de ICMS, IPI e PIS/COFINS conforme o regime
                  tributário (Lucro Real, Presumido ou Simples Nacional).
                </li>
                <li>
                  • <strong>Operações Interestaduais &amp; Comex:</strong>{" "}
                  simulação de DIFAL, frete CIF/FOB e encargos logísticos.
                </li>
                <li>
                  • <strong>Saving Real Auditável:</strong> registro da
                  economia efetiva entre o orçamento base e o TCO vencedor.
                </li>
              </ul>
            </div>

            {/* Pilar 3 */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300">
                  MÓDULO 03 • SPEND ANALYSIS &amp; STRATEGIC SOURCING
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Inteligência de gastos, matriz de categorias e alavancas
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consolidação analítica do volume transacionado por categoria,
                região geográfica, escopo logístico e curva ABC de fornecedores.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                <li>
                  • <strong>Mapeamento de Concentração:</strong> identificação
                  de dependência de fornecedor único (single-source) e
                  dispersão de compras spot.
                </li>
                <li>
                  • <strong>Alavancas de Negociação:</strong> consolidação de
                  volume, acordos guarda-chuva (LTA) e revisão de escopo técnico.
                </li>
                <li>
                  • <strong>KPIs Executivos:</strong> acompanhamento de Spend
                  sob gestão, Lead Time médio de atendimento e OTIF.
                </li>
              </ul>
            </div>

            {/* Pilar 4 */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300">
                  MÓDULO 04 • CLM &amp; FORECAST CONTRATUAL (12 MESES)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Previsibilidade de caixa e governança de renovações
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Elimine renovações automáticas indesejadas e reajustes sem
                negociação com visão antecipada de 12 meses sobre toda a
                carteira contratual.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                <li>
                  • <strong>Projeção Mensal (12M):</strong> curva de desembolso
                  comprometido versus cenário projetado pós-renegociação.
                </li>
                <li>
                  • <strong>Alertas de Janela Crítica:</strong> sinalização de
                  contratos vencendo em 30, 60 e 90 dias.
                </li>
                <li>
                  • <strong>Matriz RACI de Governança:</strong> vinculação
                  clara entre Gestor do Contrato, Área Requisitante e
                  Stakeholder Executivo.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bloco 3: Metodologia de Implantação */}
        <section className="rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              GOVERNANÇA DE ONBOARDING
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Como estruturamos a implantação na sua empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5">
              <p className="font-black text-indigo-300">ETAPA 01</p>
              <p className="font-bold text-white text-sm">
                Diagnóstico Executivo
              </p>
              <p className="text-slate-300 leading-relaxed">
                Reunião direta com a liderança da Atlas para mapear categorias,
                política de alçadas, regime tributário e ERP atual.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5">
              <p className="font-black text-indigo-300">ETAPA 02</p>
              <p className="font-bold text-white text-sm">
                Saneamento &amp; Carga Base
              </p>
              <p className="text-slate-300 leading-relaxed">
                Importação estruturada dos seus fornecedores homologados,
                centros de custo e contratos vigentes com datas de vigência.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5">
              <p className="font-black text-indigo-300">ETAPA 03</p>
              <p className="font-bold text-white text-sm">
                Parametrização Fiscal &amp; P2P
              </p>
              <p className="text-slate-300 leading-relaxed">
                Configuração das regras de crédito tributário (TCO), perfis de
                compradores, aprovadores e comunicação com fornecedores.
              </p>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5">
              <p className="font-black text-emerald-300">ETAPA 04</p>
              <p className="font-bold text-white text-sm">
                Go-Live &amp; Acompanhamento
              </p>
              <p className="text-slate-300 leading-relaxed">
                Início das cotações em ambiente produtivo com acompanhamento
                analítico de saving e forecast mensal de contratos.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco 4: Contato Direto com CEO & Arquitetura de Suprimentos */}
        <section
          id="contato-executivo"
          className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-400/30 p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ATENDIMENTO CONSULTIVO DIRETO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Converse diretamente com o nosso CEO e especialistas de
                Suprimentos.
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Cada operação corporativa possui particularidades fiscais,
                logísticas e de governança. Não utilizamos pacotes engessados:
                estruturamos o desenho ideal junto com a sua diretoria.
              </p>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 text-xs">
                <p className="font-bold text-amber-300">
                  Canal Direto • Diretoria Executiva &amp; Enterprise
                </p>
                <p className="text-slate-200">
                  <strong>E-mail:</strong> fabio.lizardo@atlassupply.com.br
                </p>
                <p className="text-slate-200">
                  <strong>Mesa Corporativa:</strong> (11) 4000-8920
                </p>
                <p className="text-slate-400">
                  Atendimento para indústrias, operadores logísticos, varejo e
                  empresas com operações nacionais ou Comex.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">
                Solicitar Reunião de Alinhamento Executivo
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Preencha os dados abaixo para agendarmos uma conversa técnica
                sobre a implantação do Atlas na sua empresa.
              </p>

              {protocoloEnviado && (
                <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl p-3.5 text-xs leading-relaxed">
                  {protocoloEnviado}
                </div>
              )}

              <form onSubmit={handleAgendamentoSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={nomeExecutivo}
                      onChange={(e) => setNomeExecutivo(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cargo / Área *
                    </label>
                    <input
                      type="text"
                      required
                      value={cargoExecutivo}
                      onChange={(e) => setCargoExecutivo(e.target.value)}
                      placeholder="Ex.: Diretor de Suprimentos / CFO"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={empresaNome}
                      onChange={(e) => setEmpresaNome(e.target.value)}
                      placeholder="Razão Social ou Nome Fantasia"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={telefoneContato}
                      onChange={(e) => setTelefoneContato(e.target.value)}
                      placeholder="(11) 99999-0000"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      value={emailCorporativo}
                      onChange={(e) => setEmailCorporativo(e.target.value)}
                      placeholder="nome@empresa.com.br"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Foco Principal da Conversa
                    </label>
                    <select
                      value={escopoInteresse}
                      onChange={(e) => setEscopoInteresse(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
                    >
                      <option>
                        Implantação Completa (P2P + TCO + Contratos)
                      </option>
                      <option>
                        Estruturação de Cotações (RFQ) &amp; Alçadas
                      </option>
                      <option>
                        Spend Analysis &amp; Governança de Contratos (12M)
                      </option>
                      <option>
                        Operações Comex &amp; Inteligência Tributária
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Breve Contexto da Operação (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={contextoOperacao}
                    onChange={(e) => setContextoOperacao(e.target.value)}
                    placeholder="Conte-nos brevemente sobre o volume aproximado de fornecedores, ERP atual ou principais desafios de compras..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Solicitar Contato com a Liderança Atlas →
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            © 2026 Atlas Supply &amp; Comércio • Divisão Enterprise B2B
          </span>
          <Link href="/" className="text-slate-300 hover:text-white">
            ← Voltar para a Página Inicial
          </Link>
        </div>
      </footer>
    </div>
  );
}