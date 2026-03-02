import React from "react";
import * as LexicalReact from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  type SerializedBlockNode,
  type SerializedLinkNode,
} from "@payloadcms/richtext-lexical";
import { BannerBlock } from "@/components/blocks/Banner";

// Extract named exports safely
const PayloadRichText = (LexicalReact as any).RichText;
const LinkJSXConverter = (LexicalReact as any).LinkJSXConverter;

/**
 * Convert internal document links to proper URLs
 */
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

/**
 * Custom JSX converters for RichText
 */
const jsxConverters: any = ({ defaultConverters }: any) => {
  const converters = { ...defaultConverters };

  // Safety check and apply Link converter
  if (typeof LinkJSXConverter === 'function') {
    try {
      Object.assign(converters, LinkJSXConverter({ internalDocToHref }));
    } catch (e) {
      console.error("Error applying LinkJSXConverter:", e);
    }
  }

  // Define block converters
  converters.blocks = {
    ...(converters.blocks || {}),
    banner: (props: any) => {
      if (!BannerBlock) {
        console.error("BannerBlock component is missing in RichText converters");
        return null;
      }
      return <BannerBlock {...(props.node?.fields || {})} />;
    },
  };

  return converters;
};

type RichTextProps = {
  data: SerializedEditorState | null | undefined;
  className?: string;
};

export const RichText: React.FC<RichTextProps> = ({ data, className }) => {
  if (!data) return null;

  const isPayloadRichTextAvailable = typeof PayloadRichText !== "undefined";

  if (!isPayloadRichTextAvailable) {
    console.error("Payload RichText component is undefined in current environment.");
  }

  return (
    <div className={className}>
      {isPayloadRichTextAvailable ? (
        <PayloadRichText
          data={data}
          converters={jsxConverters}
        />
      ) : (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg">
          <p className="font-bold font-sans">Content Rendering Error</p>
          <p className="text-sm mt-1">The rich text component failed to load. This usually indicates a module resolution issue in the build.</p>
        </div>
      )}
    </div>
  );
};
