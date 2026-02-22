import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { jsxConverters } from "./converters";

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
