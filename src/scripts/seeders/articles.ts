import type { Payload } from "payload";
import type { Article, Category, Tag, Author, Media } from "../../payload-types";

interface SeedDependencies {
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  articleImages: Media[];
}

// Helper to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to get random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate rich text content structure for Lexical editor
function generateRichTextContent(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            version: 1,
          },
        ],
      })),
    },
  };
}

const articlesData = [
  {
    title: "Global Tech Giants Report Record Quarterly Earnings Despite Economic Headwinds",
    slug: "global-tech-giants-record-earnings",
    excerpt:
      "Major technology companies have defied economic uncertainty to post impressive quarterly results, driven by cloud computing and AI investments.",
    categorySlug: "technology",
    tagSlugs: ["ai", "stock-market", "innovation"],
    status: "published",
    featured: true,
    breaking: false,
    paragraphs: [
      "In a surprising turn of events, the world's largest technology companies have reported record-breaking quarterly earnings, defying widespread concerns about a potential economic downturn.",
      "Amazon, Microsoft, and Google all exceeded analyst expectations, with cloud computing services emerging as the primary growth driver. Amazon Web Services (AWS) reported a 20% increase in revenue, while Microsoft Azure saw similar growth patterns.",
      "The artificial intelligence boom has played a significant role in these results. Companies investing heavily in AI infrastructure are seeing returns as businesses across industries rush to adopt AI-powered solutions.",
      '"We\'re witnessing a fundamental shift in how businesses operate," said industry analyst Maria Santos. "AI is no longer a nice-to-have; it\'s becoming essential for competitive advantage."',
      "However, experts caution that maintaining this growth trajectory may prove challenging as macroeconomic conditions evolve and competition in the AI space intensifies.",
    ],
  },
  {
    title: "Historic Climate Agreement Reached at Global Summit",
    slug: "historic-climate-agreement-global-summit",
    excerpt:
      "World leaders have agreed to ambitious new targets for carbon reduction in a landmark deal that could reshape global environmental policy.",
    categorySlug: "world",
    tagSlugs: ["climate-change", "environment", "breaking-news"],
    status: "published",
    featured: true,
    breaking: true,
    paragraphs: [
      'In what environmental advocates are calling a "turning point for humanity," 195 nations have signed a comprehensive climate agreement that sets legally binding targets for carbon reduction.',
      "The agreement, reached after two weeks of intense negotiations, commits signatory nations to reduce carbon emissions by 50% by 2035 and achieve carbon neutrality by 2050.",
      "Key provisions include a $500 billion annual fund to help developing nations transition to clean energy, strict penalties for non-compliance, and mandatory annual progress reports.",
      'Environmental groups have largely welcomed the agreement, though some argue it doesn\'t go far enough. "This is a significant step, but we need faster action," said Greenpeace International director Jennifer Morgan.',
      "Implementation will begin immediately, with countries required to submit detailed action plans within six months.",
    ],
  },
  {
    title: "Local Team Clinches Championship in Dramatic Final",
    slug: "local-team-championship-dramatic-final",
    excerpt:
      "In a nail-biting finish that had fans on the edge of their seats, the home team secured their first championship title in 25 years.",
    categorySlug: "sports",
    tagSlugs: ["football", "exclusive"],
    status: "published",
    featured: false,
    breaking: false,
    paragraphs: [
      "The city erupted in celebration last night as the local football team clinched their first championship title in a quarter century, defeating their long-time rivals 3-2 in a dramatic final.",
      'The match appeared to be heading for a draw until the 89th minute when star striker Marcus Williams scored what fans are already calling "the goal of the decade."',
      '"I\'ve dreamed of this moment since I was a kid watching this team with my father," an emotional Williams said during the post-match interview.',
      "Streets across the city filled with jubilant fans waving flags and honking horns well into the early morning hours. The mayor has declared a public holiday to mark the historic victory.",
      "The team's journey from near-relegation three seasons ago to championship glory is already being called one of the greatest turnaround stories in sports history.",
    ],
  },
  {
    title: "Revolutionary Cancer Treatment Shows Promising Results in Clinical Trials",
    slug: "revolutionary-cancer-treatment-clinical-trials",
    excerpt:
      "A new immunotherapy approach has shown remarkable success rates in treating previously untreatable forms of cancer.",
    categorySlug: "health",
    tagSlugs: ["research", "innovation", "exclusive"],
    status: "published",
    featured: true,
    breaking: false,
    paragraphs: [
      "Researchers at the National Cancer Institute have announced groundbreaking results from clinical trials of a new immunotherapy treatment that could revolutionize cancer care.",
      "The treatment, which uses modified T-cells to target cancer cells with unprecedented precision, showed an 85% response rate in patients with forms of cancer that had not responded to any other treatment.",
      '"These results exceed our most optimistic projections," said Dr. Sarah Chen, lead researcher on the study. "We\'re seeing complete remission in patients who had been told there were no options left."',
      "The treatment works by reprogramming the patient's own immune cells to recognize and destroy cancer cells while leaving healthy tissue unharmed.",
      "While the treatment is still in early stages and requires further study, the FDA has granted it breakthrough therapy designation, which will expedite the approval process.",
    ],
  },
  {
    title: "Stock Markets Rally as Central Bank Signals Rate Pause",
    slug: "stock-markets-rally-rate-pause",
    excerpt:
      "Global markets surged after the Federal Reserve indicated it may halt interest rate increases, boosting investor confidence.",
    categorySlug: "business",
    tagSlugs: ["stock-market", "economy", "breaking-news"],
    status: "published",
    featured: false,
    breaking: true,
    paragraphs: [
      "Stock markets around the world experienced their strongest rally in months following signals from the Federal Reserve that interest rate increases may be coming to an end.",
      "The S&P 500 rose 2.5%, while the Nasdaq Composite gained 3.2%. European and Asian markets followed suit, with most major indices posting significant gains.",
      "Federal Reserve Chair Jerome Powell's comments, while carefully worded, suggested that the central bank is satisfied with progress on inflation and sees less need for further rate hikes.",
      '"The market has been waiting for this signal for months," said Goldman Sachs analyst David Kostin. "This could mark the beginning of a new bull market phase."',
      "However, some economists warn that inflation remains above target and that the Fed could resume rate increases if price pressures resurface.",
    ],
  },
  {
    title: "Blockbuster Film Breaks Opening Weekend Records Worldwide",
    slug: "blockbuster-film-opening-weekend-records",
    excerpt:
      "The highly anticipated superhero sequel has shattered box office records, earning over $500 million in its first three days.",
    categorySlug: "entertainment",
    tagSlugs: ["movies", "exclusive"],
    status: "published",
    featured: false,
    breaking: false,
    paragraphs: [
      "The latest installment in the popular superhero franchise has broken every opening weekend record, earning a staggering $523 million globally in just three days.",
      "The film, which has received positive reviews from critics and an A+ CinemaScore from audiences, represents a triumphant return to theaters for the beloved franchise.",
      '"This is a testament to the power of theatrical experiences," said studio executive Jennifer Lee. "People want to come together and share these moments."',
      "The success comes despite concerns about the viability of big-budget films in an era of streaming dominance. Analysts say the result proves that audiences will still show up for the right content.",
      "The previous record holder, which earned $357 million on opening weekend, has been dethroned after holding the title for nearly five years.",
    ],
  },
  {
    title: "Scientists Discover New Species in Deep Ocean Exploration",
    slug: "new-species-deep-ocean-discovery",
    excerpt:
      "An international research team has identified dozens of previously unknown marine species in the deepest parts of the Pacific Ocean.",
    categorySlug: "science",
    tagSlugs: ["research", "environment", "innovation"],
    status: "published",
    featured: false,
    breaking: false,
    paragraphs: [
      "Scientists aboard the research vessel Nautilus have made a remarkable discovery, identifying 47 species previously unknown to science during a three-month expedition to the Pacific Ocean's deepest trenches.",
      "Among the discoveries are several bioluminescent creatures, a new species of octopus that lives at unprecedented depths, and organisms that challenge our understanding of life's limits.",
      '"Every dive revealed something we\'d never seen before," said expedition leader Dr. Robert Ballard. "We\'re realizing that we know more about the surface of Mars than we do about our own ocean floors."',
      "The findings have significant implications for understanding how life adapts to extreme environments and could inform the search for life on other planets.",
      "The team will spend the next several years analyzing samples and documenting their findings, with initial papers expected to be published within the year.",
    ],
  },
  {
    title: "Government Unveils Major Infrastructure Investment Plan",
    slug: "government-infrastructure-investment-plan",
    excerpt:
      "A trillion-dollar infrastructure package promises to modernize roads, bridges, and public transit systems across the nation.",
    categorySlug: "politics",
    tagSlugs: ["economy", "breaking-news"],
    status: "published",
    featured: true,
    breaking: false,
    paragraphs: [
      "The government has unveiled the most ambitious infrastructure investment plan in decades, committing $1.2 trillion over the next ten years to modernize the nation's aging transportation and utility systems.",
      "Key provisions include $300 billion for road and bridge repairs, $200 billion for public transit expansion, $150 billion for clean energy infrastructure, and $100 billion for broadband internet access in rural areas.",
      '"This investment will create millions of good-paying jobs while building an infrastructure worthy of the 21st century," said the Transportation Secretary during today\'s announcement.',
      "The plan has received bipartisan support, though debates continue over funding mechanisms and project priorities. Environmental groups have praised the clean energy provisions while calling for even greater investment.",
      "Construction on priority projects is expected to begin within six months, with officials promising transparent progress reports and community input opportunities.",
    ],
  },
  {
    title: "The Future of Remote Work: What Studies Reveal About Productivity",
    slug: "future-remote-work-productivity-studies",
    excerpt:
      "New research challenges assumptions about remote work, revealing complex patterns in productivity and employee satisfaction.",
    categorySlug: "business",
    tagSlugs: ["research", "innovation"],
    status: "published",
    featured: false,
    breaking: false,
    paragraphs: [
      "A comprehensive study by Stanford University has provided the most detailed look yet at how remote work affects productivity, employee well-being, and company culture.",
      "The research, which tracked 10,000 workers over two years, found that hybrid arrangements—with 2-3 days in the office—yielded the highest productivity scores and employee satisfaction levels.",
      '"The narrative that remote work automatically reduces productivity is simply not supported by the data," said Professor Nicholas Bloom, the study\'s lead author.',
      "However, the study also highlighted challenges. Fully remote workers reported feeling less connected to their colleagues and were 50% less likely to be promoted than their in-office counterparts.",
      "Experts recommend that companies carefully design their remote work policies, focusing on outcomes rather than hours logged and investing in technology and practices that foster connection.",
    ],
  },
  {
    title: "Travel Industry Sees Strongest Recovery Since Pandemic",
    slug: "travel-industry-strongest-recovery",
    excerpt:
      "Airlines and hotels report booking levels exceeding pre-pandemic numbers as travelers embrace a return to exploration.",
    categorySlug: "lifestyle",
    tagSlugs: ["travel", "economy"],
    status: "published",
    featured: false,
    breaking: false,
    paragraphs: [
      "The global travel industry is experiencing its strongest performance since the pandemic began, with major airlines and hotel chains reporting booking levels that surpass 2019 numbers.",
      "International travel has led the recovery, with destinations in Europe, Asia, and the Caribbean seeing particularly strong demand. Business travel, once thought permanently reduced, is also showing signs of robust recovery.",
      '"People are making up for lost time," said industry analyst Catherine Davidson. "We\'re seeing longer trips, more experiential travel, and a willingness to spend more per trip."',
      "Airlines have responded by adding routes and increasing fleet sizes, though labor shortages continue to cause operational challenges. Ticket prices remain elevated due to high fuel costs and strong demand.",
      "Industry experts predict that this recovery momentum will continue through the year, though economic uncertainty could affect travel patterns in the longer term.",
    ],
  },
];

export async function seedArticles(
  payload: Payload,
  dependencies: SeedDependencies,
): Promise<Article[]> {
  const { categories, tags, authors, articleImages } = dependencies;
  const createdArticles: Article[] = [];

  for (let i = 0; i < articlesData.length; i++) {
    const articleData = articlesData[i];

    // Find the category by slug
    const category = categories.find((c) => c.slug === articleData.categorySlug);
    if (!category) {
      console.log(`   ⚠️ Category not found for: ${articleData.title}`);
      continue;
    }

    // Find tags by slug
    const articleTags = tags.filter((t) => articleData.tagSlugs.includes(t.slug));

    // Get random author
    const author = getRandomItem(authors);

    // Get corresponding featured image (cycling through available images)
    const featuredImage = articleImages[i % articleImages.length];

    // Generate publish date within last 30 days
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 30));

    const article = await payload.create({
      collection: "articles",
      data: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        status: articleData.status as "draft" | "published" | "scheduled" | "archived",
        featured: articleData.featured,
        breaking: articleData.breaking,
        content: generateRichTextContent(articleData.paragraphs),
        category: category.id,
        tags: articleTags.map((t) => t.id),
        author: author.id,
        featuredImage: featuredImage?.id || null,
        publishedDate: publishedDate.toISOString(),
        allowComments: true,
        views: Math.floor(Math.random() * 10000),
      },
    });
    createdArticles.push(article);
  }

  return createdArticles;
}
