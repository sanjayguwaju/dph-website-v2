import React from "react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { SerializedLinkNode } from "@payloadcms/richtext-lexical";

// Lazy-import to avoid RSC resolution issues in different render contexts
import { RichText as LexicalRichText, defaultJSXConverters, LinkJSXConverter } from "@payloadcms/richtext-lexical/react";
import { BannerBlock } from "@/components/blocks/Banner";

// Convert internal document links to proper URLs
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const { relationTo, value } = linkNode.fields.doc || {};

  if (!value || typeof value === "string") {
    return "/";
  }

  const slug = (value as { slug?: string }).slug;

  switch (relationTo) {
    case "articles":
      return `/articles/${slug}`;
    case "pages":
      return `/${slug}`;
    default:
      return `/${slug ?? ""}`;
  }
};

type RichTextProps = {
  data: SerializedEditorState | null | undefined;
  className?: string;
};

export function RichText({ data, className }: RichTextProps) {
  if (!data) {
    return null;
  }

  if (!LexicalRichText) {
    // Fallback: plain text extraction if component fails to resolve
    return (
      <div className={className}>
        <p className="text-muted-foreground text-sm">Content unavailable.</p>
      </div>
    );
  }

  return (
    <LexicalRichText
      data={data}
      className={className}
      converters={{
        ...defaultJSXConverters,
        heading: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });
          const textContent = node.children
            .map((child: any) => (child.text ? child.text : ""))
            .join("");
          const id = textContent
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

          const Tag = (node.tag || "h2") as any;
          return <Tag id={id}>{children}</Tag>;
        },
        ...LinkJSXConverter({ internalDocToHref }),
        blocks: {
          banner: ({ node }: any) => (
            <BannerBlock style={node.fields.style} content={node.fields.content} />
          ),
        },
      }}
    />
  );
}
