"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type PerfilOperacao = "adm" | "colaborador" | "fornecedor";

type EtapaFluxoCompra =
  | "Orcamento Criado"
  | "Em Aprovacao (REQ)"
  | "PO Emitida (Aprovado)"
  | "Reprovado"
  | "Cancelado";

interface ItemFornecedor {
  id: string;
  nome: string;
  ncm: string;
  precoUnitario: number;
  unidade: string;
  pedidoMinimo: number;
  prazoEntrega: string;
}

interface Fornecedor {
  id: string;
  sigla: string;
  corBadge: string;
  nome: string;
  razaoSocial: string;
  uf: string;
  cidade: string;
  categoria: string;
  porte: string;
  regimeTributario: "Lucro Real" | "Lucro Presumido" | "Simples Nacional";
  cnpj: string;
  contratoStatus: string;
  ndaStatus: string;
  slaEntrega: string;
  contatoNome: string;
  contatoEmail: string;
  chavePix: string;
  contaBancaria: string;
  itens: ItemFornecedor[];
}

interface OrcamentoRegistro {
  id: string;
  fornecedorId: string;
  fornecedorNome: string;
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

const COLABORADOR_RESPONSAVEL = {
  nome: "Lucas Andrade — Comprador Pleno (Atlas Supply)",
  email: "compras@atlassupply-exemplo.com.br",
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
      "bg-gradient-to-r from-stone-950/95 via-stone-900/85 to-amber-950/80",
    overlayPagina: "bg-stone-100/90",
    bordaDestaque: "border-amber-500/40",
  },
  colaborador: {
    imagemFundo: "/images/acesso-colaborador.jpg",
    altFundo: "Mesa de compras e negociação com fornecedores",
    overlayHeader:
      "bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-blue-950/80",
    overlayPagina: "bg-slate-100/88",
    bordaDestaque: "border-blue-500/40",
  },
  fornecedor: {
    imagemFundo: "/images/acesso-fornecedor.jpg",
    altFundo: "Operação comercial e abastecimento do fornecedor parceiro",
    overlayHeader:
      "bg-gradient-to-r from-emerald-950/95 via-slate-950/85 to-teal-950/80",
    overlayPagina: "bg-emerald-50/88",
    bordaDestaque: "border-emerald-500/40",
  },
};

const FORNECEDORES_INICIAIS: Fornecedor[] = [
  {
    id: "packs-sp",
    sigla: "PE",
    corBadge: "bg-emerald-700",
    nome: "PackSul Embalagens Industriais",
    razaoSocial: "PackSul Embalagens Ltda",
    uf: "SP",
    cidade: "Guarulhos",
    categoria: "Embalagens & Manufatura",
    porte: "Escala Industrial",
    regimeTributario: "Lucro Real",
    cnpj: "12.345.678/0001-90",
    contratoStatus: "Vigente",
    ndaStatus: "Assinado",
    slaEntrega: "5 dias úteis",
    contatoNome: "Mariana Costa",
    contatoEmail: "mariana.costa@packsul-exemplo.com.br",
    chavePix: "12.345.678/0001-90 (CNPJ)",
    contaBancaria:
      "Banco Itaú (341) • Ag. 0421 • C/C 78412-9 • Titular: PackSul Embalagens Ltda (CNPJ 12.345.678/0001-90)",
    itens: [
      {
        id: "pk-1",
        nome: "Caixa Papelão Ondulado ON2 (60x40x40cm)",
        ncm: "4819.10.00",
        precoUnitario: 6.8,
        unidade: "un.",
        pedidoMinimo: 1000,
        prazoEntrega: "5 dias úteis",
      },
      {
        id: "pk-2",
        nome: "Filme Stretch Industrial 500mm x 25micras",
        ncm: "3920.10.99",
        precoUnitario: 48.5,
        unidade: "bobina",
        pedidoMinimo: 120,
        prazoEntrega: "4 dias úteis",
      },
    ],
  },
  {
    id: "agrovale-mg",
    sigla: "AV",
    corBadge: "bg-amber-700",
    nome: "AgroVale Cooperativa & Grãos",
    razaoSocial: "Cooperativa AgroVale do Cerrado Ltda",
    uf: "MG",
    cidade: "Uberlândia",
    categoria: "Agro & Alimentos",
    porte: "Médio Porte / Cooperativa",
    regimeTributario: "Lucro Real",
    cnpj: "23.456.789/0001-12",
    contratoStatus: "Vigente",
    ndaStatus: "Assinado",
    slaEntrega: "7 dias úteis",
    contatoNome: "Ricardo Nogueira",
    contatoEmail: "comercial@agrovale-exemplo.com.br",
    chavePix: "23.456.789/0001-12 (CNPJ)",
    contaBancaria:
      "Banco do Brasil (001) • Ag. 3120-4 • C/C 44190-2 • Titular: Cooperativa AgroVale do Cerrado Ltda",
    itens: [
      {
        id: "ag-1",
        nome: "Milho Amarelo Tipo 1 — Saca 60kg (Lote Industrial)",
        ncm: "1005.90.10",
        precoUnitario: 74.0,
        unidade: "saca",
        pedidoMinimo: 250,
        prazoEntrega: "7 dias úteis",
      },
      {
        id: "ag-2",
        nome: "Café Arábica Torrado Grão Exportação — Saca 60kg",
        ncm: "0901.21.00",
        precoUnitario: 1180.0,
        unidade: "saca",
        pedidoMinimo: 30,
        prazoEntrega: "10 dias úteis",
      },
    ],
  },
  {
    id: "metalprime-pr",
    sigla: "MP",
    corBadge: "bg-slate-800",
    nome: "MetalPrime Componentes & Aço",
    razaoSocial: "MetalPrime Usinagem Industrial S.A.",
    uf: "PR",
    cidade: "Curitiba",
    categoria: "Insumos Industriais",
    porte: "Escala Industrial",
    regimeTributario: "Lucro Real",
    cnpj: "34.567.890/0001-45",
    contratoStatus: "Vigente",
    ndaStatus: "Assinado",
    slaEntrega: "8 dias úteis",
    contatoNome: "Eng. Henrique Dias",
    contatoEmail: "vendas@metalprime-exemplo.com.br",
    chavePix: "34.567.890/0001-45 (CNPJ)",
    contaBancaria:
      "Bradesco (237) • Ag. 1890 • C/C 90211-4 • Titular: MetalPrime Usinagem Industrial S.A.",
    itens: [
      {
        id: "mp-1",
        nome: "Chapa de Aço Carbono SAE 1020 (3,0mm)",
        ncm: "7208.52.00",
        precoUnitario: 310.0,
        unidade: "chapa",
        pedidoMinimo: 50,
        prazoEntrega: "8 dias úteis",
      },
      {
        id: "mp-2",
        nome: "Kit Fixadores Inox Linha Pesada (100 peças)",
        ncm: "7318.15.00",
        precoUnitario: 89.9,
        unidade: "kit",
        pedidoMinimo: 100,
        prazoEntrega: "5 dias úteis",
      },
    ],
  },
  {
    id: "atlantico-sc",
    sigla: "AC",
    corBadge: "bg-sky-800",
    nome: "Atlântico Comex & Logística Portuária",
    razaoSocial: "Atlântico Operações Aduaneiras Ltda",
    uf: "SC",
    cidade: "Itajaí",
    categoria: "Comex & Logística",
    porte: "Operador Internacional",
    regimeTributario: "Lucro Presumido",
    cnpj: "45.678.901/0001-77",
    contratoStatus: "Vigente",
    ndaStatus: "Assinado",
    slaEntrega: "3 dias úteis",
    contatoNome: "Beatriz Ramos",
    contatoEmail: "comex@atlanticoport-exemplo.com.br",
    chavePix: "45.678.901/0001-77 (CNPJ)",
    contaBancaria:
      "Santander (033) • Ag. 2214 • C/C 1300492-8 • Titular: Atlântico Operações Aduaneiras Ltda",
    itens: [
      {
        id: "ac-1",
        nome: "Desembaraço Aduaneiro & Agenciamento Container 40' HC",
        ncm: "0000.00.00",
        precoUnitario: 4250.0,
        unidade: "processo",
        pedidoMinimo: 1,
        prazoEntrega: "3 dias úteis",
      },
      {
        id: "ac-2",
        nome: "Frete Rodoviário Dedicado Porto Itajaí → CD SP",
        ncm: "0000.00.00",
        precoUnitario: 5900.0,
        unidade: "viagem",
        pedidoMinimo: 1,
        prazoEntrega: "2 dias úteis",
      },
    ],
  },
  {
    id: "hortifrut-sp",
    sigla: "HF",
    corBadge: "bg-teal-700",
    nome: "Sítio Boa Esperança — Produtor Local",
    razaoSocial: "Associação Rural Boa Esperança ME",
    uf: "SP",
    cidade: "Ibiúna",
    categoria: "Agro & Alimentos",
    porte: "Micro / Pequeno Produtor",
    regimeTributario: "Simples Nacional",
    cnpj: "56.789.012/0001-33",
    contratoStatus: "Em Homologação",
    ndaStatus: "Assinado",
    slaEntrega: "2 dias úteis",
    contatoNome: "Seu Antônio Almeida",
    contatoEmail: "boaesperanca@produtor-exemplo.com.br",
    chavePix: "56.789.012/0001-33 (CNPJ)",
    contaBancaria:
      "Sicoob (756) • Ag. 4012 • C/C 19844-0 • Titular: Associação Rural Boa Esperança ME",
    itens: [
      {
        id: "hf-1",
        nome: "Caixa Hortifrúti Selecionado (20kg) — Entrega Direta",
        ncm: "0709.99.90",
        precoUnitario: 64.0,
        unidade: "caixa",
        pedidoMinimo: 40,
        prazoEntrega: "2 dias úteis",
      },
    ],
  },
  {
    id: "sulquimica-rs",
    sigla: "SQ",
    corBadge: "bg-indigo-800",
    nome: "SulQuímica Resinas & Polímeros",
    razaoSocial: "SulQuímica Industrial Ltda",
    uf: "RS",
    cidade: "Caxias do Sul",
    categoria: "Insumos Industriais",
    porte: "Escala Industrial",
    regimeTributario: "Lucro Real",
    cnpj: "67.890.123/0001-88",
    contratoStatus: "Vigente",
    ndaStatus: "Assinado",
    slaEntrega: "6 dias úteis",
    contatoNome: "Fernanda Silveira",
    contatoEmail: "comercial@sulquimica-exemplo.com.br",
    chavePix: "67.890.123/0001-88 (CNPJ)",
    contaBancaria:
      "Banrisul (041) • Ag. 0180 • C/C 06.112890.0-5 • Titular: SulQuímica Industrial Ltda",
    itens: [
      {
        id: "sq-1",
        nome: "Resina Polietileno Alta Densidade (PEAD) — Bag 25kg",
        ncm: "3901.20.29",
        precoUnitario: 245.0,
        unidade: "bag",
        pedidoMinimo: 80,
        prazoEntrega: "6 dias úteis",
      },
    ],
  },
];

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
      ? "fabio.lizardo@atlassupply-exemplo.com.br"
      : perfil === "colaborador"
      ? COLABORADOR_RESPONSAVEL.email
      : "mariana.costa@packsul-exemplo.com.br");

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(
    FORNECEDORES_INICIAIS
  );
  const [fornecedorId, setFornecedorId] = useState<string>(
    FORNECEDORES_INICIAIS[0].id
  );

  // Filtros da carteira de fornecedores (ADM & Colaborador)
  const [buscaFornecedor, setBuscaFornecedor] = useState("");
  const [filtroUf, setFiltroUf] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");

  const fornecedorAtual = useMemo(() => {
    if (perfil === "fornecedor") {
      return fornecedores[0];
    }
    return (
      fornecedores.find((f) => f.id === fornecedorId) || fornecedores[0]
    );
  }, [perfil, fornecedores, fornecedorId]);

  const ufsDisponiveis = useMemo(() => {
    const unicos = Array.from(new Set(fornecedores.map((f) => f.uf)));
    return ["TODOS", ...unicos];
  }, [fornecedores]);

  const categoriasDisponiveis = useMemo(() => {
    const unicas = Array.from(new Set(fornecedores.map((f) => f.categoria)));
    return ["TODAS", ...unicas];
  }, [fornecedores]);

  const fornecedoresFiltrados = useMemo(() => {
    return fornecedores.filter((f) => {
      const bateUf = filtroUf === "TODOS" || f.uf === filtroUf;
      const bateCategoria =
        filtroCategoria === "TODAS" || f.categoria === filtroCategoria;
      const termo = buscaFornecedor.trim().toLowerCase();
      const bateBusca =
        !termo ||
        f.nome.toLowerCase().includes(termo) ||
        f.cidade.toLowerCase().includes(termo) ||
        f.cnpj.toLowerCase().includes(termo) ||
        f.categoria.toLowerCase().includes(termo) ||
        f.itens.some((it) => it.nome.toLowerCase().includes(termo));
      return bateUf && bateCategoria && bateBusca;
    });
  }, [fornecedores, buscaFornecedor, filtroUf, filtroCategoria]);

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

  // Sequenciadores de Requisição (REQ) e Purchase Order (PO)
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

  function alternarPerfilSimulacao(novoPerfil: PerfilOperacao) {
    const emailPorPerfil =
      novoPerfil === "adm"
        ? "fabio.lizardo@atlassupply-exemplo.com.br"
        : novoPerfil === "colaborador"
        ? COLABORADOR_RESPONSAVEL.email
        : "mariana.costa@packsul-exemplo.com.br";
    router.push(
      `/operacoes?perfil=${novoPerfil}&usuario=${encodeURIComponent(
        emailPorPerfil
      )}`
    );
  }

  function selecionarFornecedor(novoFornecedor: Fornecedor) {
    setFornecedorId(novoFornecedor.id);
    const primeiroItem = novoFornecedor.itens[0];
    setItemId(primeiroItem.id);
    setQuantidade(primeiroItem.pedidoMinimo);
    setDesconto(0);
    setComprovanteNome(null);
    setObservacoes("");
  }

  function alterarStatusContratoAdm(novoStatus: string) {
    setFornecedores((prev) =>
      prev.map((f) =>
        f.id === fornecedorAtual.id ? { ...f, contratoStatus: novoStatus } : f
      )
    );
    notificar(
      `Status contratual de ${fornecedorAtual.nome} atualizado para "${novoStatus}" pelo ADM & Owner.`
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
      setAssuntoContato("Ajuda sobre emissão de NF-e e vinculação da PO");
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

  // ETAPA 1 (Exclusiva de Colaborador & ADM): Criar Orçamento
  function handleGuardarOrcamento(e: React.FormEvent) {
    e.preventDefault();
    if (!temVisaoGlobal) return;

    const novoId = `ORC-${String(orcamentos.length + 101)}`;
    const novo: OrcamentoRegistro = {
      id: novoId,
      fornecedorId: fornecedorAtual.id,
      fornecedorNome: fornecedorAtual.nome,
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
    notificar(
      `Orçamento ${novoId} criado para ${fornecedorAtual.nome}. Agora abra a Requisição (REQ) para aprovação.`
    );
  }

  // ETAPA 2 (Exclusiva de Colaborador & ADM): Abrir Requisição de Compra (REQ)
  function gerarRequisicao(orcamento: OrcamentoRegistro) {
    if (!temVisaoGlobal) return;
    const numReq = `REQ-2026-${seqRequisicao}`;
    setSeqRequisicao((prev) => prev + 1);

    const alcada =
      orcamento.totalNf > 15000
        ? "Diretoria Executiva & Owner (Alçada Máxima)"
        : orcamento.totalNf > 5000
        ? "Gerência de Suprimentos & Controladoria"
        : "Coordenação de Compras";

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
      `Requisição ${numReq} aberta! Aprovação em andamento com ${alcada}.`
    );
  }

  // ETAPA 3 (Exclusiva de Colaborador & ADM): Aprovar e Gerar PO para o Fornecedor
  function aprovarEEmitirPO(orcamento: OrcamentoRegistro) {
    if (!temVisaoGlobal) return;
    const numPO = `PO-2026-${seqPO}`;
    setSeqPO((prev) => prev + 1);

    const aprovadorAssinatura =
      perfil === "adm"
        ? `Fabio Lizardo — ADM & Owner (${usuarioExibido})`
        : `Mesa de Compras (${usuarioExibido})`;

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
      `Requisição ${orcamento.numeroRequisicao} aprovada! PO ${numPO} emitida para o fornecedor inserir na NF-e.`
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
              motivoReprovacao:
                "Devolvido pelos responsáveis de aprovação para revisão.",
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
          ? `Mesa de Compras (${usuarioExibido})`
          : `${fornecedorAtual.contatoNome} — ${fornecedorAtual.nome}`,
      tipo: tipoContato,
      assunto: assuntoContato.trim(),
      dataReuniao:
        tipoContato === "Solicitação de Reunião" ? dataReuniao : undefined,
      conteudo: textoContato.trim(),
      criadoEm: hora,
    };

    if (perfil === "fornecedor" && tipoContato === "Contestação" && orcamentoAlvoId) {
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
        `Contestação registrada no orçamento ${orcamentoAlvoId} e enviada para o colaborador responsável.`
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
      {/* Imagem de fundo fixa exclusiva por perfil */}
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
      <div className="bg-stone-950 text-stone-200 text-xs py-2.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-bold text-amber-400">
              Atlas Supply &amp; Comércio
            </span>
            <span className="text-stone-600">•</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-semibold ${
                perfil === "adm"
                  ? "bg-amber-500 text-stone-950"
                  : perfil === "colaborador"
                  ? "bg-blue-600 text-white"
                  : "bg-emerald-500 text-slate-950"
              }`}
            >
              {perfil === "adm"
                ? "Perfil: ADM & Owner • Governança Total"
                : perfil === "colaborador"
                ? "Perfil: Colaborador (Mesa de Compras)"
                : "Perfil: Fornecedor Parceiro"}
            </span>
            <span className="text-stone-400">({usuarioExibido})</span>
          </div>

          <Link
            href="/"
            className="text-amber-300 hover:text-amber-200 font-medium transition-colors"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>

      {/* Cabeçalho principal com imagem temática de cada página */}
      <header className="relative overflow-hidden text-white py-6 px-4 sm:px-6 border-b border-white/15">
        <img
          src={tema.imagemFundo}
          alt={tema.altFundo}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
        />
        <div className={`absolute inset-0 ${tema.overlayHeader}`} />

        <div className="relative max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
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
                ? "GOVERNANÇA EXECUTIVA & OWNER • VISIBILIDADE IRRESTRITA DE TODA A REDE"
                : perfil === "colaborador"
                ? "MESA DE COMPRAS • 1. ABRE REQ → 2. APROVAÇÃO → 3. PO PARA NF-E"
                : "PORTAL DO FORNECEDOR • ORÇAMENTO, PO PARA NF-E, DOCUMENTOS & CONTESTAÇÃO"}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
              {perfil === "adm"
                ? "Painel ADM & Owner — Carteira Global, Requisições (REQ) e POs"
                : perfil === "colaborador"
                ? "Operações de Compras — Requisição (REQ), Aprovação e Emissão de PO"
                : "Portal do Fornecedor — Orçamentos, PO para NF-e e Contestação"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center bg-black/50 backdrop-blur-xs border border-white/20 rounded-lg p-1 text-[11px]">
              <button
                type="button"
                onClick={() => alternarPerfilSimulacao("adm")}
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
                onClick={() => alternarPerfilSimulacao("colaborador")}
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
                onClick={() => alternarPerfilSimulacao("fornecedor")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  perfil === "fornecedor"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                Fornecedor
              </button>
            </div>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-semibold text-white transition-colors"
            >
              ← Início
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Operacional */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Faixa Exclusiva do ADM & Owner */}
        {perfil === "adm" && (
          <section className="bg-stone-900/95 text-white rounded-2xl border border-amber-500/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500 text-stone-950">
                  Modo ADM &amp; Project Owner
                </span>
                <span className="text-xs text-stone-300">
                  Fabio Lizardo • Visibilidade total sobre{" "}
                  <strong>{fornecedores.length} fornecedores</strong> e aprovações
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Selecione qualquer fornecedor para auditar cotações, abrir REQ,
                aprovar POs e acompanhar contestações enviadas por fornecedores.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-stone-400">
                Status do contrato atual:
              </span>
              {(["Vigente", "Em Homologação", "Em Revisão"] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => alterarStatusContratoAdm(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      fornecedorAtual.contratoStatus === st
                        ? "bg-amber-500 text-stone-950"
                        : "bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </section>
        )}

        {/* Faixa de Contato com Colaborador Responsável e Botão de Ajuda para o Fornecedor */}
        {perfil === "fornecedor" && (
          <section className="bg-white/95 backdrop-blur-xs rounded-2xl border border-emerald-300 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Colaborador Responsável &amp; Suporte ao Fornecedor
              </span>
              <p className="text-sm font-bold text-slate-900">
                {COLABORADOR_RESPONSAVEL.nome}
              </p>
              <p className="text-xs text-slate-600">
                E-mail: <strong>{COLABORADOR_RESPONSAVEL.email}</strong> •
                Atendimento: <strong>{COLABORADOR_RESPONSAVEL.ramal}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                As cotações e REQs são abertas pela equipe da Atlas Supply.
                Aqui você acompanha orçamentos, POs aprovadas para emitir sua NF-e,
                documentos e pode contestar qualquer condição.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => abrirModalFornecedor("Ajuda")}
                className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                ? Ajuda / Dúvidas NF-e
              </button>
              <button
                type="button"
                onClick={() => abrirModalFornecedor("Contestação")}
                className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold cursor-pointer"
              >
                Contestar condição
              </button>
            </div>
          </section>
        )}

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

        {/* Faixa de Esteira Procure-to-Pay */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/90 p-3.5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-slate-400">
              1. Orçamentos / RFQ
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {resumoFluxo.total}
            </p>
            <p className="text-[11px] text-slate-500">
              {resumoFluxo.aguardandoReq} aguardando REQ
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-amber-200 p-3.5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-amber-700">
              2. Aprovação em Andamento
            </p>
            <p className="text-xl font-bold text-amber-900 mt-0.5">
              {resumoFluxo.emAprovacao}
            </p>
            <p className="text-[11px] text-slate-500">
              REQ passando por responsáveis
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-emerald-200 p-3.5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-emerald-700">
              3. POs Geradas p/ NF-e
            </p>
            <p className="text-xl font-bold text-emerald-800 mt-0.5">
              {resumoFluxo.poEmitida}
            </p>
            <p className="text-[11px] text-slate-500">
              Total aprovado: {formatarMoeda(resumoFluxo.valorTotalPOs)}
            </p>
          </div>

          <div className="bg-slate-900/95 text-white rounded-xl p-3.5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-amber-300">
              Próxima Numeração
            </p>
            <p className="text-xs font-semibold mt-1">
              REQ: <span className="text-white">REQ-2026-{seqRequisicao}</span>
            </p>
            <p className="text-xs font-semibold mt-0.5">
              PO: <span className="text-emerald-400">PO-2026-{seqPO}</span>
            </p>
          </div>
        </section>

        {/* Cartão Superior: Dados Fiscais, Contrato e Dados Bancários */}
        <section
          className={`bg-white/95 backdrop-blur-xs rounded-2xl border ${tema.bordaDestaque} p-5 shadow-sm space-y-4`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-[260px]">
              <div
                className={`w-12 h-12 rounded-xl ${fornecedorAtual.corBadge} text-white font-bold flex items-center justify-center text-base shrink-0`}
              >
                {fornecedorAtual.sigla}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {perfil === "adm"
                    ? "FORNECEDOR INSPECIONADO PELO ADM & OWNER"
                    : perfil === "colaborador"
                    ? "FORNECEDOR SELECIONADO NA MESA DE COMPRAS"
                    : "EMPRESA PARCEIRA LOGADA"}
                </p>

                {temVisaoGlobal ? (
                  <select
                    value={fornecedorAtual.id}
                    onChange={(e) => {
                      const achado = fornecedores.find(
                        (f) => f.id === e.target.value
                      );
                      if (achado) selecionarFornecedor(achado);
                    }}
                    className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {fornecedores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome} ({f.uf} • {f.regimeTributario})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-base sm:text-lg font-bold text-slate-900">
                    {fornecedorAtual.nome}{" "}
                    <span className="text-xs font-medium text-slate-500">
                      ({fornecedorAtual.cidade}/{fornecedorAtual.uf} •{" "}
                      {fornecedorAtual.regimeTributario})
                    </span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
                  <span>
                    CNPJ: <strong>{fornecedorAtual.cnpj}</strong>
                  </span>
                  <span>
                    Contrato: <strong>{fornecedorAtual.contratoStatus}</strong>
                  </span>
                  <span>
                    NDA: <strong>{fornecedorAtual.ndaStatus}</strong>
                  </span>
                  <span>
                    SLA de entrega:{" "}
                    <strong>{fornecedorAtual.slaEntrega}</strong>
                  </span>
                  <span>
                    Contato: <strong>{fornecedorAtual.contatoNome}</strong> (
                    {fornecedorAtual.contatoEmail})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {temVisaoGlobal ? (
                <a
                  href="#formulario-orcamento"
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Criar Orçamento / REQ
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => abrirModalFornecedor("Contestação")}
                  className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Contestar Orçamento / PO
                </button>
              )}

              <button
                type="button"
                onClick={() => abrirModalFornecedor("Mensagem")}
                className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                {perfil === "fornecedor"
                  ? "Falar com Colaborador"
                  : "Mensagem / Reunião"}{" "}
                {mensagensDoFornecedor.length > 0 &&
                  `(${mensagensDoFornecedor.length})`}
              </button>
            </div>
          </div>

          <div className="bg-slate-50/90 border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5 text-xs text-slate-700">
              <p>
                <span className="font-semibold text-slate-500">CHAVE PIX:</span>{" "}
                <strong>{fornecedorAtual.chavePix}</strong>
              </p>
              <p>
                <span className="font-semibold text-slate-500">
                  CONTA BANCÁRIA (CNPJ):
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
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                Copiar PIX
              </button>
              <button
                type="button"
                onClick={() =>
                  copiarTexto(fornecedorAtual.contaBancaria, "Conta bancária")
                }
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                Copiar Conta
              </button>
            </div>
          </div>
        </section>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUNA ESQUERDA */}
          {temVisaoGlobal ? (
            <section
              id="formulario-orcamento"
              className="lg:col-span-6 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Novo Orçamento (Cotação de Preço — RFQ)
                  </h2>
                  <p className="text-xs text-slate-500">
                    1. Guarde o orçamento → 2. Abra a REQ para aprovação → 3.
                    Emita a PO para a NF-e.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  NCM {itemSelecionado.ncm}
                </span>
              </div>

              <form onSubmit={handleGuardarOrcamento} className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    ITEM OFERTADO PARA A EMPRESA
                  </label>
                  <select
                    value={itemSelecionado.id}
                    onChange={(e) => handleTrocarItem(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {fornecedorAtual.itens.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.nome} — Ofertado: {formatarMoeda(it.precoUnitario)}{" "}
                        (por {it.unidade})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-600">
                    Pedido mínimo:{" "}
                    <strong>
                      {itemSelecionado.pedidoMinimo.toLocaleString("pt-BR")}{" "}
                      {itemSelecionado.unidade}
                    </strong>{" "}
                    • Prazo: <strong>{itemSelecionado.prazoEntrega}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      QUANTIDADE
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      DESCONTO (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={desconto}
                      onChange={(e) => setDesconto(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      MODALIDADE
                    </label>
                    <select
                      value={modalidade}
                      onChange={(e) => setModalidade(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>Compra Spot / Lote Único</option>
                      <option>Contrato</option>
                      <option>Programação Mensal</option>
                      <option>Operação Comex (FOB / CIF)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      PRAZO / FORMA PAGAMENTO
                    </label>
                    <select
                      value={prazoPagamento}
                      onChange={(e) => setPrazoPagamento(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>À vista (PIX / TED)</option>
                      <option>15 dias</option>
                      <option>30 dias</option>
                      <option>30 / 60 dias</option>
                      <option>Carta de Crédito (Comex)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-900">
                      COMPROVANTE / DOCUMENTO DO ORÇAMENTO (PDF / IMAGEM)
                    </span>
                    <span className="text-[11px] text-slate-600">
                      PIX: {fornecedorAtual.chavePix}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition-colors">
                      Escolher arquivo
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setComprovanteNome(file ? file.name : null);
                        }}
                      />
                    </label>
                    <span className="text-xs text-slate-600">
                      {comprovanteNome || "Nenhum arquivo escolhido"}
                    </span>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={enviarEmailAuto}
                      onChange={(e) => setEnviarEmailAuto(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300"
                    />
                    <span>
                      Compartilhar documento automaticamente com o fornecedor (
                      <strong>{fornecedorAtual.contatoEmail}</strong>)
                    </span>
                  </label>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      COMPOSIÇÃO TRIBUTÁRIA (BRASIL)
                    </span>
                    <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setModoImposto("por_fora")}
                        className={`px-2.5 py-1 font-semibold cursor-pointer ${
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
                        className={`px-2.5 py-1 font-semibold cursor-pointer ${
                          modoImposto === "incluso"
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        Impostos inclusos
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        ICMS (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={icms}
                        onChange={(e) => setIcms(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
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
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
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
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
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
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
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
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    OBSERVAÇÕES FISCAIS / ENTREGA
                  </label>
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex.: Vincular ao contrato vigente, destacar ICMS/IPI na NF-e e confirmar janela de descarga..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="bg-slate-950 text-white rounded-xl p-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>
                      Subtotal dos itens ({quantidade} {itemSelecionado.unidade}):
                    </span>
                    <span className="font-semibold text-white">
                      {formatarMoeda(calculos.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Carga tributária calculada:</span>
                    <span>{formatarMoeda(calculos.cargaTributaria)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>
                      Crédito tributário estimado (
                      {fornecedorAtual.regimeTributario}):
                    </span>
                    <span>- {formatarMoeda(calculos.creditoEstimado)}</span>
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-800 flex items-baseline justify-between">
                    <span className="text-sm font-bold">
                      Total da Nota Fiscal (NF):
                    </span>
                    <span className="text-xl font-bold text-emerald-400">
                      {formatarMoeda(calculos.totalNf)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Custo líquido efetivo (descontando créditos):</span>
                    <span>{formatarMoeda(calculos.custoLiquido)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  Guardar Orçamento com Impostos
                </button>
              </form>
            </section>
          ) : (
            /* COLUNA ESQUERDA DO FORNECEDOR: Documentos, Contato do Colaborador, Ajuda e Contestação */
            <section className="lg:col-span-5 bg-white/95 backdrop-blur-xs rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  Visão Restrita do Fornecedor
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Documentos, Contato e Contestação
                </h2>
                <p className="text-xs text-slate-500">
                  A abertura de REQ e aprovação de PO são feitas pela equipe da
                  Atlas Supply. Aqui você consulta documentos, fala com o
                  colaborador ou contesta condições.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-500">
                  Contato do Colaborador Responsável
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {COLABORADOR_RESPONSAVEL.nome}
                </p>
                <p className="text-slate-600">
                  E-mail: <strong>{COLABORADOR_RESPONSAVEL.email}</strong>
                </p>
                <p className="text-slate-600">
                  Telefone: <strong>{COLABORADOR_RESPONSAVEL.ramal}</strong>
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copiarTexto(
                        COLABORADOR_RESPONSAVEL.email,
                        "E-mail do colaborador"
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    Copiar e-mail
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirModalFornecedor("Mensagem")}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-bold text-emerald-950">
                  Como inserir a PO na Nota Fiscal (NF-e)?
                </p>
                <p className="text-emerald-900 leading-relaxed">
                  Quando um orçamento for aprovado, o número{" "}
                  <strong>PO-2026-XXXX</strong> aparecerá ao lado no card do
                  pedido. Informe esse número no campo de pedido/observações da
                  sua NF-e antes do faturamento.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => abrirModalFornecedor("Ajuda")}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100/60 text-emerald-950 font-semibold cursor-pointer"
                  >
                    Central de Ajuda
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirModalFornecedor("Contestação")}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer"
                  >
                    Contestar divergência
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-800">
                  Documentos &amp; Comprovantes Vinculados
                </p>
                {orcamentosVisiveis.filter((o) => o.comprovanteNome).length ===
                0 ? (
                  <p className="text-xs text-slate-500">
                    Nenhum documento/comprovante anexado nos registros atuais.
                  </p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {orcamentosVisiveis
                      .filter((o) => o.comprovanteNome)
                      .map((o) => (
                        <li
                          key={o.id}
                          className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                        >
                          <span className="font-semibold text-slate-800">
                            {o.comprovanteNome}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Ref.: {o.id}
                            {o.numeroPO ? ` • ${o.numeroPO}` : ""}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {/* COLUNA DIREITA */}
          <div
            className={`${
              temVisaoGlobal ? "lg:col-span-6" : "lg:col-span-7"
            } space-y-6`}
          >
            {temVisaoGlobal && (
              <section className="bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                      {perfil === "adm"
                        ? "Carteira Completa • Governança ADM & Owner"
                        : "Visibilidade Completa • Mesa de Compras"}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                      Base de Fornecedores por Região e Segmento
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {fornecedoresFiltrados.length} de {fornecedores.length}{" "}
                    exibidos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <input
                    type="text"
                    value={buscaFornecedor}
                    onChange={(e) => setBuscaFornecedor(e.target.value)}
                    placeholder="Buscar fornecedor, cidade, CNPJ ou item..."
                    className="sm:col-span-7 rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="sm:col-span-5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {categoriasDisponiveis.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "TODAS" ? "Todos os segmentos" : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">
                    Região (UF):
                  </span>
                  {ufsDisponiveis.map((uf) => (
                    <button
                      key={uf}
                      type="button"
                      onClick={() => setFiltroUf(uf)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                        filtroUf === uf
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {uf === "TODOS" ? "Todos os estados" : uf}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {fornecedoresFiltrados.length === 0 ? (
                    <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-xs text-slate-500">
                      Nenhum fornecedor encontrado para esse filtro.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setBuscaFornecedor("");
                          setFiltroUf("TODOS");
                          setFiltroCategoria("TODAS");
                        }}
                        className="text-blue-600 font-semibold underline cursor-pointer"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  ) : (
                    fornecedoresFiltrados.map((f) => {
                      const selecionado = f.id === fornecedorAtual.id;
                      return (
                        <div
                          key={f.id}
                          onClick={() => selecionarFornecedor(f)}
                          className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                            selecionado
                              ? "border-blue-600 bg-blue-50/70 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg ${f.corBadge} text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5`}
                              >
                                {f.sigla}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h3 className="text-sm font-bold text-slate-900">
                                    {f.nome}
                                  </h3>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                                    {f.uf}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {f.cidade}/{f.uf} • {f.categoria} •{" "}
                                  {f.regimeTributario}
                                </p>
                                <p className="text-[11px] text-slate-600 mt-1">
                                  Principal item:{" "}
                                  <strong>{f.itens[0].nome}</strong> (
                                  {formatarMoeda(f.itens[0].precoUnitario)})
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 space-y-1">
                              <span
                                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  f.contratoStatus === "Vigente"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {f.contratoStatus}
                              </span>
                              <p className="text-[11px] font-semibold text-blue-700">
                                {selecionado
                                  ? "● Selecionado"
                                  : "Selecionar →"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {/* ESTEIRA DE ORÇAMENTO -> REQUISIÇÃO (REQ) -> APROVAÇÃO -> PO */}
            <section className="bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                    {temVisaoGlobal
                      ? "Esteira de Aprovação & Pedidos"
                      : "Meus Orçamentos, Requisições e POs para NF-e"}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    {temVisaoGlobal
                      ? `Orçamentos, Requisições (REQ) e POs (${orcamentosVisiveis.length})`
                      : `Orçamentos e POs Emitidas (${orcamentosVisiveis.length})`}
                  </h2>
                </div>

                {temVisaoGlobal && (
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setEscopoLista("este")}
                      className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                        escopoLista === "este"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600"
                      }`}
                    >
                      Este fornecedor
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscopoLista("todos")}
                      className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                        escopoLista === "todos"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600"
                      }`}
                    >
                      Todos ({orcamentos.length})
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
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
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
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2 bg-slate-50/70">
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {temVisaoGlobal
                      ? "Nenhum orçamento registrado nesta visão ainda. Crie um orçamento ao lado, abra a REQ para aprovação e emita a PO."
                      : "Nenhum orçamento ou PO registrado para a sua conta ainda. Assim que o colaborador da Atlas Supply emitir, aparecerá aqui."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orcamentosVisiveis.map((orc) => (
                    <div
                      key={orc.id}
                      className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                              {orc.id}
                            </span>

                            {orc.numeroRequisicao && (
                              <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                                {orc.numeroRequisicao}
                              </span>
                            )}

                            {orc.numeroPO && (
                              <span className="text-xs font-bold text-emerald-950 bg-emerald-200 border border-emerald-400 px-2 py-0.5 rounded">
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

                          <p className="text-sm font-bold text-slate-900 pt-0.5">
                            {orc.fornecedorNome}
                          </p>
                          <p className="text-xs text-slate-600">
                            {orc.itemNome} • Qtd:{" "}
                            <strong>{orc.quantidade}</strong> •{" "}
                            {orc.modalidade} ({orc.prazoPagamento})
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Aberto por: {orc.origem} • {orc.criadoEm}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-bold text-emerald-700">
                            {formatarMoeda(orc.totalNf)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Impostos: {formatarMoeda(orc.cargaTributaria)}
                          </p>
                        </div>
                      </div>

                      {/* Barra das 3 Etapas */}
                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        <div className="rounded-lg px-2.5 py-1.5 bg-slate-900 text-white font-semibold">
                          ✓ 1. {orc.id}
                        </div>
                        <div
                          className={`rounded-lg px-2.5 py-1.5 font-semibold ${
                            orc.numeroRequisicao
                              ? "bg-amber-100 text-amber-950 border border-amber-300"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {orc.numeroRequisicao
                            ? `2. ${orc.numeroRequisicao}`
                            : "2. REQ pendente"}
                        </div>
                        <div
                          className={`rounded-lg px-2.5 py-1.5 font-semibold ${
                            orc.numeroPO
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {orc.numeroPO
                            ? `✓ 3. ${orc.numeroPO}`
                            : "3. PO pendente"}
                        </div>
                      </div>

                      {orc.alcadaAprovacao && (
                        <div className="bg-amber-50/80 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-950 space-y-0.5">
                          <p>
                            <strong>Requisição {orc.numeroRequisicao}:</strong>{" "}
                            Aprovação em andamento • Responsáveis:{" "}
                            <strong>{orc.alcadaAprovacao}</strong>
                          </p>
                          {orc.requisicaoGeradaEm && (
                            <p className="text-[11px] text-amber-800">
                              Aberta em {orc.requisicaoGeradaEm}
                            </p>
                          )}
                        </div>
                      )}

                      {orc.numeroPO && (
                        <div className="bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2 text-xs text-emerald-950 space-y-0.5">
                          <p>
                            <strong>PO Gerada:</strong>{" "}
                            <span className="font-bold">{orc.numeroPO}</span> •{" "}
                            <span className="font-semibold text-emerald-800">
                              Pronta para inserir na NF-e emitida
                            </span>
                          </p>
                          <p className="text-[11px] text-emerald-800">
                            Aprovada por {orc.aprovadoPor} em {orc.poEmitidaEm}
                          </p>
                        </div>
                      )}

                      {orc.contestacaoFornecedor && (
                        <div className="bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 text-xs text-amber-950 space-y-0.5">
                          <p className="font-bold">
                            Contestação do Fornecedor:{" "}
                            {orc.contestacaoFornecedor.motivo}
                          </p>
                          <p>{orc.contestacaoFornecedor.detalhes}</p>
                          <p className="text-[11px] text-amber-800">
                            Registrada em {orc.contestacaoFornecedor.registradoEm}
                          </p>
                        </div>
                      )}

                      {orc.motivoReprovacao && (
                        <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
                          {orc.motivoReprovacao}
                        </p>
                      )}

                      {orc.comprovanteNome && (
                        <p className="text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                          Documento: <strong>{orc.comprovanteNome}</strong>
                        </p>
                      )}

                      {orc.observacoes && (
                        <p className="text-xs text-slate-600 italic">
                          “{orc.observacoes}”
                        </p>
                      )}

                      {/* Ações do Colaborador & ADM */}
                      {temVisaoGlobal && (
                        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {(orc.etapaFluxo === "Orcamento Criado" ||
                              orc.etapaFluxo === "Reprovado") && (
                              <button
                                type="button"
                                onClick={() => gerarRequisicao(orc)}
                                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                1. Abrir REQ para Aprovação →
                              </button>
                            )}

                            {orc.etapaFluxo === "Em Aprovacao (REQ)" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => aprovarEEmitirPO(orc)}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                                >
                                  ✓ Aprovar &amp; Gerar PO
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reprovarRequisicao(orc)}
                                  className="px-3.5 py-1.5 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Devolver / Reprovar
                                </button>
                              </>
                            )}

                            {orc.etapaFluxo === "PO Emitida (Aprovado)" &&
                              orc.numeroPO && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copiarTexto(
                                      `${orc.numeroPO} (${orc.numeroRequisicao} / ${orc.id})`,
                                      "Número da PO"
                                    )
                                  }
                                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Copiar Nº da PO ({orc.numeroPO})
                                </button>
                              )}
                          </div>

                          <button
                            type="button"
                            onClick={() => cancelarOuReabrir(orc)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline cursor-pointer"
                          >
                            {orc.etapaFluxo === "Cancelado"
                              ? "Reabrir processo"
                              : "Cancelar"}
                          </button>
                        </div>
                      )}

                      {/* Ações do Fornecedor: Copiar PO para NF-e e Contestar */}
                      {perfil === "fornecedor" && (
                        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
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
                              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold cursor-pointer"
                            >
                              Contestar este orçamento
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
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
                    ? "Central de Ajuda ao Fornecedor"
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
                  placeholder={
                    perfil === "fornecedor"
                      ? "Ex.: Divergência no prazo de pagamento ou alíquota de imposto"
                      : "Ex.: Liberação de PO e janela de entrega"
                  }
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
                  placeholder="Escreva o motivo da contestação, dúvida de NF-e ou alinhamento..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Registrar envio (simulação)
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
                        Sugestão de agenda: {m.dataReuniao}
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