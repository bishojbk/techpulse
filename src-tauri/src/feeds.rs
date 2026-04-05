use chrono::{DateTime, Utc};
use regex::Regex;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::State;

// ─── Article type (matches frontend) ───────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Article {
    pub id: String,
    pub title: String,
    pub excerpt: String,
    pub url: String,
    pub source: String,
    pub source_icon: String,
    pub category: String,
    pub published_at: String,
    pub image_url: Option<String>,
    pub comment_count: Option<u32>,
    pub points: Option<u32>,
    pub hn_url: Option<String>,
}

// ─── Feed cache ────────────────────────────────────────────────────────────

pub struct FeedCache {
    articles: Vec<Article>,
    last_fetched: Option<Instant>,
}

impl FeedCache {
    pub fn new() -> Self {
        Self {
            articles: Vec::new(),
            last_fetched: None,
        }
    }

    fn is_fresh(&self) -> bool {
        self.last_fetched
            .map(|t| t.elapsed() < Duration::from_secs(600))
            .unwrap_or(false)
    }
}

// ─── Source definitions ────────────────────────────────────────────────────

struct RssSource {
    name: &'static str,
    url: &'static str,
    domain: &'static str,
    is_atom: bool,
}

const RSS_SOURCES: &[RssSource] = &[
    RssSource { name: "TechCrunch", url: "https://techcrunch.com/feed/", domain: "techcrunch.com", is_atom: false },
    RssSource { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", domain: "theverge.com", is_atom: true },
    RssSource { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", domain: "arstechnica.com", is_atom: false },
    RssSource { name: "Wired", url: "https://www.wired.com/feed/rss", domain: "wired.com", is_atom: false },
    RssSource { name: "MIT Tech Review", url: "https://www.technologyreview.com/feed/", domain: "technologyreview.com", is_atom: false },
    RssSource { name: "VentureBeat", url: "https://venturebeat.com/feed/", domain: "venturebeat.com", is_atom: false },
    RssSource { name: "Engadget", url: "https://www.engadget.com/rss.xml", domain: "engadget.com", is_atom: false },
];

const REDDIT_SOURCES: &[RssSource] = &[
    RssSource { name: "r/technology", url: "https://www.reddit.com/r/technology/.rss", domain: "reddit.com", is_atom: true },
    RssSource { name: "r/programming", url: "https://www.reddit.com/r/programming/.rss", domain: "reddit.com", is_atom: true },
    RssSource { name: "r/artificial", url: "https://www.reddit.com/r/artificial/.rss", domain: "reddit.com", is_atom: true },
];

// ─── HTML stripping ───────────────────────────────────────────────────────

fn strip_html(html: &str) -> String {
    let tag_re = Regex::new(r"<[^>]*>").unwrap();
    let result = tag_re.replace_all(html, "");
    let result = result
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#39;", "'")
        .replace("&apos;", "'");
    let ws_re = Regex::new(r"\s+").unwrap();
    ws_re.replace_all(&result, " ").trim().to_string()
}

fn truncate(text: &str, max_len: usize) -> String {
    if text.len() <= max_len {
        return text.to_string();
    }
    let truncated = &text[..max_len];
    if let Some(pos) = truncated.rfind(' ') {
        format!("{}…", &truncated[..pos])
    } else {
        format!("{}…", truncated)
    }
}

fn simple_hash(s: &str) -> String {
    let mut hash: u64 = 0;
    for byte in s.bytes() {
        hash = hash.wrapping_mul(31).wrapping_add(byte as u64);
    }
    format!("{:x}", hash)
}

fn source_icon(domain: &str) -> String {
    format!("https://www.google.com/s2/favicons?domain={}&sz=32", domain)
}

fn normalize_url(url: &str) -> String {
    if let Ok(mut u) = reqwest::Url::parse(url) {
        u.set_query(None);
        u.set_fragment(None);
        let path = u.path().trim_end_matches('/').to_string();
        u.set_path(&path);
        u.to_string()
    } else {
        url.to_string()
    }
}

// ─── Image extraction ──────────────────────────────────────────────────────

fn extract_image_from_html(html: &str) -> Option<String> {
    let re = Regex::new(r#"<img[^>]+src=["']([^"']+)["']"#).ok()?;
    re.captures(html).and_then(|c| {
        let url = c.get(1)?.as_str().to_string();
        if url.contains("tracking") || url.contains("pixel") || url.len() < 20 {
            None
        } else {
            Some(url)
        }
    })
}

// ─── Categorization ────────────────────────────────────────────────────────

fn categorize(title: &str, excerpt: &str) -> String {
    let text = format!("{} {}", title, excerpt).to_lowercase();

    let categories: &[(&str, &[&str])] = &[
        ("ai", &[
            "ai", "artificial intelligence", "machine learning", "llm", "gpt",
            "neural", "deep learning", "chatgpt", "openai", "anthropic",
            "model training", "transformer", "generative", "diffusion",
            "copilot", "gemini", "claude", "midjourney", "stable diffusion",
        ]),
        ("dev", &[
            "programming", "developer", "javascript", "typescript", "react",
            "api", "open source", "github", "framework", "compiler", "runtime",
            "devtools", "code", "rust", "python", "golang", "node.js", "npm",
            "docker", "kubernetes", "git", "vscode", "ide", "web dev",
            "frontend", "backend", "full stack",
        ]),
        ("security", &[
            "security", "hack", "breach", "vulnerability", "malware",
            "encryption", "privacy", "cve", "ransomware", "zero-day",
            "phishing", "cybersecurity", "exploit", "ddos", "firewall",
            "infosec", "data leak",
        ]),
        ("hardware", &[
            "chip", "processor", "gpu", "cpu", "hardware", "semiconductor",
            "amd", "intel", "nvidia", "apple silicon", "quantum computing",
            "robotics", "motherboard", "ram", "ssd", "display", "laptop",
            "phone", "tablet", "wearable",
        ]),
        ("startups", &[
            "startup", "funding", "series a", "series b", "series c",
            "acquisition", "ipo", "venture capital", "valuation",
            "y combinator", "unicorn", "seed round", "angel investor",
        ]),
        ("science", &[
            "space", "nasa", "climate", "biotech", "physics", "research",
            "study", "discovery", "crispr", "genome", "telescope", "mars",
            "satellite", "biology", "chemistry", "neuroscience", "astronomy",
            "spacex",
        ]),
    ];

    let mut best_cat = "general";
    let mut best_score = 0usize;

    for (cat, keywords) in categories {
        let score = keywords
            .iter()
            .filter(|kw| text.contains(*kw))
            .count();
        if score > best_score {
            best_score = score;
            best_cat = cat;
        }
    }

    best_cat.to_string()
}

// ─── RSS feed parsing ──────────────────────────────────────────────────────

async fn fetch_rss_feed(client: &Client, source: &RssSource) -> Vec<Article> {
    let body = match client.get(source.url).send().await {
        Ok(resp) => match resp.text().await {
            Ok(t) => t,
            Err(e) => {
                log::warn!("Failed to read body from {}: {}", source.name, e);
                return vec![];
            }
        },
        Err(e) => {
            log::warn!("Failed to fetch {}: {}", source.name, e);
            return vec![];
        }
    };

    if source.is_atom {
        parse_atom_feed(&body, source)
    } else {
        parse_rss_feed(&body, source)
    }
}

fn parse_rss_feed(body: &str, source: &RssSource) -> Vec<Article> {
    let channel = match rss::Channel::read_from(body.as_bytes()) {
        Ok(c) => c,
        Err(e) => {
            log::warn!("Failed to parse RSS from {}: {}", source.name, e);
            return vec![];
        }
    };

    channel
        .items()
        .iter()
        .take(20)
        .filter_map(|item| {
            let title = item.title()?.to_string();
            let url = item.link()?.to_string();
            let raw_desc = item.description().unwrap_or("");
            let content = item.content().unwrap_or("");
            let excerpt = truncate(&strip_html(if raw_desc.is_empty() { content } else { raw_desc }), 200);

            let image_url = item
                .enclosure()
                .and_then(|e| {
                    if e.mime_type().starts_with("image") {
                        Some(e.url().to_string())
                    } else {
                        None
                    }
                })
                .or_else(|| extract_image_from_html(content))
                .or_else(|| extract_image_from_html(raw_desc));

            let published_at = item
                .pub_date()
                .and_then(|d| DateTime::parse_from_rfc2822(d).ok())
                .map(|d| d.with_timezone(&Utc).to_rfc3339())
                .unwrap_or_else(|| Utc::now().to_rfc3339());

            let category = categorize(&title, &excerpt);

            Some(Article {
                id: simple_hash(&normalize_url(&url)),
                title,
                excerpt,
                url,
                source: source.name.to_string(),
                source_icon: source_icon(source.domain),
                category,
                published_at,
                image_url,
                comment_count: None,
                points: None,
                hn_url: None,
            })
        })
        .collect()
}

fn parse_atom_feed(body: &str, source: &RssSource) -> Vec<Article> {
    let feed = match atom_syndication::Feed::read_from(body.as_bytes()) {
        Ok(f) => f,
        Err(e) => {
            log::warn!("Failed to parse Atom from {}: {}", source.name, e);
            return vec![];
        }
    };

    feed.entries()
        .iter()
        .take(20)
        .filter_map(|entry| {
            let title = strip_html(&entry.title().to_string());
            let url = entry.links().first()?.href().to_string();
            let raw_content = entry
                .content()
                .and_then(|c| c.value.clone())
                .or_else(|| entry.summary().map(|s| s.value.clone()))
                .unwrap_or_default();
            let excerpt = truncate(&strip_html(&raw_content), 200);

            let image_url = extract_image_from_html(&raw_content);

            let published_at = entry
                .published()
                .or(Some(entry.updated()))
                .map(|d| d.to_rfc3339())
                .unwrap_or_else(|| Utc::now().to_rfc3339());

            let category = categorize(&title, &excerpt);

            Some(Article {
                id: simple_hash(&normalize_url(&url)),
                title,
                excerpt,
                url,
                source: source.name.to_string(),
                source_icon: source_icon(source.domain),
                category,
                published_at,
                image_url,
                comment_count: None,
                points: None,
                hn_url: None,
            })
        })
        .collect()
}

// ─── Hacker News ───────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct HnItem {
    id: u64,
    title: Option<String>,
    url: Option<String>,
    score: Option<u32>,
    descendants: Option<u32>,
    time: Option<i64>,
    #[serde(rename = "type")]
    item_type: Option<String>,
}

async fn fetch_hacker_news(client: &Client) -> Vec<Article> {
    let ids: Vec<u64> = match client
        .get("https://hacker-news.firebaseio.com/v0/topstories.json")
        .send()
        .await
    {
        Ok(resp) => match resp.json::<Vec<u64>>().await {
            Ok(ids) => ids,
            Err(e) => {
                log::warn!("Failed to parse HN top stories: {}", e);
                return vec![];
            }
        },
        Err(e) => {
            log::warn!("Failed to fetch HN top stories: {}", e);
            return vec![];
        }
    };

    let top_ids: Vec<u64> = ids.into_iter().take(30).collect();
    let mut articles = Vec::new();

    // Fetch in batches of 10 to avoid overwhelming
    for chunk in top_ids.chunks(10) {
        let futures: Vec<_> = chunk
            .iter()
            .map(|id| {
                let c = client.clone();
                let url = format!("https://hacker-news.firebaseio.com/v0/item/{}.json", id);
                async move { c.get(&url).send().await?.json::<HnItem>().await }
            })
            .collect();

        let results = futures::future::join_all(futures).await;

        for result in results {
            if let Ok(item) = result {
                let title: String = match &item.title {
                    Some(t) => t.clone(),
                    None => continue,
                };
                if item.item_type.as_deref() != Some("story") {
                    continue;
                }

                let hn_link = format!("https://news.ycombinator.com/item?id={}", item.id);
                let url = item.url.clone().unwrap_or_else(|| hn_link.clone());
                let points = item.score.unwrap_or(0);
                let comments = item.descendants.unwrap_or(0);
                let excerpt = format!(
                    "Discuss on Hacker News — {} points, {} comments",
                    points, comments
                );
                let published_at = item
                    .time
                    .and_then(|t: i64| DateTime::<Utc>::from_timestamp(t, 0))
                    .map(|d: DateTime<Utc>| d.to_rfc3339())
                    .unwrap_or_else(|| Utc::now().to_rfc3339());

                let category = categorize(&title, "");

                articles.push(Article {
                    id: simple_hash(&format!("hn-{}", item.id)),
                    title,
                    excerpt,
                    url,
                    source: "Hacker News".to_string(),
                    source_icon: source_icon("news.ycombinator.com"),
                    category,
                    published_at,
                    image_url: None,
                    comment_count: Some(comments),
                    points: Some(points),
                    hn_url: Some(hn_link),
                });
            }
        }
    }

    articles
}

// ─── Main fetch command ────────────────────────────────────────────────────

#[tauri::command]
pub async fn fetch_all_feeds(
    cache: State<'_, Mutex<FeedCache>>,
) -> Result<Vec<Article>, String> {
    // Check cache first
    {
        let c = cache.lock().map_err(|e| e.to_string())?;
        if c.is_fresh() && !c.articles.is_empty() {
            log::info!("Returning {} cached articles", c.articles.len());
            return Ok(c.articles.clone());
        }
    }

    log::info!("Fetching fresh feeds...");

    let client = Client::builder()
        .timeout(Duration::from_secs(15))
        .user_agent("TechPulse/1.0 (Desktop News Reader)")
        .build()
        .map_err(|e| e.to_string())?;

    // Fetch all sources in parallel
    let mut all_futures: Vec<tokio::task::JoinHandle<Vec<Article>>> = Vec::new();

    for source in RSS_SOURCES.iter().chain(REDDIT_SOURCES.iter()) {
        let c = client.clone();
        let name = source.name;
        let url = source.url;
        let domain = source.domain;
        let is_atom = source.is_atom;
        all_futures.push(tokio::spawn(async move {
            let s = RssSource { name, url, domain, is_atom };
            fetch_rss_feed(&c, &s).await
        }));
    }

    let c = client.clone();
    all_futures.push(tokio::spawn(async move {
        fetch_hacker_news(&c).await
    }));

    let results = futures::future::join_all(all_futures).await;

    let mut all_articles: Vec<Article> = Vec::new();
    for result in results {
        match result {
            Ok(articles) => all_articles.extend(articles),
            Err(e) => log::warn!("Feed task failed: {}", e),
        }
    }

    // Deduplicate by normalized URL
    let mut seen = HashSet::new();
    all_articles.retain(|a| {
        let norm = normalize_url(&a.url);
        seen.insert(norm)
    });

    // Sort by published_at descending
    all_articles.sort_by(|a, b| b.published_at.cmp(&a.published_at));

    // Limit to 100
    all_articles.truncate(100);

    log::info!("Fetched {} unique articles", all_articles.len());

    // Update cache
    {
        let mut c = cache.lock().map_err(|e| e.to_string())?;
        c.articles = all_articles.clone();
        c.last_fetched = Some(Instant::now());
    }

    Ok(all_articles)
}
