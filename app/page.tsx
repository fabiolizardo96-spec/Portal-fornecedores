"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface ItemPublicado {
  nome: string;
  tipo: "Produto" | "Serviço";
  valorUnitario: number;
  valorPublicado: string;
  unidade: string;
  prazoMedio: string;
  pedidoMinimo: string;
}

interface ReclameAquiInfo {
  nota: string;
  status: string;
  indiceSolucao: string;
  url: string;
}

interface Fornecedor {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  categoria: string;
  cnae: string;
  cidade: string;
  estado: string;
  abrangencia: "Local" | "Regional" | "Nacional";
  porte: "MEI" | "EPP" | "Médio" | "Grande";
  anosMercado: number;
  capitalSocial: string;
  pedidoMinimoGeral: string;
  prazoPagamentoPadrao: string;
  scoreRisco: number;
  grupoEconomicoId?: string;
  socios: string[];
  resumoIA: string;
  contatoComercial: string;
  telefone: string;
  site: string;
  linkedin: string;
  reclameAqui: ReclameAquiInfo;
  itensPublicados: ItemPublicado[];
}

const CATEGORIAS_PRINCIPAIS = [
  "Embalagens",
  "Logística & Transporte",
  "Matéria-Prima & Usinagem",
  "TI & Cloud",
  "Manutenção Predial & Facilities",
  "EPIs & Segurança do Trabalho",
  "Serviços Contábeis & Jurídicos",
  "Marketing & Gráfica",
];

const FORNECEDORES_MOCK: Fornecedor[] = [
  {
    id: "1",
    nomeFantasia: "PackSul Embalagens Industriais",
    razaoSocial: "PackSul Indústria de Papelão Ondulado Ltda",
    cnpj: "12.345.678/0001-90",
    categoria: "Embalagens",
    cnae: "1731-1/00 - Fabricação de embalagens de papel",
    cidade: "Campinas",
    estado: "SP",
    abrangencia: "Nacional",
    porte: "Grande",
    anosMercado: 14,
    capitalSocial: "R$ 4.500.000,00",
    pedidoMinimoGeral: "R$ 2.500,00 / 1.000 un.",
    prazoPagamentoPadrao: "28 / 42 / 56 dias (Boleto)",
    scoreRisco: 92,
    grupoEconomicoId: "GRP-01",
    socios: ["Carlos Eduardo Mendes", "Roberto Almeida"],
    resumoIA:
      "Especializada em caixas de papelão ondulado de alta resistência para transporte logístico e indústria alimentícia. Possui certificação ISO 9001 e frota própria.",
    contatoComercial: "Mariana Costa (Executiva de Contas)",
    telefone: "(19) 3214-8890",
    site: "https://www.packsul-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/packsul-exemplo",
    reclameAqui: {
      nota: "8.4 / 10",
      status: "Ótimo",
      indiceSolucao: "91%",
      url: "https://www.reclameaqui.com.br/empresa/packsul-exemplo",
    },
    itensPublicados: [
      {
        nome: "Caixa Papelão Ondulado ON2 (60x40x40cm)",
        tipo: "Produto",
        valorUnitario: 6.8,
        valorPublicado: "R$ 6,80",
        unidade: "por unidade",
        prazoMedio: "5 dias úteis",
        pedidoMinimo: "1.000 unidades",
      },
      {
        nome: "Desenvolvimento de Embalagem Sob Medida + Protótipo",
        tipo: "Serviço",
        valorUnitario: 1250.0,
        valorPublicado: "R$ 1.250,00",
        unidade: "por projeto",
        prazoMedio: "7 dias úteis",
        pedidoMinimo: "1 projeto",
      },
    ],
  },
  {
    id: "2",
    nomeFantasia: "Cartonagem Vale Verde",
    razaoSocial: "Vale Verde Artefatos de Papel Ltda",
    cnpj: "23.456.789/0001-12",
    categoria: "Embalagens",
    cnae: "1731-1/00 - Fabricação de embalagens de papel",
    cidade: "Jundiaí",
    estado: "SP",
    abrangencia: "Regional",
    porte: "Médio",
    anosMercado: 6,
    capitalSocial: "R$ 850.000,00",
    pedidoMinimoGeral: "R$ 1.200,00 / 500 un.",
    prazoPagamentoPadrao: "30 dias (Boleto / Faturado)",
    scoreRisco: 68,
    grupoEconomicoId: "GRP-01",
    socios: ["Roberto Almeida", "Fernanda Lima"],
    resumoIA:
      "Focada em lotes médios e embalagens personalizadas para e-commerce e autopeças com entrega rápida no interior de SP.",
    contatoComercial: "Lucas Ferreira (Comercial)",
    telefone: "(11) 4582-1120",
    site: "https://www.valeverdepack-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/valeverdepack-exemplo",
    reclameAqui: {
      nota: "6.7 / 10",
      status: "Regular",
      indiceSolucao: "76%",
      url: "https://www.reclameaqui.com.br/empresa/valeverdepack-exemplo",
    },
    itensPublicados: [
      {
        nome: "Caixa Papelão Ondulado ON2 (60x40x40cm)",
        tipo: "Produto",
        valorUnitario: 6.15,
        valorPublicado: "R$ 6,15",
        unidade: "por unidade",
        prazoMedio: "4 dias úteis",
        pedidoMinimo: "500 unidades",
      },
      {
        nome: "Impressão Flexográfica 2 Cores",
        tipo: "Serviço",
        valorUnitario: 0.45,
        valorPublicado: "R$ 0,45",
        unidade: "adicional por caixa",
        prazoMedio: "3 dias úteis",
        pedidoMinimo: "500 unidades",
      },
    ],
  },
  {
    id: "3",
    nomeFantasia: "TransRápido Logística Refrigerada",
    razaoSocial: "TransRápido Transportes Rodoviários S.A.",
    cnpj: "34.567.890/0001-34",
    categoria: "Logística & Transporte",
    cnae: "4930-2/02 - Transporte rodoviário de carga",
    cidade: "Curitiba",
    estado: "PR",
    abrangencia: "Nacional",
    porte: "Grande",
    anosMercado: 19,
    capitalSocial: "R$ 12.000.000,00",
    pedidoMinimoGeral: "1 rota ou 10 posições/mês",
    prazoPagamentoPadrao: "21 / 30 dias",
    scoreRisco: 95,
    socios: ["Henrique Souza", "Patrícia Nogueira"],
    resumoIA:
      "Operador logístico com rastreamento via satélite 24h, foco em carga fracionada e dedicada entre Sul e Sudeste.",
    contatoComercial: "André Martins (Gerente Comercial)",
    telefone: "(41) 3345-7700",
    site: "https://www.transrapido-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/transrapido-exemplo",
    reclameAqui: {
      nota: "8.9 / 10",
      status: "RA1000 / Ótimo",
      indiceSolucao: "95%",
      url: "https://www.reclameaqui.com.br/empresa/transrapido-exemplo",
    },
    itensPublicados: [
      {
        nome: "Frete Fracionado Refrigerado (até 500 kg - SP/PR)",
        tipo: "Serviço",
        valorUnitario: 890.0,
        valorPublicado: "R$ 890,00",
        unidade: "por rota/embarque",
        prazoMedio: "2 dias úteis",
        pedidoMinimo: "1 embarque",
      },
      {
        nome: "Armazenagem Climatizada (2°C a 8°C)",
        tipo: "Serviço",
        valorUnitario: 145.0,
        valorPublicado: "R$ 145,00",
        unidade: "por posição/mês",
        prazoMedio: "Imediato",
        pedidoMinimo: "10 posições",
      },
    ],
  },
  {
    id: "4",
    nomeFantasia: "Usinagem Precisão Metal",
    razaoSocial: "Metalúrgica Precisão Industrial Ltda",
    cnpj: "45.678.901/0001-56",
    categoria: "Matéria-Prima & Usinagem",
    cnae: "2539-0/01 - Serviços de usinagem e solda",
    cidade: "Joinville",
    estado: "SC",
    abrangencia: "Regional",
    porte: "EPP",
    anosMercado: 9,
    capitalSocial: "R$ 420.000,00",
    pedidoMinimoGeral: "R$ 800,00 por lote",
    prazoPagamentoPadrao: "14 / 28 dias",
    scoreRisco: 84,
    socios: ["Ricardo Weber"],
    resumoIA:
      "Usinagem CNC de peças técnicas em aço inox e alumínio sob desenho técnico para manutenção industrial (MRO).",
    contatoComercial: "Ricardo Weber (Diretor Técnico)",
    telefone: "(47) 3422-9010",
    site: "https://www.precisaometal-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/precisaometal-exemplo",
    reclameAqui: {
      nota: "Sem índice (Baixo volume)",
      status: "Sem reclamações graves",
      indiceSolucao: "100%",
      url: "https://www.reclameaqui.com.br",
    },
    itensPublicados: [
      {
        nome: "Bucha / Eixo em Aço Inox 304 (Usinagem CNC)",
        tipo: "Produto",
        valorUnitario: 78.0,
        valorPublicado: "R$ 78,00",
        unidade: "por peça",
        prazoMedio: "8 dias úteis",
        pedidoMinimo: "15 peças",
      },
      {
        nome: "Hora Máquina Torno CNC / Centro de Usinagem",
        tipo: "Serviço",
        valorUnitario: 210.0,
        valorPublicado: "R$ 210,00",
        unidade: "por hora técnica",
        prazoMedio: "5 dias úteis",
        pedidoMinimo: "4 horas",
      },
    ],
  },
  {
    id: "5",
    nomeFantasia: "EcoBox Embalagens Flexíveis",
    razaoSocial: "EcoBox Polímeros e Filmes Ltda",
    cnpj: "56.789.012/0001-78",
    categoria: "Embalagens",
    cnae: "2222-6/00 - Fabricação de embalagens de plástico",
    cidade: "Guarulhos",
    estado: "SP",
    abrangencia: "Nacional",
    porte: "Médio",
    anosMercado: 11,
    capitalSocial: "R$ 2.100.000,00",
    pedidoMinimoGeral: "R$ 1.500,00 / 25 bobinas",
    prazoPagamentoPadrao: "28 / 45 dias",
    scoreRisco: 88,
    socios: ["Juliana Torres", "Marcelo Dias"],
    resumoIA:
      "Fabricante de filme stretch, plástico bolha e sacos industriais recicláveis com atendimento para grandes centros de distribuição.",
    contatoComercial: "Camila Rocha (Key Account)",
    telefone: "(11) 2468-5540",
    site: "https://www.ecobox-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/ecobox-exemplo",
    reclameAqui: {
      nota: "8.1 / 10",
      status: "Ótimo",
      indiceSolucao: "89%",
      url: "https://www.reclameaqui.com.br/empresa/ecobox-exemplo",
    },
    itensPublicados: [
      {
        nome: "Bobina Filme Stretch 500mm x 25 micra",
        tipo: "Produto",
        valorUnitario: 64.9,
        valorPublicado: "R$ 64,90",
        unidade: "por bobina",
        prazoMedio: "3 dias úteis",
        pedidoMinimo: "25 bobinas",
      },
      {
        nome: "Saco Plástico Coex Industrial (50x70cm)",
        tipo: "Produto",
        valorUnitario: 1.15,
        valorPublicado: "R$ 1,15",
        unidade: "por unidade",
        prazoMedio: "5 dias úteis",
        pedidoMinimo: "2.000 unidades",
      },
    ],
  },
  {
    id: "6",
    nomeFantasia: "NuvemSegura TI & Infraestrutura",
    razaoSocial: "NuvemSegura Soluções em Tecnologia Ltda",
    cnpj: "67.890.123/0001-91",
    categoria: "TI & Cloud",
    cnae: "6202-3/00 - Desenvolvimento e licenciamento de programas",
    cidade: "São Paulo",
    estado: "SP",
    abrangencia: "Nacional",
    porte: "Médio",
    anosMercado: 8,
    capitalSocial: "R$ 1.300.000,00",
    pedidoMinimoGeral: "Contrato mensal (1 mês)",
    prazoPagamentoPadrao: "30 dias (NF + Boleto)",
    scoreRisco: 90,
    socios: ["Bruno Tavares", "Daniela Mendes"],
    resumoIA:
      "Suporte de infraestrutura em nuvem, segurança da informação (SOC 24/7) e licenciamento corporativo para equipes híbridas.",
    contatoComercial: "Felipe Andrade (Account Executive)",
    telefone: "(11) 3090-4410",
    site: "https://www.nuvemsegura-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/nuvemsegura-exemplo",
    reclameAqui: {
      nota: "7.8 / 10",
      status: "Bom",
      indiceSolucao: "86%",
      url: "https://www.reclameaqui.com.br/empresa/nuvemsegura-exemplo",
    },
    itensPublicados: [
      {
        nome: "Monitoramento de Servidores & Cloud (Plano Essencial)",
        tipo: "Serviço",
        valorUnitario: 2890.0,
        valorPublicado: "R$ 2.890,00",
        unidade: "por mês",
        prazoMedio: "Ativação em 48h",
        pedidoMinimo: "1 mês",
      },
      {
        nome: "Auditoria de Segurança & Backup em Nuvem",
        tipo: "Serviço",
        valorUnitario: 4500.0,
        valorPublicado: "R$ 4.500,00",
        unidade: "por pacote",
        prazoMedio: "10 dias úteis",
        pedidoMinimo: "1 auditoria",
      },
    ],
  },
  {
    id: "7",
    nomeFantasia: "ProGuard EPIs & Segurança",
    razaoSocial: "ProGuard Equipamentos de Proteção Ltda",
    cnpj: "78.901.234/0001-05",
    categoria: "EPIs & Segurança do Trabalho",
    cnae: "3292-2/02 - Fabricação de equipamento de proteção",
    cidade: "Belo Horizonte",
    estado: "MG",
    abrangencia: "Nacional",
    porte: "EPP",
    anosMercado: 12,
    capitalSocial: "R$ 750.000,00",
    pedidoMinimoGeral: "R$ 900,00 por pedido",
    prazoPagamentoPadrao: "28 / 35 dias",
    scoreRisco: 86,
    socios: ["Marcos Vinícius Lima"],
    resumoIA:
      "Fornecimento de EPIs com Certificado de Aprovação (CA) ativo, calçados de segurança, luvas nitrílicas e uniformes NR-10/NR-35.",
    contatoComercial: "Priscila Gomes (Vendas Corporativas)",
    telefone: "(31) 3566-2090",
    site: "https://www.proguardepi-exemplo.com.br",
    linkedin: "https://www.linkedin.com/company/proguardepi-exemplo",
    reclameAqui: {
      nota: "8.2 / 10",
      status: "Ótimo",
      indiceSolucao: "90%",
      url: "https://www.reclameaqui.com.br/empresa/proguardepi-exemplo",
    },
    itensPublicados: [
      {
        nome: "Bota de Segurança Bico Composite CA Ativo",
        tipo: "Produto",
        valorUnitario: 89.9,
        valorPublicado: "R$ 89,90",
        unidade: "por par",
        prazoMedio: "3 dias úteis",
        pedidoMinimo: "10 pares",
      },
      {
        nome: "Luva Pigmentada / Nitrílica (Pacote 12 pares)",
        tipo: "Produto",
        valorUnitario: 54.0,
        valorPublicado: "R$ 54,00",
        unidade: "por pacote",
        prazoMedio: "2 dias úteis",
        pedidoMinimo: "15 pacotes",
      },
    ],
  },
];

export default function Home() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [scoreMinimo, setScoreMinimo] = useState(0);
  const [selecionado, setSelecionado] = useState<Fornecedor | null>(
    FORNECEDORES_MOCK[0]
  );

  const categorias = useMemo(() => {
    const extras = FORNECEDORES_MOCK.map((f) => f.categoria);
    return [
      "Todas",
      ...Array.from(new Set([...CATEGORIAS_PRINCIPAIS, ...extras])),
    ];
  }, []);

  const estados = useMemo(() => {
    return [
      "Todos",
      ...Array.from(new Set(FORNECEDORES_MOCK.map((f) => f.estado))),
    ];
  }, []);

  const fornecedoresFiltrados = useMemo(() => {
    return FORNECEDORES_MOCK.filter((f) => {
      const matchItem = f.itensPublicados.some(
        (item) =>
          item.nome.toLowerCase().includes(busca.toLowerCase()) ||
          item.valorPublicado.toLowerCase().includes(busca.toLowerCase()) ||
          item.pedidoMinimo.toLowerCase().includes(busca.toLowerCase())
      );
      const matchBusca =
        f.nomeFantasia.toLowerCase().includes(busca.toLowerCase()) ||
        f.resumoIA.toLowerCase().includes(busca.toLowerCase()) ||
        f.categoria.toLowerCase().includes(busca.toLowerCase()) ||
        f.prazoPagamentoPadrao.toLowerCase().includes(busca.toLowerCase()) ||
        f.cnpj.includes(busca) ||
        f.cidade.toLowerCase().includes(busca.toLowerCase()) ||
        matchItem;
      const matchCategoria =
        categoriaFiltro === "Todas" || f.categoria === categoriaFiltro;
      const matchEstado =
        estadoFiltro === "Todos" || f.estado === estadoFiltro;
      const matchScore = f.scoreRisco >= scoreMinimo;
      return matchBusca && matchCategoria && matchEstado && matchScore;
    });
  }, [busca, categoriaFiltro, estadoFiltro, scoreMinimo]);

  const concorrentesDoSelecionado = useMemo(() => {
    if (!selecionado) return [];
    return FORNECEDORES_MOCK.filter(
      (f) => f.id !== selecionado.id && f.categoria === selecionado.categoria
    );
  }, [selecionado]);

  const obterConcorrentesDe = (fornecedorAlvo: Fornecedor) => {
    return FORNECEDORES_MOCK.filter(
      (f) => f.id !== fornecedorAlvo.id && f.categoria === fornecedorAlvo.categoria
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Cabeçalho do Portal */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              SRM & Market Intelligence
            </span>
            <h1 className="text-xl font-bold">
              Portal de Prospecção de Fornecedores
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Base Ativa: <strong>{FORNECEDORES_MOCK.length}</strong> empresas
            </span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Categorias: <strong>{categorias.length - 1}</strong>
            </span>
            <Link
              href={`/operacoes?fornecedorId=${selecionado?.id ?? "1"}&aba=orcamento`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Orçamentos, Mensagens & Reuniões →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Barra de Pesquisa e Filtros */}
        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Buscar por Empresa, Produto/Serviço, Prazo, Cidade ou CNPJ
            </label>
            <input
              type="text"
              placeholder="Ex: Papelão, 30 dias, Campinas, EPI, Cloud..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Categoria / Ramo
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Estado (UF)
              </label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
              >
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Score Mínimo
              </label>
              <select
                value={scoreMinimo}
                onChange={(e) => setScoreMinimo(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
              >
                <option value={0}>Todos</option>
                <option value={70}>70+ (Bom)</option>
                <option value={85}>85+ (Alto)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Área Principal: Lista à Esquerda + Ficha 360º à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista de Fornecedores */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Resultados ({fornecedoresFiltrados.length})
              </h2>
            </div>

            {fornecedoresFiltrados.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-sm text-slate-500">
                Nenhum fornecedor encontrado com esses filtros.
              </div>
            ) : (
              fornecedoresFiltrados.map((forn) => {
                const ativo = selecionado?.id === forn.id;
                const itemDestaque = forn.itensPublicados[0];
                return (
                  <div
                    key={forn.id}
                    onClick={() => setSelecionado(forn)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      ativo
                        ? "bg-blue-50/60 border-blue-600 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 mb-1">
                          {forn.categoria}
                        </span>
                        <h3 className="font-bold text-slate-900">
                          {forn.nomeFantasia}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {forn.cidade}/{forn.estado} • Porte {forn.porte} •{" "}
                          {forn.anosMercado} anos
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                            forn.scoreRisco >= 80
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          Score {forn.scoreRisco}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          RA: <strong>{forn.reclameAqui.nota}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs space-y-1">
                      {itemDestaque && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 truncate pr-2">
                            {itemDestaque.nome}
                          </span>
                          <span className="font-bold text-emerald-700 shrink-0">
                            {itemDestaque.valorPublicado}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Mín.: {forn.pedidoMinimoGeral}</span>
                        <span>Pagto: {forn.prazoPagamentoPadrao}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Ficha 360º do Fornecedor Selecionado */}
          <div className="lg:col-span-7">
            {selecionado ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {selecionado.categoria}
                      </span>
                      <span className="text-xs text-slate-500">
                        CNPJ: {selecionado.cnpj}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">
                      {selecionado.nomeFantasia}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {selecionado.razaoSocial} • {selecionado.cnae}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    <Link
                      href={`/operacoes?fornecedorId=${selecionado.id}&aba=orcamento`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center transition-colors"
                    >
                      Criar Orçamento
                    </Link>
                    <Link
                      href={`/operacoes?fornecedorId=${selecionado.id}&aba=contato`}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center transition-colors"
                    >
                      Mensagem / Reunião
                    </Link>
                  </div>
                </div>

                {/* Resumo Inteligente */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">
                    Resumo Operacional (Análise Automática)
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selecionado.resumoIA}
                  </p>
                </div>

                {/* Condições Comerciais, Risco & Reclame Aqui */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="block text-xs text-slate-500">
                      Pedido Mínimo
                    </span>
                    <strong className="text-slate-900">
                      {selecionado.pedidoMinimoGeral}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="block text-xs text-slate-500">
                      Prazo de Pagamento
                    </span>
                    <strong className="text-slate-900">
                      {selecionado.prazoPagamentoPadrao}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="block text-xs text-slate-500">
                      Score & Capital
                    </span>
                    <strong className="text-emerald-700">
                      {selecionado.scoreRisco} / 100
                    </strong>
                    <span className="block text-[11px] text-slate-500">
                      {selecionado.capitalSocial}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <span className="block text-xs text-slate-500">
                      Reclame Aqui
                    </span>
                    <strong className="text-slate-900">
                      {selecionado.reclameAqui.nota}
                    </strong>
                    <span className="block text-[11px] text-slate-500">
                      {selecionado.reclameAqui.status} • Solução:{" "}
                      {selecionado.reclameAqui.indiceSolucao}
                    </span>
                  </div>
                </div>

                {/* Valores Publicados (Produtos e Serviços) */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase text-slate-500">
                      Valores de Produtos & Serviços Publicados
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Atuação: {selecionado.cidade}/{selecionado.estado} (
                      {selecionado.abrangencia})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selecionado.itensPublicados.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {item.tipo}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Prazo: {item.prazoMedio}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 mt-1.5">
                          {item.nome}
                        </p>
                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="text-base font-bold text-emerald-700">
                            {item.valorPublicado}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.unidade}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Pedido mínimo: <strong>{item.pedidoMinimo}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadro Societário, Contato, Site, LinkedIn e Reclame Aqui */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">
                      Quadro de Sócios (QSA)
                    </h4>
                    <ul className="list-disc list-inside text-slate-700">
                      {selecionado.socios.map((socio) => (
                        <li key={socio}>{socio}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">
                      Contato & Canais Digitais
                    </h4>
                    <p className="text-slate-800 font-medium">
                      {selecionado.contatoComercial}
                    </p>
                    <p className="text-slate-600">{selecionado.telefone}</p>
                    <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold">
                      <a
                        href={selecionado.site}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        🌐 Site Oficial
                      </a>
                      <a
                        href={selecionado.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-700 hover:underline"
                      >
                        💼 LinkedIn Empresa
                      </a>
                      <a
                        href={selecionado.reclameAqui.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline"
                      >
                        ⭐ Reclame Aqui
                      </a>
                    </div>
                  </div>
                </div>

                {/* Inteligência Competitiva & Visibilidade Cruzada */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Concorrentes Diretos & Visibilidade Cruzada na Categoria (
                    {concorrentesDoSelecionado.length})
                  </h4>
                  {concorrentesDoSelecionado.length === 0 ? (
                    <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      ⚠️ Alerta de Gargalo: Nenhum concorrente direto mapeado
                      nesta categoria ainda.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {concorrentesDoSelecionado.map((conc) => {
                        const mesmoGrupo =
                          selecionado.grupoEconomicoId &&
                          selecionado.grupoEconomicoId ===
                            conc.grupoEconomicoId;
                        const concorrentesDoConc = obterConcorrentesDe(conc);
                        const valorConc = conc.itensPublicados[0];

                        return (
                          <div
                            key={conc.id}
                            onClick={() => setSelecionado(conc)}
                            className="cursor-pointer p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {conc.nomeFantasia}{" "}
                                  <span className="text-xs font-normal text-slate-500">
                                    ({conc.cidade}/{conc.estado})
                                  </span>
                                </p>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  Enxerga{" "}
                                  <strong>{concorrentesDoConc.length}</strong>{" "}
                                  concorrente(s) na mesma categoria
                                  {valorConc
                                    ? ` • Item base: ${valorConc.valorPublicado}`
                                    : ""}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Mín.: {conc.pedidoMinimoGeral} • Pagto:{" "}
                                  {conc.prazoPagamentoPadrao}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-700">
                                  Score {conc.scoreRisco}
                                </span>
                                <span className="block text-[11px] text-slate-500">
                                  RA {conc.reclameAqui.nota}
                                </span>
                              </div>
                            </div>

                            {mesmoGrupo && (
                              <span className="inline-block mt-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                🚨 Alerta de Compliance: Sócio em comum (mesmo
                                grupo econômico)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}