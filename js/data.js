// ============================================================
// GUEDE'S — Dados do Site
// ✏️ Edite aqui: WhatsApp, endereço, cardápio, avaliações
// ============================================================

const WPP      = "5571999767523";
const ENDERECO = "R. Domingos Pires, 50 — Periperi, Salvador";
const MAPS     = "https://maps.google.com/?q=Rua+Domingos+Pires+50+Periperi+Salvador+BA";

// ── PALETA DE CORES ────────────────────────────────────────
const C = {
  cream:   "#F4EFE4",
  paper:   "#EDE7D9",
  ink:     "#1C1510",
  red:     "#CC2B1D",
  redDark: "#9E1F14",
  muted:   "#7A6E62",
  line:    "#D4CCBE",
  white:   "#FDFAF5",
};

// ── HORÁRIOS ───────────────────────────────────────────────
const HORARIOS = [
  { dias: "Seg — Qui", horas: "11h30 – 15h00" },
  { dias: "Sex — Dom", horas: "11h30 – 23h00" },
];

// ── TAMANHOS DE PIZZA ──────────────────────────────────────
// maxSabores = quantos sabores diferentes a pessoa pode escolher
// minSabores = mínimo de sabores obrigatórios
// maxSabores = máximo de sabores permitidos
const TAMANHOS = [
  { id: "broto",   nome: "Broto",   fatias: "aprox. 4 fatias",    preco: "29,90", minSabores: 1, maxSabores: 1 },
  { id: "media",   nome: "Média",   fatias: "aprox. 6 fatias",    preco: "39,90", minSabores: 1, maxSabores: 2 },
  { id: "grande",  nome: "Grande",  fatias: "aprox. 8 fatias",    preco: "48,90", minSabores: 2, maxSabores: 3 },
  { id: "gigante", nome: "Gigante", fatias: "10 a 12 fatias",     preco: "59,90", minSabores: 2, maxSabores: 4 },
];

// ── SABORES DE PIZZA ───────────────────────────────────────
const SABORES = [
  // Tradicionais
  { id: "calabresa",    nome: "Calabresa",      desc: "Calabresa, cebola, azeitona",           tipo: "Tradicional" },
  { id: "mussarela",    nome: "Mussarela",       desc: "Mussarela derretida, tomate, orégano",  tipo: "Tradicional" },
  { id: "portuguesa",   nome: "Portuguesa",      desc: "Presunto, ovo, cebola, azeitona",       tipo: "Tradicional" },
  { id: "margherita",   nome: "Margherita",      desc: "Mussarela, tomate, manjericão",         tipo: "Tradicional" },
  // Especiais
  { id: "frango",       nome: "Frango c/ Milho", desc: "Frango desfiado, milho, catupiry",      tipo: "Especial" },
  { id: "4queijos",     nome: "4 Queijos",        desc: "Mussarela, provolone, catupiry, parmesão", tipo: "Especial" },
  { id: "pepperoni",    nome: "Pepperoni",        desc: "Pepperoni artesanal, mussarela",        tipo: "Especial" },
  { id: "carne",        nome: "Carne do Sol",     desc: "Carne do sol, cebola caramelizada",     tipo: "Especial" },
  // Doces
  { id: "chocolate",    nome: "Chocolate",        desc: "Chocolate ao leite, granulado",         tipo: "Doce" },
  { id: "romeu_julieta",nome: "Romeu e Julieta",  desc: "Mussarela, goiabada cremosa",           tipo: "Doce" },
  { id: "banana",       nome: "Banana Nevada",    desc: "Banana, canela, leite condensado",      tipo: "Doce" },
];

// ── CARDÁPIO GERAL (almoço e petiscos) ────────────────────
const CARDAPIO = [
  {
    cat: "Almoço",
    itens: [
      { nome: "Prato Feito",   desc: "Arroz, feijão, carne, acompanhamentos", preco: "18,90" },
      { nome: "Executivo",     desc: "PF + salada + suco ou refri",           preco: "24,90" },
      { nome: "Marmita G",     desc: "Arroz, feijão, 2 carnes, salada",       preco: "22,90" },
    ],
  },
  {
    cat: "Petiscos",
    itens: [
      { nome: "Porção de Frango", desc: "500g de frango frito crocante", preco: "29,90" },
      { nome: "Isca de Peixe",    desc: "400g com molho tártaro",        preco: "27,90" },
      { nome: "Batata Frita",     desc: "Porção generosa com cheddar",   preco: "19,90" },
    ],
  },
  {
    cat: "Bebidas",
    itens: [
      { nome: "Chopp 300ml",      desc: "Sempre gelado e cremoso",       preco: "8,90"  },
      { nome: "Suco Natural",     desc: "Laranja, maracujá ou abacaxi",  preco: "9,90"  },
      { nome: "Refrigerante",     desc: "Lata 350ml gelada",             preco: "5,90"  },
    ],
  },
];

// ── AVALIAÇÕES ─────────────────────────────────────────────
const AVALIACOES = [
  { nome: "Ana Lima",    nota: 5, txt: "Pizza maravilhosa, massa fininha do jeito que eu gosto. Já virou rotina aqui em casa." },
  { nome: "Carlos S.",   nota: 5, txt: "Almoço farto, preço justo. O prato feito vem cheio. É o melhor da região."            },
  { nome: "Patrícia M.", nota: 5, txt: "Chopp sempre gelado e o ambiente é aconchegante. A família toda adora!"               },
  { nome: "Roberto A.",  nota: 4, txt: "Calabresa especial — recheio generoso de verdade. Virou meu pedido toda sexta."       },
  { nome: "Fernanda C.", nota: 5, txt: "A pizza 4 queijos é de outro nível! Entrega rápida e ainda chegou quentinha."         },
  { nome: "Diego M.",    nota: 5, txt: "Melhor prato feito do subúrbio. Preço justo e porção grande. Recomendo demais!"       },
];
