export const projectsData = [
  {
    id: 1,
    slug: "juno",
    title: "Juno",
    subtitle: "Voice-Native Financial Operating System",
    category: "Voice-Native AI",
    tagline: "2nd Runner-Up · Google Cloud Agentic AI Day 2025",
    description: "Multi-agent voice-first financial advisor built for *Google Cloud Agentic AI Day 2025*. A **Coordinator MCP** orchestrates *Gemini*-powered specialist agents; users ask plain-language questions in multiple Indian languages and receive grounded financial reasoning.",
    detailedDescription: "Multi-agent advisory system where a **Coordinator MCP** orchestrates specialized *Gemini*-powered agents (*Growth, Security, Context, Feedback*). Built in **30 hours** and awarded **2nd Runner-Up** among **1,941 developers** across **700+ teams** at the *Guinness World Record-certified* Google Cloud Agentic AI Day 2025.",
    features: [
      "**Multi-agent reasoning**: Coordinator MCP orchestrates *Growth, Security, Context, and Feedback* agents",
      "**Fi Money MCP integration** streams normalized assets, liabilities, cash-flow, and risk metrics into agent context",
      "**Voice-first multilingual UX** in multiple Indian languages via *Cloud Speech-to-Text + TTS*",
      "**Monte-Carlo retirement and goal simulations** grounded with real-time market and regulatory data via *Search Grounding*",
      "**Serverless backend**: *Cloud Run* micro-agents, *Firebase Auth* (Phone-OTP, passkey), *Firestore* for per-user agent memory and life-event store"
    ],
    technologies: ["Flutter", "Vertex AI (Gemini 2.5 Flash Lite)", "Firebase", "Firestore", "Cloud Run", "Cloud Speech-to-Text", "MCP"],
    metrics: {
      recognition: "2nd Runner-Up, Google Cloud Agentic AI Day 2025",
      cohort: "1,941 developers / 700+ teams",
      prize: "INR 1 Lakh",
      stack: "Flutter + GCP serverless"
    },
    status: "Completed",
    github: null,
    demo: "https://drive.google.com/file/d/12SFmxkaDG8kcLFpLTg6fAuKgeOlFq4Y8/view?usp=sharing",
    embed: "https://drive.google.com/file/d/12SFmxkaDG8kcLFpLTg6fAuKgeOlFq4Y8/preview",
    accent: "#A8451F",
    gradient: "linear-gradient(135deg, #F4D5C2 0%, #F0DFB8 50%, #E8C5A0 100%)",
    image: "/images/agentic-ai-day-team.jpg",
    imageAlt: "Our team accepting the 2nd Runner-Up check at Google Cloud Agentic AI Day 2025",
    gallery: [
      {
        src: "/images/agentic-ai-day-podium.jpg",
        alt: "Top 3 teams on stage during the closing ceremony, gold confetti falling",
        caption: "The top 3 teams on stage at the closing ceremony"
      }
    ]
  },
  {
    id: 2,
    slug: "spear",
    title: "SPEAR",
    subtitle: "Split Panel Engine for Automated Rendering",
    category: "Code Generation",
    tagline: "Published Research · NCAIT-2025",
    description: "An AI web development assistant that turns a plain-language prompt into a working website with a live preview. The first version is **published research** (NCAIT-2025); I then rebuilt it for my capstone as a *LangGraph* team of *Developer*, *Reviewer* and *QA* agents.",
    detailedDescription: "**Version 1, published:** a *FastAPI* backend asks *Claude* for HTML, CSS and JavaScript, validates it, and renders it live in the browser through *StackBlitz WebContainer*, all containerised with *Docker*. Across **100 test prompts**, **92%** produced a working website on the first try, and the time to a first prototype fell from about four hours to under five minutes. **Version 2, after the paper:** the single model became a *LangGraph* team of Developer, Reviewer and QA agents on *Gemini*, with file-based generation for applications larger than the model's context window.",
    features: [
      "**Published research (v1):** a natural-language prompt becomes a working website, previewed in real time in *StackBlitz WebContainer*",
      "**92% of 100 test prompts** produced a working website on the first try, and **over 90%** passed W3C validation",
      "**Prototype time cut from about 4 hours to under 5 minutes**, with **94% satisfaction** from beta testers",
      "**Validation before rendering:** *ESLint*, *Prettier* and sandboxed runtime checks on every generated site",
      "**Capstone upgrade (v2):** *LangGraph*-orchestrated *Developer*, *Reviewer* and *QA* agents on *Gemini*",
      "**File-based generation (v2)** for applications larger than the model's context window",
      "Paper published in the *JSS Journal of Scientific Studies*, Special Issue 1 (December 2025), pp. 9–12, from **NCAIT-2025**"
    ],
    technologies: ["Python", "FastAPI", "React", "TypeScript", "Claude", "StackBlitz WebContainer", "Docker", "LangGraph", "Gemini", "MongoDB"],
    metrics: {
      firstTrySuccess: "92% of 100 prompts (v1)",
      prototypeTime: "~4 h to under 5 min (v1)",
      publication: "JSS Journal of Scientific Studies, 2025",
      upgrade: "LangGraph multi-agent (v2)"
    },
    status: "Completed",
    github: null,
    demo: null,
    embed: null,
    /** The published paper (v1). Proof for the claims above; cited in the JSON-LD too. */
    paper: {
      url: "https://jssateb-journal.vercel.app/journal/vol2-issue-2/paper_17.pdf",
      title: "SPEAR (Split Panel Engine for Automated Rendering): An Innovative AI-Powered Web Development Assistant",
      venue: "JSS Journal of Scientific Studies, Special Issue 1 (NCAIT-2025)",
      published: "2025-12",
      pages: "9-12",
      authors: ["Pranava C Hiremath", "Varsha R", "Sreenivas Gurram", "Rohith B"]
    },
    accent: "#3F4A2A",
    gradient: "linear-gradient(135deg, #DDE5C5 0%, #C9D5A8 50%, #A8B987 100%)"
  },
  {
    id: 3,
    slug: "skooc",
    title: "Skooc",
    subtitle: "Multi-Persona Therapeutic AI Suite",
    category: "Healthcare AI",
    tagline: "Consulting · 2025 – present",
    description: "A **three-persona therapeutic AI suite** serving Educators, Parents, and Children. It covers **300+ clinical scenarios** across **20 psychological themes**, with **crisis intervention routing** and culturally-tuned RAG for Indian contexts. Ongoing consulting engagement since 2025.",
    detailedDescription: "*LangGraph*-orchestrated three-persona chatbot architecture with **neurodivergent-aware routing** and **Severity-C** crisis classification. Adaptive *Quick Help / Deep Dive* workflows scaling **5–30 minutes per session**, backed by a **Cultural-Context RAG** pipeline of evidence-based strategies tuned for Indian parenting and education contexts.",
    features: [
      "**Three persona-specialized agents** (*Educator, Parent, Child*) with cross-persona context aggregation",
      "**300+ clinical scenarios** spanning **20 psychological themes**",
      "**Severity-C binary classification** routes high-risk inputs (self-harm/abuse) to human counsellors, achieving **100% safety compliance**",
      "**Neurodivergent-aware routing** with ~50 unique interaction states (Confidence Check, Pattern Recognition)",
      "**Cultural-Context RAG**: 50+ evidence-based strategies tuned for Indian parenting and education"
    ],
    technologies: ["Python", "LangGraph", "RAG", "Vector Search", "AWS"],
    metrics: {
      scenarios: "300+ clinical scenarios",
      themes: "20 psychological themes",
      personas: "3 (Educator / Parent / Child)",
      safety: "100% Severity-C compliance"
    },
    status: "Completed",
    github: null,
    demo: null,
    embed: null,
    accent: "#7C2D5F",
    gradient: "linear-gradient(135deg, #F0D4DD 0%, #E0B8C8 50%, #C595A8 100%)"
  }
];

export const projectCategories = [
  "All",
  "Voice-Native AI",
  "Code Generation",
  "Healthcare AI"
];

export const featuredProjects = [1, 2, 3];

export const getProjectBySlug = (slug) =>
  projectsData.find((project) => project.slug === slug);
