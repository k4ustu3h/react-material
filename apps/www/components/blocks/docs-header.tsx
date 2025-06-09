import React from "react";
import Iridescence from "./iridescence";

const DocsHeader = (props: { title: string; description: string; img?: string }) => {
  return (
    <div className="absolute left-0 right-0 top-0 flex gap-2 not-prose">
      <div className="grow h-120 bg-surface-container rounded-xl overflow-hidden">
        <div className="flex flex-col justify-center h-full px-20 text-on-secondary-container">
          <h1 className="m3-font-display-large font-semibold text-8xl text-wrap break-words">{props.title}</h1>
          <p className="m3-font-title-large">{props.description}</p>
        </div>
      </div>
      <div className="w-[40%] shrink-0 h-120 bg-surface-container rounded-xl overflow-hidden">
        <Iridescence />
      </div>
    </div>
  );
};

export default DocsHeader;
