/**
 * Who he is: the copy for the hero and the contact section.
 *
 * Lives here rather than in the components for the same reason the rest of
 * src/data does: the build-time prerender (scripts/prerender.mjs) reads these
 * files to write crawlable HTML, so anything that only exists inside JSX is
 * invisible to search engines and AI crawlers. Plain strings with the
 * **bold** / *italic* markup that utils/richText understands, nothing else.
 */

export const profile = {
  name: "Sreenivas Gurram",
  role: "Full-Stack AI Engineer",
  focus: "AI system architecture, agentic workflows, MCP & AI gateways",
  location: "Bangalore, India",
  email: "me@sreenivasgurram.com",
  url: "https://sreenivasgurram.com",
  photo: "/images/sreenivas-portrait.jpg",
  photoAlt: "Sreenivas Gurram at Google Cloud Agentic AI Day 2025",

  /** The one-paragraph description search results and link previews show. */
  summary: "Sreenivas Gurram, Full-Stack AI Engineer in Bangalore. Designs and builds AI applications end to end: system architecture, agentic workflows, MCP servers and AI gateways, plus the products around them.",

  bio: "AI/ML Engineer specializing in **Agentic Workflows**, **LangGraph orchestration**, and **LLM optimization**, with full-stack capability across **React**, **FastAPI**, **Flutter**, and cloud-native infrastructure. Currently **Associate Software Engineer at DigitalAPI.ai**, where I architect enterprise **MCP Gateways** handling **10K+ daily requests**. I also placed **2nd Runner-Up** at the **Guinness World Record-certified** Google Cloud Agentic AI Day 2025. I focus on building cost-efficient autonomous systems that go beyond standard API integrations to solve complex, unstructured problems at scale.",

  /** Label / value rows under the bio. */
  facts: [
    { label: "Recognition", value: "1,941 developers · 700+ teams · INR 1 Lakh prize" },
    { label: "Research", value: "Co-author, NCAIT-2025 · agentic IDE architecture" },
    { label: "Location", value: "Bangalore, India · open to collaboration and consulting" }
  ],

  contactIntro: "Open to *collaboration*, consulting on AI systems, open-source work and research. Email is the fastest way to reach me, and I respond within a day.",

  /** For the structured data search engines and AI systems read (scripts/prerender.mjs). */
  employer: { name: "DigitalAPI.ai", url: "https://www.digitalapi.ai" },
  twitter: "@SreenivasGurra3",
  knowsAbout: [
    "AI Engineering",
    "AI System Architecture",
    "Agentic AI",
    "Large Language Models",
    "Model Context Protocol",
    "Retrieval-Augmented Generation",
    "Python",
    "FastAPI",
    "React",
    "Google Cloud",
    "Microsoft Azure",
    "AWS"
  ],
  /**
   * Profiles that are the same person as this site. Search engines and AI
   * systems use these to tie the accounts together. Add YouTube here when it exists.
   */
  sameAs: [
    "https://www.linkedin.com/in/sreenivas-gurram-363528289/",
    "https://github.com/LSG-hub",
    "https://x.com/SreenivasGurra3"
  ],

  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/sreenivas-gurram-363528289/" },
    { label: "GitHub", url: "https://github.com/LSG-hub" },
    { label: "Twitter", url: "https://x.com/SreenivasGurra3" },
    { label: "Blog", url: "https://iotodyssey.blogspot.com/2024/11/the-iot-odyssey-from-smart-homes-to.html" }
  ]
};

export default profile;
