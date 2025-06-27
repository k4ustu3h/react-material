import React from "react";
import DottedBackground from "../misc/dotted-background";

const DocsPreview = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg [&>pre]:m-0 border border-dashed border-primary-container my-8 relative">
      {props.children}
    </div>
  );
};

export const DocsComp = (props: React.HTMLAttributes<HTMLPreElement>) => {
  return (
    <div className="flex gap-2 relative p-4 flex-wrap overflow-hidden rounded-md not-prose">
      <DottedBackground className="absolute inset-0 w-full h-full -z-10 opacity-30" />
      {props.children}
    </div>
  );
};

export default DocsPreview;
