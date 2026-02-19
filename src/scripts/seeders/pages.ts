import type { Payload } from "payload";
import type { Page } from "../../payload-types";

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

const pagesData = [
  {
    title: "About Us",
    slug: "about",
    status: "published",
    paragraphs: [
      "Welcome to Hamro News, your trusted source for breaking news, in-depth analysis, and comprehensive coverage of local and global events.",
      "Founded in 2020, Hamro News has grown from a small local news outlet to a comprehensive digital news platform serving millions of readers worldwide.",
      "Our Mission: To deliver accurate, unbiased news that empowers our readers to stay informed about the issues that matter most.",
      "Our team of dedicated journalists works around the clock to bring you the latest stories from politics, business, technology, sports, entertainment, and more.",
      "We believe in the power of journalism to hold power accountable and to give voice to the voiceless. Every story we publish is carefully researched and fact-checked.",
      "Thank you for choosing Hamro News as your source of information. We are committed to earning your trust every day.",
    ],
  },
  {
    title: "Contact Us",
    slug: "contact",
    status: "published",
    paragraphs: [
      "We'd love to hear from you! Whether you have a news tip, feedback, or just want to say hello, there are several ways to reach us.",
      "General Inquiries: For general questions about Hamro News, email us at info@hamronews.com",
      "News Tips: Have a story you think we should cover? Send tips to tips@hamronews.com. We protect our sources.",
      "Advertising: For advertising opportunities, contact our sales team at advertising@hamronews.com",
      "Technical Support: Having trouble with our website or app? Email support@hamronews.com",
      "Our offices are located at: 123 News Street, Media City, MC 12345. We're open Monday through Friday, 9 AM to 6 PM.",
    ],
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    status: "published",
    paragraphs: [
      "At Hamro News, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.",
      "Information We Collect: We may collect personal information such as your name, email address, and browsing behavior when you use our website or subscribe to our newsletters.",
      "How We Use Your Information: We use your information to provide personalized content, send newsletters you've subscribed to, and improve our services.",
      "Cookies: Our website uses cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.",
      "Third-Party Services: We may use third-party services like analytics providers. These services have their own privacy policies.",
      "Your Rights: You have the right to access, correct, or delete your personal information. Contact us at privacy@hamronews.com for any privacy-related requests.",
      "This policy is effective as of January 1, 2024, and may be updated periodically. Check this page for the latest version.",
    ],
  },
  {
    title: "Terms of Service",
    slug: "terms-of-service",
    status: "published",
    paragraphs: [
      "Welcome to Hamro News. By accessing and using our website, you agree to comply with these Terms of Service.",
      "Content Ownership: All content on Hamro News, including articles, images, and multimedia, is owned by Hamro News or its content providers and is protected by copyright laws.",
      "Acceptable Use: You may not use our website for any illegal or unauthorized purpose. You agree not to interfere with the proper functioning of the website.",
      "User Comments: Users may post comments on articles. You are responsible for your comments and must not post content that is defamatory, offensive, or illegal.",
      "Disclaimer: Content on Hamro News is provided for informational purposes only. We make no warranties about the accuracy or completeness of the content.",
      "Limitation of Liability: Hamro News shall not be liable for any damages arising from your use of our website.",
      "These terms may be updated at any time. Your continued use of the website constitutes acceptance of any changes.",
    ],
  },
  {
    title: "Advertise With Us",
    slug: "advertise",
    status: "published",
    paragraphs: [
      "Reach millions of engaged readers by advertising on Hamro News, one of the fastest-growing digital news platforms.",
      "Our Audience: Our readers are educated, affluent, and engaged. They trust Hamro News for reliable information and make decisions based on what they read here.",
      "Advertising Options: We offer a variety of advertising formats including display ads, sponsored content, newsletter sponsorships, and custom packages.",
      "Display Advertising: Premium ad placements across our website with targeting options based on content category, geography, and user behavior.",
      "Sponsored Content: Native advertising that tells your brand story in an authentic way, created by our editorial team to match our content standards.",
      "Newsletter Advertising: Reach our subscribers directly in their inbox with sponsored mentions in our daily and weekly newsletters.",
      "Contact our advertising team at advertising@hamronews.com to discuss opportunities and get a custom quote.",
    ],
  },
];

export async function seedPages(payload: Payload): Promise<Page[]> {
  const createdPages: Page[] = [];

  for (const pageData of pagesData) {
    const page = await payload.create({
      collection: "pages",
      data: {
        title: pageData.title,
        slug: pageData.slug,
        status: pageData.status as "draft" | "published",
        content: generateRichTextContent(pageData.paragraphs),
      },
    });
    createdPages.push(page);
  }

  return createdPages;
}
