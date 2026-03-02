import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Twitter, Linkedin, Facebook, Instagram, Mail } from "lucide-react";
import { getAuthorBySlug } from "@/lib/queries/authors";
import { getArticles } from "@/lib/queries/articles";
import { ArticleGrid } from "@/components/article";
import { Pagination, NewsletterSection } from "@/components/sections";
import { getImageUrl, getImageAlt } from "@/utils/image";
import { PageLayout } from "@/components/layout/page-layout";
import { getSiteSettings } from "@/lib/queries/globals";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

import { getLocale } from "@/utils/locale-server";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const author = await getAuthorBySlug(slug);
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  if (!author) {
    return {
      title: locale === "ne" ? `लेखक फेला परेन | ${hospitalName}` : `Author Not Found | ${hospitalName}`,
    };
  }

  const authorLabel = locale === "ne" ? "लेखक" : "Author";

  return {
    title: locale === "ne" ? `${author.name} | ${hospitalName}` : `${author.name} - ${authorLabel} | ${hospitalName}`,
    description: author.bio || (locale === "ne" ? `${author.name} द्वारा लेखहरू` : `Articles by ${author.name}`),
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const locale = await getLocale();

  const author = await getAuthorBySlug(slug); // Removed locale argument

  if (!author) {
    notFound();
  }

  const page = parseInt(pageParam || "1");
  const articles = await getArticles({
    author: author.id,
    page,
    limit: 12,
  });

  const labels = {
    articlesBy: locale === "ne" ? `${author.name} द्वारा लेखहरू` : `Articles by ${author.name}`,
    empty: locale === "ne" ? "यस लेखकद्वारा लेखहरू अझै प्रकाशित छैनन्।" : "No articles by this author yet.",
    email: locale === "ne" ? "इमेल" : "Email",
    twitter: locale === "ne" ? "ट्विटर" : "Twitter",
    linkedin: locale === "ne" ? "लिंक्डइन" : "LinkedIn",
    facebook: locale === "ne" ? "फेसबुक" : "Facebook",
    instagram: locale === "ne" ? "इन्स्टाग्राम" : "Instagram",
  };

  const socialLinks = [
    { name: "Twitter", href: author.social?.twitter, icon: Twitter, ariaLabel: labels.twitter },
    { name: "LinkedIn", href: author.social?.linkedin, icon: Linkedin, ariaLabel: labels.linkedin },
    { name: "Facebook", href: author.social?.facebook, icon: Facebook, ariaLabel: labels.facebook },
    { name: "Instagram", href: author.social?.instagram, icon: Instagram, ariaLabel: labels.instagram },
  ].filter((link) => link.href);

  return (
    <PageLayout
      breadcrumbs={[
        { label: author.name }, // Simplified author.name rendering
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="py-8">
        {/* Author header */}
        <header className="mb-12 flex flex-col items-start gap-6 border-b border-gray-100 pb-12 md:flex-row md:items-center">
          {author.avatar && (
            <Image
              src={getImageUrl(author.avatar, "card")}
              alt={getImageAlt(author.avatar) || author.name}
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-white shadow-sm"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-[var(--font-display)] font-bold text-black lg:text-4xl">
              {author.name}
            </h1>
            {author.role && (
              <p className="mt-1 font-medium text-[#2563eb]">{author.role}</p>
            )}
            {author.bio && (
              <p className="mt-4 max-w-2xl leading-relaxed text-gray-600">
                {author.bio}
              </p>
            )}

            {/* Social links */}
            {(socialLinks.length > 0 || author.email) && (
              <div className="mt-4 flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2563eb]"
                    aria-label={link.ariaLabel} // Localized aria-label
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2563eb]"
                    aria-label={labels.email} // Localized aria-label
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Articles */}
        <section>
          <h2 className="mb-8 text-2xl font-[var(--font-display)] font-bold text-black">
            {labels.articlesBy}
          </h2>

          {articles.docs.length > 0 ? (
            <>
              <ArticleGrid articles={articles.docs} columns={3} />
              <Pagination
                currentPage={page}
                totalPages={articles.totalPages}
                basePath={`/author/${slug}`}
              />
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-400 font-bold">{labels.empty}</p>
            </div>
          )}
        </section>
      </div>

      <NewsletterSection />
    </PageLayout>
  );
}
