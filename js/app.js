// ============================================================
// GUEDE'S — App Principal
// Arquivo: js/app.js
// ============================================================

const { useState, useEffect, useRef } = React;

// ── isOpen ────────────────────────────────────────────────
function isOpen() {
  const d = new Date(), day = d.getDay();
  const t = d.getHours() * 60 + d.getMinutes();
  const o = 11 * 60 + 30;
  if (day >= 1 && day <= 4) return t >= o && t < 15 * 60;
  return t >= o && t < 23 * 60;
}

// ── useInView ─────────────────────────────────────────────
function useInView() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

// ── Reveal ────────────────────────────────────────────────
function Reveal({ children, delay = 0, style }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={v ? "reveal-visible" : "reveal-hidden"} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ── PizzaBuilder ──────────────────────────────────────────
// Fluxo: 1) Escolha o tamanho → 2) Escolha os sabores → 3) Resumo e envio
function PizzaBuilder({ wppLink }) {
  const [step, setStep]           = useState(1); // 1=tamanho, 2=sabores, 3=resumo
  const [tamanho, setTamanho]     = useState(null);
  const [sabores, setSabores]     = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("Todos");

  const tipos = ["Todos", "Tradicional", "Especial", "Doce"];

  // Filtra sabores pelo tipo selecionado
  const saboresFiltrados = tipoFiltro === "Todos"
    ? SABORES
    : SABORES.filter(s => s.tipo === tipoFiltro);

  // Seleciona/deseleciona um sabor
  function toggleSabor(sabor) {
    if (sabores.find(s => s.id === sabor.id)) {
      // Remove se já estava selecionado
      setSabores(sabores.filter(s => s.id !== sabor.id));
    } else {
      // Adiciona se não atingiu o limite
      if (sabores.length < tamanho.maxSabores) {
        setSabores([...sabores, sabor]);
      }
    }
  }

  // Verifica se o sabor está selecionado
  const isSelecionado = (id) => !!sabores.find(s => s.id === id);

  // Verifica se atingiu o limite de sabores
  const limiteAtingido = tamanho && sabores.length >= tamanho.maxSabores;

  // Escolhe tamanho e avança para próximo passo
  function escolherTamanho(t) {
    setTamanho(t);
    setSabores([]); // limpa sabores ao trocar tamanho
    setStep(2);
  }

  // Monta a mensagem do WhatsApp com o pedido completo
  function montarMensagem() {
    const nomeSabores = sabores.map(s => s.nome).join(", ");
    const msg = `Olá! Quero pedir uma pizza:\n\n🍕 *${tamanho.nome}* (${tamanho.tamanho} — ${tamanho.fatias})\n💰 R$ ${tamanho.preco}\n🧀 Sabor(es): ${nomeSabores}\n\nAguardo a confirmação!`;
    return wppLink(msg);
  }

  // Reinicia o builder
  function reiniciar() {
    setStep(1);
    setTamanho(null);
    setSabores([]);
    setTipoFiltro("Todos");
  }

  const corTipo = { "Tradicional": "#7A6E62", "Especial": "#CC2B1D", "Doce": "#9E6B2F" };

  return (
    <div>
      {/* Indicador de passos */}
      <div className="builder-steps">
        {[
          { n: 1, label: "Tamanho" },
          { n: 2, label: "Sabores" },
          { n: 3, label: "Confirmar" },
        ].map(({ n, label }) => (
          <div
            key={n}
            className={`builder-step${step === n ? " active" : step > n ? " done" : ""}`}
            style={{ cursor: step > n ? "pointer" : "default" }}
            onClick={() => { if (step > n) setStep(n); }}
          >
            <span style={{ marginRight: 6, opacity: 0.7 }}>
              {step > n ? "✓" : n}
            </span>
            {label}
          </div>
        ))}
      </div>

      {/* ── PASSO 1: Escolha o tamanho ── */}
      {step === 1 && (
        <div>
          <p className="syne" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>
            Selecione o tamanho
          </p>
          <div className="tamanho-grid">
            {TAMANHOS.map(t => (
              <div
                key={t.id}
                className={`tamanho-card${tamanho?.id === t.id ? " active" : ""}`}
                onClick={() => escolherTamanho(t)}
              >
                {/* Ícone proporcional ao tamanho */}
                <div style={{ fontSize: { broto: 26, media: 34, grande: 42, gigante: 50 }[t.id], marginBottom: 10 }}>🍕</div>
                <p className="bebas" style={{ fontSize: 22, color: "white", letterSpacing: 1 }}>{t.nome}</p>
                <p className="syne" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "4px 0" }}>{t.fatias}</p>
                <p className="bebas" style={{ fontSize: 20, color: tamanho?.id === t.id ? "white" : "#CC2B1D", marginTop: 6 }}>R$ {t.preco}</p>
                <p className="syne" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                  {t.minSabores === t.maxSabores ? `${t.maxSabores} sabor` : `${t.minSabores} a ${t.maxSabores} sabores`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PASSO 2: Escolha os sabores ── */}
      {step === 2 && tamanho && (
        <div>
          {/* Resumo do tamanho escolhido */}
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "14px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="syne" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pizza escolhida: </span>
              <span className="bebas" style={{ color: "white", fontSize: 18, letterSpacing: 1 }}>{tamanho.nome} — R$ {tamanho.preco}</span>
            </div>
            <button onClick={() => setStep(1)} className="syne" style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", padding: "6px 14px", cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Trocar tamanho
            </button>
          </div>

          {/* Contador de sabores */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <p className="syne" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {tamanho.minSabores === tamanho.maxSabores ? `Escolha ${tamanho.maxSabores} sabor` : `Escolha de ${tamanho.minSabores} a ${tamanho.maxSabores} sabores`}
            </p>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {Array.from({ length: tamanho.maxSabores }).map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: sabores[i] ? "#CC2B1D" : "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "background 0.2s",
                }} />
              ))}
              <span className="syne" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginLeft: 8 }}>
                {sabores.length} / {tamanho.minSabores === tamanho.maxSabores ? tamanho.maxSabores : `${tamanho.minSabores}–${tamanho.maxSabores}`}
              </span>
            </div>
          </div>

          {/* Filtro por tipo */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {tipos.map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoFiltro(tipo)}
                className="syne"
                style={{
                  background: tipoFiltro === tipo ? "rgba(255,255,255,0.12)" : "none",
                  border: `1px solid ${tipoFiltro === tipo ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                  color: tipoFiltro === tipo ? "white" : "rgba(255,255,255,0.4)",
                  padding: "5px 14px", cursor: "pointer",
                  fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* Grid de sabores */}
          <div className="sabores-grid">
            {saboresFiltrados.map(sabor => {
              const sel = isSelecionado(sabor.id);
              const dis = !sel && limiteAtingido;
              return (
                <div
                  key={sabor.id}
                  className={`sabor-card${sel ? " selected" : dis ? " disabled" : ""}`}
                  onClick={() => !dis && toggleSabor(sabor)}
                >
                  <div className="sabor-check">
                    {sel && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p className="syne" style={{ fontWeight: 700, fontSize: 14, color: "white" }}>{sabor.nome}</p>
                      <span style={{ fontSize: 9, fontFamily: "Syne, sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: corTipo[sabor.tipo], background: `${corTipo[sabor.tipo]}22`, padding: "1px 6px" }}>
                        {sabor.tipo}
                      </span>
                    </div>
                    <p className="syne" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{sabor.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão de avançar — habilitado só quando selecionou pelo menos 1 */}
          {sabores.length >= tamanho.minSabores && (
            <div style={{ marginTop: 28 }}>
              <button
                className="btn btn-red"
                onClick={() => setStep(3)}
              >
                Continuar → {sabores.length} sabor{sabores.length > 1 ? "es" : ""} escolhido{sabores.length > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PASSO 3: Resumo e confirmação ── */}
      {step === 3 && tamanho && (
        <div>
          <div className="pedido-resumo">
            <p className="syne" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              Resumo do pedido
            </p>

            {/* Detalhes do tamanho */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <p className="bebas" style={{ fontSize: 24, color: "white", letterSpacing: 1 }}>Pizza {tamanho.nome}</p>
                <p className="syne" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{tamanho.tamanho} · {tamanho.fatias}</p>
              </div>
              <p className="bebas" style={{ fontSize: 28, color: "#CC2B1D" }}>R$ {tamanho.preco}</p>
            </div>

            {/* Sabores escolhidos */}
            <p className="syne" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
              Sabor{sabores.length > 1 ? "es" : ""}
            </p>
            {sabores.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < sabores.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <span style={{ color: "#CC2B1D", fontWeight: 700, fontSize: 14 }}>✓</span>
                <div>
                  <p className="syne" style={{ fontWeight: 700, fontSize: 14, color: "white" }}>{s.nome}</p>
                  <p className="syne" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <a href={montarMensagem()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn btn-red" style={{ fontSize: 14 }}>
                📱 Enviar pedido pelo WhatsApp
              </button>
            </a>
            <button className="btn" onClick={reiniciar} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Montar outra pizza
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── App principal ─────────────────────────────────────────
function App() {
  const [tab, setTab]       = useState(0);
  const [busca, setBusca]   = useState("");
  const [menuOpen, setMenu] = useState(false);
  const aberto = isOpen();

  const w = (msg = "Olá! Vim pelo site e quero fazer um pedido 🍕") =>
    `https://wa.me/${WPP}?text=${encodeURIComponent(msg)}`;

  const filtrado = busca.trim()
    ? CARDAPIO.flatMap(c => c.itens).filter(i =>
        i.nome.toLowerCase().includes(busca.toLowerCase()) ||
        i.desc.toLowerCase().includes(busca.toLowerCase()))
    : null;

  return (
    <div style={{ background: C.cream, color: C.ink, minHeight: "100vh" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="nav">
        <span className="nav-logo">GUEDE'S</span>

        {/* Links desktop */}
        <nav className="nav-links-desktop">
          {[["#pizza","Monte sua Pizza"],["#cardapio","Cardápio"],["#horario","Horário"],["#avaliacoes","Avaliações"],["#localizacao","Onde Estamos"]].map(([href, label]) => (
            <a key={href} className="nav-link" href={href}>{label}</a>
          ))}
        </nav>

        <div className="nav-right">
          {/* Badge status */}
          <div className="nav-status" style={{ color: aberto ? "#1a7d3e" : C.red }}>
            <span className="nav-status-dot" style={{ background: aberto ? "#25D366" : C.red }} />
            <span>{aberto ? "Aberto" : "Fechado"}</span>
          </div>

          {/* Hambúrguer */}
          <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenu(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        {[["#pizza","Monte sua Pizza"],["#cardapio","Cardápio"],["#horario","Horário"],["#avaliacoes","Avaliações"],["#localizacao","Onde Estamos"]].map(([href, label]) => (
          <a key={href} className="nav-link" href={href} onClick={() => setMenu(false)}>{label}</a>
        ))}
      </div>

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <div className="marquee-wrap" style={{ marginTop: 56 }}>
        <div className="marquee-track">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="marquee-item">
              GUEDE'S RESTAURANTE E PIZZARIA &nbsp;·&nbsp; PERIPERI, SALVADOR &nbsp;·&nbsp; PIZZA · ALMOÇO · CHOPP &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="hero">
        <Reveal>
          <div style={{ position: "relative" }}>
            <span className="hero-bg-letter">G</span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="section-label">Desde quando Periperi tem fome</span>
              <h1 className="hero-title">
                PIZZA<br />
                <span style={{ color: C.red }}>DE VERDADE.</span><br />
                TODO DIA.
              </h1>
            </div>
          </div>
        </Reveal>

        {/* Barra de métricas */}
        <Reveal delay={0.1}>
          <div className="hero-bar">
            <div className="hero-metrics">
              <div className="hero-metric">
                <p className="syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Entrega</p>
                <p className="bebas" style={{ fontSize: 26 }}>30–50 MIN</p>
              </div>
              <div className="hero-metric">
                <p className="syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Avaliação</p>
                <p className="bebas" style={{ fontSize: 26 }}>4.9 ★</p>
              </div>
              <div className="hero-metric">
                <p className="syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>Endereço</p>
                <p className="syne" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{ENDERECO}</p>
              </div>
            </div>
            <div className="hero-ctas">
              <button className="btn btn-dark" onClick={() => document.getElementById("pizza").scrollIntoView({ behavior: "smooth" })}>
                Montar Minha Pizza
              </button>
              <a href={w()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn btn-red">Pedir Agora</button>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Bloco sobre + pagamentos */}
        <Reveal delay={0.15}>
          <div className="hero-about">
            <div className="hero-about-text">
              <span className="section-label">O Guede's</span>
              <p className="serif" style={{ fontSize: "clamp(17px, 2.5vw, 26px)", lineHeight: 1.5, marginBottom: 16 }}>
                Aqui em Periperi, a mesa nunca esfriou. Pizza de forno, almoço de panela e chopp tirado na hora.
              </p>
              <p className="syne" style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Somos o restaurante do bairro, onde o dono conhece o cliente pelo nome e a massa da pizza ainda é aberta na mão.
              </p>
            </div>
            <div className="hero-about-red">
              <div>
                <p className="bebas" style={{ fontSize: 12, letterSpacing: 5, color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>ACEITAMOS</p>
                {["Dinheiro","Débito","Crédito","Pix"].map(p => (
                  <div key={p} style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 10, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                    <span className="syne" style={{ fontWeight: 700, color: "white", fontSize: 14 }}>{p}</span>
                    <span style={{ color: "rgba(255,255,255,0.55)" }}>✓</span>
                  </div>
                ))}
              </div>
              <div className="stamp">Fidelidade: 10 pedidos = 30% off</div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── PIZZA BUILDER ───────────────────────────────────────
          Seção exclusiva: cliente monta a pizza e manda pro WPP */}
      <div id="pizza" className="pizza-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <span className="section-label" style={{ color: "#CC2B1D", borderColor: "#CC2B1D" }}>Monte do seu jeito</span>
            <h2 className="bebas" style={{ fontSize: "clamp(44px, 10vw, 88px)", lineHeight: 0.9, color: "#FDFAF5", marginBottom: 8 }}>
              MONTE SUA PIZZA
            </h2>
            <p className="syne" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 36, maxWidth: 480 }}>
              Escolha o tamanho, os sabores que quiser e mande direto pro WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <PizzaBuilder wppLink={w} />
          </Reveal>
        </div>
      </div>

      {/* ── CARDÁPIO GERAL ──────────────────────────────────────
          Almoço, petiscos e bebidas                             */}
      <div id="cardapio" className="cardapio-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div className="cardapio-header">
              <div>
                <span className="section-label">Almoço, petiscos e bebidas</span>
                <h2 className="bebas" style={{ fontSize: "clamp(44px, 10vw, 88px)", lineHeight: 0.9 }}>CARDÁPIO</h2>
              </div>
              <input
                className="search-input"
                placeholder="Buscar item..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </Reveal>

          {!busca && (
            <Reveal delay={0.05}>
              <div className="tabs">
                {CARDAPIO.map((cat, i) => (
                  <button key={i} className={`tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>
                    {cat.cat}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {busca && (
            <p className="syne" style={{ fontSize: 13, color: C.muted, marginBottom: 16, fontWeight: 600 }}>
              {filtrado?.length || 0} resultado{filtrado?.length !== 1 ? "s" : ""} para "{busca}"
            </p>
          )}

          <div>
            {(filtrado || CARDAPIO[tab].itens).map((item, i) => (
              <Reveal key={item.nome} delay={i * 0.04}>
                <a href={w(`Olá! Quero pedir: ${item.nome} — R$ ${item.preco}`)} target="_blank" rel="noopener noreferrer" className="menu-item">
                  <div>
                    <p className="syne item-nome" style={{ fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{item.nome}</p>
                    <p className="syne" style={{ fontSize: 13, color: C.muted }}>{item.desc}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p className="bebas" style={{ fontSize: 22 }}>R$ {item.preco}</p>
                    <p className="syne" style={{ fontSize: 10, color: C.red, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pedir →</p>
                  </div>
                </a>
              </Reveal>
            ))}
            {filtrado?.length === 0 && (
              <p className="syne" style={{ color: C.muted, padding: "28px 0" }}>Nenhum item encontrado.</p>
            )}
          </div>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${C.line}` }}>
              <a href={w("Olá! Quero ver o cardápio completo")} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn btn-outline">Ver cardápio completo pelo WhatsApp →</button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── HORÁRIO ─────────────────────────────────────────────── */}
      <div id="horario" className="horario-section" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <span className="section-label">Quando estamos aqui</span>
          <div className="horario-grid">
            {HORARIOS.map(({ dias, horas }) => (
              <div key={dias} className="horario-item">
                <p className="syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{dias}</p>
                <p className="bebas" style={{ fontSize: "clamp(28px, 6vw, 52px)", lineHeight: 1 }}>{horas}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="horario-cards">
            <div style={{ background: C.paper, border: `1.5px solid ${C.line}`, padding: "22px 20px" }}>
              <p className="syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Retirada no local</p>
              <p className="serif" style={{ fontSize: 16, lineHeight: 1.5 }}>
                Retire aqui e ganhe <strong>desconto especial</strong>. Avise pelo WhatsApp.
              </p>
            </div>
            <div style={{ background: C.paper, border: `1.5px solid ${C.line}`, padding: "22px 20px" }}>
              <p className="syne" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Agendar pedido</p>
              <p className="serif" style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 16 }}>Quer garantir com hora marcada? Manda mensagem.</p>
              <a href={w("Olá! Quero agendar um pedido 📅")} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn btn-dark">Agendar pelo WhatsApp</button>
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── AVALIAÇÕES ──────────────────────────────────────────── */}
      <div id="avaliacoes" className="avaliacoes-section">
        <Reveal>
          <div className="avaliacoes-header">
            <div>
              <span className="section-label" style={{ color: C.red, borderColor: C.red }}>O que o pessoal fala</span>
              <h2 className="bebas" style={{ fontSize: "clamp(44px, 10vw, 88px)", lineHeight: 0.9, color: C.cream }}>AVALIAÇÕES</h2>
            </div>
            <div>
              <p className="bebas" style={{ fontSize: "clamp(44px, 10vw, 68px)", lineHeight: 1, color: C.red }}>4.9</p>
              <p className="syne" style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.1em" }}>★★★★★ +100 avaliações</p>
            </div>
          </div>
        </Reveal>

        <div className="av-outer">
          <div className="av-track">
            {[...AVALIACOES, ...AVALIACOES].map((av, i) => (
              <div key={i} className="av-card">
                <p className="syne" style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{av.nome}</p>
                <p style={{ color: "#d4a800", fontSize: 13, marginBottom: 12 }}>{"★".repeat(av.nota)}</p>
                <p className="syne" style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>"{av.txt}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="avaliacoes-cta">
          <a href={w("Olá! Quero deixar minha avaliação ⭐")} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn btn-red">Deixar avaliação →</button>
          </a>
        </div>
      </div>

      {/* ── LOCALIZAÇÃO ─────────────────────────────────────────── */}
      <div id="localizacao" className="local-section" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <span className="section-label">Onde a gente fica</span>
          <div className="local-grid">
            <div className="local-info">
              <div className="local-bloco">
                <p className="bebas" style={{ fontSize: 12, letterSpacing: 4, color: C.muted, marginBottom: 8 }}>ENDEREÇO</p>
                <p className="serif" style={{ fontSize: 20, lineHeight: 1.4, marginBottom: 20 }}>{ENDERECO}</p>
                <a href={MAPS} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn btn-dark">Abrir no Maps →</button>
                </a>
              </div>
              <div className="local-bloco">
                <p className="bebas" style={{ fontSize: 12, letterSpacing: 4, color: C.muted, marginBottom: 8 }}>FALE CONOSCO</p>
                <p className="serif" style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 20 }}>
                  Pedidos, reservas e dúvidas direto no WhatsApp.
                </p>
                <a href={w()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn btn-red">Chamar no WhatsApp →</button>
                </a>
              </div>
            </div>
            <div className="local-mapa">
              <iframe
                title="Mapa Guede's"
                src="https://maps.google.com/maps?q=Rua+Domingos+Pires,+50,+Periperi,+Salvador,+BA&output=embed"
                width="100%" height="100%"
                style={{ border: 0, display: "block", minHeight: 280 }}
                allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <p className="bebas" style={{ fontSize: 30, color: C.cream, letterSpacing: 3 }}>GUEDE'S</p>
            <p className="syne" style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Restaurante e Pizzaria — Periperi, Salvador</p>
          </div>
          <div className="footer-btns">
            <a href="https://instagram.com/guedesrestaurantee" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn btn-outline-white">Instagram</button>
            </a>
            <a href={w()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn btn-red">WhatsApp</button>
            </a>
          </div>
          <p className="footer-copy">© 2025 Guede's Restaurante e Pizzaria. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ── WPP FLUTUANTE ───────────────────────────────────────── */}
      <a href={w()} target="_blank" rel="noopener noreferrer" className="wpp-float" title="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
