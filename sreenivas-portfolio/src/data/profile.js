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

  bio: "I design and build AI applications end to end, mostly in **Python**: the architecture behind **agentic workflows**, **MCP servers** and **AI gateways**, the **React** frontends on top, and deployments on **GCP**, **AWS** and **Azure**. Most of my work is giving AI real access to real systems, like an agent that calls a company's live APIs, or an assistant that answers bank developers using only the documentation their company has paid for. So I spend as much care on the guardrails as on the model: approvals, access boundaries, and checks that catch a wrong answer before anyone sees it.",

  /**
   * Label / value rows under the bio. \u00a0 (no-break space) keeps each
   * "·" segment together, so "INR 1 Lakh prize" never splits across lines.
   */
  facts: [
    { label: "Recognition", value: "2nd Runner-Up at Google Cloud Agentic AI Day 2025, a Guinness World Record-certified hackathon · 1,941\u00a0developers · 700+\u00a0teams · INR\u00a01\u00a0Lakh\u00a0prize" },
    { label: "Research", value: "Co-author, NCAIT-2025 · AI-powered web development assistant" },
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
