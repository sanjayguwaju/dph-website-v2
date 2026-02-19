import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Twitter, Linkedin, Facebook, Instagram, Mail } from "lucide-react";
import { getAuthorBySlug } from "@/lib/queries/authors";
import { getArticles } from "@/lib/queries/articles";
import { ArticleGrid } from "@/components/article";
import { Pagination, NewsletterSection } from "@/components/sections";
import { getImageUrl, getImageAlt } from "@/utils/image";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: `${author.name} - Author`,
    description: author.bio || `Articles by ${author.name}`,
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const page = parseInt(pageParam || "1");
  const articles = await getArticles({
    author: author.id,
    page,
    limit: 12,
  });

  const socialLinks = [
    { name: "Twitter", href: author.social?.twitter, icon: Twitter },
    { name: "LinkedIn", href: author.social?.linkedin, icon: Linkedin },
    { name: "Facebook", href: author.social?.facebook, icon: Facebook },
    { name: "Instagram", href: author.social?.instagram, icon: Instagram },
  ].filter((link) => link.href);

  return (
    <>
      <div className="container mx-auto px-[var(--spacing-page)] py-[var(--spacing-section)]">
        {/* Author header */}
        <header className="mb-12 flex flex-col items-start gap-6 border-b border-[var(--color-ink-800)] pb-12 md:flex-row md:items-center">
          {author.avatar && (
            <Image
              src={getImageUrl(author.avatar, "card")}
              alt={getImageAlt(author.avatar) || author.name}
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)] lg:text-4xl">
              {author.name}
            </h1>
            {author.role && (
              <p className="mt-1 font-medium text-[var(--color-crimson)]">{author.role}</p>
            )}
            {author.bio && (
              <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-ink-300)]">
                {author.bio}
              </p>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-[var(--color-ink-400)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="rounded-lg p-2 text-[var(--color-ink-400)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
                    aria-label="Email"
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
          <h2 className="mb-8 text-2xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
            Articles by {author.name}
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
              <p className="text-[var(--color-ink-400)]">No articles by this author yet.</p>
            </div>
          )}
        </section>
      </div>

      <NewsletterSection />
    </>
  );
}
