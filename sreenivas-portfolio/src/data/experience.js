export const experienceData = [
  {
    id: 1,
    title: "Associate Software Engineer",
    company: "DigitalAPI.ai",
    location: "Bangalore, India",
    duration: "Oct 2025 - Present",
    type: "Full-Time",
    description: "End-to-end owner of two production AI products for enterprise clients: **App Builder**, live on **Tata Communications**' API marketplace, and the AI assistant on **Fiserv**'s developer marketplace.",
    achievements: [
      "**Took App Builder from prototype to a v1.0 production release as its sole engineer**: an AI workspace over a marketplace's entire API catalog, where users discover and find the right APIs in conversation, call and test them live, chain them into workflows, and turn those workflows into working web apps. One deployment serves every marketplace",
      "**Gave an autonomous agent safe access to customers' live systems**: wrote a framework-free agent runtime (*OpenAI* and *Gemini*, **10 tools**) with approval gates before any change or live API call, a read-only, tenant-scoped database role behind its SQL tool, and automatic checks on every file of code it generates",
      "**Load-tested the platform with k6 and re-architected how it serves**: a single 2-vCPU server now holds **200 concurrent chat sessions**, and errors at 400 concurrent users fell from **7.4% to 0%** with throughput doubled. Moved it off Google Cloud to self-managed servers with CI/CD and automatic rollback",
      "**Re-architected Fiserv's AI assistant around an agent that plans its own searches**: a tool-calling loop on *Azure OpenAI* with **8 retrieval tools** over hybrid *Azure AI Search*, in production since **September 2026**. Cut a production report that was timing out from **~148 s to 4.4 s**",
      "**Kept every answer inside what each bank is entitled to see**: the agent's tools accept only the Fiserv products a customer's company has bought, the server re-checks every call, and code-side guards replace prompt rules the model kept ignoring, linking every API it cites and flagging endpoints that don't exist",
      "**Built the proofs of concept that set the company's agent-infrastructure direction**: co-built an AI Gateway with multi-model routing, reasoning streaming, strict response schemas, rate limiting and telemetry beyond what *LiteLLM* and *APISIX* supported, and an MCP Gateway that turns any OpenAPI spec into an MCP server auto-deployed to *Cloud Run*, with rate limiting, telemetry and tool monetization"
    ],
    technologies: ["Python", "FastAPI", "React", "PostgreSQL", "pgvector", "OpenAI", "Gemini", "Azure OpenAI", "Azure AI Search", "Azure Kubernetes Service", "Docker", "GitHub Actions", "Cloud Run", "MCP"],
    highlights: {
      productionProducts: "2",
      reportSpeedup: "~148 s to 4.4 s",
      focus: "Production AI agents"
    },
    image: null,
    imageAlt: "DigitalAPI.ai"
  },
  {
    id: 2,
    title: "Engineering Intern",
    company: "DigitalAPI.ai",
    location: "Bangalore, India",
    duration: "April 2025 - Sept 2025",
    type: "Internship",
    description: "On the Data Science team, built **large-scale OpenAPI processing pipelines** and co-built a **natural-language analytics agent**, using *Gemini* and *LangGraph*.",
    achievements: [
      "**Made API specs larger than the model's context window processable**: built an OpenAPI pipeline with *LangGraph* and *Gemini* that handles enterprise specs over **1.3M input tokens**, resolving circular references and chunking work in parallel. Cut inference cost by **45%** and generation time by **85%** at **99.9% structural accuracy**",
      "**Turned AI-enhanced API specs into finished documentation automatically**: built a React rendering engine that lays out enriched descriptions, complex schemas and code samples in *Python*, *C* and *Java* in a Redoc-style UI, with a **fully automated** generation-to-download pipeline",
      "**Co-built 'Analytics on Demand'**, a natural-language analytics agent on *Gemini 2.0* and **MCP** with **5+ custom tools** that queries *PostgreSQL* and *MongoDB* across millions of rows. Generates dashboards in **under 3 seconds** and removes **15+ hours a week** of manual reporting at **100% retrieval accuracy**"
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
  }
];

export const educationData = [
  {
    id: 1,
    degree: "Bachelor's in Artificial Intelligence and Machine Learning",
    institution: "BMS College of Engineering",
    location: "Bangalore, India",
    duration: "2021 - 2025",
    cgpa: "8.04",
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
    kind: "award",
    title: "Second Runner-Up, Google Cloud Agentic AI Day 2025",
    issuer: "Google Cloud × Hack2Skill",
    date: "2025",
    description: "Awarded **INR 1 Lakh prize** at the **Guinness World Record-certified** 30-hour innovation sprint, the *largest agentic-AI hackathon ever held*, with **1,941 adjudicated developers** across **700+ teams**. Built *Juno* (see Projects) for the *'Let AI Speak to Your Money'* challenge.",
    skills: ["Agentic AI", "Multi-Agent Systems", "Vertex AI", "Flutter", "MCP", "Cloud Run"],
    image: "/images/agentic-ai-day-podium.jpg",
    imageAlt: "Top 3 winning teams on stage during Google Cloud Agentic AI Day 2025 closing ceremony, gold confetti falling"
  },
  {
    id: 2,
    kind: "publication",
    title: "Co-Authored Research Paper, NCAIT 2025",
    issuer: "11th National Conference on Advancements in Information Technology, JSS Academy of Technical Education",
    date: "May 2025",
    description: "Co-authored *'SPEAR: An Innovative AI-Powered Web Development Assistant'* presented at **NCAIT-2025**, Bengaluru. Research on **agentic IDE architecture** for autonomous, context-optimized code generation using *LangGraph* multi-persona orchestration.",
    skills: ["Research", "LangGraph", "Agentic AI", "Code Generation", "Multi-Persona Orchestration"]
  }
];
