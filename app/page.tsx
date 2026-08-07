"use client";

import { useEffect, useMemo, useState } from "react";

type Experience = {
  company: string;
  role: string;
  location?: string;
  period: string;
  bullets: string[];
};

type Project = {
  title: string;
  category: "Graph + Data" | "Cloud + Systems" | "Agents" | "Product";
  index: string;
  description: string;
  source: string;
  demo?: string;
  stack: string[];
};

const navItems = [
  ["engine", "Engine"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["research", "Research"],
  ["contact", "Connect"],
] as const;

const graphNodes = [
  { id: "event", label: "EVENT", x: 8, y: 48, type: "source" },
  { id: "api", label: "PY API", x: 28, y: 29, type: "compute" },
  { id: "identity", label: "ENTITY", x: 31, y: 70, type: "data" },
  { id: "skill", label: "SKILL", x: 53, y: 18, type: "graph" },
  { id: "path", label: "PATH", x: 56, y: 52, type: "graph" },
  { id: "signal", label: "SIGNAL", x: 51, y: 83, type: "data" },
  { id: "cache", label: "CACHE", x: 76, y: 27, type: "compute" },
  { id: "answer", label: "ANSWER", x: 83, y: 63, type: "answer" },
] as const;

const graphEdges = [
  { from: "event", to: "api", left: 11, top: 42, width: 22, angle: -29 },
  { from: "event", to: "identity", left: 11, top: 56, width: 23, angle: 27 },
  { from: "api", to: "skill", left: 31, top: 25, width: 24, angle: -17 },
  { from: "api", to: "path", left: 31, top: 38, width: 27, angle: 29 },
  { from: "identity", to: "path", left: 33, top: 63, width: 25, angle: -27 },
  { from: "identity", to: "signal", left: 33, top: 75, width: 20, angle: 17 },
  { from: "skill", to: "cache", left: 55, top: 20, width: 23, angle: 10 },
  { from: "skill", to: "path", left: 55, top: 27, width: 25, angle: 90 },
  { from: "path", to: "cache", left: 58, top: 41, width: 21, angle: -33 },
  { from: "path", to: "answer", left: 59, top: 57, width: 26, angle: 12 },
  { from: "signal", to: "answer", left: 53, top: 76, width: 32, angle: -21 },
  { from: "cache", to: "answer", left: 78, top: 38, width: 27, angle: 74 },
] as const;

const queryStates = [
  {
    mode: "CYPHER / PATH 01",
    query:
      "MATCH (person)-[:HAS_SKILL]->(skill)<-[:REQUIRES]-(role) RETURN role, score",
    result: "35% higher match accuracy",
  },
  {
    mode: "GREMLIN / PATH 02",
    query:
      "g.V().has('candidate', 'id', id).repeat(outE().inV()).times(3).path()",
    result: "multi-hop context in milliseconds",
  },
  {
    mode: "EVENT / STREAM 03",
    query:
      "ingest → resolve entity → update graph → invalidate cache → emit decision",
    result: "observable, idempotent flow",
  },
] as const;

const experiences: Experience[] = [
  {
    company: "Sprouts AI",
    role: "Software Engineer · Python / AWS / Graph Databases",
    location: "Chicago, IL",
    period: "Mar 2025 — Present",
    bullets: [
      "Architected Python/FastAPI REST APIs on AWS (Lambda, ECS, API Gateway, DynamoDB) at sub-second latency for 1K+ daily users.",
      "Designed graph intelligence on Neo4j, TigerGraph, and Amazon Neptune, modeling candidate-skill-job relationships with multi-hop Cypher/Gremlin traversals and entity resolution, cutting manual review 60% and boosting match accuracy 35%.",
      "Built event-driven microservices with SQS/SNS, Kafka, and Kinesis for asynchronous ingestion and streaming analytics pipelines, enabling real-time data-driven matching decisions at scale.",
      "Engineered data analytics pipelines over PostgreSQL and DynamoDB with CloudWatch observability, IAM-secured access, and query performance tuning, reducing p95 API latency 40%.",
      "Automated CI/CD with Docker, GitHub Actions, and Pytest; mentored junior engineers and led architecture reviews.",
    ],
  },
  {
    company: "Resilience Inc",
    role: "Software Engineer · Python Backend",
    location: "Chicago, IL",
    period: "Aug 2023 — Mar 2025",
    bullets: [
      "Developed Python (Flask/Django) REST APIs on AWS (EC2, ECS, RDS, CloudWatch), cutting page load time 30% for 10K+ users.",
      "Built data analytics pipelines and backend APIs powering product analytics dashboards, enabling data-driven feature decisions that lifted student engagement 40%.",
      "Built low-latency Go backend services using goroutines, channels, contexts, and worker pools, processing asynchronous Kafka workloads with controlled backpressure, cancellation, and timeouts.",
      "Modeled relational data in PostgreSQL and served high-traffic reads with DynamoDB and Redis, tuning queries and indexes to improve API response times 35%.",
      "Established CI/CD with GitHub Actions, Docker, and automated testing, shipping end-to-end releases with product teams.",
    ],
  },
  {
    company: "Tata Steel",
    role: "Software Engineer · Backend & Data Platform",
    period: "Apr 2018 — Aug 2023",
    bullets: [
      "Architected cloud-native Python and Java microservices with RESTful APIs for enterprise data platforms, achieving 40% API response improvement and 99.99% production uptime.",
      "Designed C#/.NET ASP.NET Core microservices with clean architecture, dependency injection, and EF Core, hardening production APIs with retries, timeouts, circuit breakers, and distributed tracing.",
      "Built distributed, event-driven data pipelines with Kafka and MQ for real-time ingestion into PostgreSQL and NoSQL stores, supporting enterprise data analytics at scale.",
      "Designed graph data models in Neo4j mapping employee-skill-learning path relationships, writing Cypher queries that powered recommendation analytics and cut manual processing time 60%.",
      "Led teams through system design, architecture reviews, debugging, and incident triage across the full SDLC.",
    ],
  },
];

const projects: Project[] = [
  {
    title: "AskMyStore",
    category: "Graph + Data",
    index: "01",
    description:
      "A graph-powered RAG API connecting FastAPI, serverless execution, relationship traversal, and grounded answers.",
    source: "https://github.com/devthedevil/AskMyStore",
    demo: "https://ask-my-store.vercel.app/",
    stack: ["Python", "FastAPI", "Graph RAG"],
  },
  {
    title: "Real-time Stock Market Analysis",
    category: "Graph + Data",
    index: "02",
    description:
      "An event-driven analysis pipeline that carries market events through Kafka and streaming computation.",
    source: "https://github.com/devthedevil/Realtime-Stock-Market-Analysis",
    stack: ["Kafka", "Spark", "Flink"],
  },
  {
    title: "CME MDP 3.0 Feed Handler",
    category: "Cloud + Systems",
    index: "03",
    description:
      "A low-latency multicast feed handler centered on binary decoding, packet sequencing, and recovery.",
    source:
      "https://github.com/devthedevil/CME-Multicast-Market-Data-Feed-Handler-C-",
    stack: ["C++", "Multicast", "Low latency"],
  },
  {
    title: "EXPOS",
    category: "Cloud + Systems",
    index: "04",
    description:
      "An experimental operating system built from first principles across processes, memory, and system calls.",
    source: "https://github.com/devthedevil/EXPOS",
    stack: ["C", "Kernel", "Scheduling"],
  },
  {
    title: "Character Device Driver",
    category: "Cloud + Systems",
    index: "05",
    description:
      "A Linux character driver exploring user-kernel boundaries, device registration, and controlled I/O.",
    source: "https://github.com/devthedevil/Character-Device-Driver",
    stack: ["C", "Linux", "Driver"],
  },
  {
    title: "16-Bit RISC Processor",
    category: "Cloud + Systems",
    index: "06",
    description:
      "A compact processor implementation focused on instruction flow, datapath controls, and architecture.",
    source: "https://github.com/devthedevil/16-Bit-RISC-Processor",
    stack: ["RISC", "Digital logic", "Compute"],
  },
  {
    title: "oxide-hv",
    category: "Cloud + Systems",
    index: "07",
    description:
      "A Rust hypervisor lab exploring virtualization boundaries with an interactive technical walkthrough.",
    source: "https://github.com/devthedevil/oxide-hv",
    demo: "https://oxide-hv.vercel.app/",
    stack: ["Rust", "Virtualization", "Systems"],
  },
  {
    title: "Kubernetes Voting App",
    category: "Cloud + Systems",
    index: "08",
    description:
      "A multi-service workload demonstrating containers, service boundaries, and orchestration.",
    source: "https://github.com/devthedevil/Kubernetes-K8",
    stack: ["Kubernetes", "Docker", "Services"],
  },
  {
    title: "Model Context Protocol",
    category: "Agents",
    index: "09",
    description:
      "An implementation study of explicit context and tool contracts for composable intelligent systems.",
    source: "https://github.com/devthedevil/MCP",
    stack: ["MCP", "Protocol", "Tools"],
  },
  {
    title: "LangChain · Chat with Search",
    category: "Agents",
    index: "10",
    description:
      "A search-aware conversation system that routes intent toward external knowledge and useful tools.",
    source: "https://github.com/devthedevil/LangChain-Chat-with-Search",
    stack: ["LangChain", "Search", "LLM"],
  },
  {
    title: "AgentFlow",
    category: "Agents",
    index: "11",
    description:
      "A study in reusable agent steps, structured tool contracts, and inspectable orchestration paths.",
    source: "https://github.com/devthedevil/openAI-Agent-SDK",
    stack: ["Agents", "Orchestration", "SDK"],
  },
  {
    title: "TradeSentinel",
    category: "Product",
    index: "12",
    description:
      "A deployed decision-intelligence product that turns live signals into an inspectable workflow.",
    source: "https://github.com/devthedevil/tradesentinel",
    demo: "https://tradesentinel.vercel.app/",
    stack: ["Analytics", "ML", "Full stack"],
  },
  {
    title: "STRANGERS",
    category: "Product",
    index: "13",
    description:
      "A responsive social discovery product built around clear realtime interaction states.",
    source: "https://github.com/devthedevil/Strangers",
    demo: "https://strangers-react.vercel.app/",
    stack: ["React", "Realtime", "UX"],
  },
  {
    title: "HireLoop",
    category: "Product",
    index: "14",
    description:
      "A hiring workflow product shaped around practical end-to-end delivery and understandable states.",
    source: "https://github.com/devthedevil/hireloop",
    stack: ["Web", "Workflow", "Product"],
  },
  {
    title: "Pitch Perfect",
    category: "Product",
    index: "15",
    description:
      "A native iOS application for recording and transforming audio through direct mobile interaction.",
    source: "https://github.com/devthedevil/Pitch_Perfect",
    stack: ["iOS", "Swift", "Audio"],
  },
  {
    title: "Tic Tac Toe",
    category: "Product",
    index: "16",
    description:
      "An Android game focused on compact rules, deterministic state transitions, and responsive play.",
    source: "https://github.com/devthedevil/TicTacToe-Game",
    stack: ["Android", "Game state", "Mobile"],
  },
];

const capabilityRows = [
  ["Python services", "FastAPI · Flask · Django · async workflows · REST"],
  ["Graph intelligence", "Neo4j · TigerGraph · Neptune · Cypher · Gremlin · SPARQL"],
  ["AWS runtime", "Lambda · ECS/EKS · API Gateway · DynamoDB · RDS · IAM"],
  ["Event systems", "SQS/SNS · Kafka · Kinesis · backpressure · idempotency"],
  ["Production quality", "Pytest · CI/CD · CloudWatch · tracing · incident response"],
  ["Systems breadth", "Go · Java · C#/.NET · Redis · PostgreSQL · Kubernetes"],
] as const;

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

function GraphField() {
  return (
    <div className="graph-field" aria-label="Animated graph traversal">
      <div className="graph-grid" aria-hidden="true" />
      {graphEdges.map((edge, index) => (
        <span
          className={`graph-edge edge-${index}`}
          key={`${edge.from}-${edge.to}`}
          style={
            {
              "--left": `${edge.left}%`,
              "--top": `${edge.top}%`,
              "--width": `${edge.width}%`,
              "--angle": `${edge.angle}deg`,
              "--delay": `${index * 0.18}s`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}
      {graphNodes.map((node, index) => (
        <div
          className={`graph-node ${node.type}`}
          key={node.id}
          style={
            {
              "--x": `${node.x}%`,
              "--y": `${node.y}%`,
              "--delay": `${index * 0.2}s`,
            } as React.CSSProperties
          }
        >
          <i />
          <span>{node.label}</span>
        </div>
      ))}
      <div className="graph-status">
        <span>TRAVERSAL / LIVE</span>
        <b>8 nodes · 12 edges · 3 hops</b>
      </div>
    </div>
  );
}

export default function Home() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [projectFilter, setProjectFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("engine");

  useEffect(() => {
    const timer = window.setInterval(
      () => setQueryIndex((current) => (current + 1) % queryStates.length),
      3200,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map(([id]) => document.getElementById(id))
      .filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(
    () =>
      projectFilter === "All"
        ? projects
        : projects.filter((project) => project.category === projectFilter),
    [projectFilter],
  );

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const query = queryStates[queryIndex];

  return (
    <div className="site-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          DK<span>/</span>GRAPH
        </button>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              className={activeSection === id ? "active" : ""}
              onClick={() => jumpTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <ExternalLink
          href="./Dev_Kumar_Python_AWS_GraphDB_Resume.docx"
          className="resume-button"
        >
          Résumé
        </ExternalLink>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Python · AWS · Graph systems</p>
            <h1 id="hero-title">
              Find the signal
              <br />
              <em>between things.</em>
            </h1>
            <p className="hero-lede">
              I design cloud-native APIs and graph-backed systems that turn
              events, entities, and multi-hop relationships into fast,
              explainable decisions.
            </p>
            <div className="hero-actions">
              <button onClick={() => jumpTo("engine")} className="primary-action">
                Explore the engine <span>↓</span>
              </button>
              <a className="text-link" href="mailto:devkumar.dklv@gmail.com">
                Start a conversation ↗
              </a>
            </div>
            <div className="hero-proof">
              <div><strong>99.99%</strong><span>production uptime</span></div>
              <div><strong>−40%</strong><span>p95 API latency</span></div>
              <div><strong>+35%</strong><span>match accuracy</span></div>
            </div>
          </div>
          <div className="hero-system">
            <GraphField />
            <div className="query-console">
              <div className="query-head">
                <span>{query.mode}</span>
                <span className="live"><i /> EXECUTING</span>
              </div>
              <code key={queryIndex}>{query.query}</code>
              <div className="query-result">
                <span>RESULT</span>
                <strong>{query.result}</strong>
              </div>
            </div>
          </div>
          <div className="hero-meta">
            <span>DEV KUMAR / CHICAGO</span>
            <span>MODEL · TRAVERSE · OBSERVE · SCALE</span>
          </div>
        </section>

        <section className="signal-strip" aria-label="Engineering impact">
          <span>CONNECTED SYSTEMS</span>
          <div>Python services</div><i />
          <div>Event-driven AWS</div><i />
          <div>Graph intelligence</div><i />
          <div>Operational rigor</div>
        </section>

        <section className="engine section" id="engine">
          <div className="section-heading">
            <p className="eyebrow">01 / RELATIONSHIP ENGINE</p>
            <h2>
              A production path from
              <br />
              <em>event to answer.</em>
            </h2>
            <p>
              Connected data only matters when the path is dependable. The
              architecture below treats ingestion, graph modeling, traversal,
              caching, and telemetry as one measurable system.
            </p>
          </div>
          <div className="flow-diagram">
            {[
              ["01", "INGEST", "SQS · SNS · Kafka · Kinesis", "durable events"],
              ["02", "VALIDATE", "Pydantic · IAM · contracts", "trusted inputs"],
              ["03", "RESOLVE", "entity identity · deduplication", "clean graph"],
              ["04", "TRAVERSE", "Cypher · Gremlin · SPARQL", "connected context"],
              ["05", "SERVE", "FastAPI · Lambda · ECS", "low-latency API"],
              ["06", "OBSERVE", "metrics · logs · traces", "visible behavior"],
            ].map(([number, title, tech, outcome], index) => (
              <article key={title}>
                <div className="flow-index">{number}</div>
                <div className="flow-glyph" aria-hidden="true">
                  <i /><i /><i />
                </div>
                <h3>{title}</h3>
                <p>{tech}</p>
                <span>{outcome}</span>
                {index < 5 && <b className="flow-arrow" aria-hidden="true">→</b>}
              </article>
            ))}
            <div className="flow-packet" aria-hidden="true" />
          </div>
          <div className="engine-principles">
            {[
              ["Model the question", "Start from the access patterns and decisions the system must support—not from a fashionable database choice."],
              ["Design for repetition", "Events can arrive twice, networks fail, caches become stale, and every path needs a safe replay story."],
              ["Measure the traversal", "Profile expensive paths, constrain fan-out, place restrictive predicates early, and expose p95 behavior."],
              ["Operate the whole path", "Own contracts, permissions, deployment, observability, incident response, and cost as one system."],
            ].map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="craft section">
          <div className="craft-image">
            <img
              src="./og.png"
              alt="A connected graph system carrying event streams through a processing plane"
            />
            <div className="image-caption">
              <span>SYSTEM STUDY / CONNECTED DATA</span>
              <span>Events become context. Context becomes action.</span>
            </div>
          </div>
          <div className="craft-copy">
            <p className="eyebrow">02 / THE WORK UNDERNEATH</p>
            <h2>
              I like the problems
              <br />
              <em>hidden in the path.</em>
            </h2>
            <p>
              A graph query that reads beautifully but fans out without bound.
              A fast endpoint whose retry semantics are unsafe. A stream that
              works until one consumer slows down. Those edges are where the
              most useful engineering lives.
            </p>
            <div className="craft-list">
              <div><span>01</span><strong>Make relationships explicit</strong><p>Names, direction, cardinality, lifecycle, and ownership belong in the model.</p></div>
              <div><span>02</span><strong>Prefer observable simplicity</strong><p>The best design is one a team can understand under pressure.</p></div>
              <div><span>03</span><strong>Leave the platform stronger</strong><p>Reusable code, tests, reviews, runbooks, and mentoring compound.</p></div>
            </div>
          </div>
        </section>

        <section className="experience section" id="experience">
          <div className="section-heading compact">
            <p className="eyebrow">03 / EXPERIENCE</p>
            <h2>
              Built for production,
              <br />
              <em>measured in outcomes.</em>
            </h2>
          </div>
          <div className="experience-list">
            {experiences.map((experience, experienceIndex) => (
              <article className="experience-card" key={experience.company}>
                <aside>
                  <span>0{experienceIndex + 1}</span>
                  <p>{experience.period}</p>
                </aside>
                <div className="experience-body">
                  <div className="experience-title">
                    <div>
                      <h3>{experience.company}</h3>
                      <p>{experience.role}</p>
                    </div>
                    {experience.location && <span>{experience.location}</span>}
                  </div>
                  <ol>
                    {experience.bullets.map((bullet, bulletIndex) => (
                      <li key={bullet}>
                        <span>{String(bulletIndex + 1).padStart(2, "0")}</span>
                        <p>{bullet}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="capabilities section">
          <div className="section-heading compact">
            <p className="eyebrow">04 / CAPABILITY MAP</p>
            <h2>
              Across the request,
              <br />
              <em>through the graph.</em>
            </h2>
          </div>
          <div className="capability-table">
            {capabilityRows.map(([title, copy], index) => (
              <div key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="projects section" id="projects">
          <div className="projects-header">
            <div className="section-heading compact">
              <p className="eyebrow">05 / PROJECT INDEX</p>
              <h2>
                Systems explored
                <br />
                <em>from silicon to agents.</em>
              </h2>
            </div>
            <div className="project-filters" aria-label="Filter projects">
              {["All", "Graph + Data", "Cloud + Systems", "Agents", "Product"].map(
                (filter) => (
                  <button
                    key={filter}
                    className={projectFilter === filter ? "active" : ""}
                    onClick={() => setProjectFilter(filter)}
                    aria-pressed={projectFilter === filter}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-meta">
                  <span>{project.index}</span>
                  <span>{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-stack">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="project-links">
                  <ExternalLink href={project.source}>SourceCode</ExternalLink>
                  {project.demo && (
                    <ExternalLink href={project.demo}>Technical Demo</ExternalLink>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="research section" id="research">
          <div className="research-visual" aria-hidden="true">
            <div className="research-network">
              {Array.from({ length: 10 }).map((_, index) => (
                <i key={index} className={`rn-${index + 1}`} />
              ))}
              <span className="research-path p1" />
              <span className="research-path p2" />
              <span className="research-path p3" />
              <span className="research-path p4" />
              <b>R</b>
            </div>
            <div className="research-axis">
              <span>COMPARE</span><i />
              <span>MEASURE</span><i />
              <span>IMPROVE</span>
            </div>
          </div>
          <div className="research-copy">
            <p className="eyebrow">06 / PUBLISHED RESEARCH</p>
            <h2>
              Comparative Study of
              <br />
              Movie Recommendation Systems
              <br />
              <em>using Feature Engineering.</em>
            </h2>
            <p>
              An evidence-first comparison of recommendation approaches and how
              feature design changes model behavior—the same discipline I bring
              to graph modeling, query performance, and backend architecture.
            </p>
            <div className="research-links">
              <ExternalLink href="https://ieeexplore.ieee.org/document/10094480">
                Read paper
              </ExternalLink>
              <ExternalLink href="https://github.com/devthedevil/Comparative-Study-of-Movie-Recommendation-System/blob/main/Netflix_Movie.ipynb">
                SourceCode
              </ExternalLink>
              <ExternalLink href="https://drive.google.com/file/d/1rayr6Cht6quyLUJOXWOAcBi_rxQp2Ol0/view">
                Certificate
              </ExternalLink>
            </div>
          </div>
        </section>

        <section className="education section">
          <p className="eyebrow">07 / EDUCATION</p>
          <div className="education-grid">
            <article>
              <span>Graduate</span>
              <h3>Illinois Institute of Technology</h3>
              <p>M.S. · Computer Science</p>
            </article>
            <article>
              <span>Undergraduate</span>
              <h3>National Institute of Technology Calicut</h3>
              <p>B.S. · Computer Science</p>
            </article>
          </div>
        </section>

        <section className="contact" id="contact">
          <p className="eyebrow">08 / CONNECT</p>
          <h2>
            Let&apos;s map the
            <br />
            <em>hard part.</em>
          </h2>
          <a className="email-link" href="mailto:devkumar.dklv@gmail.com">
            devkumar.dklv@gmail.com <span>↗</span>
          </a>
          <div className="contact-links">
            <ExternalLink href="https://github.com/devthedevil">GitHub</ExternalLink>
            <ExternalLink href="https://leetcode.com/u/dev_kumar_dklv/">
              LeetCode
            </ExternalLink>
            <ExternalLink href="https://scholar.google.com/citations?user=VXIu5a4AAAAJ&hl=en">
              Google Scholar
            </ExternalLink>
            <ExternalLink href="https://ieeexplore.ieee.org/document/10094480">
              IEEE
            </ExternalLink>
            <ExternalLink href="./Dev_Kumar_Python_AWS_GraphDB_Resume.docx">
              Résumé
            </ExternalLink>
          </div>
          <div className="contact-status">
            <span>CHICAGO, IL</span>
            <span className="live"><i /> OPEN TO HARD SYSTEMS PROBLEMS</span>
          </div>
        </section>
      </main>
    </div>
  );
}
