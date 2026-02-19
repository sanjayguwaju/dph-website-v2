import type {
  SerializedLinkNode,
  SerializedHeadingNode,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import type { JSXConvertersFunction, JSXConverters } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { LinkJSXConverter } from "@payloadcms/richtext-lexical/react";
import { BannerBlock } from "@/components/blocks/Banner";

// Banner block fields type
interface BannerFields {
  style?: "info" | "warning" | "success" | "error" | null;
  content?: SerializedEditorState | null;
  blockType: "banner";
}

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
      return `/${slug}`;
  }
};

// Custom heading converter with auto-generated IDs for anchor links
const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const textContent = node.children.map((child: any) => (child.text ? child.text : "")).join("");
    const id = textContent
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const Tag = node.tag;
    return <Tag id={id}>{children}</Tag>;
  },
};

// Block node type
type BlockNodeTypes = SerializedBlockNode<BannerFields>;

export const jsxConverters: JSXConvertersFunction<DefaultNodeTypes | BlockNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
  blocks: {
    banner: ({ node }) => <BannerBlock style={node.fields.style} content={node.fields.content} />,
  },
});
