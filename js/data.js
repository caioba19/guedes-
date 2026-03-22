// ============================================================
// GUEDE'S — Dados do Site
// Arquivo: js/data.js
//
// ✏️  EDITE AQUI para atualizar o site:
//   - Número do WhatsApp
//   - Endereço
//   - Horários de funcionamento
//   - Itens do cardápio (nome, descrição, preço)
//   - Avaliações de clientes
// ============================================================

// ── CONFIGURAÇÕES GERAIS ───────────────────────────────────
// Número do WhatsApp (só números, sem + ou espaços)
const WPP = "5571999767523";

// Endereço exibido no site
const ENDERECO = "R. Domingos Pires, 50 — Periperi, Salvador";

// URL do Google Maps
const MAPS = "https://maps.google.com/?q=Rua+Domingos+Pires+50+Periperi+Salvador+BA";

// ── PALETA DE CORES ────────────────────────────────────────
const C = {
  cream:   "#F4EFE4", // fundo principal
  paper:   "#EDE7D9", // fundo secundário
  ink:     "#1C1510", // texto e bordas escuras
  red:     "#CC2B1D", // vermelho principal
  redDark: "#9E1F14", // vermelho escuro (hover)
  muted:   "#7A6E62", // texto secundário/labels
  line:    "#D4CCBE", // bordas sutis
  white:   "#FDFAF5", // branco levemente amarelado
};

// ── HORÁRIOS DE FUNCIONAMENTO ──────────────────────────────
const HORARIOS = [
  { dias: "Seg — Qui", horas: "11h30 – 15h00" },
  { dias: "Sex — Dom", horas: "11h30 – 23h00" },
];

// ── CARDÁPIO ───────────────────────────────────────────────
// Para adicionar um item: copie uma linha { nome, desc, preco }
// Para remover: apague a linha correspondente
const CARDAPIO = [
  {
    cat: "Pizzas",
    itens: [
      { nome: "Calabresa",       desc: "Calabresa fatiada, cebola, azeitona",      preco: "39,90" },
      { nome: "Frango c/ Milho", desc: "Frango desfiado, milho, catupiry",          preco: "42,90" },
      { nome: "Portuguesa",      desc: "Presunto, ovo, cebola, azeitona",           preco: "44,90" },
      { nome: "Mussarela",       desc: "Mussarela derretida, tomate fresco",        preco: "37,90" },
      { nome: "4 Queijos",       desc: "Mussarela, provolone, catupiry, parmesão",  preco: "46,90" },
      { nome: "Pepperoni",       desc: "Pepperoni artesanal, mussarela",            preco: "48,90" },
    ],
  },
  {
    cat: "Almoço",
    itens: [
      { nome: "Prato Feito", desc: "Arroz, feijão, carne, acompanhamentos", preco: "18,90" },
      { nome: "Executivo",   desc: "PF + salada + suco ou refri",           preco: "24,90" },
      { nome: "Marmita G",   desc: "Arroz, feijão, 2 carnes, salada",       preco: "22,90" },
    ],
  },
  {
    cat: "Petiscos",
    itens: [
      { nome: "Porção de Frango", desc: "500g de frango frito crocante", preco: "29,90" },
      { nome: "Chopp 300ml",      desc: "Sempre gelado, sempre cremoso",  preco: "8,90"  },
      { nome: "Refrigerante",     desc: "Lata 350ml gelada",              preco: "5,90"  },
    ],
  },
];

// ── AVALIAÇÕES DE CLIENTES ─────────────────────────────────
// Substitua por avaliações reais do Google ou WhatsApp
// nota: número de 1 a 5 estrelas
const AVALIACOES = [
  { nome: "Ana Lima",    nota: 5, txt: "Pizza maravilhosa, massa fininha do jeito que eu gosto. Já virou rotina aqui em casa." },
  { nome: "Carlos S.",   nota: 5, txt: "Almoço farto, preço justo. O prato feito vem cheio. É o melhor da região."            },
  { nome: "Patrícia M.", nota: 5, txt: "Chopp sempre gelado e o ambiente é aconchegante. A família toda adora!"               },
  { nome: "Roberto A.",  nota: 4, txt: "Calabresa especial — recheio generoso de verdade. Virou meu pedido toda sexta."       },
];
