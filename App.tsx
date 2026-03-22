// ============================================================
// GUEDE'S RESTAURANTE E PIZZARIA — Site Institucional v2
// Estilo: Pôster editorial / fundo creme / tipografia pesada
// Autor: gerado com assistência de IA
// ============================================================

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// CONFIGURAÇÕES GLOBAIS
// Altere aqui para atualizar o site inteiro
// ─────────────────────────────────────────────

// Número do WhatsApp (sem + e sem espaços)
const WPP = "5571999767523";

// Endereço exibido no site
const ENDERECO = "R. Domingos Pires, 50 — Periperi, Salvador";

// Link do Google Maps para o endereço
const MAPS = "https://maps.google.com/?q=Rua+Domingos+Pires+50+Periperi+Salvador+BA";

// ─────────────────────────────────────────────
// DADOS DE HORÁRIO
// Cada objeto representa uma faixa de dias
// fimMin = horário de fechamento em minutos (ex: 15*60 = 15h00)
// ─────────────────────────────────────────────
const HORARIOS = [
  { dias: "Seg — Qui", horas: "11h30 – 15h00", fimMin: 15 * 60 },
  { dias: "Sex — Dom", horas: "11h30 – 23h00", fimMin: 23 * 60 },
];

// ─────────────────────────────────────────────
// CARDÁPIO
// Adicione ou remova itens livremente em cada categoria.
// Cada item tem: nome, desc (descrição curta) e preco (string)
// ─────────────────────────────────────────────
const CARDAPIO = [
  {
    cat: "Pizzas", // Nome da aba/categoria
    itens: [
      { nome: "Calabresa",     desc: "Calabresa fatiada, cebola, azeitona",        preco: "39,90" },
      { nome: "Frango c/ Milho", desc: "Frango desfiado, milho, catupiry",          preco: "42,90" },
      { nome: "Portuguesa",    desc: "Presunto, ovo, cebola, azeitona",             preco: "44,90" },
      { nome: "Mussarela",     desc: "Mussarela derretida, tomate fresco",          preco: "37,90" },
      { nome: "4 Queijos",     desc: "Mussarela, provolone, catupiry, parmesão",    preco: "46,90" },
      { nome: "Pepperoni",     desc: "Pepperoni artesanal, mussarela",              preco: "48,90" },
    ],
  },
  {
    cat: "Almoço",
    itens: [
      { nome: "Prato Feito",   desc: "Arroz, feijão, carne, acompanhamentos",       preco: "18,90" },
      { nome: "Executivo",     desc: "PF + salada + suco ou refri",                 preco: "24,90" },
      { nome: "Marmita G",     desc: "Arroz, feijão, 2 carnes, salada",             preco: "22,90" },
    ],
  },
  {
    cat: "Petiscos",
    itens: [
      { nome: "Porção de Frango", desc: "500g de frango frito crocante",            preco: "29,90" },
      { nome: "Chopp 300ml",   desc: "Sempre gelado, sempre cremoso",               preco: "8,90"  },
      { nome: "Refrigerante",  desc: "Lata 350ml gelada",                           preco: "5,90"  },
    ],
  },
];

// ─────────────────────────────────────────────
// AVALIAÇÕES DE CLIENTES
// Substitua por avaliações reais do Google ou WhatsApp
// nota: número de estrelas (1 a 5)
// ─────────────────────────────────────────────
const AVALIACOES = [
  { nome: "Ana Lima",    txt: "Pizza maravilhosa, massa fininha do jeito que eu gosto. Já virou rotina aqui em casa.", nota: 5 },
  { nome: "Carlos S.",   txt: "Almoço farto, preço justo. O prato feito vem cheio. É o melhor da região.",           nota: 5 },
  { nome: "Patrícia M.", txt: "Chopp sempre gelado e o ambiente é aconchegante. A família toda adora!",              nota: 5 },
  { nome: "Roberto A.",  txt: "Calabresa especial — recheio generoso de verdade. Virou meu pedido toda sexta.",      nota: 4 },
];

// ─────────────────────────────────────────────
// PALETA DE CORES
// Centralizada para facilitar ajustes visuais
// ─────────────────────────────────────────────
const C = {
  cream:   "#F4EFE4", // fundo principal (creme/papel)
  paper:   "#EDE7D9", // fundo secundário (levemente mais escuro)
  ink:     "#1C1510", // preto quase puro (texto e bordas)
  red:     "#CC2B1D", // vermelho principal (CTAs e destaques)
  redDark: "#9E1F14", // vermelho escuro (hover dos botões vermelhos)
  muted:   "#7A6E62", // cinza para textos secundários/labels
  line:    "#D4CCBE", // cor de divisórias e bordas sutis
  white:   "#FDFAF5", // branco levemente amarelado (cards)
};

// ─────────────────────────────────────────────
// FUNÇÃO: isOpen()
// Verifica se o restaurante está aberto AGORA
// com base no dia da semana e horário atual.
// Retorna: true (aberto) ou false (fechado)
// ─────────────────────────────────────────────
function isOpen() {
  const d   = new Date();
  const day = d.getDay();                      // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const t   = d.getHours() * 60 + d.getMinutes(); // horário atual em minutos totais
  const abre = 11 * 60 + 30;                  // 11h30 em minutos

  // Segunda (1) a Quinta (4): fecha às 15h00
  if (day >= 1 && day <= 4) return t >= abre && t < 15 * 60;

  // Sexta (5), Sábado (6) e Domingo (0): fecha às 23h00
  return t >= abre && t < 23 * 60;
}

// ─────────────────────────────────────────────
// HOOK: useInView()
// Detecta quando um elemento entra na viewport.
// Usado para disparar animações de entrada.
// Retorna: [ref, visível]
// ─────────────────────────────────────────────
function useInView() {
  const ref      = useRef(null);
  const [v, setV] = useState(false); // false = ainda não apareceu na tela

  useEffect(() => {
    // IntersectionObserver observa o elemento referenciado
    // threshold: 0.1 = dispara quando 10% do elemento está visível
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setV(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);

    // Cleanup: para de observar ao desmontar o componente
    return () => obs.disconnect();
  }, []);

  return [ref, v];
}

// ─────────────────────────────────────────────
// COMPONENTE: Reveal
// Envolve qualquer conteúdo com animação de
// "aparecer subindo" ao entrar na viewport.
// Props:
//   delay  = atraso em segundos (ex: 0.1)
//   style  = estilos extras opcionais
// ─────────────────────────────────────────────
function Reveal({ children, delay = 0, style }) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      style={{
        // Começa invisível e deslocado para baixo; anima para opaco e posição original
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL: GuedesV2
// ─────────────────────────────────────────────
export default function GuedesV2() {

  // Estado da aba ativa no cardápio (0 = Pizzas, 1 = Almoço, 2 = Petiscos)
  const [tab, setTab] = useState(0);

  // Estado do texto de busca no campo de pesquisa do cardápio
  const [busca, setBusca] = useState("");

  // Verifica se está aberto no momento em que o componente renderiza
  const aberto = isOpen();

  // ─────────────────────────────────────────
  // FUNÇÃO: w(msg)
  // Gera o link do WhatsApp com mensagem pré-preenchida.
  // Se nenhuma mensagem for passada, usa a mensagem padrão.
  // ─────────────────────────────────────────
  const w = (msg = "Olá! Vim pelo site e quero fazer um pedido 🍕") =>
    `https://wa.me/${WPP}?text=${encodeURIComponent(msg)}`;

  // ─────────────────────────────────────────
  // LÓGICA DE BUSCA NO CARDÁPIO
  // Se o campo estiver vazio, filtrado = null (mostra a aba ativa normalmente)
  // Se tiver texto, filtra todos os itens de todas as categorias
  // buscando no nome E na descrição (case insensitive)
  // ─────────────────────────────────────────
  const filtrado = busca.trim()
    ? CARDAPIO
        .flatMap(categoria => categoria.itens) // une todos os itens em uma lista só
        .filter(item =>
          item.nome.toLowerCase().includes(busca.toLowerCase()) ||
          item.desc.toLowerCase().includes(busca.toLowerCase())
        )
    : null; // null = não está buscando, usa a aba normal

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.cream, color: C.ink, fontFamily: "sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── ESTILOS GLOBAIS ───────────────────────────────────────
          Importa 3 fontes do Google Fonts:
          - Bebas Neue: display condensado pra títulos grandes
          - Syne: sans-serif geométrico pra labels e corpo
          - DM Serif Display: serif elegante pra textos longos
      ─────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F4EFE4; }

        /* Classes utilitárias de tipografia */
        .bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .syne  { font-family: 'Syne', sans-serif; }
        .serif { font-family: 'DM Serif Display', Georgia, serif; }

        /* ── BOTÕES ──────────────────────────────────────────
           3 variantes: sólido escuro, outline, vermelho
        ──────────────────────────────────────────────────── */

        /* Botão primário: fundo escuro, vira vermelho no hover */
        .btn-solid {
          background: ${C.ink}; color: ${C.white}; border: none;
          padding: 14px 30px; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-solid:hover { background: ${C.red}; }

        /* Botão secundário: borda escura, inverte no hover */
        .btn-outline {
          background: transparent; color: ${C.ink};
          border: 2px solid ${C.ink}; padding: 13px 30px;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-outline:hover { background: ${C.ink}; color: ${C.white}; }

        /* Botão de ação principal: vermelho (WhatsApp, pedir agora) */
        .btn-red {
          background: ${C.red}; color: ${C.white}; border: none;
          padding: 14px 30px; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-red:hover { background: ${C.redDark}; }

        /* ── ITEM DO CARDÁPIO ──────────────────────────────────
           Layout de linha horizontal (estilo menu impresso)
           Hover desloca levemente à direita e muda cor do nome
        ──────────────────────────────────────────────────────── */
        .menu-item {
          border-bottom: 1px solid ${C.line};
          padding: 20px 0;
          display: grid;
          grid-template-columns: 1fr auto; /* nome+desc na esquerda, preço na direita */
          gap: 16px;
          align-items: start;
          cursor: pointer;
          transition: padding 0.15s;
        }
        .menu-item:hover { padding-left: 8px; }
        .menu-item:hover .item-nome { color: ${C.red}; }

        /* ── ABAS DO CARDÁPIO ─────────────────────────────── */
        .tab-pill {
          background: none; border: 1.5px solid ${C.line};
          padding: 8px 20px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          transition: all 0.15s; color: ${C.muted};
        }
        .tab-pill.active { background: ${C.ink}; border-color: ${C.ink}; color: ${C.white}; }
        .tab-pill:hover:not(.active) { border-color: ${C.ink}; color: ${C.ink}; }

        /* ── CAMPO DE BUSCA ───────────────────────────────────
           Sem borda visível exceto a linha inferior (estilo minimalista)
        ──────────────────────────────────────────────────────── */
        .search-raw {
          width: 100%; border: none; border-bottom: 2px solid ${C.ink};
          background: transparent; padding: 12px 0;
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600;
          color: ${C.ink}; outline: none;
        }
        .search-raw::placeholder { color: ${C.muted}; font-weight: 400; }

        /* ── CARD DE AVALIAÇÃO ──────────────────────────────── */
        .av-card {
          border: 1.5px solid ${C.line}; padding: 28px;
          background: ${C.white}; transition: border-color 0.2s;
        }
        .av-card:hover { border-color: ${C.ink}; }

        /* ── CARIMBO DE FIDELIDADE ──────────────────────────────
           Estilo de carimbo rotacionado, como etiqueta de loja
        ──────────────────────────────────────────────────────── */
        .stamp {
          display: inline-block; border: 3px solid ${C.red};
          padding: 4px 14px; transform: rotate(-2deg);
          font-family: 'Bebas Neue', sans-serif; font-size: 15px;
          letter-spacing: 0.1em; color: ${C.red};
        }

        /* ── LINKS DA NAVEGAÇÃO ─────────────────────────────── */
        .nav-link {
          font-family: 'Syne', sans-serif; font-size: 12px;
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: ${C.muted}; text-decoration: none; transition: color 0.15s;
        }
        .nav-link:hover { color: ${C.ink}; }

        /* ── LETRA DECORATIVA NO HERO ───────────────────────────
           Grande "G" de fundo — elemento visual, não lido pelo usuário
        ──────────────────────────────────────────────────────── */
        .big-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(100px, 22vw, 240px);
          line-height: 0.85; color: ${C.paper}; /* mesma cor do fundo = quase invisível */
          position: absolute; right: -2vw; top: -20px;
          pointer-events: none; user-select: none; z-index: 0;
        }

        /* ── BOTÃO FLUTUANTE DO WHATSAPP ────────────────────────
           Fixo no canto inferior direito.
           Sombra deslocada simula efeito de carimbo impresso.
        ──────────────────────────────────────────────────────── */
        .wpp-float {
          position: fixed; bottom: 28px; right: 28px; z-index: 999;
          width: 56px; height: 56px; background: #25D366;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; box-shadow: 4px 4px 0 #1a9d4e; /* sombra deslocada */
          transition: all 0.15s;
        }
        /* Hover: move o botão pra cima/esquerda e aumenta a sombra */
        .wpp-float:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #1a9d4e; }

        /* ── LABEL DE SEÇÃO ─────────────────────────────────────
           Pequeno label vermelho com borda esquerda, acima dos títulos
        ──────────────────────────────────────────────────────── */
        .section-label {
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; color: ${C.red};
          border-left: 3px solid ${C.red}; padding-left: 10px;
          display: inline-block; margin-bottom: 20px;
        }

        /* ── FAIXA DE TEXTO ROLANDO (MARQUEE) ──────────────────
           Animação CSS pura, sem JavaScript.
           Duplicamos o conteúdo (Array(8)) pra criar loop infinito.
        ──────────────────────────────────────────────────────── */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); } /* move metade = exatamente 1 loop */
        }
        .marquee-track {
          animation: marquee 18s linear infinite;
          display: flex;
          white-space: nowrap;
        }

        /* ── CARROSSEL DE AVALIAÇÕES ────────────────────────────
           Scroll automático horizontal.
           Pausa ao passar o mouse (av-track:hover).
           Gradiente nas bordas (av-outer::before/after) para suavizar.
        ──────────────────────────────────────────────────────── */
        @keyframes av-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .av-track {
          display: flex; gap: 16px;
          animation: av-scroll 28s linear infinite;
          width: max-content;
        }
        .av-track:hover { animation-play-state: paused; } /* pausa ao hover */

        .av-outer { overflow: hidden; position: relative; }

        /* Gradiente nas bordas para dar efeito de "desvanecimento" */
        .av-outer::before, .av-outer::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none;
        }
        .av-outer::before { left: 0;  background: linear-gradient(to right, #1C1510, transparent); }
        .av-outer::after  { right: 0; background: linear-gradient(to left,  #1C1510, transparent); }

        /* Transição de cor no nome do item do cardápio */
        .item-nome { transition: color 0.15s; }
      `}</style>

      {/* ── NAVEGAÇÃO SUPERIOR ──────────────────────────────────────
          Fixo no topo. Contém:
          - Logo (texto)
          - Links de âncora para as seções
          - Badge de status (aberto/fechado em tempo real)
      ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: C.cream, borderBottom: `2px solid ${C.ink}`,
        padding: "0 5vw", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo em Bebas Neue */}
        <span className="bebas" style={{ fontSize: 26, letterSpacing: 3 }}>GUEDE'S</span>

        {/* Links de navegação — gerados dinamicamente a partir do array */}
        <nav style={{ display: "flex", gap: 32 }}>
          {[
            ["#cardapio",    "Cardápio"],
            ["#horario",     "Horário"],
            ["#avaliacoes",  "Avaliações"],
            ["#localizacao", "Localização"],
          ].map(([href, label]) => (
            <a key={href} className="nav-link" href={href}>{label}</a>
          ))}
        </nav>

        {/* Badge de status: bolinha verde/vermelha + texto */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: aberto ? "#25D366" : C.red, // verde se aberto, vermelho se fechado
            display: "inline-block",
          }} />
          <span className="syne" style={{
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: aberto ? "#1a7d3e" : C.red,
          }}>
            {aberto ? "Aberto" : "Fechado"}
          </span>
        </div>
      </header>

      {/* ── FAIXA MARQUEE ──────────────────────────────────────────
          Fundo escuro com texto rolando da direita pra esquerda.
          O Array(8) repete o conteúdo 8 vezes para criar o loop.
          A animação CSS move exatamente -50% (metade do dobro do conteúdo).
      ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 56, background: C.ink, overflow: "hidden", padding: "10px 0" }}>
        <div className="marquee-track">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="bebas" style={{ color: C.cream, fontSize: 15, letterSpacing: 4, marginRight: 40 }}>
              GUEDE'S RESTAURANTE E PIZZARIA &nbsp;·&nbsp; PERIPERI, SALVADOR &nbsp;·&nbsp; PIZZA · ALMOÇO · CHOPP &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────
          Layout assimétrico tipo pôster.
          - "G" enorme no fundo (decorativo, quase invisível)
          - Título com clamp() para responsividade
          - Barra de informações rápidas (entrega, avaliação, endereço)
          - Bloco de 2 colunas: texto à esquerda, caixa vermelha à direita
      ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: "60px 5vw 0", maxWidth: 1200, margin: "0 auto" }}>

        {/* Título principal com letra decorativa de fundo */}
        <Reveal>
          <div style={{ position: "relative", overflow: "visible" }}>
            {/* "G" decorativo — posicionado absolutamente atrás do título */}
            <span className="big-num">G</span>

            {/* Título real — z-index 1 para ficar na frente do "G" */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="section-label">Desde quando Periperi tem fome</span>
              <h1 className="bebas" style={{
                fontSize: "clamp(72px, 15vw, 160px)", // responsivo: min 72px, ideal 15vw, max 160px
                lineHeight: 0.9,
                letterSpacing: 2,
                maxWidth: "70%", // evita que o título quebre de forma estranha
              }}>
                PIZZA<br />
                <span style={{ color: C.red }}>DE VERDADE.</span><br />
                TODO DIA.
              </h1>
            </div>
          </div>
        </Reveal>

        {/* Barra horizontal com métricas rápidas + botões de ação */}
        <Reveal delay={0.1}>
          <div style={{
            borderTop: `2px solid ${C.ink}`, borderBottom: `2px solid ${C.ink}`,
            margin: "40px 0", padding: "20px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
          }}>
            {/* Métricas: entrega / avaliação / endereço */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div>
                <p className="syne" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Entrega</p>
                <p className="bebas" style={{ fontSize: 28, letterSpacing: 1 }}>30–50 MIN</p>
              </div>
              <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
                <p className="syne" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Avaliação</p>
                <p className="bebas" style={{ fontSize: 28, letterSpacing: 1 }}>4.9 ★</p>
              </div>
              <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
                <p className="syne" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Endereço</p>
                <p className="syne" style={{ fontSize: 14, fontWeight: 600 }}>{ENDERECO}</p>
              </div>
            </div>

            {/* CTAs: "Ver Cardápio" (scroll suave) e "Pedir Agora" (WhatsApp) */}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-solid" onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })}>
                Ver Cardápio
              </button>
              <a href={w()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-red">Pedir Agora</button>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Bloco assimétrico: texto do restaurante + caixa vermelha com pagamentos */}
        <Reveal delay={0.15}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr", // coluna esquerda maior (texto)
            gap: 0,
            marginBottom: 80,
            border: `2px solid ${C.ink}`,
          }}>
            {/* Coluna esquerda: apresentação do restaurante */}
            <div style={{ padding: "48px 40px", borderRight: `2px solid ${C.ink}` }}>
              <span className="section-label">O Guede's</span>
              <p className="serif" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", lineHeight: 1.5, marginBottom: 24 }}>
                Aqui em Periperi, a mesa nunca esfriou.<br />
                Pizza de forno, almoço de panela e chopp tirado na hora — desde que a gente abriu essa porta.
              </p>
              <p className="syne" style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Não somos delivery de app. Somos o restaurante do bairro, onde o dono conhece o cliente pelo nome e a massa da pizza ainda é aberta na mão.
              </p>
            </div>

            {/* Coluna direita: fundo vermelho com formas de pagamento + carimbo de fidelidade */}
            <div style={{ background: C.red, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className="bebas" style={{ fontSize: 13, letterSpacing: 6, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>PAGAMOS EM</p>
                {/* Lista de formas de pagamento com separadores */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {["Dinheiro", "Débito", "Crédito", "Pix"].map(pagamento => (
                    <div key={pagamento} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      paddingBottom: 10,
                      display: "flex", justifyContent: "space-between",
                    }}>
                      <span className="syne" style={{ fontWeight: 700, color: "white", fontSize: 15 }}>{pagamento}</span>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carimbo de fidelidade — rotacionado levemente para parecer impresso */}
              <div>
                <div className="stamp">Fidelidade: 10 pedidos = 30% off</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── CARDÁPIO ────────────────────────────────────────────────
          Fundo branco para diferenciar do hero.
          Layout de lista (estilo menu impresso), não cards.
          Funcionalidades:
            - Abas por categoria (ocultas durante busca)
            - Campo de busca com feedback de resultados
            - Cada item abre WhatsApp com mensagem pré-preenchida
      ─────────────────────────────────────────────────────────── */}
      <div id="cardapio" style={{ background: C.white, borderTop: `2px solid ${C.ink}`, borderBottom: `2px solid ${C.ink}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>

          {/* Cabeçalho do cardápio: título + campo de busca lado a lado */}
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
              <div>
                <span className="section-label">O que servimos</span>
                <h2 className="bebas" style={{ fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 0.9 }}>CARDÁPIO</h2>
              </div>
              {/* Campo de busca minimalista (só linha inferior) */}
              <div style={{ position: "relative", width: 280 }}>
                <input
                  className="search-raw"
                  placeholder="Buscar no cardápio..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
            </div>
          </Reveal>

          {/* Abas de categoria — só aparecem quando não está buscando */}
          {!busca && (
            <Reveal delay={0.05}>
              <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
                {CARDAPIO.map((categoria, i) => (
                  <button
                    key={i}
                    className={`tab-pill${tab === i ? " active" : ""}`}
                    onClick={() => setTab(i)} // troca a aba ativa
                  >
                    {categoria.cat}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Contador de resultados — só aparece durante busca ativa */}
          {busca && (
            <p className="syne" style={{ fontSize: 13, color: C.muted, marginBottom: 24, fontWeight: 600 }}>
              {filtrado?.length || 0} resultado{filtrado?.length !== 1 ? "s" : ""} para "{busca}"
            </p>
          )}

          {/* Lista de itens do cardápio
              Se filtrado !== null → mostra resultados da busca
              Senão → mostra itens da aba ativa (CARDAPIO[tab].itens)
              Cada item é um link direto pro WhatsApp com o item no texto */}
          <div>
            {(filtrado || CARDAPIO[tab].itens).map((item, i) => (
              <Reveal key={item.nome} delay={i * 0.04}> {/* delay escalonado para efeito cascata */}
                <a
                  href={w(`Olá! Quero pedir: ${item.nome} — R$ ${item.preco} 🍕`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="menu-item">
                    {/* Lado esquerdo: nome + descrição */}
                    <div>
                      <p className="syne item-nome" style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{item.nome}</p>
                      <p className="syne" style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>{item.desc}</p>
                    </div>
                    {/* Lado direito: preço + CTA */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p className="bebas" style={{ fontSize: 26, letterSpacing: 1 }}>R$ {item.preco}</p>
                      <p className="syne" style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pedir →</p>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}

            {/* Mensagem de "não encontrado" quando a busca não retorna nada */}
            {filtrado?.length === 0 && (
              <p className="syne" style={{ color: C.muted, padding: "40px 0", fontSize: 15 }}>
                Nenhum item encontrado.
              </p>
            )}
          </div>

          {/* Link para cardápio completo pelo WhatsApp */}
          <Reveal delay={0.1}>
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.line}` }}>
              <a href={w("Olá! Quero ver o cardápio completo 🍕")} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-outline">Cardápio completo pelo WhatsApp →</button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── HORÁRIO DE FUNCIONAMENTO ────────────────────────────────
          Grid de 2 colunas com os horários em tipografia grande.
          Abaixo: cards de "Retirada no local" e "Agendar pedido".
      ─────────────────────────────────────────────────────────── */}
      <div id="horario" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>
        <Reveal>
          <span className="section-label">Quando estamos aqui</span>

          {/* Grade de horários — cada faixa em uma célula */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, border: `2px solid ${C.ink}`, marginTop: 8 }}>
            {HORARIOS.map(({ dias, horas }) => (
              <div key={dias} style={{ padding: "40px 36px", borderRight: `1px solid ${C.ink}` }}>
                {/* Label dos dias em caixa alta, cor suave */}
                <p className="syne" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>{dias}</p>
                {/* Horário em Bebas Neue grande — responsivo com clamp() */}
                <p className="bebas" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1 }}>{horas}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Cards de serviços adicionais: retirada e agendamento */}
        <Reveal delay={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
            <div style={{ background: C.paper, border: `1.5px solid ${C.line}`, padding: "28px 32px" }}>
              <p className="syne" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Retirada no local</p>
              <p className="serif" style={{ fontSize: 18, lineHeight: 1.5 }}>
                Retire seu pedido aqui e ganhe <strong>desconto especial</strong>. Basta avisar pelo WhatsApp.
              </p>
            </div>
            <div style={{ background: C.paper, border: `1.5px solid ${C.line}`, padding: "28px 32px" }}>
              <p className="syne" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Agendar pedido</p>
              <p className="serif" style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 16 }}>
                Quer garantir seu pedido com hora marcada? Manda mensagem.
              </p>
              <a href={w("Olá! Quero agendar um pedido 📅")} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-solid">Agendar pelo WhatsApp</button>
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── AVALIAÇÕES ──────────────────────────────────────────────
          Fundo escuro (ink) para contrastar com o restante do site.
          Carrossel horizontal automático com pausa no hover.
          As avaliações são duplicadas ([...AVALIACOES, ...AVALIACOES])
          para criar o efeito de loop contínuo no scroll.
      ─────────────────────────────────────────────────────────── */}
      <div id="avaliacoes" style={{ background: C.ink, borderTop: `2px solid ${C.ink}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>

          {/* Cabeçalho: título à esquerda, nota grande à direita */}
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
              <div>
                {/* Label de seção adaptado para fundo escuro (usa C.red) */}
                <span style={{
                  fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase", color: C.red,
                  borderLeft: `3px solid ${C.red}`, paddingLeft: 10,
                  display: "inline-block", marginBottom: 20,
                }}>O que o pessoal fala</span>
                <h2 className="bebas" style={{ fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 0.9, color: C.cream }}>AVALIAÇÕES</h2>
              </div>
              {/* Nota média em destaque — número enorme em vermelho */}
              <div style={{ textAlign: "right" }}>
                <p className="bebas" style={{ fontSize: 72, lineHeight: 1, color: C.red }}>4.9</p>
                <p className="syne" style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.1em" }}>★★★★★ +100 avaliações</p>
              </div>
            </div>
          </Reveal>

          {/* Carrossel de avaliações com scroll automático
              - av-outer: container com overflow hidden e gradientes nas bordas
              - av-track: faixa animada com os cards
              - Duplicamos AVALIACOES para criar loop infinito sem reiniciar visivelmente */}
          <div className="av-outer">
            <div className="av-track">
              {[...AVALIACOES, ...AVALIACOES].map((av, i) => (
                <div
                  key={i}
                  className="av-card"
                  style={{
                    background: C.paper,
                    border: `1px solid ${C.line}`,
                    minWidth: 300,   // largura fixa para o carrossel funcionar
                    maxWidth: 300,
                    flexShrink: 0,
                    whiteSpace: "normal", // permite quebra de linha dentro do card
                  }}
                >
                  <p className="syne" style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{av.nome}</p>
                  {/* Estrelas geradas dinamicamente com repeat() */}
                  <p style={{ color: "#d4a800", fontSize: 13, marginBottom: 16 }}>{"★".repeat(av.nota)}</p>
                  <p className="syne" style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>"{av.txt}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA para deixar avaliação */}
          <Reveal delay={0.1}>
            <div style={{ marginTop: 40 }}>
              <a href={w("Olá! Quero deixar minha avaliação ⭐")} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn-red">Deixar avaliação →</button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── LOCALIZAÇÃO ─────────────────────────────────────────────
          Grid de 2 colunas:
          - Esquerda: endereço + botão Maps / contato + botão WhatsApp
          - Direita: iframe do Google Maps embutido
      ─────────────────────────────────────────────────────────── */}
      <div id="localizacao" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>
        <Reveal>
          <span className="section-label">Onde a gente fica</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 0, border: `2px solid ${C.ink}`, marginTop: 8 }}>

            {/* Coluna esquerda — dividida em dois blocos com separador */}
            <div style={{ borderRight: `2px solid ${C.ink}` }}>

              {/* Bloco do endereço */}
              <div style={{ padding: "40px", borderBottom: `1px solid ${C.line}` }}>
                <p className="bebas" style={{ fontSize: 13, letterSpacing: 4, color: C.muted, marginBottom: 12 }}>ENDEREÇO</p>
                <p className="serif" style={{ fontSize: 22, lineHeight: 1.4, marginBottom: 24 }}>{ENDERECO}</p>
                <a href={MAPS} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-solid">Abrir no Maps →</button>
                </a>
              </div>

              {/* Bloco de contato */}
              <div style={{ padding: "40px" }}>
                <p className="bebas" style={{ fontSize: 13, letterSpacing: 4, color: C.muted, marginBottom: 12 }}>FALE CONOSCO</p>
                <p className="serif" style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 24 }}>
                  Pedidos, reservas e dúvidas direto no WhatsApp — respondemos rápido.
                </p>
                <a href={w()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-red">Chamar no WhatsApp →</button>
                </a>
              </div>
            </div>

            {/* Coluna direita: mapa do Google embutido via iframe
                loading="lazy" para não atrasar o carregamento da página */}
            <div style={{ minHeight: 400 }}>
              <iframe
                title="Mapa Guede's"
                src="https://maps.google.com/maps?q=Rua+Domingos+Pires,+50,+Periperi,+Salvador,+BA&output=embed"
                width="100%" height="100%"
                style={{ border: 0, display: "block", minHeight: 400 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────
          Fundo escuro, logo + localização + links de redes sociais
      ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: C.ink, borderTop: `2px solid ${C.ink}`, padding: "48px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>

          {/* Logo e subtítulo */}
          <div>
            <p className="bebas" style={{ fontSize: 36, color: C.cream, letterSpacing: 3 }}>GUEDE'S</p>
            <p className="syne" style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Restaurante e Pizzaria — Periperi, Salvador</p>
          </div>

          {/* Links para redes sociais */}
          <div style={{ display: "flex", gap: 12 }}>
            <a href="https://instagram.com/guedesrestaurantee" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              {/* btn-outline com cor adaptada para fundo escuro */}
              <button className="btn-outline" style={{ color: C.cream, borderColor: "rgba(255,255,255,0.2)" }}>Instagram</button>
            </a>
            <a href={w()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-red">WhatsApp</button>
            </a>
          </div>

          {/* Copyright */}
          <p className="syne" style={{
            fontSize: 12, color: C.muted, width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24,
          }}>
            © 2025 Guede's Restaurante e Pizzaria. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* ── BOTÃO FLUTUANTE DO WHATSAPP ──────────────────────────────
          Fixo no canto inferior direito em todas as páginas.
          Ícone SVG oficial do WhatsApp (branco sobre verde).
          Sombra deslocada no estilo "carimbo/caricatura" para combinar
          com a estética editorial do site.
      ─────────────────────────────────────────────────────────── */}
      <a href={w()} target="_blank" rel="noopener noreferrer" className="wpp-float" title="Chamar no WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

    </div> // fim do container principal
  );
}
