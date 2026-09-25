import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, BrainCircuit, Check, ChevronRight, GraduationCap, Landmark, Menu, Route as RouteIcon, ShieldCheck, Smartphone, Sparkles, X } from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  detail: string;
  accent: 'teal' | 'warm' | 'coral' | 'ink';
  icon: typeof GraduationCap;
  benefits: { title: string; copy: string }[];
};

const products: Product[] = [
  {
    slug: 'studybuddy',
    name: 'Studybuddy',
    category: 'EdTech / AI learning',
    description: 'A learning companion that makes study time feel more focused, more human, and easier to keep moving.',
    detail: 'Learning support with an AI point of view.',
    accent: 'teal',
    icon: GraduationCap,
    benefits: [
      { title: 'Learning, with less friction', copy: 'Studybuddy brings the learning moment into focus, so the next useful step is easier to find.' },
      { title: 'An AI companion for progress', copy: 'AI-powered support meets people where they are — with clarity instead of complexity.' },
      { title: 'Made for everyday study', copy: 'A practical EdTech experience that respects attention, effort, and the pace of real life.' },
    ],
  },
  {
    slug: 'mypay',
    name: 'MyPay',
    category: 'Fintech / Payroll & Checkout',
    description: 'Payroll and checkout, brought closer together so getting paid and paying out feels straightforward.',
    detail: 'The practical layer between work and payment.',
    accent: 'warm',
    icon: Sparkles,
    benefits: [
      { title: 'Work to wallet, clearly', copy: 'MyPay connects payroll moments with the checkout moments that follow them.' },
      { title: 'A calmer payment experience', copy: 'Fintech that keeps the important information close and the path forward easy to read.' },
      { title: 'Built around everyday work', copy: 'A useful bridge for people and teams managing the rhythm of getting paid.' },
    ],
  },
  {
    slug: 'strait',
    name: 'Strait',
    category: 'Financial rails & routing',
    description: 'The connective layer for moving value through the right financial route at the right moment.',
    detail: 'Financial infrastructure that keeps the route clear.',
    accent: 'ink',
    icon: RouteIcon,
    benefits: [
      { title: 'Routes that make sense', copy: 'Strait is focused on the rails and routing underneath dependable financial movement.' },
      { title: 'Connection over clutter', copy: 'A financial layer designed to make complex pathways feel more legible.' },
      { title: 'Ready for the next link', copy: 'The connective thinking that helps products work better together.' },
    ],
  },
  {
    slug: 'timbis-bank',
    name: 'TimBis Bank',
    category: 'Digital banking',
    description: 'A digital banking experience shaped around clear choices, everyday confidence, and human-scale money.',
    detail: 'Banking with a little more daylight in it.',
    accent: 'coral',
    icon: Landmark,
    benefits: [
      { title: 'A clearer view of money', copy: 'TimBis Bank brings digital banking closer to the decisions people make every day.' },
      { title: 'Confidence without stiffness', copy: 'A banking experience that aims to be dependable, direct, and easier to understand.' },
      { title: 'Digital by design', copy: 'Modern banking for the moments that happen between work, home, and plans.' },
    ],
  },
  {
    slug: 'accountant-ai',
    name: 'Accountant AI',
    category: 'AI bookkeeping & business intelligence',
    description: 'AI-powered bookkeeping and business intelligence for a sharper view of how work is really doing.',
    detail: 'The business picture, made easier to read.',
    accent: 'teal',
    icon: BrainCircuit,
    benefits: [
      { title: 'Books that tell a story', copy: 'Accountant AI helps turn bookkeeping into a more useful view of the business.' },
      { title: 'Intelligence where it matters', copy: 'AI and business intelligence meet in the places decisions need more context.' },
      { title: 'Less chasing, more knowing', copy: 'A practical companion for making sense of financial information.' },
    ],
  },
  {
    slug: 'kowo-pay',
    name: 'Kowo Pay',
    category: 'Instant mobile payments',
    description: 'An instant mobile payments app for moving money with the pace and ease people expect from their phones.',
    detail: 'A faster way to keep everyday payments moving.',
    accent: 'warm',
    icon: Smartphone,
    benefits: [
      { title: 'Payment at the speed of now', copy: 'Kowo Pay is shaped for instant mobile payments and the moments that cannot wait.' },
      { title: 'Made for the phone in your hand', copy: 'A mobile app experience that keeps payment close, clear, and practical.' },
      { title: 'Everyday movement, simplified', copy: 'A direct path from intention to payment, without unnecessary distance.' },
    ],
  },
];

const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<string, Product>;

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, attribute: 'name' | 'property', content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector.match(/"(.*?)"/)?.[1] ?? '');
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href.split('#')[0];
  }, [description, title]);
}

function Logo() {
  return <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark" aria-hidden="true">T</span><span className="brand-word">TierChnology</span></Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => setOpen(false), [location]);
  const closeMenu = () => setOpen(false);
  return (
    <header className="site-header" data-testid="site-header">
      <div className="nav-wrap">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a className="nav-link" href="/#portfolio" data-testid="link-nav-portfolio">Portfolio</a>
          <a className="nav-link" href="/#approach" data-testid="link-nav-approach">Our approach</a>
          <a className="nav-link" href="/#trust" data-testid="link-nav-trust">Trust</a>
          <a className="nav-cta" href="/#contact" data-testid="link-nav-contact">Talk with us <ArrowUpRight size={14} /></a>
        </nav>
        <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} data-testid="button-mobile-menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
        <a href="/#portfolio" onClick={closeMenu} data-testid="link-mobile-portfolio">Portfolio</a>
        <a href="/#approach" onClick={closeMenu} data-testid="link-mobile-approach">Our approach</a>
        <a href="/#trust" onClick={closeMenu} data-testid="link-mobile-trust">Trust</a>
        <a className="nav-cta" href="/#contact" onClick={closeMenu} data-testid="link-mobile-contact">Talk with us <ArrowUpRight size={14} /></a>
      </nav>}
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer" data-testid="site-footer">
      <div className="footer-wrap">
        <div className="footer-brand">
          <Logo />
          <p>A connected portfolio for learning, work, and everyday money — built with clarity and care.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col"><strong>Explore</strong><a href="/#portfolio" data-testid="link-footer-portfolio">Portfolio</a><a href="/#approach" data-testid="link-footer-approach">Our approach</a><a href="/#trust" data-testid="link-footer-trust">Trust & clarity</a></div>
          <div className="footer-col"><strong>Products</strong>{products.slice(0, 3).map((product) => <Link key={product.slug} href={`/products/${product.slug}`} data-testid={`link-footer-${product.slug}`}>{product.name}</Link>)}</div>
          <div className="footer-col"><strong>More products</strong>{products.slice(3).map((product) => <Link key={product.slug} href={`/products/${product.slug}`} data-testid={`link-footer-${product.slug}`}>{product.name}</Link>)}</div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} TierChnology</span><a href="/#contact" data-testid="link-footer-contact">Contact path</a><span>Built for useful progress.</span></div>
    </footer>
  );
}

function ProductMark({ product, detail = false }: { product: Product; detail?: boolean }) {
  const Icon = product.icon;
  return <div className={detail ? `detail-visual ${product.accent}` : 'card-orb'} aria-hidden="true">{detail && <><Icon size={34} strokeWidth={1.5} /><span className="visual-word">{product.name.split(' ')[0]}</span></>}</div>;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article id={product.slug} className={`product-card ${index === 0 ? 'large' : ''} ${product.accent === 'warm' ? 'warm' : product.accent === 'coral' ? 'coral' : ''} reveal delay-${Math.min(index + 1, 3)}`} data-testid={`card-product-${product.slug}`}>
      <div className="card-top"><div><span className="card-number">0{index + 1}</span><span className="category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div><ArrowUpRight size={18} aria-hidden="true" /></div>
      <div className="card-bottom"><Link className="explore-link" href={`/products/${product.slug}`} data-testid={`link-explore-${product.slug}`}>Explore {product.name} <ArrowRight size={15} /></Link><ProductMark product={product} /></div>
    </article>
  );
}

function Home() {
  usePageMeta('TierChnology — Technology for real life', 'TierChnology connects learning, payroll, payments, banking, and AI-powered finance into a portfolio built for useful progress.');
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" data-testid="link-skip-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <section className="hero" aria-labelledby="home-heading">
          <div className="hero-grid">
            <div className="reveal">
              <span className="eyebrow">A portfolio for real life</span>
              <h1 id="home-heading">Technology that moves with <span className="highlight">life.</span></h1>
              <p className="hero-copy">TierChnology brings together practical products for learning, earning, paying, banking, and understanding the numbers in between.</p>
              <div className="hero-actions"><a className="button-primary" href="#portfolio" data-testid="button-explore-portfolio">Explore the portfolio <ArrowRight size={16} /></a><a className="button-secondary" href="#approach" data-testid="button-see-approach">See the thinking <ChevronRight size={16} /></a></div>
              <p className="hero-note"><span aria-hidden="true" />One ambitious company, six useful directions.</p>
            </div>
            <div className="hero-art reveal delay-2" aria-label="TierChnology connects learning, work, payments, banking, and intelligence">
              <div className="orbit"><div className="orbit-line" /><div className="orbit-core">T</div><div className="orbit-label label-one"><strong>Learn</strong><span>Studybuddy</span></div><div className="orbit-label label-two"><strong>Earn</strong><span>MyPay</span></div><div className="orbit-label label-three"><strong>Move</strong><span>Kowo Pay</span></div><div className="orbit-label label-four"><strong>Know</strong><span>Accountant AI</span></div></div>
              <div className="orbit-stamp">Useful<br />by design</div>
            </div>
          </div>
        </section>
        <nav className="product-rail" aria-label="Product shortcuts"><div className="rail-inner">{products.map((product, index) => <a className="rail-link" href={`#${product.slug}`} key={product.slug} data-testid={`link-rail-${product.slug}`}><span className="rail-index">0{index + 1}</span>{product.name}</a>)}</div></nav>

        <section id="portfolio" className="section" aria-labelledby="portfolio-heading">
          <p className="section-kicker">The portfolio</p><h2 className="section-heading" id="portfolio-heading">Different jobs. One point of view.</h2><p className="section-intro">Every TierChnology product starts with a practical question: what would make this everyday moment clearer, lighter, or more possible?</p>
          <div className="portfolio-grid">{products.map((product, index) => <ProductCard product={product} index={index} key={product.slug} />)}</div>
        </section>

        <section id="approach" className="trust-section" aria-labelledby="approach-heading"><div className="section"><p className="section-kicker">The through-line</p><h2 className="section-heading" id="approach-heading">Ambition is useful when people can feel it working.</h2><p className="section-intro">We make technology that earns its place in the routine: clear enough to trust, considered enough to keep using, and connected enough to open the next door.</p><div className="principles"><article className="principle"><span className="principle-index">01 / CLARITY</span><h3>Plain language is a feature.</h3><p>Products should make the next decision easier to see, especially when the subject is learning or money.</p></article><article className="principle"><span className="principle-index">02 / CONNECTION</span><h3>Useful things work better together.</h3><p>Our portfolio spans different jobs, but it shares a belief in thoughtful links between them.</p></article><article className="principle"><span className="principle-index">03 / PROGRESS</span><h3>Small moments add up.</h3><p>From one study session to one payment, better everyday tools create room for bigger possibilities.</p></article></div></div></section>

        <section id="trust" className="section" aria-labelledby="trust-heading"><p className="section-kicker">Trust, in practice</p><h2 className="section-heading" id="trust-heading">Built with the seriousness everyday life deserves.</h2><p className="section-intro">We care about privacy, clear consent, reliable flows, and honest product language. We do not ask people to take confidence on faith — we aim to make each experience understandable enough to inspect.</p><div className="hero-actions"><a className="button-secondary" href="#contact" data-testid="button-trust-contact">Start a conversation <ArrowUpRight size={15} /></a></div></section>

        <section id="contact" className="section connect-section" aria-labelledby="contact-heading"><div className="connect-panel"><h2 id="contact-heading">Want to understand where the portfolio could take you?</h2><p>Explore the products, follow the connections, and keep an eye on what TierChnology is building next.</p><a className="button-primary" href="#portfolio" data-testid="button-contact-explore">Return to the portfolio <ArrowRight size={16} /></a><div className="contact-note">A clear contact destination will be shared here as the company opens up.</div></div></section>
      </main>
      <Footer />
    </div>
  );
}

function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const product = productBySlug[params.slug ?? ''];
  const [location] = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [location]);
  if (!product) return <NotFound />;
  usePageMeta(`${product.name} — TierChnology`, `${product.name}: ${product.description}`);
  const Icon = product.icon;
  return (
    <div className="site-shell"><a className="skip-link" href="#main-content" data-testid="link-skip-content">Skip to content</a><Header /><main id="main-content" className="detail-main">
      <Link href="/#portfolio" className="back-link" data-testid="link-back-portfolio"><ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to portfolio</Link>
      <section className="detail-hero" aria-labelledby="product-heading"><div className="reveal"><span className="eyebrow">{product.category}</span><h1 id="product-heading">{product.name}</h1><p className="detail-description">{product.description}</p><div className="hero-actions"><a className="button-primary" href="#product-detail" data-testid={`button-learn-${product.slug}`}>See what it is for <ArrowRight size={16} /></a><Link className="button-secondary" href="/#portfolio" data-testid={`button-all-products-${product.slug}`}>All products <ArrowRight size={16} /></Link></div></div><ProductMark product={product} detail /></section>
      <section id="product-detail" className="detail-block" aria-labelledby="detail-heading"><div><p className="section-kicker">A closer look</p><h2 id="detail-heading">{product.detail}</h2></div><div className="benefit-list">{product.benefits.map((benefit, index) => <article className="benefit" key={benefit.title} data-testid={`benefit-${product.slug}-${index}`}><Check size={18} /><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div></article>)}</div></section>
      <section className="detail-cta" aria-label="Continue exploring"><div><p className="section-kicker">Across the portfolio</p><h2>Useful progress rarely happens in one place.</h2></div><Link className="button-primary" href="/#portfolio" data-testid={`link-more-products-${product.slug}`}>Meet the other products <ArrowRight size={16} /></Link></section>
    </main><Footer /></div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/products/:slug" component={ProductDetail} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;