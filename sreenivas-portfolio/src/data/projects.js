export const projectsData = [
  {
    id: 1,
    title: "Juno",
    subtitle: "Voice-Native Financial Operating System",
    category: "Voice-Native AI",
    description: "Multi-agent voice-first financial advisor built for Google Cloud Agentic AI Day 2025. A Coordinator MCP orchestrates Gemini-powered specialist agents; users ask plain-language questions in multiple Indian languages and receive grounded financial reasoning.",
    detailedDescription: "Multi-agent advisory system where a Coordinator MCP orchestrates specialized Gemini-powered agents (Growth, Security, Context, Feedback). Built in 30 hours and awarded 2nd Runner-Up among 1,941 developers across 700+ teams at the Guinness World Record-certified Google Cloud Agentic AI Day 2025.",
    features: [
      "Multi-agent reasoning: Coordinator MCP orchestrates Growth, Security, Context, and Feedback agents",
      "Fi Money MCP integration streams normalized assets, liabilities, cash-flow, and risk metrics into agent context",
      "Voice-first multilingual UX in multiple Indian languages via Cloud Speech-to-Text + TTS",
      "Monte-Carlo retirement and goal simulations grounded with real-time market and regulatory data via Search Grounding",
      "Serverless backend: Cloud Run micro-agents, Firebase Auth (Phone-OTP, passkey), Firestore for per-user agent memory and life-event store"
    ],
    technologies: ["Flutter", "Vertex AI (Gemini 2.5 Flash Lite)", "Firebase", "Firestore", "Cloud Run", "Cloud Speech-to-Text", "MCP"],
    metrics: {
      recognition: "2nd Runner-Up — Google Cloud Agentic AI Day 2025",
      cohort: "1,941 developers / 700+ teams",
      prize: "INR 1 Lakh",
      stack: "Flutter + GCP serverless"
    },
    status: "Completed",
    github: null,
    demo: "https://drive.google.com/file/d/12SFmxkaDG8kcLFpLTg6fAuKgeOlFq4Y8/view?usp=sharing",
    image: "/images/juno-project.jpg"
  },
  {
    id: 2,
    title: "SPEAR",
    subtitle: "Split Panel Engine for Automated Rendering",
    category: "Code Generation",
    description: "An autonomous AI software development team built with LangGraph — Developer, Reviewer, and QA personas collaborate to generate enterprise-scale applications. Co-authored research paper presented at NCAIT-2025.",
    detailedDescription: "Agentic IDE architecture demonstrating context-optimized code generation. Multi-persona agents coordinate via LangGraph to overcome LLM context window limits while maintaining design pattern consistency across enterprise codebases.",
    features: [
      "LangGraph-orchestrated multi-persona agents (Developer / Reviewer / QA)",
      "95% accuracy in code compilation and functionality tests",
      "File-based coding algorithm overcomes LLM context window limits",
      "Maintains consistent design patterns at enterprise scale",
      "Research published at NCAIT-2025, JSS Academy of Technical Education, Bengaluru — May 2025"
    ],
    technologies: ["Python", "FastAPI", "React", "LangGraph", "Docker", "Gemini", "MongoDB"],
    metrics: {
      accuracy: "95% code compilation",
      publication: "NCAIT-2025",
      personas: "Developer / Reviewer / QA",
      focus: "Enterprise-scale generation"
    },
    status: "Completed",
    github: null,
    demo: null,
    image: "/images/spear-project.jpg"
  },
  {
    id: 3,
    title: "Skooc",
    subtitle: "Multi-Persona Therapeutic AI Suite",
    category: "Healthcare AI",
    description: "A three-persona therapeutic AI suite serving Educators, Parents, and Children — 300+ clinical scenarios across 20 psychological themes, with crisis intervention routing and culturally-tuned RAG for Indian contexts. Consulting engagement, 2025.",
    detailedDescription: "LangGraph-orchestrated three-persona chatbot architecture with neurodivergent-aware routing and Severity-C crisis classification. Adaptive Quick Help / Deep Dive workflows scaling 5–30 minutes per session, backed by a Cultural-Context RAG pipeline of evidence-based strategies tuned for Indian parenting and education contexts.",
    features: [
      "Three persona-specialized agents (Educator, Parent, Child) with cross-persona context aggregation",
      "300+ clinical scenarios spanning 20 psychological themes",
      "Severity-C binary classification routes high-risk inputs (self-harm/abuse) to human counsellors — 100% safety compliance",
      "Neurodivergent-aware routing with ~50 unique interaction states (Confidence Check, Pattern Recognition)",
      "Cultural-Context RAG: 50+ evidence-based strategies tuned for Indian parenting and education"
    ],
    technologies: ["Python", "LangGraph", "RAG", "Vector Search"],
    metrics: {
      scenarios: "300+ clinical scenarios",
      themes: "20 psychological themes",
      personas: "3 (Educator / Parent / Child)",
      safety: "100% Severity-C compliance"
    },
    status: "Completed",
    github: null,
    demo: null,
    image: "/images/skooc-project.jpg"
  }
];

export const projectCategories = [
  "All",
  "Voice-Native AI",
  "Code Generation",
  "Healthcare AI"
];

export const featuredProjects = [1, 2, 3];
