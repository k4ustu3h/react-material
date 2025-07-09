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
    <div
      id="header"
      className="order-1 flex flex-col xl:flex-row gap-2 not-prose animation-fade-in">
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
          quality={100}
          className="relative w-full h-full object-contain inset-0 z-20"
        />
        <SVGNoise />
        <Image
          width={800}
          height={450}
          src="/images/HeaderBackground.jpg"
          alt="Background Image"
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
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

const SVGNoise = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 700 700"
    width="700"
    height="700"
    className="absolute inset-0 w-full h-full z-10 opacity-30">
    <defs>
      <filter
        id="nnnoise-filter"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        color-interpolation-filters="linearRGB">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.075"
          numOctaves="4"
          seed="15"
          stitchTiles="stitch"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="turbulence"></feTurbulence>
        <feSpecularLighting
          surfaceScale="15"
          specularConstant="0.75"
          specularExponent="20"
          lighting-color="#ffffff"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          in="turbulence"
          result="specularLighting">
          <feDistantLight azimuth="3" elevation="100"></feDistantLight>
        </feSpecularLighting>
      </filter>
    </defs>
    <rect width="700" height="700" fill="transparent"></rect>
    <rect width="700" height="700" fill="#ffffff" filter="url(#nnnoise-filter)"></rect>
  </svg>
);

export default DocsHeader;
