export const experienceData = [
  {
    id: 1,
    title: "Associate Technical Specialist, AI/ML",
    company: "DigitalAPI.ai",
    location: "Bangalore, India",
    duration: "Oct 2025 - Present",
    type: "Full-Time",
    description: "Architecting **enterprise agentic AI infrastructure** — multi-model assistants, **MCP gateways** managing **10K+ daily requests**, and real-time collaborative workflow builders.",
    achievements: [
      "**Architected 'DAC Studio' Agentic Suite** — multi-model (*Gemini, Claude, OpenAI*) enterprise AI assistant with dynamic **RBAC** routing across **7+ custom MCP tools**, including server-side secure cURL execution and live web search with reasoning streaming",
      "**Engineered cost-efficient RAG pipeline** using *PostgreSQL + PGVector* to embed thousands of API method/path summaries — reduced token consumption by **60%** while maintaining high retrieval accuracy",
      "**Built full-stack drag-and-drop workflow builder** with *React Flow + WebSockets* for multi-user real-time collaboration; AI translates natural language into structured graph nodes that sandbox-execute and render in the UI",
      "**Co-built proprietary multi-model AI Gateway** routing infrastructure overcoming *LiteLLM/APISIX* limits — supports thinking tokens, strict response schemas, live reasoning streaming, rate limiting, and telemetry across **10K+ daily API requests** with **zero downtime**",
      "**Architected enterprise MCP Gateway** transforming API marketplaces into 'Agent-Ready' ecosystems — custom OpenAPI → JSON-RPC HTTP MCP Server parser with **zero-downtime auto-deploys** to *GCP Cloud Run*, multi-tier rate limiting, telemetry, and tool monetization. Manages **10K+ daily requests**, reduces LLM context bloat by **70%**"
    ],
    technologies: ["LangGraph", "MCP", "Gemini", "Claude", "OpenAI", "PostgreSQL", "PGVector", "React Flow", "WebSockets", "GCP Cloud Run", "FastAPI"],
    highlights: {
      dailyRequests: "10K+",
      contextReduction: "70%",
      tokenSavings: "60%",
      focus: "Enterprise Agentic AI"
    },
    image: null,
    imageAlt: "DigitalAPI.ai office or DAC Studio screenshot"
  },
  {
    id: 2,
    title: "Engineering Intern, AI/ML",
    company: "DigitalAPI.ai",
    location: "Bangalore, India",
    duration: "April 2025 - Sept 2025",
    type: "Internship",
    description: "Built **natural-language analytics agents** and **large-scale OpenAPI processing pipelines** using *Gemini* and *LangGraph*.",
    achievements: [
      "**Engineered 'Analytics on Demand' platform** — natural-language-to-analytics agent using *Gemini 2.0* + **MCP** with **5+ custom tools** for autonomous *PostgreSQL/MongoDB* querying across millions of rows. Generates dynamic dashboards in **under 3 seconds**; eliminates **15+ hours/week** of manual reporting at **100% retrieval accuracy**",
      "**Built scalable OpenAPI processing pipeline** with *LangGraph + Gemini* — handles enterprise specs exceeding **1.3M+ input tokens** via reference resolution algorithms for circular dependencies and parallel async chunking. **45% inference cost reduction**, **85% generation speedup**, **99.9% structural accuracy**",
      "**Developed custom React documentation rendering engine** — dynamically renders AI-enhanced API specs with enriched descriptions, complex schemas, and multi-language code snippets (*Python/C/Java*) into a Redoc-style UI with a **100% automated** generation-to-download pipeline"
    ],
    technologies: ["LangGraph", "MCP", "Gemini 2.0", "PostgreSQL", "MongoDB", "React", "Python", "FastAPI"],
    highlights: {
      inputTokens: "1.3M+",
      costReduction: "45%",
      speedUp: "85%",
      focus: "Agentic Analytics & API Tooling"
    },
    image: null,
    imageAlt: "Analytics on Demand dashboard or OpenAPI pipeline diagram"
  },
  {
    id: 3,
    title: "AI Engineer, Contract",
    company: "RightSense",
    location: "Bangalore, India",
    duration: "Jan 2025 - March 2025",
    type: "Contract",
    description: "Architected the **SmartRFP enterprise platform** for automated RFP/RFQ processing — *Django + React* with multi-tenant collaboration and AI document parsing.",
    achievements: [
      "**Architected enterprise SmartRFP platform** reducing proposal preparation time by **70%** — processed **50+ concurrent RFP documents** at **95% accuracy**",
      "**Built scalable multi-tenant collaboration infrastructure** with role-based access control (*SuperAdmin/Admin/User*) — supporting **100+ concurrent users** with chat, calendar scheduling, and JIRA-style task management",
      "**Developed universal RFP parser** powered by *Llama* (deployed via *Ollama*) — converts diverse RFP formats into a standardized structure; coupled with a dynamic past-RFP knowledge base lifting automated draft generation accuracy by **85%**",
      "**Deployed full production stack** via *Docker + Jenkins CI/CD* on *GCP VMs* with hybrid *BigQuery + MongoDB* architecture — **99.5% uptime** supporting **500+ document processing workflows**"
    ],
    technologies: ["Django", "React", "Llama", "Ollama", "Docker", "Jenkins", "GCP", "BigQuery", "MongoDB"],
    highlights: {
      proposalTimeReduction: "70%",
      uptime: "99.5%",
      concurrentUsers: "100+",
      focus: "Enterprise RFP Automation"
    },
    image: null,
    imageAlt: "SmartRFP platform screenshot or RightSense team photo"
  }
];

export const educationData = [
  {
    id: 1,
    degree: "Bachelor's in Artificial Intelligence and Machine Learning",
    institution: "BMS College of Engineering",
    location: "Bangalore, India",
    duration: "2021 - 2025",
    cgpa: "8.6",
    status: "Graduated",
    relevantCourses: [
      "Machine Learning & Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Data Structures & Algorithms",
      "Neural Networks & AI",
      "Statistical Methods",
      "Database Management Systems"
    ]
  }
];

export const achievementsData = [
  {
    id: 1,
    title: "Second Runner-Up — Google Cloud Agentic AI Day 2025",
    issuer: "Google Cloud × Hack2Skill",
    date: "2025",
    description: "Awarded **INR 1 Lakh prize** at the **Guinness World Record-certified** 30-hour innovation sprint — the *largest agentic-AI hackathon ever held*, with **1,941 adjudicated developers** across **700+ teams**. Built *Juno* (see Projects) for the *'Let AI Speak to Your Money'* challenge.",
    skills: ["Agentic AI", "Multi-Agent Systems", "Vertex AI", "Flutter", "MCP", "Cloud Run"],
    image: "/images/agentic-ai-day-podium.jpg",
    imageAlt: "Top 3 winning teams on stage during Google Cloud Agentic AI Day 2025 closing ceremony, gold confetti falling"
  },
  {
    id: 2,
    title: "Co-Authored Research Paper — NCAIT 2025",
    issuer: "11th National Conference on Advancements in Information Technology, JSS Academy of Technical Education",
    date: "May 2025",
    description: "Co-authored *'SPEAR: An Innovative AI-Powered Web Development Assistant'* presented at **NCAIT-2025**, Bengaluru. Research on **agentic IDE architecture** for autonomous, context-optimized code generation using *LangGraph* multi-persona orchestration.",
    skills: ["Research", "LangGraph", "Agentic AI", "Code Generation", "Multi-Persona Orchestration"]
  }
];
