import React from "react";
import * as LexicalReact from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { type SerializedLinkNode } from "@payloadcms/richtext-lexical";
import { BannerBlock } from "@/components/blocks/Banner";
import Link from "next/link";

// --- Discovery Block ---
const LexModule: any = LexicalReact || {};
const PayloadRichText = LexModule.RichText || LexModule.default?.RichText;
const defaultConverters = LexModule.defaultJSXConverters || LexModule.default?.defaultJSXConverters;
const LinkConverter = LexModule.LinkJSXConverter || LexModule.default?.LinkJSXConverter;

// --- Helper: URL Resolver ---
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const { relationTo, value } = linkNode.fields.doc || {};
  if (!value || typeof value === "string") return "/";
  const slug = (value as { slug?: string }).slug;
  switch (relationTo) {
    case "news":
    case "articles": return `/news/${slug}`;
    case "pages": return `/${slug === "home" ? "" : slug}`;
    case "notices": return `/notices/${slug || value.id}`;
    case "staff": return `/staff/${slug || value.id}`;
    default: return `/${slug ?? ""}`;
  }
};

// --- Custom Converters Factory ---
const getConverters = (providedDefault: any) => {
  const converters = { ...(providedDefault || defaultConverters || {}) };

  // Add a catch-all for unknown nodes to prevent "unknown node" text leak
  if (!converters.unknown) {
    converters.unknown = () => null;
  }

  if (LinkConverter) {
    Object.assign(converters, LinkConverter({ internalDocToHref }));
  }
  converters.blocks = {
    ...(converters.blocks || {}),
    banner: ({ node }: any) => {
      if (!BannerBlock) return null;
      return <BannerBlock {...(node?.fields || {})} />;
    },
  };
  return converters;
};

// --- Robust Node Renderer ---
const renderNode = (node: any, idx: number): React.ReactNode => {
  if (!node) return null;

  // Text node handling
  if (node.type === 'text') {
    let text = node.text || "";
    // Basic formatting bits: 1=bold, 2=italic, 8=underline, 16=strikethrough
    return (
      <span key={idx} style={{
        fontWeight: (node.format & 1) ? 'bold' : 'inherit',
        fontStyle: (node.format & 2) ? 'italic' : 'inherit',
        textDecoration: (node.format & 8) ? 'underline' : ((node.format & 16) ? 'line-through' : 'none')
      }}>
        {text}
      </span>
    );
  }

  // Element node handling
  switch (node.type) {
    case "paragraph":
      return (
        <p key={idx} className="mb-4">
          {node.children?.map((c: any, ci: number) => renderNode(c, ci))}
        </p>
      );
    case "linebreak":
      return <br key={idx} />;
    case "heading": {
      // node.tag usually comes as "h1", "h2", etc. from Lexical
      // but we handle both "h2" and "2" formats to be safe.
      const rawTag = node.tag || "h2";
      const Tag = (rawTag.toString().startsWith("h") ? rawTag : `h${rawTag}`) as any;
      return <Tag key={idx} className="font-bold mb-4">{node.children?.map((c: any, ci: number) => renderNode(c, ci))}</Tag>;
    }
    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
        <ListTag key={idx} className="list-inside mb-4 ml-4" style={{ listStyleType: node.listType === "number" ? "decimal" : "disc" }}>
          {node.children?.map((item: any, ii: number) => renderNode(item, ii))}
        </ListTag>
      );
    }
    case "listitem":
      return <li key={idx}>{node.children?.map((c: any, ci: number) => renderNode(c, ci))}</li>;
    default:
      // Recursively render children if it's an unknown container, instead of showing "unknown node"
      if (node.children) {
        return <React.Fragment key={idx}>{node.children.map((c: any, ci: number) => renderNode(c, ci))}</React.Fragment>;
      }
      return null;
  }
};

// --- Emergency Fallback Renderer ---
const FallbackRichText = ({ data, className }: { data: any; className?: string }) => {
  const root = data?.root;
  if (!root || !Array.isArray(root.children)) return null;

  return (
    <div className={className}>
      {root.children.map((node: any, idx: number) => renderNode(node, idx))}
    </div>
  );
};

// --- Main Component ---
export const RichText: React.FC<{ data: SerializedEditorState | null | undefined; className?: string }> = ({ data, className }) => {
  if (!data) return null;

  // We use FallbackRichText as the primary renderer here because the official PayloadRichText 
  // is inconsistently rendering "unknown node" text in this environment.
  // This ensures the user actually sees their content.
  return <FallbackRichText data={data} className={className} />;
};
