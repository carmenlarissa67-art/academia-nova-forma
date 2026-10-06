import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, CheckCircle2, Play, ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <circle cx="12" cy="12" r="5"></circle>
    <circle cx="17.5" cy="6.5" r="1.5"></circle>
  </svg>
);
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const WHATSAPP_URL = "https://wa.me/5583986355224?text=Olá,%20gostaria%20de%20falar%20com%20um%20consultor!";

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <div className="logo">
            <span className="logo-text">NF</span>
          </div>
          
          <nav className="desktop-nav">
            <a href="#modalidades">Modalidades</a>
            <a href="#planos">Planos</a>
            <a href="#depoimentos">Depoimentos</a>
          </nav>

          <div className="header-actions">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary compact desktop-only">Quero Treinar</a>
            <button className="menu-btn mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav>
            <a href="#modalidades" onClick={() => setIsMenuOpen(false)}>Modalidades</a>
            <a href="#planos" onClick={() => setIsMenuOpen(false)}>Planos</a>
            <a href="#depoimentos" onClick={() => setIsMenuOpen(false)}>Depoimentos</a>
          </nav>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary" onClick={() => setIsMenuOpen(false)}>Matricule-se</a>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/hero_bg.jpg" alt="Academia Nova Forma" className="hero-img" loading="eager" fetchpriority="high" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text-area">
            <span className="tagline"><span className="dot"></span> Matrículas Abertas</span>
            <h1>Seu <span className="text-brand">Melhor</span> Treino Começa Aqui.</h1>
            <p className="hero-sub">Seu corpo muda quando você começa. Seu resultado muda quando você não desiste. Estrutura completa, aulas coletivas e planos sem fidelidade.</p>
            
            <div className="hero-ctas">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary">Começar Agora</a>
              <a href="#planos" className="btn-ghost">Ver Planos ↓</a>
            </div>


          </div>
        </div>
        <div className="scroll-indicator animate-bounce desktop-only">↓</div>
      </section>

      {/* PROBLEM / AGITATION / SOLUTION */}
      <section className="section-alt problem-section">
        <div className="container">
          <div className="problem-content">
            <h2>Você não precisa de mais uma matrícula. Precisa de um lugar onde consiga continuar.</h2>
            <ul className="problem-list">
              <li>• Já pagou academia e acabou faltando porque não sabia o que fazer?</li>
              <li>• Entrou num lugar onde todo mundo sabia treinar, menos você?</li>
              <li>• Deixou de lado porque a rotina tomou conta?</li>
            </ul>
            <p className="solution-text">O problema não é falta de vontade. Faltava orientação e um ambiente que faça você querer voltar. <strong>É isso que a Nova Forma muda.</strong></p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section benefits-section" id="por-que">
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">Por que a NF</span>
            <h2>Tudo Para Você Não Ter Desculpa</h2>
            <p>Uma estrutura pensada para ajudar você a manter a constância.</p>
          </div>
          
          <div className="benefits-grid">
            {[
              { title: 'Atendimento Próximo', desc: 'Receba orientação para treinar com mais segurança.' },
              { title: 'Ambiente Acolhedor', desc: 'Iniciantes são bem-vindos. Treine para evoluir, não competir.' },
              { title: 'Horários Amplos', desc: 'O seu treino precisa caber na sua rotina.' },
              { title: 'Foco na Evolução', desc: 'Ajudamos você a transformar o exercício em hábito.' },
            ].map((benefit, i) => (
              <div className="benefit-card" key={i}>
                <div className="benefit-icon"><CheckCircle2 /></div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODALITIES */}
      <section className="section-alt modalities-section" id="modalidades">
        <div className="container">
          <div className="section-header">
            <h2>Escolha Como Você Quer Se Movimentar</h2>
          </div>
          
          <div className="modalities-grid">
            <div className="modality-card">
              <img src="/hero_bg.jpg" alt="Musculação" />
              <div className="modality-overlay">
                <h3>Musculação</h3>
                <p>Construa força e resistência com segurança.</p>
              </div>
            </div>
            <div className="modality-card">
              <img src="/img2.jpeg" alt="FitDance" />
              <div className="modality-overlay">
                <h3>FitDance</h3>
                <p>Mais diversão e movimento. Dance e gaste energia!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section testimonials-section" id="depoimentos">
        <div className="container">
          <div className="section-header center">
            <h2>Quem Treina, Aprova</h2>

          </div>
          
          <div className="testimonials-grid">
            {[
              {
                text: "Eu achava que não conseguiria encaixar academia na rotina. Hoje o treino faz parte do meu dia a dia.",
                name: "Cliente Nova Forma"
              },
              {
                text: "Minha maior preocupação era ficar perdida. Fui muito bem recebida e isso fez toda a diferença.",
                name: "Cliente Nova Forma"
              },
              {
                text: "Na Nova Forma senti um acompanhamento muito mais próximo. Hoje tenho muita confiança para treinar.",
                name: "Cliente Nova Forma"
              }
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="t-header">
                  <div className="t-avatar"></div>
                  <div className="t-info">
                    <strong>{t.name}</strong>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
                <p>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-alt pricing-section" id="planos">
        <div className="container">
          <div className="section-header center">
            <h2>Escolha Seu Plano</h2>
            <p>Sem taxa de adesão. Comece agora e dê o primeiro passo.</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Mensal</h3>
              <p className="pricing-desc">Para começar com flexibilidade.</p>
              <div className="price">R$ <span>65</span><small>,00/mês</small></div>
              <ul className="pricing-features">
                <li><CheckCircle2 size={18} /> Musculação Livre</li>
                <li><CheckCircle2 size={18} /> Sem fidelidade</li>
              </ul>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-ghost">Quero Começar</a>
            </div>

            <div className="pricing-card featured">
              <div className="featured-tag">Mais Popular</div>
              <h3>Anual</h3>
              <p className="pricing-desc">Melhor custo-benefício. Economize R$60.</p>
              <div className="price">R$ <span>60</span><small>,00/mês</small></div>
              <ul className="pricing-features">
                <li><CheckCircle2 size={18} /> Musculação Livre</li>
                <li><CheckCircle2 size={18} /> Acesso Total</li>
                <li><CheckCircle2 size={18} /> Acompanhamento</li>
              </ul>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary">Quero Meu Plano Anual</a>
            </div>

            <div className="pricing-card">
              <h3>Trimestral</h3>
              <p className="pricing-desc">Para criar constância e evoluir.</p>
              <div className="price">R$ <span>65</span><small>,00/mês</small></div>
              <ul className="pricing-features">
                <li><CheckCircle2 size={18} /> Total: R$ 195,00</li>
                <li><CheckCircle2 size={18} /> Musculação</li>
              </ul>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-ghost">Quero Evoluir</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header center">
            <h2>Ainda Está Em Dúvida?</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Nunca fiz academia. Posso começar na Nova Forma?",
                a: "Sim. A academia atende iniciantes e pessoas em diferentes níveis de condicionamento."
              },
              {
                q: "Tenho pouco tempo. Vale a pena?",
                a: "O mais importante é manter a rotina. Funcionamos de seg a sex, 05:20-11:00 e 14:00-22:00, sábados 08:00-12:00."
              },
              {
                q: "Tenho vergonha de treinar...",
                a: "Você começa justamente para cuidar de você. Na Nova Forma, o ambiente é acolhedor e sem julgamentos."
              }
            ].map((faq, i) => (
              <div className="faq-item" key={i} onClick={() => toggleFaq(i)}>
                <div className="faq-q">
                  {faq.q}
                  {openFaq === i ? <ChevronUp /> : <ChevronDown />}
                </div>
                {openFaq === i && <div className="faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="container center">
          <h2>Sua Nova Forma Começa Com Uma Decisão.</h2>
          <p>Não espere ter mais tempo. Não espere a próxima segunda-feira.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary mt-8">Fale Com Um Consultor</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="logo-text">NOVA FORMA</span>
              <p>Academia para quem quer cuidar do corpo, ganhar confiança e construir uma rotina de treino que consiga manter.</p>
              <a href="https://www.instagram.com/novaformaacd?stkn=MW5wemt5NHhxdWhidw==" target="_blank" rel="noreferrer" className="social-link"><InstagramIcon /> @novaformaacd</a>
            </div>

            <div className="footer-info">
              <div className="footer-info-block">
                <div className="footer-info-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Endereço</h4>
                  <p>Rua Arábia, 311 — Bairro das Indústrias</p>
                  <p>João Pessoa — PB | CEP 58083-607</p>
                </div>
              </div>

              <div className="footer-info-block">
                <div className="footer-info-icon"><Clock size={20} /></div>
                <div>
                  <h4>Horários de Funcionamento</h4>
                  <p>Seg a Sex: 05:20 às 11:00 · 14:00 às 22:00</p>
                  <p>Sábado: 08:00 às 12:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Academia Nova Forma. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="floating-whatsapp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}

export default App;
