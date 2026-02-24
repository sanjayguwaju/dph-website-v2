import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  DefaultNodeTypes,
  type SerializedBlockNode,
  type SerializedLinkNode,
} from "@payloadcms/richtext-lexical";

// Lazy-import to avoid RSC resolution issues in different render contexts
import { RichText as LexicalRichText, defaultJSXConverters, LinkJSXConverter } from "@payloadcms/richtext-lexical/react";
import { BannerBlock, type BannerProps } from "@/components/blocks/Banner";

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


type NodeTypes = DefaultNodeTypes | SerializedBlockNode<BannerProps>;

const jsxConverters = ({ defaultConverters }: { defaultConverters: any }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }: { node: SerializedBlockNode<BannerProps> }) => <BannerBlock {...node.fields} />,
  },
});

type RichTextProps = {
  data: SerializedEditorState | null | undefined;
  className?: string;
};

export function RichText({ data, className }: RichTextProps) {
  if (!data) return null;

  return (
    <div className={className}>
      <PayloadRichText
        data={data}
        converters={jsxConverters}
      />
    </div>
  );
}
