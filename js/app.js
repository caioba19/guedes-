// ============================================================
// GUEDE'S — App React Principal
// Arquivo: js/app.js
//
// Este arquivo contém toda a lógica e estrutura visual do site.
// Os dados (cardápio, horários etc.) estão em js/data.js
// Os estilos estão em css/style.css
// ============================================================

// Desestrutura hooks do React (carregado via CDN no index.html)
const { useState, useEffect, useRef } = React;

// ── FUNÇÃO: isOpen() ──────────────────────────────────────
// Verifica se o restaurante está aberto agora
// com base no dia da semana e hora atual.
function isOpen() {
  const d    = new Date();
  const day  = d.getDay();                          // 0=dom, 1=seg ... 6=sáb
  const mins = d.getHours() * 60 + d.getMinutes(); // hora atual em minutos
  const abre = 11 * 60 + 30;                       // 11h30

  if (day >= 1 && day <= 4) return mins >= abre && mins < 15 * 60; // seg–qui
  return mins >= abre && mins < 23 * 60;                            // sex–dom
}

// ── HOOK: useInView() ─────────────────────────────────────
// Detecta quando um elemento HTML entra na viewport.
// Usado para disparar animações de entrada (ver: Reveal).
// Retorna: [ref, visível]
function useInView() {
  const ref       = useRef(null);
  const [v, setV] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setV(true); },
      { threshold: 0.1 } // dispara quando 10% do elemento está visível
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect(); // limpa ao desmontar o componente
  }, []);

  return [ref, v];
}

// ── COMPONENTE: Reveal ────────────────────────────────────
// Envolve qualquer conteúdo com animação de "subir e aparecer"
// quando o elemento entra na viewport.
// Props:
//   delay → atraso em segundos (ex: 0.1 para efeito cascata)
//   style → estilos extras opcionais
function Reveal({ children, delay = 0, style }) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={visible ? "reveal-visible" : "reveal-hidden"}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

// ── COMPONENTE PRINCIPAL: App ─────────────────────────────
function App() {

  // Aba ativa no cardápio (0=Pizzas, 1=Almoço, 2=Petiscos)
  const [tab, setTab]     = useState(0);

  // Texto digitado no campo de busca do cardápio
  const [busca, setBusca] = useState("");

  // Status atual (calculado uma vez ao montar o componente)
  const aberto = isOpen();

  // Gera link do WhatsApp com mensagem pré-preenchida
  const w = (msg = "Olá! Vim pelo site e quero fazer um pedido 🍕") =>
    `https://wa.me/${WPP}?text=${encodeURIComponent(msg)}`;

  // Filtra itens de todas as categorias quando há busca ativa.
  // Retorna null se o campo estiver vazio (usa aba normalmente).
  const filtrado = busca.trim()
    ? CARDAPIO
        .flatMap(c => c.itens)
        .filter(i =>
          i.nome.toLowerCase().includes(busca.toLowerCase()) ||
          i.desc.toLowerCase().includes(busca.toLowerCase())
        )
    : null;

  return (
    <div style={{ background: C.cream, color: C.ink, minHeight: "100vh" }}>

      {/* ── NAV FIXA ──────────────────────────────────────────
          Logo | Links de âncora | Badge aberto/fechado       */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: C.cream, borderBottom: `2px solid ${C.ink}`,
        padding: "0 5vw", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span className="bebas" style={{ fontSize: 26, letterSpacing: 3 }}>GUEDE'S</span>

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

        {/* Badge de status em tempo real */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: aberto ? "#25D366" : C.red,
            display: "inline-block",
          }} />
          <span className="syne" style={{
            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: aberto ? "#1a7d3e" : C.red,
          }}>
            {aberto ? "Aberto" : "Fechado"}
          </span>
        </div>
      </header>

      {/* ── MARQUEE ───────────────────────────────────────────
          Faixa de texto rolando em loop via animação CSS pura */}
      <div style={{ marginTop: 56, background: C.ink, overflow: "hidden", padding: "10px 0" }}>
        <div className="marquee-track">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="bebas" style={{ color: C.cream, fontSize: 15, letterSpacing: 4, marginRight: 40 }}>
              GUEDE'S RESTAURANTE E PIZZARIA &nbsp;·&nbsp; PERIPERI, SALVADOR &nbsp;·&nbsp; PIZZA · ALMOÇO · CHOPP &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────
          Layout assimétrico estilo pôster tipográfico.        */}
      <div style={{ padding: "60px 5vw 0", maxWidth: 1200, margin: "0 auto" }}>

        {/* Título com "G" ornamental de fundo */}
        <Reveal>
          <div style={{ position: "relative", overflow: "visible" }}>
            <span className="big-num">G</span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="section-label">Desde quando Periperi tem fome</span>
              <h1 className="bebas" style={{ fontSize: "clamp(72px, 15vw, 160px)", lineHeight: 0.9, letterSpacing: 2, maxWidth: "70%" }}>
                PIZZA<br />
                <span style={{ color: C.red }}>DE VERDADE.</span><br />
                TODO DIA.
              </h1>
            </div>
          </div>
        </Reveal>

        {/* Barra de métricas + botões de ação */}
        <Reveal delay={0.1}>
          <div style={{
            borderTop: `2px solid ${C.ink}`, borderBottom: `2px solid ${C.ink}`,
            margin: "40px 0", padding: "20px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
          }}>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[
                { label: "Entrega",   valor: "30–50 MIN" },
                { label: "Avaliação", valor: "4.9 ★"     },
              ].map(({ label, valor }) => (
                <div key={label} style={{ borderLeft: label !== "Entrega" ? `1px solid ${C.line}` : "none", paddingLeft: label !== "Entrega" ? 40 : 0 }}>
                  <p className="syne" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>{label}</p>
                  <p className="bebas" style={{ fontSize: 28 }}>{valor}</p>
                </div>
              ))}
              <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
                <p className="syne" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Endereço</p>
                <p className="syne" style={{ fontSize: 14, fontWeight: 600 }}>{ENDERECO}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-solid" onClick={() => document.getElementById("cardapio").scrollIntoView({ behavior: "smooth" })}>
                Ver Cardápio
              </button>
              <a href={w()} target="_blank" rel="noopener noreferrer">
                <button className="btn-red">Pedir Agora</button>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Bloco assimétrico: texto + caixa vermelha (pagamentos/fidelidade) */}
        <Reveal delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", marginBottom: 80, border: `2px solid ${C.ink}` }}>
            <div style={{ padding: "48px 40px", borderRight: `2px solid ${C.ink}` }}>
              <span className="section-label">O Guede's</span>
              <p className="serif" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", lineHeight: 1.5, marginBottom: 24 }}>
                Aqui em Periperi, a mesa nunca esfriou.<br />
                Pizza de forno, almoço de panela e chopp tirado na hora.
              </p>
              <p className="syne" style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Não somos delivery de app. Somos o restaurante do bairro, onde o dono conhece o cliente pelo nome e a massa da pizza ainda é aberta na mão.
              </p>
            </div>
            <div style={{ background: C.red, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className="bebas" style={{ fontSize: 13, letterSpacing: 6, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>PAGAMOS EM</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                  {["Dinheiro", "Débito", "Crédito", "Pix"].map(p => (
                    <div key={p} style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 10, display: "flex", justifyContent: "space-between" }}>
                      <span className="syne" style={{ fontWeight: 700, color: "white", fontSize: 15 }}>{p}</span>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>✓</span>
                    </div>
                  ))}
                </div>
              </div>
              <div><div className="stamp">Fidelidade: 10 pedidos = 30% off</div></div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── CARDÁPIO ──────────────────────────────────────────
          Fundo branco. Lista estilo menu impresso.
          Busca filtra todas as categorias simultaneamente.    */}
      <div id="cardapio" style={{ background: C.white, borderTop: `2px solid ${C.ink}`, borderBottom: `2px solid ${C.ink}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>

          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
              <div>
                <span className="section-label">O que servimos</span>
                <h2 className="bebas" style={{ fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 0.9 }}>CARDÁPIO</h2>
              </div>
              <input
                className="search-raw"
                style={{ width: 280 }}
                placeholder="Buscar no cardápio..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </Reveal>

          {/* Abas — ocultas durante busca */}
          {!busca && (
            <Reveal delay={0.05}>
              <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
                {CARDAPIO.map((cat, i) => (
                  <button key={i} className={`tab-pill${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>
                    {cat.cat}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Contador de resultados */}
          {busca && (
            <p className="syne" style={{ fontSize: 13, color: C.muted, marginBottom: 24, fontWeight: 600 }}>
              {filtrado?.length || 0} resultado{filtrado?.length !== 1 ? "s" : ""} para "{busca}"
            </p>
          )}

          {/* Lista de itens — delay escalonado cria efeito cascata */}
          <div>
            {(filtrado || CARDAPIO[tab].itens).map((item, i) => (
              <Reveal key={item.nome} delay={i * 0.04}>
                <a href={w(`Olá! Quero pedir: ${item.nome} — R$ ${item.preco} 🍕`)} target="_blank" rel="noopener noreferrer" className="menu-item">
                  <div>
                    <p className="syne item-nome" style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{item.nome}</p>
                    <p className="syne" style={{ fontSize: 13, color: C.muted }}>{item.desc}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p className="bebas" style={{ fontSize: 26 }}>R$ {item.preco}</p>
                    <p className="syne" style={{ fontSize: 11, color: C.red, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pedir →</p>
                  </div>
                </a>
              </Reveal>
            ))}
            {filtrado?.length === 0 && (
              <p className="syne" style={{ color: C.muted, padding: "40px 0", fontSize: 15 }}>Nenhum item encontrado.</p>
            )}
          </div>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.line}` }}>
              <a href={w("Olá! Quero ver o cardápio completo 🍕")} target="_blank" rel="noopener noreferrer">
                <button className="btn-outline">Cardápio completo pelo WhatsApp →</button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── HORÁRIO ───────────────────────────────────────────
          Grade com horários + cards de retirada/agendamento  */}
      <div id="horario" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>
        <Reveal>
          <span className="section-label">Quando estamos aqui</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: `2px solid ${C.ink}`, marginTop: 8 }}>
            {HORARIOS.map(({ dias, horas }) => (
              <div key={dias} style={{ padding: "40px 36px", borderRight: `1px solid ${C.ink}` }}>
                <p className="syne" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>{dias}</p>
                <p className="bebas" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1 }}>{horas}</p>
              </div>
            ))}
          </div>
        </Reveal>

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
              <a href={w("Olá! Quero agendar um pedido 📅")} target="_blank" rel="noopener noreferrer">
                <button className="btn-solid">Agendar pelo WhatsApp</button>
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── AVALIAÇÕES ────────────────────────────────────────
          Fundo escuro. Carrossel horizontal com pausa no hover. */}
      <div id="avaliacoes" style={{ background: C.ink }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
              <div>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.red, borderLeft: `3px solid ${C.red}`, paddingLeft: 10, display: "inline-block", marginBottom: 20 }}>
                  O que o pessoal fala
                </span>
                <h2 className="bebas" style={{ fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 0.9, color: C.cream }}>AVALIAÇÕES</h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="bebas" style={{ fontSize: 72, lineHeight: 1, color: C.red }}>4.9</p>
                <p className="syne" style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.1em" }}>★★★★★ +100 avaliações</p>
              </div>
            </div>
          </Reveal>

          {/* Carrossel — AVALIACOES duplicado para loop infinito */}
          <div className="av-outer">
            <div className="av-track">
              {[...AVALIACOES, ...AVALIACOES].map((av, i) => (
                <div key={i} className="av-card" style={{ background: C.paper, border: `1px solid ${C.line}`, minWidth: 300, maxWidth: 300, flexShrink: 0, whiteSpace: "normal" }}>
                  <p className="syne" style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{av.nome}</p>
                  <p style={{ color: "#d4a800", fontSize: 13, marginBottom: 16 }}>{"★".repeat(av.nota)}</p>
                  <p className="syne" style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>"{av.txt}"</p>
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 40 }}>
              <a href={w("Olá! Quero deixar minha avaliação ⭐")} target="_blank" rel="noopener noreferrer">
                <button className="btn-red">Deixar avaliação →</button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── LOCALIZAÇÃO ───────────────────────────────────────
          Grid 2 colunas: info de contato + mapa embutido      */}
      <div id="localizacao" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5vw" }}>
        <Reveal>
          <span className="section-label">Onde a gente fica</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", border: `2px solid ${C.ink}`, marginTop: 8 }}>
            <div style={{ borderRight: `2px solid ${C.ink}` }}>
              <div style={{ padding: "40px", borderBottom: `1px solid ${C.line}` }}>
                <p className="bebas" style={{ fontSize: 13, letterSpacing: 4, color: C.muted, marginBottom: 12 }}>ENDEREÇO</p>
                <p className="serif" style={{ fontSize: 22, lineHeight: 1.4, marginBottom: 24 }}>{ENDERECO}</p>
                <a href={MAPS} target="_blank" rel="noopener noreferrer">
                  <button className="btn-solid">Abrir no Maps →</button>
                </a>
              </div>
              <div style={{ padding: "40px" }}>
                <p className="bebas" style={{ fontSize: 13, letterSpacing: 4, color: C.muted, marginBottom: 12 }}>FALE CONOSCO</p>
                <p className="serif" style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 24 }}>
                  Pedidos, reservas e dúvidas direto no WhatsApp — respondemos rápido.
                </p>
                <a href={w()} target="_blank" rel="noopener noreferrer">
                  <button className="btn-red">Chamar no WhatsApp →</button>
                </a>
              </div>
            </div>
            <div style={{ minHeight: 400 }}>
              <iframe
                title="Mapa Guede's"
                src="https://maps.google.com/maps?q=Rua+Domingos+Pires,+50,+Periperi,+Salvador,+BA&output=embed"
                width="100%" height="100%"
                style={{ border: 0, display: "block", minHeight: 400 }}
                allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: C.ink, borderTop: `2px solid ${C.ink}`, padding: "48px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <p className="bebas" style={{ fontSize: 36, color: C.cream, letterSpacing: 3 }}>GUEDE'S</p>
            <p className="syne" style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Restaurante e Pizzaria — Periperi, Salvador</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="https://instagram.com/guedesrestaurantee" target="_blank" rel="noopener noreferrer">
              <button className="btn-outline" style={{ color: C.cream, borderColor: "rgba(255,255,255,0.2)" }}>Instagram</button>
            </a>
            <a href={w()} target="_blank" rel="noopener noreferrer">
              <button className="btn-red">WhatsApp</button>
            </a>
          </div>
          <p className="syne" style={{ fontSize: 12, color: C.muted, width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
            © 2025 Guede's Restaurante e Pizzaria. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* ── BOTÃO FLUTUANTE WHATSAPP ───────────────────────── */}
      <a href={w()} target="_blank" rel="noopener noreferrer" className="wpp-float" title="Chamar no WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

    </div>
  );
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────
// Monta o componente App na div#root do index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
