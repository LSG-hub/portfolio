export const projectsData = [
  {
    id: 1,
    title: "S.P.E.A.R",
    subtitle: "Split Panel Engine for Automated Rendering",
    category: "Full-Stack AI Platform",
    description: "No-code full-stack development platform enabling users to build applications 3x faster than traditional coding. Led a team of 3 to design a platform leveraging React.js for UI/UX and Node.js for backend automation.",
    detailedDescription: "Revolutionary no-code platform that democratizes application development through intelligent automation and AI-powered assistance.",
    features: [
      "AI-Powered code generation using OpenAI GPT-3.5 and LangChain",
      "RAG architecture for contextual data retrieval with 90% accuracy",
      "Drag-and-drop workflows with role-based access control",
      "Autonomous task execution based on user instructions",
      "Real-time collaboration for enterprise use cases"
    ],
    technologies: ["React.js", "Node.js", "OpenAI GPT-3.5", "LangChain", "RAG", "JavaScript", "REST APIs"],
    metrics: {
      developmentSpeed: "3x faster",
      testingAccuracy: "90%",
      teamSize: "3 members",
      useCases: "5+ enterprise scenarios"
    },
    status: "Completed",
    github: "https://github.com/yourusername/spear-platform",
    demo: "https://spear-demo.vercel.app",
    image: "/images/spear-project.jpg"
  },
  {
    id: 2,
    title: "Zenith AI",
    subtitle: "AI-Driven SaaS Platform",
    category: "Modular AI SaaS",
    description: "Spearheaded a team of 3 to develop a modular SaaS platform integrating MedBot (healthcare assistant), QuizCrafter (AI-generated quizzes), and a stock prediction model.",
    detailedDescription: "Comprehensive AI-driven platform showcasing the versatility of AI applications across healthcare, education, and finance sectors.",
    features: [
      "MedBot for healthcare diagnostics and patient support",
      "QuizCrafter for automated educational content generation",
      "Stock prediction model with real-time market analysis",
      "Automated data pipelines using UiPath and LangChain",
      "Real-time NLP analysis and processing"
    ],
    technologies: ["UiPath", "LangChain", "NLP", "Python", "Machine Learning", "Stock APIs", "Healthcare APIs"],
    metrics: {
      manualEffortReduction: "70%",
      moduleCount: "3 integrated modules",
      teamSize: "3 members",
      industries: "Healthcare, Education, Finance"
    },
    status: "Completed",
    github: "https://github.com/yourusername/zenith-ai",
    demo: "https://zenith-ai-demo.vercel.app",
    image: "/images/zenith-project.jpg"
  },
  {
    id: 3,
    title: "MedBot",
    subtitle: "Conversational AI for Healthcare Diagnostics",
    category: "Healthcare AI",
    description: "Built a GPT-3-powered assistant to analyze medical reports and match patient histories, reducing diagnosis time by 30% in prototype scenarios.",
    detailedDescription: "HIPAA-compliant healthcare assistant that leverages advanced NLP to provide intelligent medical support and diagnostics assistance.",
    features: [
      "Medical report analysis and interpretation",
      "Patient history matching and correlation",
      "HIPAA-compliant data processing workflows",
      "Secure API pipelines for data privacy",
      "NLP-driven search and recommendation system"
    ],
    technologies: ["GPT-3", "NLP", "Healthcare APIs", "HIPAA Compliance", "Python", "Secure Architecture"],
    metrics: {
      diagnosisTimeReduction: "30%",
      complianceStandard: "HIPAA",
      accuracy: "High precision medical analysis",
      security: "End-to-end encryption"
    },
    status: "Prototype",
    github: "https://github.com/yourusername/medbot",
    demo: "https://medbot-demo.vercel.app",
    image: "/images/medbot-project.jpg"
  },
  {
    id: 4,
    title: "Mutual Fund Advisor",
    subtitle: "UiPath-Powered RPA System",
    category: "Financial RPA",
    description: "Engineered an RPA solution to extract and analyze real-time mutual fund data from 15+ financial websites, automating 8 hours/week of manual work.",
    detailedDescription: "Intelligent financial advisor system that automates data collection, analysis, and investment recommendations through advanced RPA techniques.",
    features: [
      "Real-time data extraction from 15+ financial websites",
      "Automated comparative analysis dashboards",
      "Investment recommendation engine",
      "Portfolio testing and validation",
      "Automated report generation"
    ],
    technologies: ["UiPath", "RPA", "Financial APIs", "Data Analysis", "Dashboard Creation", "Python"],
    metrics: {
      weeklyTimeSaved: "8 hours",
      websitesMonitored: "15+",
      automationLevel: "Full automation",
      accuracy: "High precision analysis"
    },
    status: "Completed",
    github: "https://github.com/yourusername/mutual-fund-advisor",
    demo: "https://mf-advisor-demo.vercel.app",
    image: "/images/mf-advisor-project.jpg"
  },
  {
    id: 5,
    title: "Jarvis AI",
    subtitle: "Voice-Controlled Virtual Assistant",
    category: "AI Assistant",
    description: "Developed a Python-based assistant with 95% voice recognition accuracy, automating tasks like web searches and app control.",
    detailedDescription: "Advanced voice-controlled virtual assistant that combines speech recognition, NLP, and automation to create a seamless user experience.",
    features: [
      "95% voice recognition accuracy",
      "Web search automation",
      "Application control and management",
      "Secure environment variable management",
      "NLP optimization for natural conversations"
    ],
    technologies: ["Python", "Speech Recognition", "NLP", "Automation", "Voice Processing", "API Integration"],
    metrics: {
      recognitionAccuracy: "95%",
      taskCompletionImprovement: "50%",
      responseTime: "Real-time processing",
      security: "Secure credential management"
    },
    status: "Completed",
    github: "https://github.com/yourusername/jarvis-ai",
    demo: "https://jarvis-demo.vercel.app",
    image: "/images/jarvis-project.jpg"
  }
];

export const projectCategories = [
  "All",
  "Full-Stack AI Platform",
  "Healthcare AI",
  "Financial RPA",
  "AI Assistant",
  "Modular AI SaaS"
];

export const featuredProjects = [1, 2, 3]; // IDs of featured projects