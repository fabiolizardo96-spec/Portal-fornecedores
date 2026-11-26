import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Barra Superior Institucional */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              AS
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">
                Atlas Supply &amp; Comércio
              </span>
              <span className="text-[11px] text-slate-400">
                SRM, Strategic Sourcing &amp; Procure-to-Pay
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <Link
              href="/acesso?tipo=colaborador"
              className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Colaborador
            </Link>
            <Link
              href="/acesso?tipo=fornecedor"
              className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Fornecedor
            </Link>
            <Link
              href="/acesso?tipo=cadastro"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg font-bold transition-colors"
            >
              Quero me Cadastrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section + 3 Portais de Entrada */}
      <main className="relative flex-1 flex items-center py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
        <img
          src="/images/parceria-comercial.jpg"
          alt="Operações corporativas Atlas Supply"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 brightness-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/75 to-slate-950/95 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12">
          {/* Texto Principal */}
          <div className="max-w-3xl space-y-4">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300">
              PLATAFORMA CORPORATIVA DE SUPRIMENTOS • 20 PRAÇAS HOMOLOGADAS
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Gestão integrada de fornecedores, cotações e compras estratégicas.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Conectamos áreas requisitantes, mesa de compras e parceiros
              homologados em um fluxo único: cotação com inteligência tributária
              (TCO), aprovação por alçada, emissão de Purchase Order (PO) e
              governança contratual.
            </p>
          </div>

          {/* 3 Cartões de Acesso Direto */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cartão 1: Sou Colaborador */}
            <Link
              href="/acesso?tipo=colaborador"
              className="group rounded-2xl bg-slate-900/90 border border-white/10 hover:border-blue-500/60 p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <div className="space-y-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300">
                  Acesso Interno
                </span>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  Sou Colaborador
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Acesse a mesa de compras, simule carga tributária e TCO, abra
                  requisições (REQ), aprove pedidos (PO) e acompanhe o Spend
                  Analysis.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span>Acessar login corporativo</span>
                <span>→</span>
              </div>
            </Link>

            {/* Cartão 2: Sou Fornecedor */}
            <Link
              href="/acesso?tipo=fornecedor"
              className="group rounded-2xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/60 p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <div className="space-y-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300">
                  Parceiro Homologado
                </span>
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Sou Fornecedor
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Consulte Purchase Orders (PO) aprovadas para emissão de NF-e,
                  baixe anexos comerciais e fale diretamente com o comprador
                  responsável.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Entrar no portal do parceiro</span>
                <span>→</span>
              </div>
            </Link>

            {/* Cartão 3: Quero me Cadastrar */}
            <Link
              href="/acesso?tipo=cadastro"
              className="group rounded-2xl bg-slate-900/90 border border-white/10 hover:border-amber-500/60 p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <div className="space-y-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300">
                  Novos Parceiros
                </span>
                <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Quero me Cadastrar
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Submeta os dados cadastrais e fiscais da sua empresa para
                  iniciar o processo de homologação em operações locais,
                  nacionais ou Comex.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>Iniciar pré-homologação</span>
                <span>→</span>
              </div>
            </Link>
          </section>

          {/* Indicadores Institucionais */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <p className="text-xl font-bold text-white">20 Praças</p>
              <p className="text-slate-400">Cobertura nas 5 regiões do Brasil</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Local &amp; Comex</p>
              <p className="text-slate-400">
                Operações regionais, importação e exportação
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">TCO &amp; Créditos</p>
              <p className="text-slate-400">
                Simulação tributária Lucro Real / Presumido
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Esteira P2P</p>
              <p className="text-slate-400">
                Rastreabilidade completa de RFQ, REQ e PO
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-white/10 py-5 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            © 2026 Atlas Supply &amp; Comércio • Portal de Gestão de
            Fornecedores
          </span>
          <Link
            href="/acesso?tipo=colaborador"
            className="text-slate-300 hover:text-white"
          >
            Central de Suporte &amp; Acesso
          </Link>
        </div>
      </footer>
    </div>
  );
}