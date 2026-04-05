import { CategoryType } from "./types";

const CATEGORY_KEYWORDS: Record<Exclude<CategoryType, "general">, RegExp> = {
  ai: /\b(ai|artificial intelligence|machine learning|llm|gpt|neural|deep learning|chatgpt|openai|anthropic|model training|transformer|generative|diffusion|copilot|gemini|claude|midjourney|stable diffusion)\b/i,
  dev: /\b(programming|developer|javascript|typescript|react|api|open source|github|framework|compiler|runtime|devtools|code|rust|python|golang|node\.js|npm|docker|kubernetes|git|vscode|ide|web dev|frontend|backend|full.?stack)\b/i,
  security: /\b(security|hack|breach|vulnerability|malware|encryption|privacy|cve|ransomware|zero.?day|phishing|cybersecurity|exploit|ddos|firewall|infosec|data leak|patch)\b/i,
  hardware: /\b(chip|processor|gpu|cpu|hardware|semiconductor|amd|intel|nvidia|apple silicon|quantum computing|robotics|motherboard|ram|ssd|display|monitor|laptop|phone|tablet|wearable|sensor)\b/i,
  startups: /\b(startup|funding|series [abc]|acquisition|ipo|venture capital|valuation|y combinator|unicorn|seed round|angel investor|pivot|bootstrapped)\b/i,
  science: /\b(space|nasa|climate|biotech|physics|research|study|discovery|crispr|genome|telescope|mars|satellite|biology|chemistry|neuroscience|astronomy|esa|spacex)\b/i,
};

export function categorize(title: string, excerpt: string): CategoryType {
  const text = `${title} ${excerpt}`.toLowerCase();

  let bestCategory: CategoryType = "general";
  let bestScore = 0;

  for (const [category, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = text.match(new RegExp(regex.source, "gi"));
    const score = matches ? matches.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as CategoryType;
    }
  }

  return bestCategory;
}
