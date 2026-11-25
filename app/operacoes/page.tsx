"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface ItemOfertado {
  nome: string;
  tipo: "Produto" | "Serviço";
  valorOfertado: number;
  unidade: string;
  prazoServico: string;
  pedidoMinimo: string;
  ncmOuCodigo: string;
  icmsPadrao: number;
  ipiPadrao: number;
  pisCofinsPadrao: number;
  issPadrao: number;
}

interface FornecedorResumo {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  estado: string;
  regimeTributario: "Lucro Real" | "Lucro Presumido" | "Simples Nacional";
  categoria: string;
  contatoComercial: string;
  emailComercial: string;
  chavePix: string;
  contaBancaria: string;
  prazoPagamentoPadrao:
    | "30 dias"
    | "45 dias"
    | "60 dias"
    | "Imediato"
    | "Transferência Bancária"
    | "Parcelado";
  pedidoMinimoGeral: string;
  tempoServico: string;
  ndaStatus: "Assinado" | "Pendente";
  contratoStatus: "Vigente" | "Pendente";
  itensOfertados: ItemOfertado[];
}

interface OrcamentoCriado {
  id: string;
  statusPedido: "Ativo" | "Cancelado";
  canceladoEm?: string;
  fornecedorId: string;
  fornecedorNome: string;
  categoriaFornecedor?: string;
  cnpjFornecedor: string;
  emailDestino: string;
  chavePix: string;
  contaBancaria: string;
  regimeTributario: string;
  itemNome: string;
  ncmOuCodigo: string;
  quantidade: number;
  descontoPercentual: number;
  pedidoMinimoTexto: string;
  abaixoDoMinimo: boolean;
  evidenciaMinimoNome: string | null;
  evidenciaMinimoUrl: string | null;
  subtotalMercadoria: number;
  modalidadeImposto: "inclusos" | "por_fora";
  aliquotas: {
    icms: number;
    ipi: number;
    pisCofins: number;
    iss: number;
    difalSt: number;
  };
  resumoImpostos: string;
  totalImpostos: number;
  creditoTributarioEstimado: number;
  valorTotalNota: number;
  custoLiquidoEfetivo: number;
  modalidadeCompra: "Pedido Avulso" | "Contrato";
  prazoPagamento: string;
  comprovanteNome: string | null;
  comprovanteTamanhoKb: number | null;
  comprovanteUrl: string | null;
  envioAutomaticoAtivo: boolean;
  statusEnvioComprovante:
    | "Enviado automaticamente ao fornecedor"
    | "Comprovante anexado (aguardando envio)"
    | "Sem comprovante anexado";
  observacoes: string;
  criadoEm: string;
}

interface RegistroContato {
  id: string;
  tipo: "Mensagem" | "Reunião";
  etapaProcesso: string;
  fornecedorNome: string;
  destinatario: string;
  emailDestino: string;
  assuntoOuData: string;
  detalhes: string;
  criadoEm: string;
}

const PRAZOS_PAGAMENTO_OPCOES = [
  "30 dias",
  "45 dias",
  "60 dias",
  "Imediato",
  "Transferência Bancária",
  "Parcelado",
] as const;

const STORAGE_KEY_ORCAMENTOS = "portal_compras_orcamentos_v1";
const STORAGE_KEY_CONTATOS = "portal_compras_contatos_v1";

const FORNECEDORES_OP: FornecedorResumo[] = [
  {
    id: "1",
    nomeFantasia: "PackSul Embalagens Industriais",
    cnpj: "12.345.678/0001-90",
    estado: "SP",
    regimeTributario: "Lucro Real",
    categoria: "Embalagens",
    contatoComercial: "Mariana Costa (Executiva de Contas)",
    emailComercial: "mariana.costa@packsul-exemplo.com.br",
    chavePix: "12.345.678/0001-90 (CNPJ)",
    contaBancaria:
      "Banco Itaú (341) • Ag. 0421 • C/C 78412-9 • Titular: PackSul Embalagens Ltda (CNPJ 12.345.678/0001-90)",
    prazoPagamentoPadrao: "30 dias",
    pedidoMinimoGeral: "R$ 2.500,00 / 1.000 un.",
    tempoServico: "5 dias úteis (SLA de entrega)",
    ndaStatus: "Assinado",
    contratoStatus: "Vigente",
    itensOfertados: [
      {
        nome: "Caixa Papelão Ondulado ON2 (60x40x40cm)",
        tipo: "Produto",
        valorOfertado: 6.8,
        unidade: "por unidade",
        prazoServico: "5 dias úteis",
        pedidoMinimo: "1.000 unidades",
        ncmOuCodigo: "NCM 4819.10.00",
        icmsPadrao: 18,
        ipiPadrao: 5,
        pisCofinsPadrao: 9.25,
        issPadrao: 0,
      },
      {
        nome: "Desenvolvimento de Embalagem Sob Medida + Protótipo",
        tipo: "Serviço",
        valorOfertado: 1250.0,
        unidade: "por projeto",
        prazoServico: "7 dias úteis",
        pedidoMinimo: "1 projeto",
        ncmOuCodigo: "LC 116 - Item 23.01",
        icmsPadrao: 0,
        ipiPadrao: 0,
        pisCofinsPadrao: 9.25,
        issPadrao: 5,
      },
    ],
  },
  {
    id: "2",
    nomeFantasia: "Cartonagem Vale Verde",
    cnpj: "23.456.789/0001-12",
    estado: "SP",
    regimeTributario: "Simples Nacional",
    categoria: "Embalagens",
    contatoComercial: "Lucas Ferreira (Comercial)",
    emailComercial: "lucas.ferreira@valeverdepack-exemplo.com.br",
    chavePix: "financeiro@valeverdepack-exemplo.com.br",
    contaBancaria:
      "Banco do Brasil (001) • Ag. 1620-4 • C/C 34910-2 • Titular: Cartonagem Vale Verde ME (CNPJ 23.456.789/0001-12)",
    prazoPagamentoPadrao: "30 dias",
    pedidoMinimoGeral: "R$ 1.200,00 / 500 un.",
    tempoServico: "4 dias úteis (SLA de entrega)",
    ndaStatus: "Pendente",
    contratoStatus: "Pendente",
    itensOfertados: [
      {
        nome: "Caixa Papelão Ondulado ON2 (60x40x40cm)",
        tipo: "Produto",
        valorOfertado: 6.15,
        unidade: "por unidade",
        prazoServico: "4 dias úteis",
        pedidoMinimo: "500 unidades",
        ncmOuCodigo: "NCM 4819.10.00",
        icmsPadrao: 3.5,
        ipiPadrao: 0,
        pisCofinsPadrao: 0,
        issPadrao: 0,
      },
      {
        nome: "Impressão Flexográfica 2 Cores",
        tipo: "Serviço",
        valorOfertado: 0.45,
        unidade: "adicional por caixa",
        prazoServico: "3 dias úteis",
        pedidoMinimo: "500 unidades",
        ncmOuCodigo: "LC 116 - Item 13.05",
        icmsPadrao: 0,
        ipiPadrao: 0,
        pisCofinsPadrao: 0,
        issPadrao: 2,
      },
    ],
  },
  {
    id: "3",
    nomeFantasia: "TransRápido Logística Refrigerada",
    cnpj: "34.567.890/0001-34",
    estado: "PR",
    regimeTributario: "Lucro Real",
    categoria: "Logística & Transporte",
    contatoComercial: "André Martins (Gerente Comercial)",
    emailComercial: "andre.martins@transrapido-exemplo.com.br",
    chavePix: "34.567.890/0001-34 (CNPJ)",
    contaBancaria:
      "Bradesco (237) • Ag. 2891 • C/C 99120-4 • Titular: TransRápido Logística S.A. (CNPJ 34.567.890/0001-34)",
    prazoPagamentoPadrao: "30 dias",
    pedidoMinimoGeral: "1 rota ou 10 posições/mês",
    tempoServico: "48h (Coleta e trânsito)",
    ndaStatus: "Assinado",
    contratoStatus: "Vigente",
    itensOfertados: [
      {
        nome: "Frete Fracionado Refrigerado (até 500 kg - SP/PR)",
        tipo: "Serviço",
        valorOfertado: 890.0,
        unidade: "por rota/embarque",
        prazoServico: "2 dias úteis",
        pedidoMinimo: "1 embarque",
        ncmOuCodigo: "CT-e Interestadual",
        icmsPadrao: 12,
        ipiPadrao: 0,
        pisCofinsPadrao: 9.25,
        issPadrao: 0,
      },
      {
        nome: "Armazenagem Climatizada (2°C a 8°C)",
        tipo: "Serviço",
        valorOfertado: 145.0,
        unidade: "por posição/mês",
        prazoServico: "Imediato",
        pedidoMinimo: "10 posições",
        ncmOuCodigo: "LC 116 - Item 11.04",
        icmsPadrao: 0,
        ipiPadrao: 0,
        pisCofinsPadrao: 9.25,
        issPadrao: 5,
      },
    ],
  },
  {
    id: "4",
    nomeFantasia: "Usinagem Precisão Metal",
    cnpj: "45.678.901/0001-56",
    estado: "SC",
    regimeTributario: "Lucro Presumido",
    categoria: "Matéria-Prima & Usinagem",
    contatoComercial: "Ricardo Weber (Diretor Técnico)",
    emailComercial: "comercial@precisaometal-exemplo.com.br",
    chavePix: "pix@precisaometal-exemplo.com.br",
    contaBancaria:
      "Santander (033) • Ag. 3104 • C/C 13004521-8 • Titular: Usinagem Precisão Metal Ltda (CNPJ 45.678.901/0001-56)",
    prazoPagamentoPadrao: "30 dias",
    pedidoMinimoGeral: "R$ 800,00 por lote",
    tempoServico: "6 dias úteis (Usinagem)",
    ndaStatus: "Assinado",
    contratoStatus: "Pendente",
    itensOfertados: [
      {
        nome: "Bucha / Eixo em Aço Inox 304 (Usinagem CNC)",
        tipo: "Produto",
        valorOfertado: 78.0,
        unidade: "por peça",
        prazoServico: "8 dias úteis",
        pedidoMinimo: "15 peças",
        ncmOuCodigo: "NCM 7307.29.00",
        icmsPadrao: 12,
        ipiPadrao: 6.5,
        pisCofinsPadrao: 3.65,
        issPadrao: 0,
      },
      {
        nome: "Hora Máquina Torno CNC / Centro de Usinagem",
        tipo: "Serviço",
        valorOfertado: 210.0,
        unidade: "por hora técnica",
        prazoServico: "5 dias úteis",
        pedidoMinimo: "4 horas",
        ncmOuCodigo: "LC 116 - Item 14.05",
        icmsPadrao: 0,
        ipiPadrao: 0,
        pisCofinsPadrao: 3.65,
        issPadrao: 3,
      },
    ],
  },
  {
    id: "5",
    nomeFantasia: "EcoBox Embalagens Flexíveis",
    cnpj: "56.789.012/0001-78",
    estado: "SP",
    regimeTributario: "Lucro Real",
    categoria: "Embalagens",
    contatoComercial: "Camila Rocha (Key Account)",
    emailComercial: "camila.rocha@ecobox-exemplo.com.br",
    chavePix: "56.789.012/0001-78 (CNPJ)",
    contaBancaria:
      "Banco Itaú (341) • Ag. 0892 • C/C 55219-0 • Titular: EcoBox Embalagens Flexíveis Ltda (CNPJ 56.789.012/0001-78)",
    prazoPagamentoPadrao: "45 dias",
    pedidoMinimoGeral: "R$ 1.500,00 / 25 bobinas",
    tempoServico: "3 dias úteis (Pronta entrega)",
    ndaStatus: "Assinado",
    contratoStatus: "Vigente",
    itensOfertados: [
      {
        nome: "Caixa Papelão Ondulado ON2 (60x40x40cm)",
        tipo: "Produto",
        valorOfertado: 6.45,
        unidade: "por unidade",
        prazoServico: "3 dias úteis",
        pedidoMinimo: "800 unidades",
        ncmOuCodigo: "NCM 4819.10.00",
        icmsPadrao: 18,
        ipiPadrao: 5,
        pisCofinsPadrao: 9.25,
        issPadrao: 0,
      },
      {
        nome: "Bobina Filme Stretch 500mm x 25 micra",
        tipo: "Produto",
        valorOfertado: 64.9,
        unidade: "por bobina",
        prazoServico: "3 dias úteis",
        pedidoMinimo: "25 bobinas",
        ncmOuCodigo: "NCM 3920.10.99",
        icmsPadrao: 18,
        ipiPadrao: 9.75,
        pisCofinsPadrao: 9.25,
        issPadrao: 0,
      },
    ],
  },
  {
    id: "6",
    nomeFantasia: "NuvemSegura TI & Infraestrutura",
    cnpj: "67.890.123/0001-91",
    estado: "SP",
    regimeTributario: "Lucro Presumido",
    categoria: "TI & Cloud",
    contatoComercial: "Felipe Andrade (Account Executive)",
    emailComercial: "felipe.andrade@nuvemsegura-exemplo.com.br",
    chavePix: "67.890.123/0001-91 (CNPJ)",
    contaBancaria:
      "BTG Pactual (208) • Ag. 0050 • C/C 0049182-1 • Titular: NuvemSegura TI Ltda (CNPJ 67.890.123/0001-91)",
    prazoPagamentoPadrao: "30 dias",
    pedidoMinimoGeral: "Contrato mensal (1 mês)",
    tempoServico: "Ativação em 48h (SLA 99,9%)",
    ndaStatus: "Assinado",
    contratoStatus: "Vigente",
    itensOfertados: [
      {
        nome: "Monitoramento de Servidores & Cloud (Plano Essencial)",
        tipo: "Serviço",
        valorOfertado: 2890.0,
        unidade: "por mês",
        prazoServico: "Ativação em 48h",
        pedidoMinimo: "1 mês",
        ncmOuCodigo: "LC 116 - Item 01.07",
        icmsPadrao: 0,
        ipiPadrao: 0,
        pisCofinsPadrao: 3.65,
        issPadrao: 2.9,
      },
      {
        nome: "Auditoria de Segurança & Backup em Nuvem",
        tipo: "Serviço",
        valorOfertado: 4500.0,
        unidade: "por pacote",
        prazoServico: "10 dias úteis",
        pedidoMinimo: "1 auditoria",
        ncmOuCodigo: "LC 116 - Item 01.06",
        icmsPadrao: 0,
        ipiPadrao: 0,
        pisCofinsPadrao: 3.65,
        issPadrao: 2.9,
      },
    ],
  },
  {
    id: "7",
    nomeFantasia: "ProGuard EPIs & Segurança",
    cnpj: "78.901.234/0001-05",
    estado: "MG",
    regimeTributario: "Lucro Presumido",
    categoria: "EPIs & Segurança do Trabalho",
    contatoComercial: "Priscila Gomes (Vendas Corporativas)",
    emailComercial: "priscila.gomes@proguardepi-exemplo.com.br",
    chavePix: "pagamentos@proguardepi-exemplo.com.br",
    contaBancaria:
      "Caixa Econômica (104) • Ag. 0118 • C/C 0004821-7 • Titular: ProGuard EPIs Ltda (CNPJ 78.901.234/0001-05)",
    prazoPagamentoPadrao: "30 dias",
    pedidoMinimoGeral: "R$ 900,00 por pedido",
    tempoServico: "2 dias úteis (Expedição)",
    ndaStatus: "Pendente",
    contratoStatus: "Pendente",
    itensOfertados: [
      {
        nome: "Bota de Segurança Bico Composite CA Ativo",
        tipo: "Produto",
        valorOfertado: 89.9,
        unidade: "por par",
        prazoServico: "3 dias úteis",
        pedidoMinimo: "10 pares",
        ncmOuCodigo: "NCM 6403.40.00",
        icmsPadrao: 12,
        ipiPadrao: 0,
        pisCofinsPadrao: 3.65,
        issPadrao: 0,
      },
      {
        nome: "Luva Pigmentada / Nitrílica (Pacote 12 pares)",
        tipo: "Produto",
        valorOfertado: 54.0,
        unidade: "por pacote",
        prazoServico: "2 dias úteis",
        pedidoMinimo: "15 pacotes",
        ncmOuCodigo: "NCM 4015.19.00",
        icmsPadrao: 12,
        ipiPadrao: 3.25,
        pisCofinsPadrao: 3.65,
        issPadrao: 0,
      },
    ],
  },
];

function extrairNumeroPedidoMinimo(texto: string): number | null {
  const match = texto.replace(/\./g, "").match(/\d+/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function obterIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0] || ""}${partes[1][0] || ""}`.toUpperCase();
}

function MiniaturaCategoriaSvg({ categoria }: { categoria: string }) {
  if (categoria === "Embalagens") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 p-2 shrink-0"
        aria-hidden="true"
      >
        <polygon points="32,8 54,19 32,30 10,19" fill="#F59E0B" />
        <polygon points="10,19 32,30 32,54 10,43" fill="#D97706" />
        <polygon points="54,19 32,30 32,54 54,43" fill="#B45309" />
        <line
          x1="21"
          y1="13.5"
          x2="43"
          y2="24.5"
          stroke="#FEF3C7"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  if (categoria === "Logística & Transporte") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 p-2 shrink-0"
        aria-hidden="true"
      >
        <rect x="8" y="18" width="32" height="24" rx="4" fill="#0284C7" />
        <path d="M40 24h10l6 8v10H40V24z" fill="#38BDF8" />
        <circle cx="18" cy="45" r="5" fill="#0F172A" />
        <circle cx="48" cy="45" r="5" fill="#0F172A" />
      </svg>
    );
  }

  if (categoria === "Matéria-Prima & Usinagem") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 p-2 shrink-0"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="18"
          fill="none"
          stroke="#475569"
          strokeWidth="6"
          strokeDasharray="8 4"
        />
        <circle
          cx="32"
          cy="32"
          r="8"
          fill="#94A3B8"
          stroke="#1E293B"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  if (categoria === "TI & Cloud") {
    return (
      <svg
        viewBox="0 0 64 64"
        className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 p-2 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M20 44h26a10 10 0 0 0 1-19.9A14 14 0 0 0 20 28a9 9 0 0 0 0 16z"
          fill="#4F46E5"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 p-2 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M32 10L48 17v13c0 11-6.8 20.4-16 24-9.2-3.6-16-13-16-24V17l16-7z"
        fill="#10B981"
      />
      <path
        d="M25 32l5 5 9-10"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EstadoVazioIlustracao({ mensagem }: { mensagem: string }) {
  return (
    <div className="py-8 px-4 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2.5">
      <svg
        viewBox="0 0 80 80"
        className="w-16 h-16 mx-auto"
        aria-hidden="true"
      >
        <rect
          x="18"
          y="12"
          width="44"
          height="56"
          rx="6"
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth="2"
        />
        <line
          x1="26"
          y1="26"
          x2="54"
          y2="26"
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="36"
          x2="48"
          y2="36"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="46"
          x2="42"
          y2="46"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="54" cy="54" r="10" fill="#10B981" />
        <path
          d="M50 54h8M54 50v8"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{mensagem}</p>
    </div>
  );
}

function OperacoesConteudo() {
  const searchParams = useSearchParams();
  const perfilParam = searchParams.get("perfil");
  const usuarioParam = searchParams.get("usuario");
  const inicialId = searchParams.get("fornecedorId") || FORNECEDORES_OP[0].id;
  const inicialAba =
    searchParams.get("aba") === "contato" ? "contato" : "orcamento";
  const itemInicial = Number(searchParams.get("itemIdx") || "0");

  const comprovanteInputRef = useRef<HTMLInputElement | null>(null);
  const evidenciaInputRef = useRef<HTMLInputElement | null>(null);

  const [abaAtiva, setAbaAtiva] = useState<"orcamento" | "contato">(
    inicialAba
  );
  const [fornecedorId, setFornecedorId] = useState<string>(inicialId);

  const fornecedorAtual =
    FORNECEDORES_OP.find((f) => f.id === fornecedorId) || FORNECEDORES_OP[0];

  const [itemIndex, setItemIndex] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1000);
  const [descontoPercentual, setDescontoPercentual] = useState<number>(0);
  const [modalidadeCompra, setModalidadeCompra] = useState<
    "Pedido Avulso" | "Contrato"
  >(fornecedorAtual.contratoStatus === "Vigente" ? "Contrato" : "Pedido Avulso");
  const [prazoPagamento, setPrazoPagamento] = useState<string>(
    fornecedorAtual.prazoPagamentoPadrao
  );
  const [observacoesOrc, setObservacoesOrc] = useState<string>("");

  const [evidenciaArquivo, setEvidenciaArquivo] = useState<File | null>(null);
  const [evidenciaUrlPreview, setEvidenciaUrlPreview] = useState<string | null>(
    null
  );

  const [comprovanteArquivo, setComprovanteArquivo] = useState<File | null>(
    null
  );
  const [comprovanteUrlPreview, setComprovanteUrlPreview] = useState<
    string | null
  >(null);
  const [envioAutomaticoComprovante, setEnvioAutomaticoComprovante] =
    useState<boolean>(true);
  const [avisoStatus, setAvisoStatus] = useState<{
    tipo: "sucesso" | "alerta";
    texto: string;
  } | null>(null);

  const [modalidadeImposto, setModalidadeImposto] = useState<
    "inclusos" | "por_fora"
  >("por_fora");
  const [aliquotaIcms, setAliquotaIcms] = useState<number>(
    fornecedorAtual.itensOfertados[0].icmsPadrao
  );
  const [aliquotaIpi, setAliquotaIpi] = useState<number>(
    fornecedorAtual.itensOfertados[0].ipiPadrao
  );
  const [aliquotaPisCofins, setAliquotaPisCofins] = useState<number>(
    fornecedorAtual.itensOfertados[0].pisCofinsPadrao
  );
  const [aliquotaIss, setAliquotaIss] = useState<number>(
    fornecedorAtual.itensOfertados[0].issPadrao
  );
  const [aliquotaDifalSt, setAliquotaDifalSt] = useState<number>(0);

  const [orcamentos, setOrcamentos] = useState<OrcamentoCriado[]>([]);
  const [escopoFornecedor, setEscopoFornecedor] = useState<
    "selecionado" | "todos"
  >("selecionado");
  const [filtroPedidos, setFiltroPedidos] = useState<
    "todos" | "ativos" | "cancelados"
  >("todos");

  const [modoContato, setModoContato] = useState<"Mensagem" | "Reunião">(
    "Mensagem"
  );
  const [etapaProcesso, setEtapaProcesso] = useState<string>(
    "Cotação de Preço (RFQ)"
  );
  const [emailDestinatario, setEmailDestinatario] = useState<string>(
    fornecedorAtual.emailComercial
  );
  const [assunto, setAssunto] = useState<string>(
    "Cotação de Preço (RFQ) — pedido mínimo, impostos e condições comerciais"
  );
  const [dataReuniao, setDataReuniao] = useState<string>("");
  const [horaReuniao, setHoraReuniao] = useState<string>("10:00");
  const [mensagemTexto, setMensagemTexto] = useState<string>("");
  const [registrosContato, setRegistrosContato] = useState<RegistroContato[]>(
    []
  );

  useEffect(() => {
    try {
      const salvoOrc = localStorage.getItem(STORAGE_KEY_ORCAMENTOS);
      if (salvoOrc) {
        const parsed: OrcamentoCriado[] = JSON.parse(salvoOrc);
        if (Array.isArray(parsed)) {
          setOrcamentos(
            parsed.map((item) => ({
              ...item,
              statusPedido: item.statusPedido || "Ativo",
              comprovanteUrl:
                item.comprovanteUrl &&
                (item.comprovanteUrl.startsWith("http://") ||
                  item.comprovanteUrl.startsWith("https://"))
                  ? item.comprovanteUrl
                  : null,
              evidenciaMinimoUrl:
                item.evidenciaMinimoUrl &&
                (item.evidenciaMinimoUrl.startsWith("http://") ||
                  item.evidenciaMinimoUrl.startsWith("https://"))
                  ? item.evidenciaMinimoUrl
                  : null,
            }))
          );
        }
      }
      const salvoCnt = localStorage.getItem(STORAGE_KEY_CONTATOS);
      if (salvoCnt) {
        const parsedCnt: RegistroContato[] = JSON.parse(salvoCnt);
        if (Array.isArray(parsedCnt)) {
          setRegistrosContato(parsedCnt);
        }
      }
    } catch {
      // ignora erro de storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORCAMENTOS, JSON.stringify(orcamentos));
    } catch {
      // ignora erro de quota
    }
  }, [orcamentos]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CONTATOS,
        JSON.stringify(registrosContato)
      );
    } catch {
      // ignora erro de quota
    }
  }, [registrosContato]);

  useEffect(() => {
    const f =
      FORNECEDORES_OP.find((item) => item.id === fornecedorId) ||
      FORNECEDORES_OP[0];
    const indiceValido =
      itemInicial >= 0 && itemInicial < f.itensOfertados.length
        ? itemInicial
        : 0;
    const it = f.itensOfertados[indiceValido];
    setItemIndex(indiceValido);
    setPrazoPagamento(f.prazoPagamentoPadrao);
    setModalidadeCompra(
      f.contratoStatus === "Vigente" ? "Contrato" : "Pedido Avulso"
    );
    setEmailDestinatario(f.emailComercial);
    setDescontoPercentual(0);
    setAliquotaIcms(it.icmsPadrao);
    setAliquotaIpi(it.ipiPadrao);
    setAliquotaPisCofins(it.pisCofinsPadrao);
    setAliquotaIss(it.issPadrao);
    setAliquotaDifalSt(f.estado !== "SP" ? 6 : 0);

    setComprovanteArquivo(null);
    setComprovanteUrlPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (comprovanteInputRef.current) comprovanteInputRef.current.value = "";

    setEvidenciaArquivo(null);
    setEvidenciaUrlPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (evidenciaInputRef.current) evidenciaInputRef.current.value = "";

    setAvisoStatus(null);
  }, [fornecedorId, itemInicial]);

  const handleSelecionarComprovante = (arquivo: File | null) => {
    setComprovanteUrlPreview((urlAnterior) => {
      if (urlAnterior) URL.revokeObjectURL(urlAnterior);
      return arquivo ? URL.createObjectURL(arquivo) : null;
    });
    setComprovanteArquivo(arquivo);
  };

  const handleRemoverComprovante = () => {
    setComprovanteUrlPreview((urlAnterior) => {
      if (urlAnterior) URL.revokeObjectURL(urlAnterior);
      return null;
    });
    setComprovanteArquivo(null);
    if (comprovanteInputRef.current) {
      comprovanteInputRef.current.value = "";
    }
  };

  const handleSelecionarEvidencia = (arquivo: File | null) => {
    setEvidenciaUrlPreview((urlAnterior) => {
      if (urlAnterior) URL.revokeObjectURL(urlAnterior);
      return arquivo ? URL.createObjectURL(arquivo) : null;
    });
    setEvidenciaArquivo(arquivo);
  };

  const handleRemoverEvidencia = () => {
    setEvidenciaUrlPreview((urlAnterior) => {
      if (urlAnterior) URL.revokeObjectURL(urlAnterior);
      return null;
    });
    setEvidenciaArquivo(null);
    if (evidenciaInputRef.current) {
      evidenciaInputRef.current.value = "";
    }
  };

  const handleTrocarItem = (novoIdx: number) => {
    setItemIndex(novoIdx);
    const it = fornecedorAtual.itensOfertados[novoIdx];
    if (it) {
      setAliquotaIcms(it.icmsPadrao);
      setAliquotaIpi(it.ipiPadrao);
      setAliquotaPisCofins(it.pisCofinsPadrao);
      setAliquotaIss(it.issPadrao);
    }
  };

  const itemSelecionado =
    fornecedorAtual.itensOfertados[itemIndex] ||
    fornecedorAtual.itensOfertados[0];

  const minimoNumerico = extrairNumeroPedidoMinimo(itemSelecionado.pedidoMinimo);
  const abaixoDoMinimo =
    minimoNumerico !== null && quantidade > 0 && quantidade < minimoNumerico;

  useEffect(() => {
    if (!abaixoDoMinimo) {
      handleRemoverEvidencia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abaixoDoMinimo]);

  const descontoLimpo = Math.min(Math.max(descontoPercentual, 0), 90);
  const valorUnitarioFinal =
    itemSelecionado.valorOfertado * (1 - descontoLimpo / 100);
  const subtotalMercadoria = valorUnitarioFinal * quantidade;

  const valorIcms = subtotalMercadoria * (aliquotaIcms / 100);
  const valorIpi = subtotalMercadoria * (aliquotaIpi / 100);
  const valorPisCofins = subtotalMercadoria * (aliquotaPisCofins / 100);
  const valorIss = subtotalMercadoria * (aliquotaIss / 100);
  const valorDifalSt = subtotalMercadoria * (aliquotaDifalSt / 100);

  const totalImpostos =
    valorIcms + valorIpi + valorPisCofins + valorIss + valorDifalSt;

  const valorTotalNota =
    modalidadeImposto === "por_fora"
      ? subtotalMercadoria + totalImpostos
      : subtotalMercadoria + valorIpi + valorDifalSt;

  const creditoTributarioEstimado =
    fornecedorAtual.regimeTributario === "Simples Nacional"
      ? 0
      : valorIcms + valorPisCofins;

  const custoLiquidoEfetivo = valorTotalNota - creditoTributarioEstimado;

  const handleCopiarTexto = async (texto: string, rotulo: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setAvisoStatus({
        tipo: "sucesso",
        texto: `${rotulo} copiado para a área de transferência.`,
      });
    } catch {
      setAvisoStatus({
        tipo: "alerta",
        texto: `Não foi possível copiar automaticamente. Dado: ${texto}`,
      });
    }
  };

  const montarLinkComprovanteEmail = (
    orc: Pick<
      OrcamentoCriado,
      | "prazoPagamento"
      | "fornecedorNome"
      | "itemNome"
      | "quantidade"
      | "modalidadeCompra"
      | "chavePix"
      | "contaBancaria"
      | "comprovanteNome"
      | "emailDestino"
    >,
    totalFormatado: string
  ) => {
    const assuntoComprovante = `Comprovante de Pagamento (${orc.prazoPagamento}) — ${orc.fornecedorNome} — ${totalFormatado}`;
    const corpoComprovante = [
      `Olá ${fornecedorAtual.contatoComercial},`,
      ``,
      `Segue o registo do pagamento referente ao item: ${orc.itemNome} (Qtd: ${orc.quantidade}).`,
      `Modalidade: ${orc.modalidadeCompra} • Pagamento/Prazo: ${orc.prazoPagamento}`,
      `Chave PIX: ${orc.chavePix}`,
      `Conta Bancária (CNPJ): ${orc.contaBancaria}`,
      `Valor Total da NF: ${totalFormatado}`,
      orc.comprovanteNome
        ? `Ficheiro do comprovante selecionado: ${orc.comprovanteNome} (anexa o ficheiro no teu e-mail antes de enviar).`
        : `Comprovante: será anexado em seguida.`,
      ``,
      `Com os melhores cumprimentos,`,
    ].join("\n");

    return `mailto:${encodeURIComponent(
      orc.emailDestino
    )}?subject=${encodeURIComponent(
      assuntoComprovante
    )}&body=${encodeURIComponent(corpoComprovante)}`;
  };

  const handleCriarOrcamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantidade <= 0) return;

    if (abaixoDoMinimo && !evidenciaArquivo) {
      setAvisoStatus({
        tipo: "alerta",
        texto: `A quantidade (${quantidade}) está abaixo do pedido mínimo (${itemSelecionado.pedidoMinimo}). Anexa a evidência de exceção negociada para guardar o orçamento.`,
      });
      return;
    }

    const partesImpostos = [
      aliquotaIcms > 0 ? `ICMS ${aliquotaIcms}%` : null,
      aliquotaIpi > 0 ? `IPI ${aliquotaIpi}%` : null,
      aliquotaPisCofins > 0 ? `PIS/COFINS ${aliquotaPisCofins}%` : null,
      aliquotaIss > 0 ? `ISS ${aliquotaIss}%` : null,
      aliquotaDifalSt > 0 ? `DIFAL/ST ${aliquotaDifalSt}%` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const temComprovante = Boolean(comprovanteArquivo);
    const statusEnvio: OrcamentoCriado["statusEnvioComprovante"] = !temComprovante
      ? "Sem comprovante anexado"
      : envioAutomaticoComprovante
        ? "Enviado automaticamente ao fornecedor"
        : "Comprovante anexado (aguardando envio)";

    const novoId = `ORC-${Date.now().toString().slice(-4)}`;
    const totalFormatado = valorTotalNota.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const novo: OrcamentoCriado = {
      id: novoId,
      statusPedido: "Ativo",
      fornecedorId: fornecedorAtual.id,
      fornecedorNome: fornecedorAtual.nomeFantasia,
      categoriaFornecedor: fornecedorAtual.categoria,
      cnpjFornecedor: fornecedorAtual.cnpj,
      emailDestino: fornecedorAtual.emailComercial,
      chavePix: fornecedorAtual.chavePix,
      contaBancaria: fornecedorAtual.contaBancaria,
      regimeTributario: fornecedorAtual.regimeTributario,
      itemNome: itemSelecionado.nome,
      ncmOuCodigo: itemSelecionado.ncmOuCodigo,
      quantidade,
      descontoPercentual: descontoLimpo,
      pedidoMinimoTexto: itemSelecionado.pedidoMinimo,
      abaixoDoMinimo,
      evidenciaMinimoNome: evidenciaArquivo ? evidenciaArquivo.name : null,
      evidenciaMinimoUrl: evidenciaUrlPreview,
      subtotalMercadoria,
      modalidadeImposto,
      aliquotas: {
        icms: aliquotaIcms,
        ipi: aliquotaIpi,
        pisCofins: aliquotaPisCofins,
        iss: aliquotaIss,
        difalSt: aliquotaDifalSt,
      },
      resumoImpostos: partesImpostos || "Isento / Sem alíquota informada",
      totalImpostos,
      creditoTributarioEstimado,
      valorTotalNota,
      custoLiquidoEfetivo,
      modalidadeCompra,
      prazoPagamento,
      comprovanteNome: comprovanteArquivo ? comprovanteArquivo.name : null,
      comprovanteTamanhoKb: comprovanteArquivo
        ? Math.max(1, Math.round(comprovanteArquivo.size / 1024))
        : null,
      comprovanteUrl: comprovanteUrlPreview,
      envioAutomaticoAtivo: envioAutomaticoComprovante,
      statusEnvioComprovante: statusEnvio,
      observacoes: observacoesOrc,
      criadoEm: new Date().toLocaleString("pt-BR"),
    };

    setOrcamentos((prev) => [novo, ...prev]);

    if (temComprovante && envioAutomaticoComprovante && comprovanteArquivo) {
      const registroAuto: RegistroContato = {
        id: `CNT-${Date.now().toString().slice(-4)}`,
        tipo: "Mensagem",
        etapaProcesso: "Comprovante de Pagamento (Automático)",
        fornecedorNome: fornecedorAtual.nomeFantasia,
        destinatario: fornecedorAtual.contatoComercial,
        emailDestino: fornecedorAtual.emailComercial,
        assuntoOuData: `Comprovante "${comprovanteArquivo.name}" — ${prazoPagamento} (${totalFormatado})`,
        detalhes: `Envio automático disparado ao guardar o orçamento ${novoId} (${modalidadeCompra}). Pagamento via "${prazoPagamento}" (PIX: ${fornecedorAtual.chavePix}) com comprovante anexado (${comprovanteArquivo.name}).`,
        criadoEm: new Date().toLocaleString("pt-BR"),
      };
      setRegistrosContato((prev) => [registroAuto, ...prev]);
      setAvisoStatus({
        tipo: "sucesso",
        texto: `Orçamento ${novoId} guardado e envio automático registado para ${fornecedorAtual.emailComercial} com o comprovante "${comprovanteArquivo.name}".`,
      });
    } else if (temComprovante && comprovanteArquivo) {
      setAvisoStatus({
        tipo: "sucesso",
        texto: `Orçamento ${novoId} guardado com o comprovante "${comprovanteArquivo.name}" anexado.`,
      });
    } else {
      setAvisoStatus({
        tipo: "sucesso",
        texto: `Orçamento ${novoId} guardado com sucesso.`,
      });
    }

    setObservacoesOrc("");
    setComprovanteArquivo(null);
    setComprovanteUrlPreview(null);
    if (comprovanteInputRef.current) comprovanteInputRef.current.value = "";

    setEvidenciaArquivo(null);
    setEvidenciaUrlPreview(null);
    if (evidenciaInputRef.current) evidenciaInputRef.current.value = "";
  };

  const handleDuplicarOrcamento = (base: OrcamentoCriado) => {
    const duplicado: OrcamentoCriado = {
      ...base,
      id: `ORC-${Date.now().toString().slice(-4)}`,
      statusPedido: "Ativo",
      canceladoEm: undefined,
      criadoEm: new Date().toLocaleString("pt-BR"),
    };
    setOrcamentos((prev) => [duplicado, ...prev]);
    setAvisoStatus({
      tipo: "sucesso",
      texto: `Orçamento ${base.id} duplicado como ${duplicado.id}.`,
    });
  };

  const handleCancelarPedido = (id: string) => {
    const agora = new Date().toLocaleString("pt-BR");
    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              statusPedido: o.statusPedido === "Cancelado" ? "Ativo" : "Cancelado",
              canceladoEm: o.statusPedido === "Cancelado" ? undefined : agora,
            }
          : o
      )
    );
    setAvisoStatus({
      tipo: "alerta",
      texto: `Pedido de compra ${id} atualizado no histórico.`,
    });
  };

  const handleApagarCard = (id: string) => {
    setOrcamentos((prev) => {
      const alvo = prev.find((o) => o.id === id);
      if (alvo?.comprovanteUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(alvo.comprovanteUrl);
      }
      if (alvo?.evidenciaMinimoUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(alvo.evidenciaMinimoUrl);
      }
      return prev.filter((o) => o.id !== id);
    });
    setAvisoStatus({
      tipo: "sucesso",
      texto: `Registo ${id} removido da lista.`,
    });
  };

  const handleLimparCancelados = () => {
    setOrcamentos((prev) =>
      prev.filter((o) => {
        if (
          escopoFornecedor === "selecionado" &&
          o.fornecedorId !== fornecedorAtual.id
        ) {
          return true;
        }
        return o.statusPedido !== "Cancelado";
      })
    );
    setAvisoStatus({
      tipo: "sucesso",
      texto: "Pedidos cancelados removidos para manter o histórico clean.",
    });
  };

  const orcamentosDoEscopo = orcamentos.filter((o) =>
    escopoFornecedor === "selecionado"
      ? o.fornecedorId === fornecedorAtual.id
      : true
  );

  const orcamentosFiltrados = orcamentosDoEscopo.filter((o) => {
    if (filtroPedidos === "ativos") return o.statusPedido !== "Cancelado";
    if (filtroPedidos === "cancelados") return o.statusPedido === "Cancelado";
    return true;
  });

  const totalCancelados = orcamentosDoEscopo.filter(
    (o) => o.statusPedido === "Cancelado"
  ).length;

  const montarMailtoHref = () => {
    const assuntoCompleto =
      modoContato === "Reunião"
        ? `[${etapaProcesso}] Convite de Reunião (${dataReuniao || "A combinar"} às ${horaReuniao}) — ${assunto}`
        : `[${etapaProcesso}] ${assunto}`;

    const corpoBase =
      modoContato === "Reunião"
        ? `Olá ${fornecedorAtual.contatoComercial},\n\nEtapa: ${etapaProcesso}\nGostaria de agendar uma reunião no dia ${dataReuniao || "[definir data]"} às ${horaReuniao}.\n\nPauta: ${mensagemTexto || assunto}\n\nCom os melhores cumprimentos,`
        : `Olá ${fornecedorAtual.contatoComercial},\n\nEtapa: ${etapaProcesso}\n${mensagemTexto || "Gostaria de alinhar pedido mínimo, alíquotas fiscais (ICMS/IPI/ISS), prazos de pagamento e valores."}\n\nCom os melhores cumprimentos,`;

    return `mailto:${encodeURIComponent(emailDestinatario)}?subject=${encodeURIComponent(
      assuntoCompleto
    )}&body=${encodeURIComponent(corpoBase)}`;
  };

  const handleEnviarContato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagemTexto.trim()) return;

    const resumoDataHora =
      modoContato === "Reunião"
        ? `Reunião em ${dataReuniao || "a definir"} às ${horaReuniao} — ${assunto}`
        : assunto;

    const novo: RegistroContato = {
      id: `CNT-${Date.now().toString().slice(-4)}`,
      tipo: modoContato,
      etapaProcesso,
      fornecedorNome: fornecedorAtual.nomeFantasia,
      destinatario: fornecedorAtual.contatoComercial,
      emailDestino: emailDestinatario,
      assuntoOuData: resumoDataHora,
      detalhes: mensagemTexto.trim(),
      criadoEm: new Date().toLocaleString("pt-BR"),
    };

    setRegistrosContato((prev) => [novo, ...prev]);
    setMensagemTexto("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Faixa de integração com a página inicial da Atlas Supply & Comércio */}
      <div className="bg-stone-950 text-stone-200 border-b border-stone-800 px-6 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-bold text-amber-400">
              Atlas Supply &amp; Comércio
            </span>
            <span className="text-stone-600">•</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-200 font-medium">
              {perfilParam === "colaborador"
                ? "Perfil: Colaborador (Mesa de Compras)"
                : perfilParam === "fornecedor"
                  ? "Perfil: Fornecedor Parceiro"
                  : "Acesso direto à Operação"}
            </span>
            {usuarioParam && (
              <span className="text-stone-300 hidden sm:inline">
                ({usuarioParam})
              </span>
            )}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium underline underline-offset-4"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>

      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Operações de Compras &amp; Fiscal
            </span>
            <h1 className="text-xl font-bold">
              Orçamentos com Impostos, Comprovante e Reuniões
            </h1>
          </div>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            ← Voltar ao Portal de Busca
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Fornecedor + Avatar SVG + Dados Bancários & PIX */}
        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 mt-5"
                title={fornecedorAtual.nomeFantasia}
              >
                {obterIniciais(fornecedorAtual.nomeFantasia)}
              </div>

              <div className="flex-1 space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase">
                  Fornecedor Selecionado
                </label>
                <select
                  value={fornecedorId}
                  onChange={(e) => setFornecedorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium"
                >
                  {FORNECEDORES_OP.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nomeFantasia} ({f.estado} • {f.regimeTributario})
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-1">
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
                    Tempo de Serviço:{" "}
                    <strong>{fornecedorAtual.tempoServico}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAbaAtiva("orcamento")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  abaAtiva === "orcamento"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Criar Orçamento
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva("contato")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  abaAtiva === "contato"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Mensagem / Reunião
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-lg">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500 font-semibold uppercase mr-1.5">
                  Chave PIX:
                </span>
                <strong className="text-slate-900">
                  {fornecedorAtual.chavePix}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase mr-1.5">
                  Conta Bancária (CNPJ):
                </span>
                <strong className="text-slate-900">
                  {fornecedorAtual.contaBancaria}
                </strong>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleCopiarTexto(fornecedorAtual.chavePix, "Chave PIX")
                }
                className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-300 font-semibold text-slate-800 transition-colors"
              >
                Copiar PIX
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCopiarTexto(
                    fornecedorAtual.contaBancaria,
                    "Conta Bancária"
                  )
                }
                className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-300 font-semibold text-slate-800 transition-colors"
              >
                Copiar Conta
              </button>
            </div>
          </div>
        </section>

        {avisoStatus && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold ${
              avisoStatus.tipo === "alerta"
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}
          >
            {avisoStatus.tipo === "alerta" ? "⚠ " : "✓ "}
            {avisoStatus.texto}
          </div>
        )}

        {abaAtiva === "orcamento" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleCriarOrcamento}
              className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Novo Orçamento (Cotação de Preço — RFQ)
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {itemSelecionado.ncmOuCodigo}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MiniaturaCategoriaSvg categoria={fornecedorAtual.categoria} />

                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Item Ofertado para a Empresa
                  </label>
                  <select
                    value={itemIndex}
                    onChange={(e) => handleTrocarItem(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  >
                    {fornecedorAtual.itensOfertados.map((it, idx) => (
                      <option key={it.nome} value={idx}>
                        {it.nome} — Ofertado:{" "}
                        {it.valorOfertado.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                        ({it.unidade})
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1.5">
                    <span>
                      Pedido mínimo:{" "}
                      <strong className="text-slate-800">
                        {itemSelecionado.pedidoMinimo}
                      </strong>
                    </span>
                    <span>
                      Prazo:{" "}
                      <strong className="text-slate-800">
                        {itemSelecionado.prazoServico}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    step={0.5}
                    value={descontoPercentual}
                    onChange={(e) =>
                      setDescontoPercentual(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Modalidade
                  </label>
                  <select
                    value={modalidadeCompra}
                    onChange={(e) =>
                      setModalidadeCompra(
                        e.target.value as "Pedido Avulso" | "Contrato"
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  >
                    <option value="Pedido Avulso">Pedido Avulso</option>
                    <option value="Contrato">Contrato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Prazo / Forma Pagamento
                  </label>
                  <select
                    value={prazoPagamento}
                    onChange={(e) => setPrazoPagamento(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  >
                    {PRAZOS_PAGAMENTO_OPCOES.map((prazo) => (
                      <option key={prazo} value={prazo}>
                        {prazo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {abaixoDoMinimo && (
                <div className="p-4 rounded-lg border border-amber-300 bg-amber-50/70 space-y-2.5">
                  <div className="text-xs font-bold text-amber-950">
                    ⚠ Quantidade abaixo do pedido mínimo (
                    {itemSelecionado.pedidoMinimo})
                  </div>
                  <p className="text-xs text-amber-900">
                    Para seguir com quantidade inferior ao mínimo sugerido pelo
                    fornecedor, anexa uma evidência de aprovação/exceção (ex.:
                    e-mail, captura de ecrã ou PDF do fornecedor).
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={evidenciaInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp,.eml,.msg"
                      onChange={(e) =>
                        handleSelecionarEvidencia(e.target.files?.[0] || null)
                      }
                      className="block w-full text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                    />
                  </div>
                  {evidenciaArquivo && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-800 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span>Evidência anexada:</span>
                        {evidenciaUrlPreview ? (
                          <a
                            href={evidenciaUrlPreview}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-blue-700 underline hover:text-blue-900"
                          >
                            {evidenciaArquivo.name}
                          </a>
                        ) : (
                          <strong>{evidenciaArquivo.name}</strong>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoverEvidencia}
                        className="px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-700 border border-red-200 font-semibold text-[11px]"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-blue-900">
                    Comprovante de Pagamento (PIX / TED / Boleto)
                  </span>
                  <span className="text-[11px] text-slate-600">
                    PIX: <strong>{fornecedorAtual.chavePix}</strong>
                  </span>
                </div>

                <div>
                  <input
                    ref={comprovanteInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={(e) =>
                      handleSelecionarComprovante(e.target.files?.[0] || null)
                    }
                    className="block w-full text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                  {comprovanteArquivo && (
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 bg-white/80 px-3 py-2 rounded-md border border-blue-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span>Ficheiro anexado:</span>
                        {comprovanteUrlPreview ? (
                          <a
                            href={comprovanteUrlPreview}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-blue-700 underline hover:text-blue-900"
                          >
                            {comprovanteArquivo.name}
                          </a>
                        ) : (
                          <strong>{comprovanteArquivo.name}</strong>
                        )}
                        <span>
                          (
                          {Math.max(
                            1,
                            Math.round(comprovanteArquivo.size / 1024)
                          )}{" "}
                          KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoverComprovante}
                        className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-[11px] transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={envioAutomaticoComprovante}
                    onChange={(e) =>
                      setEnvioAutomaticoComprovante(e.target.checked)
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Enviar comprovante automaticamente para o fornecedor (
                    <strong>{fornecedorAtual.emailComercial}</strong>) ao guardar
                  </span>
                </label>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    Composição Tributária (Brasil)
                  </span>
                  <div className="flex rounded-md bg-slate-200 p-0.5 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setModalidadeImposto("por_fora")}
                      className={`px-2.5 py-1 rounded ${
                        modalidadeImposto === "por_fora"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600"
                      }`}
                    >
                      + Impostos por fora
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalidadeImposto("inclusos")}
                      className={`px-2.5 py-1 rounded ${
                        modalidadeImposto === "inclusos"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600"
                      }`}
                    >
                      Impostos inclusos
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      ICMS (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      step={0.1}
                      value={aliquotaIcms}
                      onChange={(e) => setAliquotaIcms(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      IPI (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={0.1}
                      value={aliquotaIpi}
                      onChange={(e) => setAliquotaIpi(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      PIS/COFINS (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.05}
                      value={aliquotaPisCofins}
                      onChange={(e) =>
                        setAliquotaPisCofins(Number(e.target.value))
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      ISS (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={aliquotaIss}
                      onChange={(e) => setAliquotaIss(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      DIFAL / ST (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      step={0.1}
                      value={aliquotaDifalSt}
                      onChange={(e) =>
                        setAliquotaDifalSt(Number(e.target.value))
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Observações Fiscais / Entrega
                </label>
                <textarea
                  rows={2}
                  value={observacoesOrc}
                  onChange={(e) => setObservacoesOrc(e.target.value)}
                  placeholder="Ex: Vincular ao contrato vigente, destacar ICMS/IPI na NF-e..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal dos itens ({quantidade} un.):</span>
                  <span>
                    {subtotalMercadoria.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Carga tributária calculada:</span>
                  <span>
                    {totalImpostos.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>
                    Crédito tributário estimado ({fornecedorAtual.regimeTributario}):
                  </span>
                  <span>
                    -{" "}
                    {creditoTributarioEstimado.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-700 text-sm">
                  <span className="font-semibold">Total da Nota Fiscal (NF):</span>
                  <strong className="text-lg font-bold text-emerald-400">
                    {valorTotalNota.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Custo líquido efetivo (descontando créditos):</span>
                  <span>
                    {custoLiquidoEfetivo.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                {comprovanteArquivo && envioAutomaticoComprovante
                  ? "Guardar Orçamento e Enviar Comprovante"
                  : "Guardar Orçamento com Impostos"}
              </button>
            </form>

            {/* Coluna Direita: Orçamentos Gerados */}
            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Orçamentos Gerados ({orcamentosFiltrados.length})
                  </h2>

                  <div className="flex rounded-md bg-slate-100 p-0.5 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setEscopoFornecedor("selecionado")}
                      className={`px-2.5 py-1 rounded ${
                        escopoFornecedor === "selecionado"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600"
                      }`}
                    >
                      Este fornecedor
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscopoFornecedor("todos")}
                      className={`px-2.5 py-1 rounded ${
                        escopoFornecedor === "todos"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600"
                      }`}
                    >
                      Todos ({orcamentos.length})
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {(
                    [
                      {
                        key: "todos",
                        label: `Todos (${orcamentosDoEscopo.length})`,
                      },
                      {
                        key: "ativos",
                        label: `Ativos (${
                          orcamentosDoEscopo.filter(
                            (o) => o.statusPedido !== "Cancelado"
                          ).length
                        })`,
                      },
                      {
                        key: "cancelados",
                        label: `Cancelados (${totalCancelados})`,
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setFiltroPedidos(item.key)}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                        filtroPedidos === item.key
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  {totalCancelados > 0 && (
                    <button
                      type="button"
                      onClick={handleLimparCancelados}
                      className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold transition-colors"
                    >
                      Limpar cancelados
                    </button>
                  )}
                </div>
              </div>

              {orcamentosFiltrados.length === 0 ? (
                <EstadoVazioIlustracao
                  mensagem={
                    escopoFornecedor === "selecionado"
                      ? `Nenhum orçamento registado para ${fornecedorAtual.nomeFantasia} ainda. Preenche o formulário ao lado para criar o primeiro.`
                      : "Nenhum orçamento registado neste filtro no momento."
                  }
                />
              ) : (
                <div className="space-y-3">
                  {orcamentosFiltrados.map((orc) => {
                    const isCancelado = orc.statusPedido === "Cancelado";
                    const totalFmt = orc.valorTotalNota.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    });
                    const liquidoFmt = orc.custoLiquidoEfetivo.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    );
                    const categoriaCard =
                      orc.categoriaFornecedor ||
                      FORNECEDORES_OP.find((f) => f.id === orc.fornecedorId)
                        ?.categoria ||
                      "Embalagens";

                    return (
                      <div
                        key={orc.id}
                        className={`p-4 rounded-lg border space-y-2.5 transition-colors ${
                          isCancelado
                            ? "border-red-200 bg-red-50/40 opacity-80"
                            : "border-slate-200 bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-blue-700">
                              {orc.id} • {orc.fornecedorNome} (
                              {orc.modalidadeCompra})
                            </span>
                            {isCancelado && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                                Pedido Cancelado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] text-slate-500 hidden sm:inline">
                              {orc.criadoEm}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDuplicarOrcamento(orc)}
                              className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-700"
                            >
                              Duplicar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApagarCard(orc.id)}
                              title="Fechar / apagar orçamento da lista"
                              aria-label={`Fechar orçamento ${orc.id}`}
                              className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MiniaturaCategoriaSvg categoria={categoriaCard} />
                          <div className="min-w-0">
                            <p
                              className={`text-sm font-semibold ${
                                isCancelado
                                  ? "line-through text-slate-500"
                                  : "text-slate-900"
                              }`}
                            >
                              {orc.itemNome} ({orc.ncmOuCodigo}) — Qtd:{" "}
                              {orc.quantidade}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Tributos:{" "}
                              <strong>{orc.resumoImpostos}</strong> • Pagto/Prazo:{" "}
                              <strong>{orc.prazoPagamento}</strong>
                              {isCancelado && orc.canceladoEm
                                ? ` • Cancelado em ${orc.canceladoEm}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {orc.abaixoDoMinimo && (
                          <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded flex flex-wrap items-center gap-1.5">
                            <span>
                              Abaixo do mínimo ({orc.pedidoMinimoTexto}) •
                              Evidência:
                            </span>
                            {orc.evidenciaMinimoUrl ? (
                              <a
                                href={orc.evidenciaMinimoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-blue-700 underline"
                              >
                                {orc.evidenciaMinimoNome}
                              </a>
                            ) : (
                              <strong>{orc.evidenciaMinimoNome}</strong>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-xs pt-1">
                          <span>
                            Mercadoria:{" "}
                            <strong>
                              {orc.subtotalMercadoria.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </strong>
                          </span>
                          <span>
                            Impostos:{" "}
                            <strong>
                              {orc.totalImpostos.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </strong>
                          </span>
                          <span className="text-emerald-700 font-bold">
                            Total NF: {totalFmt}
                          </span>
                          <span className="text-slate-900 font-bold">
                            Custo líquido efetivo: {liquidoFmt}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block">
                              {orc.statusEnvioComprovante}
                            </span>
                            <span className="block text-[11px] text-slate-600">
                              PIX: <strong>{orc.chavePix}</strong> • Conta CNPJ:{" "}
                              <strong>{orc.cnpjFornecedor}</strong>
                            </span>
                            {orc.comprovanteNome && (
                              <span className="block text-[11px] text-slate-600">
                                Anexo:{" "}
                                {orc.comprovanteUrl ? (
                                  <a
                                    href={orc.comprovanteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-blue-700 underline hover:text-blue-900"
                                  >
                                    {orc.comprovanteNome}
                                  </a>
                                ) : (
                                  orc.comprovanteNome
                                )}{" "}
                                ({orc.comprovanteTamanhoKb} KB) →{" "}
                                {orc.emailDestino}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCancelarPedido(orc.id)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                                isCancelado
                                  ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                                  : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {isCancelado
                                ? "Reativar pedido"
                                : "Cancelar pedido de compra"}
                            </button>

                            {orc.comprovanteNome && !isCancelado && (
                              <a
                                href={montarLinkComprovanteEmail(orc, totalFmt)}
                                className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] text-center"
                              >
                                ✉️ Disparar E-mail do Comprovante
                              </a>
                            )}
                          </div>
                        </div>

                        {orc.observacoes && (
                          <p className="text-xs text-slate-500 italic">
                            Obs: {orc.observacoes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleEnviarContato}
              className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Falar com {fornecedorAtual.nomeFantasia}
                </h2>
                <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setModoContato("Mensagem")}
                    className={`px-3 py-1 rounded-md ${
                      modoContato === "Mensagem"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600"
                    }`}
                  >
                    Enviar Mensagem
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoContato("Reunião")}
                    className={`px-3 py-1 rounded-md ${
                      modoContato === "Reunião"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600"
                    }`}
                  >
                    Marcar Reunião
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Etapa do Processo de Compras
                  </label>
                  <select
                    value={etapaProcesso}
                    onChange={(e) => setEtapaProcesso(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  >
                    <option value="Qualificação Inicial (RFI)">
                      Qualificação Inicial (RFI)
                    </option>
                    <option value="Cotação de Preço (RFQ)">
                      Cotação de Preço (RFQ)
                    </option>
                    <option value="Proposta Completa (RFP)">
                      Proposta Completa (RFP)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    E-mail para Convite / Contato
                  </label>
                  <input
                    type="email"
                    required
                    value={emailDestinatario}
                    onChange={(e) => setEmailDestinatario(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Assunto / Pauta
                </label>
                <input
                  type="text"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {modoContato === "Reunião" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Data da Reunião
                    </label>
                    <input
                      type="date"
                      value={dataReuniao}
                      onChange={(e) => setDataReuniao(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Horário
                    </label>
                    <input
                      type="time"
                      value={horaReuniao}
                      onChange={(e) => setHoraReuniao(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  {modoContato === "Mensagem"
                    ? "Mensagem para o Fornecedor"
                    : "Detalhes / Pauta do Convite de Reunião"}
                </label>
                <textarea
                  rows={4}
                  value={mensagemTexto}
                  onChange={(e) => setMensagemTexto(e.target.value)}
                  placeholder="Descreve os pontos da conversa, contrato, impostos (ICMS/IPI/ISS) ou proposta..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
                >
                  {modoContato === "Mensagem"
                    ? "Registar Mensagem no Portal"
                    : "Registar Convite no Portal"}
                </button>
                <a
                  href={montarMailtoHref()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm text-center transition-colors"
                >
                  ✉️ Enviar Convite por E-mail
                </a>
              </div>
            </form>

            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Mensagens e Convites Registados ({registrosContato.length})
              </h2>
              {registrosContato.length === 0 ? (
                <EstadoVazioIlustracao mensagem="Nenhuma mensagem ou reunião registada ainda. Usa o formulário ao lado para registar ou disparar o convite por e-mail." />
              ) : (
                <div className="space-y-3">
                  {registrosContato.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          [{reg.tipo}] {reg.fornecedorNome} • {reg.etapaProcesso}
                        </span>
                        <span className="text-xs text-slate-500">
                          {reg.criadoEm}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-700">
                        {reg.assuntoOuData}
                      </p>
                      <p className="text-sm text-slate-700">{reg.detalhes}</p>
                      <p className="text-[11px] text-slate-500">
                        Para: {reg.destinatario} ({reg.emailDestino})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function OperacoesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm">A carregar...</div>}>
      <OperacoesConteudo />
    </Suspense>
  );
}