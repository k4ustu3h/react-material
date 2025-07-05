import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import SEO from "../misc/seo";

const DocsHeader = (props: { title: string; description: string; img?: string }) => {
  const [docsContentElement, setDocsContentElement] = useState<Element | null>(null);

  useEffect(() => {
    const element = document.getElementById("docs-content");
    setDocsContentElement(element);
  }, []);

  const headerContent = (
    <div id="header" className="order-1 flex flex-col xl:flex-row gap-2 not-prose animation-fade-in">
      <div className="grow h-85 xl:h-120 bg-surface-container rounded-xl overflow-hidden">
        <div className="flex flex-col justify-center h-full px-15 lg:px-[10%] text-on-secondary-container">
          <h1 className="m3-font-display-large font-semibold text-7xl lg:text-8xl text-wrap">
            {props.title}
          </h1>
          <p className="m3-font-title-large text-lg lg:text-2xl">{props.description}</p>
        </div>
      </div>
      <div className="xl:w-[40%] shrink-0 h-85 xl:h-120 bg-surface-container rounded-xl overflow-hidden relative">
        <Image
          width={532}
          height={480}
          src={props.img ?? "/images/Button.png"}
          alt={props.title + " Image"}
          className="relative w-full h-full object-contain inset-0 z-10"
        />
      </div>
    </div>
  );

  return (
    <>
      <SEO title={props.title} description={props.description} />
      {docsContentElement && createPortal(headerContent, docsContentElement)}
    </>
  );
};

export default DocsHeader;
