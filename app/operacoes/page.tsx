"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FORNECEDORES_20_CIDADES,
  Fornecedor,
} from "../../data/fornecedores-sourcing";

type PerfilOperacao = "adm" | "colaborador" | "fornecedor";
type AbaWorkspace = "fornecedores" | "cotacao" | "esteira";

type EtapaFluxoCompra =
  | "Orcamento Criado"
  | "Em Aprovacao (REQ)"
  | "PO Emitida (Aprovado)"
  | "Reprovado"
  | "Cancelado";

interface AreaCorporativa {
  id: string;
  nome: string;
  costCenterPadrao: string;
  spendCategoryPadrao: string;
  requisitantes: string[];
  aprovadorArea: string;
}

interface OrcamentoRegistro {
  id: string;
  fornecedorId: string;
  fornecedorNome: string;
  areaSolicitante: string;
  requisitanteNome: string;
  costCenter: string;
  spendCategory: string;
  aprovadorArea: string;
  itemNome: string;
  ncm: string;
  quantidade: number;
  descontoPercentual: number;
  modalidade: string;
  prazoPagamento: string;
  modoImposto: "por_fora" | "incluso";
  icms: number;
  ipi: number;
  pisCofins: number;
  iss: number;
  difalSt: number;
  subtotal: number;
  cargaTributaria: number;
  creditoEstimado: number;
  totalNf: number;
  custoLiquido: number;
  comprovanteNome: string | null;
  enviadoEmail: boolean;
  observacoes: string;
  etapaFluxo: EtapaFluxoCompra;
  numeroRequisicao?: string;
  alcadaAprovacao?: string;
  requisicaoGeradaEm?: string;
  numeroPO?: string;
  aprovadoPor?: string;
  poEmitidaEm?: string;
  motivoReprovacao?: string;
  contestacaoFornecedor?: {
    motivo: string;
    detalhes: string;
    registradoEm: string;
  };
  origem: "ADM & Owner" | "Mesa de Compras";
  criadoEm: string;
}

interface MensagemRegistro {
  id: string;
  fornecedorId: string;
  fornecedorNome: string;
  remetente: string;
  tipo: "Mensagem" | "Solicitação de Reunião" | "Contestação" | "Ajuda";
  assunto: string;
  dataReuniao?: string;
  conteudo: string;
  criadoEm: string;
}

const AREAS_CORPORATIVAS: AreaCorporativa[] = [
  {
    id: "operacoes",
    nome: "Operações & Produção Industrial",
    costCenterPadrao: "CC-101 • Produção & Manufatura",
    spendCategoryPadrao: "Matéria-Prima & Insumos Diretos",
    requisitantes: ["Camila Rocha", "Diego Martins", "Felipe Tavares"],
    aprovadorArea: "Rogério Tavares (Gerente de Operações)",
  },
  {
    id: "logistica",
    nome: "Logística, Armazenagem & Distribuição",
    costCenterPadrao: "CC-102 • Logística & Distribuição",
    spendCategoryPadrao: "Frete, Logística & Comex",
    requisitantes: ["Patrícia Alves", "Thiago Ferreira", "Aline Castro"],
    aprovadorArea: "Sônia Menezes (Coordenadora de Logística)",
  },
  {
    id: "comex",
    nome: "Comércio Exterior (Comex) & Importação/Exportação",
    costCenterPadrao: "CC-103 • Comex & Operações Aduaneiras",
    spendCategoryPadrao: "Frete, Logística & Comex",
    requisitantes: ["Beatriz Ramos", "Caio Nogueira", "Marina Peixoto"],
    aprovadorArea: "Eduardo Vasconcelos (Head de Comex)",
  },
  {
    id: "ti",
    nome: "Tecnologia da Informação (TI) & Sistemas",
    costCenterPadrao: "CC-104 • TI & Sistemas",
    spendCategoryPadrao: "TI, Software & Infraestrutura",
    requisitantes: ["Rafael Souza", "Juliana Lima", "Lucas Mendes"],
    aprovadorArea: "Andréia Campos (Gerente de TI)",
  },
  {
    id: "facilities",
    nome: "Manutenção & Facilities / Predial",
    costCenterPadrao: "CC-105 • Facilities & Predial",
    spendCategoryPadrao: "Manutenção, Predial & Facilities",
    requisitantes: ["Marcos Oliveira", "Vanessa Duarte", "Rodrigo Paiva"],
    aprovadorArea: "Cláudio Ribeiro (Supervisor de Facilities)",
  },
  {
    id: "marketing-comercial",
    nome: "Marketing, Comercial & Trade",
    costCenterPadrao: "CC-106 • Comercial & Marketing",
    spendCategoryPadrao: "Marketing, Eventos & Material Promocional",
    requisitantes: ["Larissa Prado", "Gustavo Costa", "Bianca Soares"],
    aprovadorArea: "Priscila Teixeira (Gerente Comercial & Trade)",
  },
  {
    id: "rh-admin",
    nome: "Recursos Humanos (RH) & Administrativo",
    costCenterPadrao: "CC-107 • RH & Administrativo",
    spendCategoryPadrao: "Administrativo & Consumo Geral",
    requisitantes: ["Fernanda Reis", "Bruno Carvalho", "Paula Azevedo"],
    aprovadorArea: "Mônica Guedes (Gerente de RH & Admin)",
  },
  {
    id: "financeiro-juridico",
    nome: "Financeiro, Controladoria & Jurídico",
    costCenterPadrao: "CC-108 • Financeiro & Controladoria",
    spendCategoryPadrao: "Serviços Profissionais & Consultoria",
    requisitantes: ["Alan Moreira", "Tatiane Pinto", "Vinícius Macedo"],
    aprovadorArea: "Henrique Cavalcanti (Controller / Financeiro)",
  },
];

const COST_CENTERS = [
  "CC-101 • Produção & Manufatura",
  "CC-102 • Logística & Distribuição",
  "CC-103 • Comex & Operações Aduaneiras",
  "CC-104 • TI & Sistemas",
  "CC-105 • Facilities & Predial",
  "CC-106 • Comercial & Marketing",
  "CC-107 • RH & Administrativo",
  "CC-108 • Financeiro & Controladoria",
];

const SPEND_CATEGORIES = [
  "Matéria-Prima & Insumos Diretos",
  "Embalagens & Expedição",
  "Frete, Logística & Comex",
  "Manutenção, Predial & Facilities",
  "TI, Software & Infraestrutura",
  "Serviços Profissionais & Consultoria",
  "Marketing, Eventos & Material Promocional",
  "Administrativo & Consumo Geral",
];

const COLABORADOR_RESPONSAVEL = {
  nome: "Lucas Andrade — Comprador Pleno (Atlas Supply)",
  email: "compras@atlassupply.com.br",
  ramal: "(11) 4000-8920 • Ramal 204",
};

const TEMA_POR_PERFIL: Record<
  PerfilOperacao,
  {
    imagemFundo: string;
    altFundo: string;
    overlayHeader: string;
    overlayPagina: string;
    bordaDestaque: string;
  }
> = {
  adm: {
    imagemFundo: "/images/parceria-comercial.jpg",
    altFundo: "Ambiente executivo e governança Atlas Supply",
    overlayHeader:
      "bg-gradient-to-r from-stone-950/95 via-stone-900/88 to-amber-950/85",
    overlayPagina: "bg-slate-100/94",
    bordaDestaque: "border-amber-500/40",
  },
  colaborador: {
    imagemFundo: "/images/acesso-colaborador.jpg",
    altFundo: "Mesa de compras e negociação com fornecedores",
    overlayHeader:
      "bg-gradient-to-r from-slate-950/95 via-slate-900/88 to-blue-950/85",
    overlayPagina: "bg-slate-100/94",
    bordaDestaque: "border-blue-500/40",
  },
  fornecedor: {
    imagemFundo: "/images/acesso-fornecedor.jpg",
    altFundo: "Operação comercial e abastecimento do fornecedor parceiro",
    overlayHeader:
      "bg-gradient-to-r from-emerald-950/95 via-slate-950/88 to-teal-950/85",
    overlayPagina: "bg-slate-100/94",
    bordaDestaque: "border-emerald-500/40",
  },
};

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function agoraFormatado(): string {
  return new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function limparTituloOperacional(titulo: string): string {
  return titulo.replace(/^Case\s*\d+\s*•\s*/i, "");
}

function badgeEscopoCor(escopo: string): string {
  if (escopo.includes("Importação") && escopo.includes("Exportação")) {
    return "bg-purple-50 text-purple-900 border-purple-200";
  }
  if (escopo === "Importação") {
    return "bg-sky-50 text-sky-900 border-sky-200";
  }
  if (escopo === "Exportação") {
    return "bg-amber-50 text-amber-900 border-amber-200";
  }
  if (escopo === "Local / Regional") {
    return "bg-teal-50 text-teal-900 border-teal-200";
  }
  return "bg-slate-100 text-slate-800 border-slate-200";
}

function OperacoesConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const perfilParam = searchParams.get("perfil");
  const usuarioParam = searchParams.get("usuario");

  const perfil: PerfilOperacao =
    perfilParam === "adm"
      ? "adm"
      : perfilParam === "fornecedor"
      ? "fornecedor"
      : "colaborador";

  const tema = TEMA_POR_PERFIL[perfil];
  const temVisaoGlobal = perfil === "adm" || perfil === "colaborador";

  const usuarioExibido =
    usuarioParam ||
    (perfil === "adm"
      ? "fabio.lizardo@atlassupply.com.br"
      : perfil === "colaborador"
      ? COLABORADOR_RESPONSAVEL.email
      : "mariana.costa@packsul.com.br");

  // Navegação por abas para evitar sobrecarga visual
  const [abaAtiva, setAbaAtiva] = useState<AbaWorkspace>(
    perfil === "fornecedor" ? "esteira" : "cotacao"
  );
  const [detalhesFornecedorAbertos, setDetalhesFornecedorAbertos] =
    useState<boolean>(false);
  const [impostosAbertos, setImpostosAbertos] = useState<boolean>(false);

  useEffect(() => {
    if (perfil === "fornecedor") {
      setAbaAtiva("esteira");
    } else if (abaAtiva === "esteira" && orcamentos.length === 0) {
      setAbaAtiva("cotacao");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil]);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(
    FORNECEDORES_20_CIDADES
  );
  const [fornecedorId, setFornecedorId] = useState<string>(
    FORNECEDORES_20_CIDADES[0].id
  );

  // Área Requisitante, Cost Center, Spend Category e Aprovadores
  const [areaId, setAreaId] = useState<string>(AREAS_CORPORATIVAS[0].id);
  const areaAtual = useMemo(
    () =>
      AREAS_CORPORATIVAS.find((a) => a.id === areaId) || AREAS_CORPORATIVAS[0],
    [areaId]
  );
  const [requisitanteNome, setRequisitanteNome] = useState<string>(
    AREAS_CORPORATIVAS[0].requisitantes[0]
  );
  const [costCenter, setCostCenter] = useState<string>(
    AREAS_CORPORATIVAS[0].costCenterPadrao
  );
  const [spendCategory, setSpendCategory] = useState<string>(
    AREAS_CORPORATIVAS[0].spendCategoryPadrao
  );
  const [aprovadorArea, setAprovadorArea] = useState<string>(
    AREAS_CORPORATIVAS[0].aprovadorArea
  );

  function handleTrocarArea(novaAreaId: string) {
    setAreaId(novaAreaId);
    const encontrada = AREAS_CORPORATIVAS.find((a) => a.id === novaAreaId);
    if (encontrada) {
      setRequisitanteNome(encontrada.requisitantes[0]);
      setCostCenter(encontrada.costCenterPadrao);
      setSpendCategory(encontrada.spendCategoryPadrao);
      setAprovadorArea(encontrada.aprovadorArea);
    }
  }

  // Filtros da base de fornecedores
  const [buscaFornecedor, setBuscaFornecedor] = useState("");
  const [filtroRegiao, setFiltroRegiao] = useState("TODAS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
  const [filtroEscopo, setFiltroEscopo] = useState("TODOS");

  const fornecedorAtual = useMemo(() => {
    if (perfil === "fornecedor") {
      return fornecedores[0];
    }
    return (
      fornecedores.find((f) => f.id === fornecedorId) || fornecedores[0]
    );
  }, [perfil, fornecedores, fornecedorId]);

  const categoriasDisponiveis = useMemo(() => {
    const unicas = Array.from(new Set(fornecedores.map((f) => f.categoria)));
    return ["TODAS", ...unicas];
  }, [fornecedores]);

  const fornecedoresFiltrados = useMemo(() => {
    return fornecedores.filter((f) => {
      const bateRegiao =
        filtroRegiao === "TODAS" || f.regiao === filtroRegiao;
      const bateCategoria =
        filtroCategoria === "TODAS" || f.categoria === filtroCategoria;
      const bateEscopo =
        filtroEscopo === "TODOS" || f.escopoAtuacao === filtroEscopo;
      const termo = buscaFornecedor.trim().toLowerCase();
      const bateBusca =
        !termo ||
        f.nome.toLowerCase().includes(termo) ||
        f.cidade.toLowerCase().includes(termo) ||
        f.uf.toLowerCase().includes(termo) ||
        f.cnpj.toLowerCase().includes(termo) ||
        f.categoria.toLowerCase().includes(termo) ||
        f.caseTitulo.toLowerCase().includes(termo) ||
        f.itens.some((it) => it.nome.toLowerCase().includes(termo));
      return bateRegiao && bateCategoria && bateEscopo && bateBusca;
    });
  }, [
    fornecedores,
    buscaFornecedor,
    filtroRegiao,
    filtroCategoria,
    filtroEscopo,
  ]);

  const spendTotalCarteira = useMemo(() => {
    return fornecedores.reduce((acc, f) => acc + f.spendAnualFicticio, 0);
  }, [fornecedores]);

  const [itemId, setItemId] = useState<string>(fornecedorAtual.itens[0].id);
  const itemSelecionado = useMemo(() => {
    return (
      fornecedorAtual.itens.find((i) => i.id === itemId) ||
      fornecedorAtual.itens[0]
    );
  }, [fornecedorAtual, itemId]);

  const [quantidade, setQuantidade] = useState<number>(
    itemSelecionado.pedidoMinimo
  );
  const [desconto, setDesconto] = useState<number>(0);
  const [modalidade, setModalidade] = useState<string>(
    "Compra Spot / Lote Único"
  );
  const [prazoPagamento, setPrazoPagamento] = useState<string>("30 dias");

  const [comprovanteNome, setComprovanteNome] = useState<string | null>(null);
  const [enviarEmailAuto, setEnviarEmailAuto] = useState<boolean>(true);

  const [modoImposto, setModoImposto] = useState<"por_fora" | "incluso">(
    "por_fora"
  );
  const [icms, setIcms] = useState<number>(18);
  const [ipi, setIpi] = useState<number>(5);
  const [pisCofins, setPisCofins] = useState<number>(9.25);
  const [iss, setIss] = useState<number>(0);
  const [difalSt, setDifalSt] = useState<number>(0);
  const [observacoes, setObservacoes] = useState<string>("");

  const [seqRequisicao, setSeqRequisicao] = useState<number>(4810);
  const [seqPO, setSeqPO] = useState<number>(9104);

  const [orcamentos, setOrcamentos] = useState<OrcamentoRegistro[]>([]);
  const [escopoLista, setEscopoLista] = useState<"este" | "todos">(
    perfil === "adm" ? "todos" : "este"
  );
  const [filtroEtapa, setFiltroEtapa] = useState<
    | "Todos"
    | "Orcamento Criado"
    | "Em Aprovacao (REQ)"
    | "PO Emitida (Aprovado)"
    | "Cancelado"
  >("Todos");

  useEffect(() => {
    if (perfil === "adm") {
      setEscopoLista("todos");
    } else if (perfil === "colaborador") {
      setEscopoLista("este");
    }
  }, [perfil]);

  const [avisoSistema, setAvisoSistema] = useState<string | null>(null);

  // Modal de Contato / Ajuda / Contestação
  const [modalMensagemAberto, setModalMensagemAberto] =
    useState<boolean>(false);
  const [tipoContato, setTipoContato] = useState<
    "Mensagem" | "Solicitação de Reunião" | "Contestação" | "Ajuda"
  >("Mensagem");
  const [orcamentoAlvoId, setOrcamentoAlvoId] = useState<string>("");
  const [assuntoContato, setAssuntoContato] = useState<string>("");
  const [dataReuniao, setDataReuniao] = useState<string>("");
  const [textoContato, setTextoContato] = useState<string>("");
  const [mensagens, setMensagens] = useState<MensagemRegistro[]>([]);

  function notificar(msg: string) {
    setAvisoSistema(msg);
    setTimeout(() => setAvisoSistema(null), 4200);
  }

  function alternarPerfil(novoPerfil: PerfilOperacao) {
    const emailPorPerfil =
      novoPerfil === "adm"
        ? "fabio.lizardo@atlassupply.com.br"
        : novoPerfil === "colaborador"
        ? COLABORADOR_RESPONSAVEL.email
        : "mariana.costa@packsul.com.br";
    router.push(
      `/operacoes?perfil=${novoPerfil}&usuario=${encodeURIComponent(
        emailPorPerfil
      )}`
    );
  }

  function selecionarFornecedor(
    novoFornecedor: Fornecedor,
    irParaCotacao = false
  ) {
    setFornecedorId(novoFornecedor.id);
    const primeiroItem = novoFornecedor.itens[0];
    setItemId(primeiroItem.id);
    setQuantidade(primeiroItem.pedidoMinimo);
    setDesconto(0);
    setComprovanteNome(null);
    setObservacoes("");
    if (irParaCotacao) {
      setAbaAtiva("cotacao");
    }
  }

  function alterarStatusContratoAdm(novoStatus: string) {
    setFornecedores((prev) =>
      prev.map((f) =>
        f.id === fornecedorAtual.id ? { ...f, contratoStatus: novoStatus } : f
      )
    );
    notificar(
      `Status contratual de ${fornecedorAtual.nome} atualizado para "${novoStatus}".`
    );
  }

  function handleTrocarItem(novoItemId: string) {
    setItemId(novoItemId);
    const encontrado = fornecedorAtual.itens.find((i) => i.id === novoItemId);
    if (encontrado) {
      setQuantidade(encontrado.pedidoMinimo);
    }
  }

  function copiarTexto(texto: string, label: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(texto).catch(() => {});
    }
    notificar(`${label} copiado para a área de transferência.`);
  }

  function abrirModalFornecedor(
    modo: "Contestação" | "Ajuda" | "Mensagem",
    orc?: OrcamentoRegistro
  ) {
    setTipoContato(modo);
    setOrcamentoAlvoId(orc ? orc.id : "");
    if (modo === "Contestação" && orc) {
      setAssuntoContato(
        `Contestação — ${orc.id}${orc.numeroPO ? ` / ${orc.numeroPO}` : ""}`
      );
    } else if (modo === "Ajuda") {
      setAssuntoContato("Dúvida sobre emissão de NF-e e vinculação da PO");
    } else {
      setAssuntoContato("");
    }
    setModalMensagemAberto(true);
  }

  const calculos = useMemo(() => {
    const qtdValida = Math.max(0, Number(quantidade) || 0);
    const descValido = Math.min(100, Math.max(0, Number(desconto) || 0));
    const bruto = qtdValida * itemSelecionado.precoUnitario;
    const subtotal = bruto * (1 - descValido / 100);

    const aliqTotal =
      (Number(icms) || 0) +
      (Number(ipi) || 0) +
      (Number(pisCofins) || 0) +
      (Number(iss) || 0) +
      (Number(difalSt) || 0);

    const cargaTributaria = subtotal * (aliqTotal / 100);

    const aliqCredito =
      fornecedorAtual.regimeTributario === "Lucro Real"
        ? (Number(icms) || 0) + (Number(pisCofins) || 0)
        : 0;
    const creditoEstimado = subtotal * (aliqCredito / 100);

    const totalNf =
      modoImposto === "por_fora" ? subtotal + cargaTributaria : subtotal;
    const custoLiquido = Math.max(0, totalNf - creditoEstimado);

    return {
      subtotal,
      cargaTributaria,
      creditoEstimado,
      totalNf,
      custoLiquido,
    };
  }, [
    quantidade,
    desconto,
    itemSelecionado,
    icms,
    ipi,
    pisCofins,
    iss,
    difalSt,
    modoImposto,
    fornecedorAtual.regimeTributario,
  ]);

  function handleGuardarOrcamento(e: React.FormEvent) {
    e.preventDefault();
    if (!temVisaoGlobal) return;

    const novoId = `ORC-${String(orcamentos.length + 101)}`;
    const novo: OrcamentoRegistro = {
      id: novoId,
      fornecedorId: fornecedorAtual.id,
      fornecedorNome: fornecedorAtual.nome,
      areaSolicitante: areaAtual.nome,
      requisitanteNome: requisitanteNome.trim() || areaAtual.requisitantes[0],
      costCenter,
      spendCategory,
      aprovadorArea,
      itemNome: itemSelecionado.nome,
      ncm: itemSelecionado.ncm,
      quantidade: Math.max(1, Number(quantidade) || 1),
      descontoPercentual: Number(desconto) || 0,
      modalidade,
      prazoPagamento,
      modoImposto,
      icms: Number(icms) || 0,
      ipi: Number(ipi) || 0,
      pisCofins: Number(pisCofins) || 0,
      iss: Number(iss) || 0,
      difalSt: Number(difalSt) || 0,
      subtotal: calculos.subtotal,
      cargaTributaria: calculos.cargaTributaria,
      creditoEstimado: calculos.creditoEstimado,
      totalNf: calculos.totalNf,
      custoLiquido: calculos.custoLiquido,
      comprovanteNome,
      enviadoEmail: enviarEmailAuto,
      observacoes: observacoes.trim(),
      etapaFluxo: "Orcamento Criado",
      origem: perfil === "adm" ? "ADM & Owner" : "Mesa de Compras",
      criadoEm: agoraFormatado(),
    };

    setOrcamentos((prev) => [novo, ...prev]);
    setObservacoes("");
    setComprovanteNome(null);
    setAbaAtiva("esteira");
    notificar(
      `Orçamento ${novoId} registrado (${areaAtual.nome} • ${costCenter}). Abra a REQ na esteira abaixo.`
    );
  }

  function gerarRequisicao(orcamento: OrcamentoRegistro) {
    if (!temVisaoGlobal) return;
    const numReq = `REQ-2026-${seqRequisicao}`;
    setSeqRequisicao((prev) => prev + 1);

    const alcada =
      orcamento.totalNf > 15000
        ? `${orcamento.aprovadorArea} + Henrique Cavalcanti (Controller) + Fabio Lizardo (ADM & Owner)`
        : orcamento.totalNf > 5000
        ? `${orcamento.aprovadorArea} + Controladoria / Suprimentos`
        : `${orcamento.aprovadorArea} (Aprovação da Área)`;

    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === orcamento.id
          ? {
              ...o,
              etapaFluxo: "Em Aprovacao (REQ)",
              numeroRequisicao: numReq,
              alcadaAprovacao: alcada,
              requisicaoGeradaEm: agoraFormatado(),
              motivoReprovacao: undefined,
            }
          : o
      )
    );

    notificar(
      `Requisição ${numReq} aberta (${orcamento.areaSolicitante}). Alçada: ${alcada}.`
    );
  }

  function aprovarEEmitirPO(orcamento: OrcamentoRegistro) {
    if (!temVisaoGlobal) return;
    const numPO = `PO-2026-${seqPO}`;
    setSeqPO((prev) => prev + 1);

    const aprovadorAssinatura =
      perfil === "adm"
        ? `Fabio Lizardo — ADM & Owner (${usuarioExibido})`
        : `${orcamento.aprovadorArea} / Mesa de Compras`;

    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === orcamento.id
          ? {
              ...o,
              etapaFluxo: "PO Emitida (Aprovado)",
              numeroPO: numPO,
              aprovadoPor: aprovadorAssinatura,
              poEmitidaEm: agoraFormatado(),
            }
          : o
      )
    );

    notificar(
      `Requisição ${orcamento.numeroRequisicao} aprovada. PO ${numPO} emitida para vinculação na NF-e.`
    );
  }

  function reprovarRequisicao(orcamento: OrcamentoRegistro) {
    if (!temVisaoGlobal) return;
    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === orcamento.id
          ? {
              ...o,
              etapaFluxo: "Reprovado",
              motivoReprovacao: `Devolvido por ${orcamento.aprovadorArea} para revisão de escopo/orçamento.`,
            }
          : o
      )
    );
    notificar(
      `Requisição ${orcamento.numeroRequisicao} devolvida na etapa de aprovação.`
    );
  }

  function cancelarOuReabrir(orcamento: OrcamentoRegistro) {
    if (!temVisaoGlobal) return;
    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === orcamento.id
          ? {
              ...o,
              etapaFluxo:
                o.etapaFluxo === "Cancelado" ? "Orcamento Criado" : "Cancelado",
            }
          : o
      )
    );
  }

  function handleEnviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    if (!assuntoContato.trim() || !textoContato.trim()) return;

    const hora = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const novaMsg: MensagemRegistro = {
      id: `MSG-${Date.now()}`,
      fornecedorId: fornecedorAtual.id,
      fornecedorNome: fornecedorAtual.nome,
      remetente:
        perfil === "adm"
          ? `Fabio Lizardo — ADM & Owner (${usuarioExibido})`
          : perfil === "colaborador"
          ? `${requisitanteNome} • ${areaAtual.nome} (${usuarioExibido})`
          : `${fornecedorAtual.contatoNome} — ${fornecedorAtual.nome}`,
      tipo: tipoContato,
      assunto: assuntoContato.trim(),
      dataReuniao:
        tipoContato === "Solicitação de Reunião" ? dataReuniao : undefined,
      conteudo: textoContato.trim(),
      criadoEm: hora,
    };

    if (
      perfil === "fornecedor" &&
      tipoContato === "Contestação" &&
      orcamentoAlvoId
    ) {
      setOrcamentos((prev) =>
        prev.map((o) =>
          o.id === orcamentoAlvoId
            ? {
                ...o,
                contestacaoFornecedor: {
                  motivo: assuntoContato.trim(),
                  detalhes: textoContato.trim(),
                  registradoEm: `${agoraFormatado()} (${hora})`,
                },
              }
            : o
        )
      );
      notificar(
        `Contestação registrada no orçamento ${orcamentoAlvoId} e encaminhada ao comprador responsável.`
      );
    } else {
      notificar(
        `${tipoContato} registrada e enviada para ${
          perfil === "fornecedor"
            ? COLABORADOR_RESPONSAVEL.email
            : fornecedorAtual.contatoEmail
        }.`
      );
    }

    setMensagens((prev) => [novaMsg, ...prev]);
    setAssuntoContato("");
    setDataReuniao("");
    setTextoContato("");
    setOrcamentoAlvoId("");
  }

  const orcamentosVisiveis = useMemo(() => {
    const base =
      perfil === "fornecedor" || escopoLista === "este"
        ? orcamentos.filter((o) => o.fornecedorId === fornecedorAtual.id)
        : orcamentos;

    if (filtroEtapa === "Todos") return base;
    return base.filter((o) => o.etapaFluxo === filtroEtapa);
  }, [orcamentos, perfil, escopoLista, fornecedorAtual.id, filtroEtapa]);

  const mensagensDoFornecedor = useMemo(() => {
    return mensagens.filter((m) => m.fornecedorId === fornecedorAtual.id);
  }, [mensagens, fornecedorAtual.id]);

  const resumoFluxo = useMemo(() => {
    const lista =
      perfil === "fornecedor"
        ? orcamentos.filter((o) => o.fornecedorId === fornecedorAtual.id)
        : orcamentos;
    const valorTotalPOs = lista
      .filter((o) => o.etapaFluxo === "PO Emitida (Aprovado)")
      .reduce((acc, item) => acc + item.totalNf, 0);

    return {
      total: lista.length,
      aguardandoReq: lista.filter((o) => o.etapaFluxo === "Orcamento Criado")
        .length,
      emAprovacao: lista.filter((o) => o.etapaFluxo === "Em Aprovacao (REQ)")
        .length,
      poEmitida: lista.filter((o) => o.etapaFluxo === "PO Emitida (Aprovado)")
        .length,
      valorTotalPOs,
    };
  }, [orcamentos, perfil, fornecedorAtual.id]);

  return (
    <div className="relative min-h-screen text-slate-900 flex flex-col">
      {/* Plano de fundo */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <img
          src={tema.imagemFundo}
          alt={tema.altFundo}
          className="w-full h-full object-cover object-center"
        />
        <div
          className={`absolute inset-0 ${tema.overlayPagina} backdrop-blur-[2px]`}
        />
      </div>

      {/* Barra superior institucional */}
      <div className="bg-stone-950 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-amber-400">
              Atlas Supply &amp; Comércio
            </span>
            <span className="text-stone-600">•</span>
            <span
              className={`px-2 py-0.5 rounded-full font-semibold ${
                perfil === "adm"
                  ? "bg-amber-500 text-stone-950"
                  : perfil === "colaborador"
                  ? "bg-blue-600 text-white"
                  : "bg-emerald-500 text-slate-950"
              }`}
            >
              {perfil === "adm"
                ? "ADM & Owner"
                : perfil === "colaborador"
                ? "Colaborador • Strategic Sourcing"
                : "Portal do Fornecedor"}
            </span>
            <span className="text-stone-400">{usuarioExibido}</span>
          </div>

          <Link
            href="/"
            className="text-amber-300 hover:text-amber-200 font-medium transition-colors"
          >
            ← Página inicial
          </Link>
        </div>
      </div>

      {/* Cabeçalho principal */}
      <header className="relative overflow-hidden text-white py-5 px-4 sm:px-6 border-b border-white/15">
        <img
          src={tema.imagemFundo}
          alt={tema.altFundo}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
        />
        <div className={`absolute inset-0 ${tema.overlayHeader}`} />

        <div className="relative max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-widest ${
                perfil === "adm"
                  ? "text-amber-300"
                  : perfil === "colaborador"
                  ? "text-sky-300"
                  : "text-emerald-300"
              }`}
            >
              {perfil === "adm"
                ? "GOVERNANÇA EXECUTIVA • REDE NACIONAL & COMEX (20 PRAÇAS)"
                : perfil === "colaborador"
                ? "MESA DE COMPRAS & STRATEGIC SOURCING • REQ / PO / TCO"
                : "PORTAL DO FORNECEDOR • PEDIDOS (PO), NF-E & ATENDIMENTO"}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
              {perfil === "adm"
                ? "Governança de Suprimentos & Aprovação Executiva"
                : perfil === "colaborador"
                ? "Operações de Compras & Strategic Sourcing"
                : "Portal do Fornecedor Parceiro"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center bg-black/50 backdrop-blur-xs border border-white/20 rounded-lg p-1 text-[11px]">
              <button
                type="button"
                onClick={() => alternarPerfil("adm")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  perfil === "adm"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                ADM / Owner
              </button>
              <button
                type="button"
                onClick={() => alternarPerfil("colaborador")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  perfil === "colaborador"
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                Colaborador
              </button>
              <button
                type="button"
                onClick={() => alternarPerfil("fornecedor")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  perfil === "fornecedor"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                Fornecedor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5 flex-1">
        {avisoSistema && (
          <div className="bg-emerald-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-sm flex items-center justify-between gap-2">
            <span>{avisoSistema}</span>
            <button
              type="button"
              onClick={() => setAvisoSistema(null)}
              className="text-emerald-200 hover:text-white underline text-[11px] cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Resumo Executivo Compacto (KPIs em 1 linha) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3 shadow-2xs">
            <p className="text-[11px] font-semibold uppercase text-slate-400">
              Orçamentos / RFQ
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-xl font-bold text-slate-900">
                {resumoFluxo.total}
              </p>
              <span className="text-[11px] text-slate-500">
                {resumoFluxo.aguardandoReq} p/ REQ
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 px-4 py-3 shadow-2xs">
            <p className="text-[11px] font-semibold uppercase text-amber-700">
              Em Aprovação (REQ)
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-xl font-bold text-amber-900">
                {resumoFluxo.emAprovacao}
              </p>
              <span className="text-[11px] text-amber-700">Em alçada</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-emerald-200 px-4 py-3 shadow-2xs">
            <p className="text-[11px] font-semibold uppercase text-emerald-700">
              POs Emitidas (NF-e)
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-xl font-bold text-emerald-800">
                {resumoFluxo.poEmitida}
              </p>
              <span className="text-[11px] font-semibold text-emerald-700">
                {formatarMoeda(resumoFluxo.valorTotalPOs)}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-2xs">
            <p className="text-[11px] font-semibold uppercase text-amber-300">
              {temVisaoGlobal ? "Spend Homologado (12m)" : "Numeração Ativa"}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-base font-bold text-emerald-400">
                {temVisaoGlobal
                  ? formatarMoeda(spendTotalCarteira)
                  : `PO-${seqPO}`}
              </p>
              <span className="text-[11px] text-slate-400">
                {temVisaoGlobal ? `${fornecedores.length} praças` : "Ativo"}
              </span>
            </div>
          </div>
        </section>

        {/* Cartão do Fornecedor Ativo (Enxuto + Gaveta Expansível) */}
        <section
          className={`bg-white rounded-2xl border ${tema.bordaDestaque} p-4 sm:p-5 shadow-2xs space-y-3`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-[260px]">
              <div
                className={`w-11 h-11 rounded-xl ${fornecedorAtual.corBadge} text-white font-bold flex items-center justify-center text-sm shrink-0`}
              >
                {fornecedorAtual.sigla}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeEscopoCor(
                      fornecedorAtual.escopoAtuacao
                    )}`}
                  >
                    {fornecedorAtual.escopoAtuacao}
                  </span>
                  <span className="text-xs text-slate-500">
                    {fornecedorAtual.cidade}/{fornecedorAtual.uf} •{" "}
                    {fornecedorAtual.regiao} •{" "}
                    <strong>{fornecedorAtual.regimeTributario}</strong>
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      fornecedorAtual.contratoStatus === "Vigente"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Contrato: {fornecedorAtual.contratoStatus}
                  </span>
                </div>

                {temVisaoGlobal ? (
                  <select
                    value={fornecedorAtual.id}
                    onChange={(e) => {
                      const achado = fornecedores.find(
                        (f) => f.id === e.target.value
                      );
                      if (achado) selecionarFornecedor(achado);
                    }}
                    className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {fornecedores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome} — {f.cidade}/{f.uf} ({f.escopoAtuacao})
                      </option>
                    ))}
                  </select>
                ) : (
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {fornecedorAtual.nome}
                  </h2>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setDetalhesFornecedorAbertos(!detalhesFornecedorAbertos)
                }
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                {detalhesFornecedorAbertos
                  ? "Ocultar detalhes ▲"
                  : "Ficha, Sourcing & Banco ▼"}
              </button>

              <button
                type="button"
                onClick={() => abrirModalFornecedor("Mensagem")}
                className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                {perfil === "fornecedor"
                  ? "Falar com Comprador"
                  : "Mensagem / Reunião"}
                {mensagensDoFornecedor.length > 0 &&
                  ` (${mensagensDoFornecedor.length})`}
              </button>

              {perfil === "fornecedor" && (
                <button
                  type="button"
                  onClick={() => abrirModalFornecedor("Contestação")}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Contestar condição
                </button>
              )}
            </div>
          </div>

          {/* Gaveta Recolhível: Ficha Fiscal, Estratégia de Categoria e Dados Bancários */}
          {detalhesFornecedorAbertos && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    Razão Social: <strong>{fornecedorAtual.razaoSocial}</strong>
                  </span>
                  <span>
                    CNPJ: <strong>{fornecedorAtual.cnpj}</strong>
                  </span>
                  <span>
                    SLA: <strong>{fornecedorAtual.slaEntrega}</strong>
                  </span>
                  <span>
                    Contato: <strong>{fornecedorAtual.contatoNome}</strong> (
                    {fornecedorAtual.contatoEmail})
                  </span>
                  {fornecedorAtual.rotaComex && (
                    <span className="text-indigo-800 font-medium">
                      Rota: {fornecedorAtual.rotaComex}
                    </span>
                  )}
                </div>

                {perfil === "adm" && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">
                      Status contratual:
                    </span>
                    {(
                      ["Vigente", "Em Homologação", "Em Revisão"] as const
                    ).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => alterarStatusContratoAdm(st)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          fornecedorAtual.contratoStatus === st
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {temVisaoGlobal && (
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                        Estratégia de Categoria
                      </span>
                      <h3 className="text-sm font-bold">
                        {limparTituloOperacional(fornecedorAtual.caseTitulo)}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-white/10 px-2.5 py-1 rounded">
                        Spend 12m:{" "}
                        <strong className="text-amber-300">
                          {formatarMoeda(fornecedorAtual.spendAnualFicticio)}
                        </strong>{" "}
                        ({fornecedorAtual.pedidosAnoFicticio} pedidos/ano)
                      </span>
                      <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded font-semibold">
                        Meta de saving:{" "}
                        {fornecedorAtual.savingPotencialPercentual}% (
                        {formatarMoeda(
                          (fornecedorAtual.spendAnualFicticio *
                            fornecedorAtual.savingPotencialPercentual) /
                            100
                        )}
                        /ano)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-1">
                        Diagnóstico &amp; Gargalo Operacional
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {fornecedorAtual.caseDesafio}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
                        Alavanca de Negociação &amp; TCO
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {fornecedorAtual.caseAlavancaSourcing}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-500">PIX:</span>{" "}
                    <strong>{fornecedorAtual.chavePix}</strong>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">
                      CONTA BANCÁRIA:
                    </span>{" "}
                    {fornecedorAtual.contaBancaria}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copiarTexto(fornecedorAtual.chavePix, "Chave PIX")
                    }
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-800 cursor-pointer"
                  >
                    Copiar PIX
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copiarTexto(
                        fornecedorAtual.contaBancaria,
                        "Conta bancária"
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-800 cursor-pointer"
                  >
                    Copiar Conta
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Barra de Abas do Workspace (Para ADM & Colaborador) */}
        {temVisaoGlobal && (
          <nav className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap items-center gap-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setAbaAtiva("cotacao")}
              className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                abaAtiva === "cotacao"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              1. Cotação &amp; Simulador Fiscal
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva("esteira")}
              className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                abaAtiva === "esteira"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>2. Esteira P2P (REQ &amp; POs)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  abaAtiva === "esteira"
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-200 text-slate-800"
                }`}
              >
                {orcamentos.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva("fornecedores")}
              className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                abaAtiva === "fornecedores"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>3. Base de Fornecedores</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  abaAtiva === "fornecedores"
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-slate-200 text-slate-800"
                }`}
              >
                {fornecedores.length} praças
              </span>
            </button>
          </nav>
        )}

        {/* ==================== ABA 1: COTAÇÃO & SIMULADOR FISCAL ==================== */}
        {temVisaoGlobal && abaAtiva === "cotacao" && (
          <form
            onSubmit={handleGuardarOrcamento}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Coluna Principal do Formulário */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Orçamento &amp; Dados da Requisição
                  </h2>
                  <p className="text-xs text-slate-500">
                    Preencha o centro de custo, item e condições comerciais.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  NCM {itemSelecionado.ncm}
                </span>
              </div>

              {/* Bloco Área / Cost Center / Spend Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Área Requisitante
                  </label>
                  <select
                    value={areaAtual.id}
                    onChange={(e) => handleTrocarArea(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {AREAS_CORPORATIVAS.map((ar) => (
                      <option key={ar.id} value={ar.id}>
                        {ar.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Solicitante
                  </label>
                  <select
                    value={requisitanteNome}
                    onChange={(e) => setRequisitanteNome(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {areaAtual.requisitantes.map((reqNome) => (
                      <option key={reqNome} value={reqNome}>
                        {reqNome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Cost Center
                  </label>
                  <select
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {COST_CENTERS.map((cc) => (
                      <option key={cc} value={cc}>
                        {cc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Spend Category
                  </label>
                  <select
                    value={spendCategory}
                    onChange={(e) => setSpendCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {SPEND_CATEGORIES.map((sc) => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seleção do Item */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Item / Serviço do Catálogo Homologado
                </label>
                <select
                  value={itemSelecionado.id}
                  onChange={(e) => handleTrocarItem(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {fornecedorAtual.itens.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.nome} — {formatarMoeda(it.precoUnitario)} /{" "}
                      {it.unidade}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-600">
                  Pedido mínimo:{" "}
                  <strong>
                    {itemSelecionado.pedidoMinimo.toLocaleString("pt-BR")}{" "}
                    {itemSelecionado.unidade}
                  </strong>{" "}
                  • Lead time: <strong>{itemSelecionado.prazoEntrega}</strong>{" "}
                  • Aprovador da área: <strong>{aprovadorArea}</strong>
                </p>
              </div>

              {/* Quantidade, Desconto, Modalidade e Pagamento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={desconto}
                    onChange={(e) => setDesconto(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                    Modalidade
                  </label>
                  <select
                    value={modalidade}
                    onChange={(e) => setModalidade(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium"
                  >
                    <option>Compra Spot / Lote Único</option>
                    <option>Contrato</option>
                    <option>Programação Mensal</option>
                    <option>Operação Comex (FOB / CIF)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                    Pagamento
                  </label>
                  <select
                    value={prazoPagamento}
                    onChange={(e) => setPrazoPagamento(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium"
                  >
                    <option>À vista (PIX / TED)</option>
                    <option>15 dias</option>
                    <option>30 dias</option>
                    <option>30 / 60 dias</option>
                    <option>Carta de Crédito (Comex)</option>
                  </select>
                </div>
              </div>

              {/* Anexo + Observações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                  <span className="block text-[11px] font-semibold uppercase text-slate-600">
                    Proposta / Anexo Comercial
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer">
                      Anexar PDF
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setComprovanteNome(file ? file.name : null);
                        }}
                      />
                    </label>
                    <span className="text-xs text-slate-500 truncate">
                      {comprovanteNome || "Nenhum anexo"}
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enviarEmailAuto}
                      onChange={(e) => setEnviarEmailAuto(e.target.checked)}
                    />
                    <span>Notificar fornecedor por e-mail</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                    Observações para NF-e / Entrega
                  </label>
                  <textarea
                    rows={3}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex.: Destacar nº da PO nos dados adicionais da NF-e..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Coluna Direita: Resumo Tributário, TCO & Ação */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Resumo Financeiro &amp; TCO
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {fornecedorAtual.regimeTributario}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div className="flex justify-between text-slate-300">
                    <span>
                      Subtotal ({quantidade} {itemSelecionado.unidade}):
                    </span>
                    <span className="font-semibold text-white">
                      {formatarMoeda(calculos.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>
                      Carga tributária (
                      {modoImposto === "por_fora" ? "por fora" : "inclusa"}):
                    </span>
                    <span>{formatarMoeda(calculos.cargaTributaria)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Crédito tributário recuperável:</span>
                    <span>- {formatarMoeda(calculos.creditoEstimado)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold">
                      Total da Nota Fiscal:
                    </span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {formatarMoeda(calculos.totalNf)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Custo líquido efetivo (TCO):</span>
                    <span className="font-semibold text-slate-200">
                      {formatarMoeda(calculos.custoLiquido)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors cursor-pointer mt-2"
                >
                  Registrar Orçamento &amp; Seguir para REQ →
                </button>
              </div>

              {/* Gaveta de Parametrização Tributária */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <button
                  type="button"
                  onClick={() => setImpostosAbertos(!impostosAbertos)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Parâmetros Tributários (ICMS, IPI, PIS/COFINS, DIFAL)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Alíquotas atuais: ICMS {icms}% • IPI {ipi}% • PIS/COFINS{" "}
                      {pisCofins}%
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-700">
                    {impostosAbertos ? "Recolher ▲" : "Ajustar ▼"}
                  </span>
                </button>

                {impostosAbertos && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setModoImposto("por_fora")}
                        className={`px-3 py-1 font-semibold cursor-pointer ${
                          modoImposto === "por_fora"
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        + Impostos por fora
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoImposto("incluso")}
                        className={`px-3 py-1 font-semibold cursor-pointer ${
                          modoImposto === "incluso"
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        Impostos inclusos
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ICMS (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={icms}
                          onChange={(e) => setIcms(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          IPI (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={ipi}
                          onChange={(e) => setIpi(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          PIS/COFINS (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={pisCofins}
                          onChange={(e) => setPisCofins(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ISS (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={iss}
                          onChange={(e) => setIss(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          DIFAL / ST (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={difalSt}
                          onChange={(e) => setDifalSt(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {/* ==================== ABA 2 (ou VISÃO FORNECEDOR): ESTEIRA P2P ==================== */}
        {(abaAtiva === "esteira" || perfil === "fornecedor") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {perfil === "fornecedor" && (
              <aside className="lg:col-span-4 bg-white rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    Suporte &amp; Faturamento
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    Atendimento ao Parceiro
                  </h2>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <p className="font-bold text-slate-900">
                    {COLABORADOR_RESPONSAVEL.nome}
                  </p>
                  <p className="text-slate-600">
                    {COLABORADOR_RESPONSAVEL.email}
                  </p>
                  <p className="text-slate-600">
                    {COLABORADOR_RESPONSAVEL.ramal}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => abrirModalFornecedor("Ajuda")}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-800 cursor-pointer"
                    >
                      Dúvidas NF-e
                    </button>
                    <button
                      type="button"
                      onClick={() => abrirModalFornecedor("Contestação")}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer"
                    >
                      Contestar pedido
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
                  <p className="font-bold">Instrução para emissão de NF-e</p>
                  <p className="leading-relaxed">
                    Após aprovação interna, o código{" "}
                    <strong>PO-2026-XXXX</strong> ficará disponível no card ao
                    lado. Informe esse número no campo de pedido/observações da
                    NF-e.
                  </p>
                </div>
              </aside>
            )}

            <section
              className={`${
                perfil === "fornecedor" ? "lg:col-span-8" : "lg:col-span-12"
              } bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Esteira Procure-to-Pay — Orçamentos, Requisições (REQ) e POs
                  </h2>
                  <p className="text-xs text-slate-500">
                    Acompanhe o fluxo de aprovação por alçada até a emissão da
                    Purchase Order (PO).
                  </p>
                </div>

                {temVisaoGlobal && (
                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setEscopoLista("este")}
                        className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                          escopoLista === "este"
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-600"
                        }`}
                      >
                        Fornecedor atual
                      </button>
                      <button
                        type="button"
                        onClick={() => setEscopoLista("todos")}
                        className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                          escopoLista === "todos"
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-600"
                        }`}
                      >
                        Toda a rede ({orcamentos.length})
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAbaAtiva("cotacao")}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                    >
                      + Novo Orçamento
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "Todos", label: "Todos" },
                    { id: "Orcamento Criado", label: "1. Orçamento" },
                    { id: "Em Aprovacao (REQ)", label: "2. Em Aprovação (REQ)" },
                    { id: "PO Emitida (Aprovado)", label: "3. PO Emitida" },
                    { id: "Cancelado", label: "Cancelados" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFiltroEtapa(tab.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                      filtroEtapa === tab.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {orcamentosVisiveis.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center space-y-3 bg-slate-50/60">
                  <p className="text-sm font-medium text-slate-700">
                    Nenhum registro encontrado nesta etapa.
                  </p>
                  {temVisaoGlobal && (
                    <button
                      type="button"
                      onClick={() => setAbaAtiva("cotacao")}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                    >
                      Criar primeiro orçamento
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {orcamentosVisiveis.map((orc) => (
                    <div
                      key={orc.id}
                      className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {orc.id}
                            </span>
                            {orc.numeroRequisicao && (
                              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                                {orc.numeroRequisicao}
                              </span>
                            )}
                            {orc.numeroPO && (
                              <span className="text-xs font-bold text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded">
                                {orc.numeroPO}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                orc.etapaFluxo === "PO Emitida (Aprovado)"
                                  ? "bg-emerald-600 text-white"
                                  : orc.etapaFluxo === "Em Aprovacao (REQ)"
                                  ? "bg-amber-500 text-slate-950"
                                  : orc.etapaFluxo === "Orcamento Criado"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {orc.etapaFluxo}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-900">
                            {orc.fornecedorNome} — {orc.itemNome}
                          </p>
                          <p className="text-xs text-slate-600">
                            Qtd: <strong>{orc.quantidade}</strong> •{" "}
                            {orc.modalidade} • {orc.prazoPagamento} •{" "}
                            {orc.costCenter} ({orc.spendCategory})
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-bold text-emerald-700">
                            {formatarMoeda(orc.totalNf)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            TCO líquido: {formatarMoeda(orc.custoLiquido)}
                          </p>
                        </div>
                      </div>

                      {/* Linha do tempo das 3 etapas */}
                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div className="rounded-lg px-3 py-1.5 bg-slate-900 text-white font-semibold">
                          ✓ 1. Orçamento ({orc.id})
                        </div>
                        <div
                          className={`rounded-lg px-3 py-1.5 font-semibold ${
                            orc.numeroRequisicao
                              ? "bg-amber-100 text-amber-950"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {orc.numeroRequisicao
                            ? `2. Requisição (${orc.numeroRequisicao})`
                            : "2. Aguardando REQ"}
                        </div>
                        <div
                          className={`rounded-lg px-3 py-1.5 font-semibold ${
                            orc.numeroPO
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {orc.numeroPO
                            ? `✓ 3. PO Emitida (${orc.numeroPO})`
                            : "3. Aguardando PO"}
                        </div>
                      </div>

                      {orc.alcadaAprovacao && (
                        <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <strong>Alçada:</strong> {orc.alcadaAprovacao}
                        </p>
                      )}

                      {orc.contestacaoFornecedor && (
                        <div className="bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 text-xs text-amber-950">
                          <strong>Contestação do Fornecedor:</strong>{" "}
                          {orc.contestacaoFornecedor.motivo} —{" "}
                          {orc.contestacaoFornecedor.detalhes}
                        </div>
                      )}

                      {/* Ações */}
                      {temVisaoGlobal ? (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {(orc.etapaFluxo === "Orcamento Criado" ||
                              orc.etapaFluxo === "Reprovado") && (
                              <button
                                type="button"
                                onClick={() => gerarRequisicao(orc)}
                                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                              >
                                Abrir REQ para Aprovação →
                              </button>
                            )}

                            {orc.etapaFluxo === "Em Aprovacao (REQ)" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => aprovarEEmitirPO(orc)}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                                >
                                  ✓ Aprovar &amp; Emitir PO
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reprovarRequisicao(orc)}
                                  className="px-3 py-1.5 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer"
                                >
                                  Devolver
                                </button>
                              </>
                            )}

                            {orc.etapaFluxo === "PO Emitida (Aprovado)" &&
                              orc.numeroPO && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copiarTexto(orc.numeroPO!, "Número da PO")
                                  }
                                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                                >
                                  Copiar {orc.numeroPO}
                                </button>
                              )}
                          </div>

                          <button
                            type="button"
                            onClick={() => cancelarOuReabrir(orc)}
                            className="text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
                          >
                            {orc.etapaFluxo === "Cancelado"
                              ? "Reabrir"
                              : "Cancelar"}
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          {orc.numeroPO && (
                            <button
                              type="button"
                              onClick={() =>
                                copiarTexto(
                                  orc.numeroPO!,
                                  "Número da PO para NF-e"
                                )
                              }
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                            >
                              Copiar PO p/ NF-e ({orc.numeroPO})
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              abrirModalFornecedor("Contestação", orc)
                            }
                            className="px-3.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold cursor-pointer"
                          >
                            Contestar condição
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ==================== ABA 3: BASE DE FORNECEDORES (20 PRAÇAS) ==================== */}
        {temVisaoGlobal && abaAtiva === "fornecedores" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Rede de Fornecedores Homologados ({fornecedores.length}{" "}
                  Praças)
                </h2>
                <p className="text-xs text-slate-500">
                  Filtre por região, segmento ou escopo logístico (Local,
                  Nacional, Importação e Exportação).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    "TODAS",
                    "Sudeste",
                    "Sul",
                    "Nordeste",
                    "Centro-Oeste",
                    "Norte",
                  ] as const
                ).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setFiltroRegiao(reg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      filtroRegiao === reg
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {reg === "TODAS" ? "Todas as Regiões" : reg}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <input
                type="text"
                value={buscaFornecedor}
                onChange={(e) => setBuscaFornecedor(e.target.value)}
                placeholder="Pesquisar por cidade, UF, empresa, CNPJ ou item..."
                className="sm:col-span-6 rounded-lg border border-slate-300 px-3.5 py-2 text-xs"
              />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="sm:col-span-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
              >
                {categoriasDisponiveis.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "TODAS" ? "Todos os Segmentos" : cat}
                  </option>
                ))}
              </select>
              <select
                value={filtroEscopo}
                onChange={(e) => setFiltroEscopo(e.target.value)}
                className="sm:col-span-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
              >
                <option value="TODOS">Todos os Escopos</option>
                <option value="Local / Regional">Local / Regional</option>
                <option value="Nacional">Nacional</option>
                <option value="Importação">Importação</option>
                <option value="Exportação">Exportação</option>
                <option value="Importação & Exportação">
                  Importação &amp; Exportação
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fornecedoresFiltrados.map((f) => {
                const selecionado = f.id === fornecedorAtual.id;
                return (
                  <div
                    key={f.id}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between gap-3 ${
                      selecionado
                        ? "border-blue-600 bg-blue-50/40 shadow-2xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-lg ${f.corBadge} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {f.sigla}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              {f.nome}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {f.cidade}/{f.uf} • {f.regiao} •{" "}
                              {f.regimeTributario}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeEscopoCor(
                            f.escopoAtuacao
                          )}`}
                        >
                          {f.escopoAtuacao}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium">
                        {limparTituloOperacional(f.caseTitulo)}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {f.caseAlavancaSourcing}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Spend 12m:{" "}
                        <strong className="text-slate-900">
                          {formatarMoeda(f.spendAnualFicticio)}
                        </strong>{" "}
                        <span className="text-emerald-700 font-semibold">
                          (-{f.savingPotencialPercentual}%)
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => selecionarFornecedor(f, true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
                      >
                        Cotar com este fornecedor →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Modal de Mensagem / Ajuda / Contestação / Reunião */}
      {modalMensagemAberto && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                  {perfil === "fornecedor"
                    ? `Destino: ${COLABORADOR_RESPONSAVEL.email}`
                    : `Canal Direto • ${fornecedorAtual.nome}`}
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  {tipoContato === "Contestação"
                    ? "Registrar Contestação"
                    : tipoContato === "Ajuda"
                    ? "Suporte ao Fornecedor"
                    : "Mensagem ou Solicitação de Reunião"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalMensagemAberto(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleEnviarMensagem} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de contato
                  </label>
                  <select
                    value={tipoContato}
                    onChange={(e) =>
                      setTipoContato(
                        e.target.value as
                          | "Mensagem"
                          | "Solicitação de Reunião"
                          | "Contestação"
                          | "Ajuda"
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                  >
                    {perfil === "fornecedor" ? (
                      <>
                        <option>Contestação</option>
                        <option>Ajuda</option>
                        <option>Mensagem</option>
                      </>
                    ) : (
                      <>
                        <option>Solicitação de Reunião</option>
                        <option>Mensagem</option>
                      </>
                    )}
                  </select>
                </div>

                {perfil === "fornecedor" && tipoContato === "Contestação" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Orçamento / PO contestado
                    </label>
                    <select
                      value={orcamentoAlvoId}
                      onChange={(e) => setOrcamentoAlvoId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    >
                      <option value="">Selecione um registro...</option>
                      {orcamentosVisiveis.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.id}
                          {o.numeroPO ? ` • ${o.numeroPO}` : ""} (
                          {formatarMoeda(o.totalNf)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {tipoContato === "Solicitação de Reunião" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data / Horário sugerido
                    </label>
                    <input
                      type="text"
                      value={dataReuniao}
                      onChange={(e) => setDataReuniao(e.target.value)}
                      placeholder="Ex.: Quinta-feira às 14h30"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  value={assuntoContato}
                  onChange={(e) => setAssuntoContato(e.target.value)}
                  placeholder="Informe o assunto..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mensagem / Detalhes
                </label>
                <textarea
                  rows={3}
                  value={textoContato}
                  onChange={(e) => setTextoContato(e.target.value)}
                  placeholder="Descreva os detalhes da solicitação..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Enviar mensagem
              </button>
            </form>

            {mensagensDoFornecedor.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2 max-h-44 overflow-y-auto">
                <p className="text-[11px] font-semibold uppercase text-slate-400">
                  Histórico recente ({mensagensDoFornecedor.length})
                </p>
                {mensagensDoFornecedor.map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>
                        {m.tipo}: {m.assunto}
                      </span>
                      <span className="text-slate-400">{m.criadoEm}</span>
                    </div>
                    {m.dataReuniao && (
                      <p className="text-[11px] text-blue-700 font-medium">
                        Agenda sugerida: {m.dataReuniao}
                      </p>
                    )}
                    <p className="text-slate-600">{m.conteudo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OperacoesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center text-sm text-slate-600">
          Carregando painel operacional da Atlas Supply &amp; Comércio...
        </div>
      }
    >
      <OperacoesConteudo />
    </Suspense>
  );
}