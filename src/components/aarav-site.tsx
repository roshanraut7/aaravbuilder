"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Building2,
  Code2,
  Smartphone,
  PenTool,
  Layers3,
  Check,
  Plus,
  Minus,
  Menu,
  X,
  Download,
  Compass,
  MessageSquare,
  ShieldCheck,
  Handshake,
  Ruler,
  HardHat,
  Monitor,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MotionProvider from "./motion-provider";
import RotatingText from "./rotating-text";
import BlurText from "./blur-text";
import { useMotionPreference } from "./motion-preference";
import CircularGallery from "./circular-gallery";

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const services = [
  {
    title: "Naksha / Building Design",
    category: "civil",
    image: "construction",
    alt: "Architect working on a detailed building plan",
    text: "Floor plans, architectural planning, and clear 2D and 3D building designs shaped around your site.",
    icon: Ruler,
  },
  {
    title: "Interior Design",
    category: "civil",
    image: "interior",
    alt: "Premium modern living room interior",
    text: "Functional and elegant interior concepts for homes, offices, retail, and commercial spaces.",
    icon: Layers3,
  },
  {
    title: "Building & Construction",
    category: "civil",
    image: "framing",
    alt: "Active residential construction site",
    text: "Reliable residential and commercial construction, from groundwork through project execution.",
    icon: HardHat,
  },
  {
    title: "3D Exterior Visualization",
    category: "civil",
    image: "residence",
    alt: "Photorealistic modern residential exterior",
    text: "Realistic exterior renders that help you understand materials, scale, and form before construction.",
    icon: Building2,
  },
  {
    title: "Renovation & Remodeling",
    category: "civil",
    image: "architecture",
    alt: "Renovated modern residential property",
    text: "Thoughtful home, office, and commercial renovations that improve function, comfort, and finish.",
    icon: Layers3,
  },
  {
    title: "Site Planning & Consultation",
    category: "civil",
    image: "site",
    alt: "Civil engineer reviewing plans at a construction site",
    text: "Professional site inspection, early planning, feasibility guidance, and practical project advice.",
    icon: Compass,
  },
  {
    title: "Web Development",
    category: "it",
    image: "web",
    alt: "Laptop displaying a clean modern website",
    text: "Fast business websites, corporate sites, portals, and web apps built for real business goals.",
    icon: Code2,
  },
  {
    title: "Mobile App Development",
    category: "it",
    image: "mobile",
    alt: "Smartphones displaying a modern mobile application",
    text: "Useful and intuitive Android and iOS applications designed around your customers and operations.",
    icon: Smartphone,
  },
  {
    title: "UI/UX Design",
    category: "it",
    image: "workspace",
    alt: "Digital interface design displayed on a monitor",
    text: "User-focused web and mobile interfaces that make complex journeys feel clear and effortless.",
    icon: PenTool,
  },
  {
    title: "Custom Software Development",
    category: "it",
    image: "web",
    alt: "Business dashboard and software interface",
    text: "Business-specific software, dashboards, and management systems tailored to your workflow.",
    icon: Monitor,
  },
  {
    title: "E-commerce Development",
    category: "it",
    image: "mobile",
    alt: "Online store displayed across laptop and mobile devices",
    text: "Complete online stores with payments, product management, and a smooth customer experience.",
    icon: ShoppingCart,
  },
  {
    title: "Website Maintenance & Support",
    category: "it",
    image: "workspace",
    alt: "Developer monitoring website performance",
    text: "Ongoing performance checks, updates, fixes, security care, and dependable technical support.",
    icon: ShieldCheck,
  },
];
const gallery = [
  {
    title: "A restaurant worth discovering.",
    category: "digital",
    image: "gallery-restaurant-website.png",
    description:
      "An elegant restaurant website concept that brings the menu, atmosphere, and reservation journey together across every screen.",
    type: "Restaurant website",
    service: "Web Development",
  },
  {
    title: "Every classroom, connected.",
    category: "digital",
    image: "gallery-school-management.png",
    description:
      "A bright school management platform for attendance, schedules, academic progress, teachers, and everyday administration.",
    type: "School management system",
    service: "Custom Software Development",
  },
  {
    title: "People and work, simplified.",
    category: "digital",
    image: "gallery-employee-management.png",
    description:
      "A clear employee management dashboard for teams, attendance, leave, payroll insights, and performance.",
    type: "Employee management system",
    service: "Custom Software Development",
  },
  {
    title: "Commerce that feels effortless.",
    category: "digital",
    image: "gallery-ecommerce-website.png",
    description:
      "A refined e-commerce experience with responsive product discovery, product details, cart, and checkout journeys.",
    type: "E-commerce website",
    service: "E-commerce Development",
  },
  {
    title: "Interiors made to belong.",
    category: "civil",
    image: "gallery-interior-design.png",
    description:
      "A warm contemporary interior shaped through natural stone, timber, soft textures, and carefully layered light.",
    type: "Interior design",
    service: "Interior Design",
  },
  {
    title: "Built with confidence.",
    category: "civil",
    image: "gallery-construction.png",
    description:
      "A modern construction project brought to life through sound planning, professional oversight, and precise execution.",
    type: "Building and construction",
    service: "Building & Construction",
  },
];
const circularGalleryItems = gallery.map((project) => ({
  image: `/images/${project.image}`,
  text: project.title,
}));
const faqs = [
  [
    "What types of projects do you take on?",
    "We work across civil construction, architectural planning, renovations, and interiors, alongside business websites, web applications, and mobile apps. Tell us what you’re planning and we’ll help define the right scope.",
  ],
  [
    "Can you help with both my building and my website?",
    "Yes. Aarav brings civil and IT services together. We can plan your physical space and digital presence as separate scopes within one shared vision.",
  ],
  [
    "How much will my project cost?",
    "Every project is different. Share your goals, requirements, and preferred timeline so we can define the scope and prepare a tailored proposal before work begins.",
  ],
  [
    "How long will my project take?",
    "The timeline depends on the scale, approvals, features, and materials involved. We agree on realistic milestones during planning and keep you informed as work progresses.",
  ],
  [
    "Do you provide support after delivery?",
    "We discuss documentation, handover, and ongoing maintenance or support while planning your project. Your proposal will clearly explain what is included.",
  ],
  [
    "How do I get started?",
    "Use the project enquiry form below to tell us about your idea. You can download your brief and, when our email is connected, open it in your email app to share with us.",
  ],
];

function Logo() {
  return (
    <a href="#home" className="brand" aria-label="Aarav home">
      <span className="brand-emblem">
        <svg viewBox="0 0 62 54" fill="none" aria-hidden="true">
          <path
            d="M5 35a26 26 0 0 1 52 0M10 35a21 21 0 0 1 42 0"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="m14 33 16-15 17 15M19 29v13h10V31h7v11h7V29M30 11v4M13 16l3 3M47 16l-3 3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m3 43 6-3h44l6 3v8H3z"
            fill="var(--paper)"
            stroke="currentColor"
          />
          <text
            x="31"
            y="48.5"
            textAnchor="middle"
            fill="currentColor"
            fontSize="6"
            fontFamily="sans-serif"
            fontWeight="700"
            letterSpacing="1.4"
          >
            AARAV
          </text>
        </svg>
      </span>
      <span className="brand-name">
        AARAV<span>BUILDER & IT SOLUTION</span>
      </span>
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="eyebrow-mark">↗</span>
      {children}
    </span>
  );
}

function Seal() {
  return (
    <div className="hero-seal" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path
            id="seal-path"
            d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"
          />
        </defs>
        <text>
          <textPath href="#seal-path" textLength="280">
            BUILT WITH PURPOSE • DESIGNED FOR PEOPLE •{" "}
          </textPath>
        </text>
      </svg>
      <ArrowUpRight />
    </div>
  );
}

export default function AaravSite() {
  const { enabled } = useMotionPreference();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [service, setService] = useState("Naksha / Building Design");
  const [serviceCategory, setServiceCategory] = useState<"civil" | "it">(
    "civil",
  );
  const [showAllServices, setShowAllServices] = useState(false);
  const [brief, setBrief] = useState("");
  const [faq, setFaq] = useState<number | null>(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const projectTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = selectedIndex === null ? null : gallery[selectedIndex];
  const categoryServices = services.filter(
    (item) => item.category === serviceCategory,
  );
  const visibleServices = showAllServices
    ? categoryServices
    : categoryServices.slice(0, 3);
  useEffect(() => {
    if (selectedIndex !== null) dialogRef.current?.showModal();
  }, [selectedIndex]);
  const chooseService = (value: string) => {
    setService(value);
    setBrief("");
  };
  const makeBrief = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBrief(
      `AARAV BUILDER & IT SOLUTION — PROJECT ENQUIRY\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${service}\nTimeline: ${data.get("timeline")}\n\nProject details:\n${data.get("message")}\n`,
    );
  };
  const downloadBrief = () => {
    const url = URL.createObjectURL(
      new Blob([brief], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aarav-project-enquiry.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="site-shell">
      <MotionProvider />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-wrap">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a className="nav-home" href="#home">
              Home
            </a>
            <a href="#about">About us</a>
            <a href="#services">Our services</a>
            <a href="#work">Gallery</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="button button-primary nav-cta" href="#contact">
            Let’s build together <ArrowUpRight size={15} />
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[
              ["Home", "home"],
              ["About us", "about"],
              ["Our expertise", "services"],
              ["Gallery", "work"],
              ["Let’s talk", "contact"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={20} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main id="main">
        <section className="hero" id="home">
          <div className="hero-visual">
            <Image
              className="hero-image"
              src="/images/framing.jpg"
              alt="The timber framework of a new home, ready to become a living space"
              fill
              preload
              sizes="(max-width: 760px) 100vw, 75vw"
            />
            <div className="hero-image-shade" />
          </div>
          <div className="hero-brush" aria-hidden="true" />
          <div className="container hero-container">
            <div className="hero-copy">
              <Eyebrow>YOUR VISION. OUR CRAFT.</Eyebrow>
              <h1 aria-label="Where plans become projects. Building spaces and creating digital possibilities.">
                <span className="hero-line">
                  <span className="hero-line-inner">WHERE PLANS</span>
                </span>
                <span className="hero-line">
                  <span className="hero-line-inner">BECOME</span>
                </span>
                <span className="hero-line hero-rotating-line">
                  <span className="hero-line-inner">
                    {enabled ? (
                      <RotatingText
                        texts={[
                          "PROJECTS.",
                          "SPACES.",
                          "WEBSITES.",
                          "POSSIBILITIES.",
                        ]}
                        rotationInterval={3000}
                        splitBy="characters"
                        staggerDuration={0.025}
                        transition={{
                          type: "spring",
                          damping: 28,
                          stiffness: 240,
                        }}
                        mainClassName="hero-rotating"
                        aria-hidden="true"
                      />
                    ) : (
                      <span>PROJECTS.</span>
                    )}
                  </span>
                </span>
              </h1>
              <p>
                From the spaces you live in to the technology you grow with.
                <br className="wide-break" /> We turn your next big idea into
                something built to last.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="button button-primary">
                  Start your project <ArrowUpRight size={17} />
                </a>
                <a href="#services" className="button button-outline">
                  Explore our services <ArrowDown size={16} />
                </a>
              </div>
              <div className="hero-bottom">
                <span>
                  <Building2 size={16} /> CIVIL & CONSTRUCTION
                </span>
                <span>
                  <Code2 size={16} /> IT & DIGITAL SOLUTIONS
                </span>
              </div>
            </div>
            <Seal />
            <div className="hero-note">
              <span className="hero-note-icon">
                <HardHat size={22} />
              </span>
              <span>
                <small>FROM CONCRETE TO CODE</small>
                <strong>
                  Different expertise.
                  <br />
                  The same dedication.
                </strong>
              </span>
              <ArrowUpRight size={26} />
            </div>
          </div>
          <span className="hero-image-caption">
            THE START OF SOMETHING GREAT.
          </span>
        </section>

        <div
          className="expertise-strip"
          aria-label="Civil construction, web development, mobile apps, design and renovation"
        >
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div
                className="marquee-group"
                key={copy}
                aria-hidden={copy === 1}
              >
                {[
                  "CIVIL CONSTRUCTION",
                  "WEBSITE DEVELOPMENT",
                  "MOBILE APPLICATIONS",
                  "DESIGN & RENOVATION",
                ].map((text) => (
                  <span key={text}>
                    {text}
                    <span className="strip-star" aria-hidden="true">
                      ✳
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section
          className="services-section surface-section section"
          id="services"
        >
          <div className="container">
            <div className="section-heading">
              <div data-reveal>
                <Eyebrow>WHAT WE DO</Eyebrow>
                <h2>OUR SERVICES</h2>
              </div>
              <p data-reveal>
                From architectural ideas to digital products, we design, build,
                and deliver solutions for both <em>physical and digital spaces.</em>
              </p>
            </div>
            <div
              className="service-tabs"
              role="tablist"
              aria-label="Service categories"
              data-reveal
            >
              {[
                { value: "civil" as const, label: "Civil Engineering", icon: Building2 },
                { value: "it" as const, label: "IT Solutions", icon: Code2 },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={serviceCategory === value}
                  aria-controls="services-panel"
                  className={serviceCategory === value ? "active" : ""}
                  onClick={() => {
                    setServiceCategory(value);
                    setShowAllServices(false);
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
            <div
              className="services-grid"
              id="services-panel"
              role="tabpanel"
              aria-live="polite"
            >
              {visibleServices.map((item, index) => (
                <article
                  className="service-card"
                  key={item.title}
                >
                  <div className="service-image" data-image-reveal>
                    <Image
                      src={`/images/${item.image}.jpg`}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                    <span className="service-image-number">
                      {serviceCategory === "civil" ? "CIVIL" : "IT"} · 0
                      {index + 1}
                    </span>
                    <span className="service-icon">
                      <item.icon size={22} />
                    </span>
                  </div>
                  <div className="service-card-copy">
                    <div className="service-title">
                      <h3>{item.title}</h3>
                    </div>
                    <p>{item.text}</p>
                    <a
                      className="service-explore"
                      href="#contact"
                      aria-label={`Explore ${item.title}`}
                      onClick={() => chooseService(item.title)}
                    >
                      Explore Service <ArrowRight size={17} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="section-bottom">
              <span>
                {showAllServices
                  ? `SHOWING ALL ${serviceCategory === "civil" ? "CIVIL ENGINEERING" : "IT"} SERVICES.`
                  : "THREE FOCUSED SERVICES. ONE EXPERIENCED PARTNER."}
              </span>
              <button
                type="button"
                className="button button-cream services-view-all"
                aria-expanded={showAllServices}
                aria-controls="services-panel"
                onClick={() => setShowAllServices((current) => !current)}
              >
                {showAllServices ? "Show Featured Services" : "View All Services"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <span className="section-watermark" aria-hidden="true">
            BUILT DIFFERENT.
          </span>
        </section>

        <section className="about-section section" id="about">
          <div className="container">
            <div className="about-grid">
              <div data-reveal>
                <Eyebrow>GET TO KNOW AARAV</Eyebrow>
                <h2>
                  GOOD PEOPLE.
                  <br />
                  GREAT WORK.
                </h2>
                <p className="about-intro">
                  A practical mindset. A creative spirit.
                  <br />A partner for what comes next.
                </p>
                <a href="#process" className="button button-outline">
                  Our approach <ArrowUpRight size={16} />
                </a>
              </div>
              <div data-reveal>
                <BlurText
                  text="We’re a team that shows up, thinks ahead, and stands behind what we build."
                  className="about-statement"
                  delay={60}
                  direction="bottom"
                />
                <p className="about-description">
                  Aarav Builder & IT Solution brings the craft of construction
                  and the possibilities of technology under one roof. A place to
                  call home, a better space to work, or a platform to grow your
                  business—we approach every project with care, clarity, and
                  purpose.
                </p>
                <div className="about-facts">
                  <div>
                    <strong>01</strong>
                    <span>Shared vision</span>
                  </div>
                  <div>
                    <strong>02</strong>
                    <span>Connected disciplines</span>
                  </div>
                  <div>
                    <strong>∞</strong>
                    <span>Possibilities ahead</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-panorama" data-image-reveal>
              <Image
                src="/images/framing.jpg"
                alt="An open timber structure showing the foundations of a future home"
                fill
                sizes="100vw"
              />
              <div className="panorama-caption">
                <span>EVERY GREAT BUILD STARTS WITH A BETTER PLAN.</span>
                <ArrowUpRight size={38} />
              </div>
            </div>
          </div>
          <span className="about-symbol" aria-hidden="true">
            ↗
          </span>
        </section>

        <section className="benefits-section section">
          <div className="container">
            <div className="section-heading">
              <div data-reveal>
                <Eyebrow>WHY BUILD WITH US</Eyebrow>
                <h2>
                  THE LITTLE THINGS.
                  <br />
                  THE BIG DIFFERENCE.
                </h2>
              </div>
              <p data-reveal>
                We keep things <em>simple, honest, and focused</em>
                <br />
                on what matters to you.
              </p>
            </div>
            <div className="benefits-grid">
              {[
                {
                  icon: MessageSquare,
                  title: "Clear communication",
                  text: "Real conversations, clear updates, and answers when you need them.",
                },
                {
                  icon: Compass,
                  title: "A considered plan",
                  text: "Scope, milestones, and expectations agreed before the work begins.",
                },
                {
                  icon: ShieldCheck,
                  title: "Built with care",
                  text: "Thoughtful decisions, dependable materials, and attention to the details.",
                },
                {
                  icon: Handshake,
                  title: "Your vision comes first",
                  text: "We listen, collaborate, and shape the solution around your needs.",
                },
              ].map((item) => (
                <article key={item.title} data-reveal>
                  <item.icon size={30} strokeWidth={1.35} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="digital-section surface-section section"
          id="digital"
        >
          <div className="container">
            <div className="center-heading" data-reveal>
              <Eyebrow>THE OTHER SIDE OF BUILDING</Eyebrow>
              <h2>
                GREAT FOUNDATIONS.
                <br />
                DIGITAL POSSIBILITIES.
              </h2>
              <p>
                Your business deserves a digital home that works as hard as you
                do.
              </p>
            </div>
            <div className="digital-showcase">
              <div className="digital-artwork project-card">
                <div className="project-image browser-mockup">
                  <div className="browser-chrome">
                    <span />
                    <span />
                    <span />
                    <small>your-next-big-idea.com</small>
                  </div>
                  <div className="mock-site">
                    <div className="mock-site-nav">
                      AARAV<span>BUILT FOR BETTER ↗</span>
                    </div>
                    <div className="mock-site-title">
                      GOOD IDEAS.
                      <br />
                      <span>GREAT SPACES.</span>
                    </div>
                    <div className="mock-site-image">
                      <Image
                        src="/images/residence.jpg"
                        alt="Example residential website concept"
                        fill
                        sizes="50vw"
                      />
                    </div>
                    <span className="mock-site-footer">
                      A WEBSITE THAT FEELS LIKE YOU. <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
                <div className="phone-mockup">
                  <span className="phone-notch" />
                  <small>
                    9:41 <span>▮▮▮</span>
                  </small>
                  <span className="phone-greeting">LET’S MAKE TODAY COUNT</span>
                  <h4>
                    Your day.
                    <br />
                    <em>Simplified.</em>
                  </h4>
                  <div className="phone-progress">
                    <span>PROJECT PROGRESS</span>
                    <strong>
                      78<small>%</small>
                    </strong>
                    <i />
                  </div>
                  <div className="phone-task">
                    <Check size={14} />
                    <span>
                      A little closer to done.<small>One step at a time.</small>
                    </span>
                  </div>
                  <div className="phone-nav">
                    <Building2 size={15} />
                    <Layers3 size={15} />
                    <Plus size={15} />
                  </div>
                </div>
                <span className="concept-label">
                  ILLUSTRATIVE INTERFACE CONCEPTS
                </span>
              </div>
              <div className="digital-details">
                {[
                  {
                    n: "01",
                    icon: Monitor,
                    title: "Websites that work.",
                    text: "Business websites, e-commerce, bookings, and custom web applications. Fast, responsive, and easy to use.",
                  },
                  {
                    n: "02",
                    icon: Smartphone,
                    title: "Apps that make sense.",
                    text: "Android and iOS experiences designed around your users, with the features your business actually needs.",
                  },
                  {
                    n: "03",
                    icon: PenTool,
                    title: "Design with a purpose.",
                    text: "Clear interfaces, considered journeys, and a visual identity that makes every interaction feel like your brand.",
                  },
                ].map((item) => (
                  <article key={item.n} data-reveal>
                    <span className="digital-detail-number">{item.n}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <item.icon size={23} />
                  </article>
                ))}
                <a
                  href="#contact"
                  className="button button-orange"
                  onClick={() => chooseService("Web Development")}
                >
                  Let’s bring your idea online <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="process-section section" id="process">
          <div className="container">
            <div className="center-heading" data-reveal>
              <Eyebrow>HOW WE MAKE IT HAPPEN</Eyebrow>
              <h2>
                FROM FIRST CONVERSATION
                <br />
                TO FINAL HANDOVER.
              </h2>
              <p>
                A clear path. A shared vision. You’re part of it at every step.
              </p>
            </div>
            <div className="process-grid">
              <span className="process-progress" aria-hidden="true" />
              {[
                {
                  n: "01",
                  title: "Talk it through.",
                  text: "We listen to your ideas and understand your goals, priorities, and what success looks like.",
                },
                {
                  n: "02",
                  title: "Make a plan.",
                  text: "We shape the design, agree on a clear scope, and map out the timeline and budget.",
                },
                {
                  n: "03",
                  title: "Build it right.",
                  text: "We bring the plan to life, share progress, and work through the details together.",
                },
                {
                  n: "04",
                  title: "Make it yours.",
                  text: "A considered handover, clear documentation, and agreed next steps for your new project.",
                },
              ].map((item) => (
                <article key={item.n} data-reveal>
                  <span className="process-number">{item.n}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-section surface-section section" id="work">
          <div className="container">
            <div className="section-heading">
              <div data-reveal>
                <Eyebrow>A WORLD OF POSSIBILITIES</Eyebrow>
                <h2>THE INSPIRATION GALLERY</h2>
              </div>
              <span className="gallery-drag-note">DRAG / SCROLL TO EXPLORE</span>
            </div>
            <p className="gallery-caption">
              A few directions your next project could take. Reference imagery
              and concepts, ready for your vision.
            </p>
            <div className="circular-gallery-shell" data-lenis-prevent-wheel>
              <CircularGallery
                items={circularGalleryItems}
                bend={2.2}
                textColor="#231c14"
                borderRadius={0.055}
                font="700 30px Arial"
                scrollSpeed={1.7}
                scrollEase={0.06}
              />
            </div>
            <div className="gallery-project-list" aria-label="Inspiration projects">
              {gallery.map((project, index) => (
                <button
                  key={project.title}
                  onClick={(event) => {
                    projectTrigger.current = event.currentTarget;
                    setSelectedIndex(index);
                  }}
                  aria-label={`Explore ${project.title}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{project.title}</strong>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
            <div className="gallery-bottom">
              <span>YOUR PROJECT COULD BE THE NEXT CHAPTER.</span>
              <a href="#contact">
                Let’s talk about it <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="faq-section section container">
          <div data-reveal>
            <Eyebrow>A LITTLE MORE CLARITY</Eyebrow>
            <h2>
              GOOD QUESTIONS.
              <br />
              STRAIGHT ANSWERS.
            </h2>
            <p>
              Have something else in mind?
              <br />
              Let’s start a conversation.
            </p>
            <a href="#contact" className="button button-outline">
              Contact us <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <article
                key={question}
                className={faq === index ? "faq-open" : ""}
              >
                <h3>
                  <button
                    aria-expanded={faq === index}
                    aria-controls={`faq-${index}`}
                    onClick={() => setFaq(faq === index ? null : index)}
                  >
                    {question}
                    {faq === index ? <Minus size={17} /> : <Plus size={17} />}
                  </button>
                </h3>
                <div id={`faq-${index}`} hidden={faq !== index}>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <div className="cta-brush" aria-hidden="true" />
          <div className="container" data-reveal>
            <Eyebrow>YOU BRING THE VISION. WE BRING THE CRAFT.</Eyebrow>
            <h2>
              BIG IDEAS DESERVE
              <br />A SOLID FOUNDATION.
            </h2>
            <p>
              A new home. A smarter website. Your next big app.
              <br />
              Let’s make something you’re proud of.
            </p>
            <a className="button button-cream" href="#contact">
              Let’s build something great <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section id="contact" className="contact-section section">
          <div className="container contact-grid">
            <div data-reveal>
              <Eyebrow>YOUR NEXT CHAPTER STARTS HERE</Eyebrow>
              <h2>
                TELL US WHAT
                <br />
                YOU’RE <span>PLANNING.</span>
              </h2>
              <p>
                Even the biggest projects start with a simple conversation. Tell
                us a little about yours.
              </p>
              <div className="contact-promise">
                <span>
                  <Check size={17} /> Your goals, understood.
                </span>
                <span>
                  <Check size={17} /> Your options, made clear.
                </span>
                <span>
                  <Check size={17} /> Your next step, made simple.
                </span>
              </div>
              <div className="contact-signature">
                <Building2 size={27} />
                <span>
                  BRICKS. PIXELS. POSSIBILITIES.
                  <br />
                  <strong>All under one roof.</strong>
                </span>
              </div>
            </div>
            <form
              className="contact-form"
              onSubmit={makeBrief}
              onChange={() => brief && setBrief("")}
            >
              <h3>Let’s hear your idea.</h3>
              <fieldset>
                <legend>I’m interested in...</legend>
                <div className="service-options">
                  {services.map(({ title: value }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={service === value}
                      className={service === value ? "selected" : ""}
                      onClick={() => chooseService(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Alex Sharma"
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="alex@company.com"
                    maxLength={254}
                  />
                </label>
              </div>
              <label>
                Your ideal timeline
                <select name="timeline" defaultValue="Just exploring">
                  <option>Just exploring</option>
                  <option>As soon as possible</option>
                  <option>Within 1–3 months</option>
                  <option>Within 3–6 months</option>
                  <option>More than 6 months</option>
                </select>
              </label>
              <label>
                A little about your idea
                <textarea
                  name="message"
                  rows={3}
                  required
                  minLength={10}
                  maxLength={4000}
                  placeholder="What would you love to create?"
                />
              </label>
              <button
                className="button button-orange form-submit"
                type="submit"
              >
                Prepare my enquiry <ArrowUpRight size={18} />
              </button>
              <p className="form-disclaimer">
                Create your project brief first. Nothing is sent automatically.
              </p>
              {brief && (
                <div className="brief-result" role="status">
                  <strong>
                    <Check size={17} /> Your project brief is ready.
                  </strong>
                  <p>
                    {email
                      ? "Download a copy or open your email app to send it to our team."
                      : "Download your brief to keep and share. Email handoff will be available once our business email is connected."}
                  </p>
                  <div>
                    <button
                      className="brief-action"
                      type="button"
                      onClick={downloadBrief}
                    >
                      <Download size={16} /> Download brief
                    </button>
                    {email && (
                      <a
                        className="brief-action"
                        href={`mailto:${email}?subject=${encodeURIComponent(`New ${service} enquiry`)}&body=${encodeURIComponent(brief)}`}
                      >
                        Open email <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="surface-section">
        <div className="container">
          <div className="footer-top">
            <p>
              One team. Two disciplines. A world of possibilities.
              <br />
              Thoughtfully designed. Carefully built. Made with purpose.
            </p>
            <a href="#home" className="back-top" aria-label="Back to top">
              <ArrowUpRight size={23} />
            </a>
          </div>
          <div className="footer-services">
              <a href="#services">Civil Engineering</a>
            <span>✳</span>
              <a href="#services">Naksha Design</a>
            <span>✳</span>
              <a href="#services">Interior Design</a>
            <span>✳</span>
              <a href="#digital">Web & Mobile</a>
            <span>✳</span>
              <a href="#services">Software Solutions</a>
          </div>
          <div className="footer-links">
            <div>
              <span>NAVIGATE</span>
              <a href="#home">Home</a>
              <a href="#about">About us</a>
              <a href="#work">Gallery</a>
            </div>
            <div>
              <span>OUR EXPERTISE</span>
              <a href="#services">Civil Engineering & Design</a>
              <a href="#digital">IT & Digital Solutions</a>
              <a href="#process">Our process</a>
            </div>
            <div className="footer-contact">
              <span>HAVE SOMETHING IN MIND?</span>
              <a href="#contact">
                LET’S BUILD IT.
                <ArrowUpRight size={28} />
              </a>
              <p>Your ideas are in good company.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Builder & IT Solution. All rights reserved.
            </span>
            <span>Built with purpose. Designed for people.</span>
            <a href="#contact">
              Start a conversation <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-label="Project concept details"
        data-lenis-prevent
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onClose={() => {
          setSelectedIndex(null);
          projectTrigger.current?.focus();
        }}
      >
        <button
          className="dialog-close"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close project details"
        >
          <X />
        </button>
        {selected && (
          <>
            <div className="dialog-image">
              <Image
                src={`/images/${selected.image}`}
                alt={selected.type}
                fill
                sizes="800px"
              />
            </div>
            <div className="dialog-content">
              <Eyebrow>{selected.type}</Eyebrow>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              <p className="concept-note">
                This is an illustrative direction, not a completed client
                project. Let’s shape something around your needs.
              </p>
              <div className="dialog-actions">
                <a
                  className="button button-primary"
                  href="#contact"
                  onClick={() => {
                    chooseService(selected.service);
                    dialogRef.current?.close();
                  }}
                >
                  Discuss a similar project <ArrowRight size={16} />
                </a>
                <div>
                  <button
                    aria-label="Previous gallery image"
                    onClick={() =>
                      setSelectedIndex(
                        ((selectedIndex ?? 0) - 1 + gallery.length) %
                          gallery.length,
                      )
                    }
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    aria-label="Next gallery image"
                    onClick={() =>
                      setSelectedIndex(
                        ((selectedIndex ?? 0) + 1) % gallery.length,
                      )
                    }
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
