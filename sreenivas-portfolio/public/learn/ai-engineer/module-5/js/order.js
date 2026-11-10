/* Running order for Module 5 · Cut 3. Only listed scenes play; add ids here as scenes are built. */
window.ORDER = [
  'T.title',
  'O.wall',                                  // the internet on prompt engineering → four questions → live vote (a bet on the role myth)
  // Question 1 · why does the same AI answer differently?
  'C.email',                                 // the case: Priya's email arrives, and what a good reply must do
  'C.plain',                                 // attempt 1: just ask, then the same ask 20 times (real Gemini runs)
  'C.models',                                // is it just Gemini? the same test on GPT-5.6 Luna and GPT-6 Luna
  'C.brief',                                 // attempt 2: the better prompt (instructions only), 20 runs on all three models
  'D.def',                                   // question 1 answered, then the definition of prompt engineering (5.1)
  // Question 2 · how do you get the right answer almost every time?
  'I.open',                                  // 5.2 input format: the question, the definition, three ideas
  'I.layout',                                // how layout evolved (sourced), then: does it still matter? (real: no)
  'I.fence',                                 // delimiters alone vs a planted note (real), obeyed vs believed, the rule back
  'I.format',                                // the Reply Assistant needs a parseable shape: 0/60 vs 60/60 (real)
  'S.open',                                  // 5.3 system prompting: the definition
  'S.app',                                   // 5.3: the rules move into the Reply Assistant's system prompt (real: 60/60)
  'S.stream',                                // for builders: system + user become one token sequence (sourced)
  'S.weight',                                // the slot gave a label; training gave weight (sourced timeline, balance scale)
  'R.open',                                  // 5.4 role & behaviour: the definition, split into a role and behaviour
  'R.bet',                                   // 5.4: the opening bet settled with real runs (expert line: no better)
  'R.study',                                 // it's not just us: Zheng et al. 2023, Wharton 2025 (sourced)
  'R.tone',                                  // what a role is for: a role + how-to-write line changes the voice, not the safety (real)
  'R.def',                                   // the bet answered, the prompt strip
  'K.open',                                  // 5.5 constraining prompts: the definition
  'K.lens',                                  // one line, one fence: each rule linked to what it removes, then to what it produced (real replies)
  'K.why',                                   // say what to do, and why (sourced); the strip
  'X.open',                                  // 5.6 contextual prompting: the definition
  'X.facts',                                 // the account notes go in: 60/60 right answers (real)
  'A2',                                      // question 2 answered: the whole prompt; why "almost"; the strip
  // Question 3 · when should you show it examples, or ask it to think first?
  'Q3.open',                                 // the question, then 5.7 zero-shot
  'Z.origin',                                // how the names were born: TL;DR (2019), zero/one/few-shot (2020), the API (2020); sourced
  'Z.why',                                   // why examples: format; 2020 examples → 2022 instructions → 2023/24 schemas → today
  'Z.shots',                                 // our CRM line zero / one / few-shot (real, one-shot an illustration)
  'Z.when',                                  // which one, when: a sourced decision flow; the strip
  'T.open',                                  // 5.9 chain-of-thought: the dive into the cell, the definition
  'T.history',                               // CoT began as few-shot (Wei 2022), then "think step by step" (Kojima 2022), then why
  'T.plan',                                  // one planning question three ways on GPT-6 Luna (real): pills and gauges
  'T.now',                                   // the hidden thinking in our own runs (real); what the docs say now
  'A3',                                      // question 3 answered; the strip
  'A.open',                                  // 5.10 ReAct: the definition
  'A.loop',                                  // thought, action, observation on our case (illustration); what became of it
  'A.tools',                                 // more tools than it shows you (sourced + a real check); the strip
  // Question 4 · is prompt engineering still worth learning?
  'W.open',                                  // the question
  'W.changed',                               // what the models took over, chapter by chapter, and what is still yours
  'W.meta',                                  // ask the model to improve your prompt (real: 60/60 safe, no facts)
  'W.answer',                                // question 4 answered, and the method
  'E.wall',                                  // the four questions answered; the full strip; the closing line
];
