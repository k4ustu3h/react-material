import Logo from "@/components/misc/logo";
import Link from "../misc/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Seperator from "../misc/seperator";
import DocsIndex from "@/utils/docs-index";
import { Button, Icon } from "react-material";
import DocsListComp from "../blocks/docs-list";

import metaJson from "@/utils/meta.json";
import TableOfContents from "../misc/table-of-contents";

interface DocsMetadata {
  categoryOrder: string[];
  categoryIcons: Record<string, string>;
  documentOrder: Record<string, string[]>;
}

const docsMetadata = metaJson as DocsMetadata;

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [DocsList, setDocsList] = useState(DocsIndex);
  const [DocsPaths, setDocsPaths] = useState<string[]>();
  const [Navigation, setNavigation] = useState<string[][]>([
    ["", ""],
    ["", ""],
  ]);

  const [CurrentPath, setCurrentPath] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const contentContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const isDocsPage = router.pathname.startsWith("/docs");

  const docsIcons = docsMetadata.categoryIcons;

  // useEffect(() => {
  //   setDocsPaths(
  //     Object.entries(DocsList).reduce((acc, [_, items]) => {
  //       items.forEach((item) => {
  //         acc.push(item.path.replace("/docs/", ""));
  //       });
  //       return acc;
  //     }, [] as string[])
  //   );
  // }, [DocsList]);

  useEffect(() => {
    const path = router.asPath;
    const currentPath = DocsPaths?.indexOf(path) || 0;
    const prevPath = DocsPaths?.[currentPath - 1] || "";
    const nextPath = DocsPaths?.[currentPath + 1] || "";
    const titles = Object.entries(DocsList).reduce(
      (acc, [category, items]) => {
        items.forEach((item) => {
          acc[item.path] = item.title;
        });
        return acc;
      },
      {} as Record<string, string>
    );

    const prevTitle = titles[prevPath] || "";
    const nextTitle = titles[nextPath] || "";

    setNavigation([
      [prevTitle, prevPath],
      [nextTitle, nextPath],
    ]);
    setCurrentPath(path);
  }, [router.asPath, DocsPaths, DocsList]);

  useEffect(() => {
    if (isDocsPage && contentContainerRef.current) {
      const container = contentContainerRef.current;
      container.scrollTo({ top: 0, behavior: "instant" });
    }
    // Close mobile menu when navigating to a new page
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  return (
    <div>
      <nav className="absolute z-50 w-full flex justify-center items-center top-4 left-0 right-0 gap-0.5 px-5 text-on-primary-container">
        <div className="flex absolute items-center left-5 gap-2">
          <Link href="/" notAsChild>
            <Logo className="size-8 grid place-items-center" />
          </Link>
          <div className="m3-font-body-small font-dmsans ml-2">
            <span>v0.0.1-alpha1</span>
          </div>
        </div>

        {/* Mobile menu button */}
        {isDocsPage && (
          <Button
            variant="text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden z-50 size-10 absolute right-3"
            aria-label="Toggle navigation menu">
            <Icon size={20}>{isMobileMenuOpen ? "close" : "menu"}</Icon>
          </Button>
        )}

        <div className="invisible sm:visible flex gap-0.5 rounded-xl overflow-hidden">
          <Link href="/docs/get-started/introduction">
            <Button variant="text" shape="square" className="shadow-none font-dmsans">
              Docs
            </Button>
          </Link>
          <Link href="/">
            <Button variant="text" shape="square" className="shadow-none font-dmsans">
              Components
            </Button>
          </Link>
          <Link href="/">
            <Button variant="text" shape="square" className="shadow-none font-dmsans">
              Themes
            </Button>
          </Link>
        </div>
      </nav>
      {isDocsPage ? (
        <div
          className="mt-18 flex px-2 gap-2 h-[calc(100vh-5rem)] relative"
          style={{ transition: "margin 1s var(--m3-util-curve-decel)" }}>
          {/* Mobile sidebar overlay */}

          <div
            className={`fixed inset-0 bg-surface/50 z-40 transition md:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none invisible"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`
            fixed lg:relative top-0 right-0 lg:left-auto
            w-80 lg:w-80 shrink-0 h-[calc(100%-5rem)] lg:h-auto
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "-translate-x-2" : "translate-x-full"} lg:translate-x-0
            z-50 lg:z-auto rounded-xl overflow-hidden
            mt-18 lg:mt-0 shadow-2xl
          `}>
            <div className="bg-surface-container transition-colors px-4 pt-8 sticky top-4 overflow-y-auto h-full">
              {Object.entries(DocsList).map(([category, items]) => (
                <DocsListComp
                  key={category}
                  category={category}
                  items={items}
                  setDocsPaths={setDocsPaths}
                  currentPath={CurrentPath}
                  docsIcons={docsIcons}
                />
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div
            ref={contentContainerRef}
            className="grow rounded-xl overflow-y-auto relative scroll-smooth w-full md:w-auto">
            <div className="flex flex-col relative bg-surface">
              <div id="docs-content" className="min-h-120" />
              <article
                key={CurrentPath}
                className="order-2 w-full xl:w-200 mx-auto mt-20 px-4 md:px-8 prose animation-fade-in">
                {/* Table of Contents - hidden on mobile and tablet */}
                <div className="absolute h-full xl:-right-35">
                  <TableOfContents />
                </div>
                <div className="relative xl:-left-30">{children}</div>
              </article>
            </div>
            <footer>
              <div className="grid grid-cols-1 md:grid-cols-2 px-2 py-10 md:px-10 xl:px-20 gap-2 bg-surface shadow-2xl shadow-surface relative z-10">
                {Navigation[0]?.[0] ? (
                  <Link href={`${Navigation[0][1]}`} className="col-start-1 mb-4 md:mb-0">
                    <Button
                      variant="tonal"
                      shape="square"
                      size="extralarge"
                      className="w-full flex flex-col items-start gap-0 bg-surface-container text-on-surface">
                      <p className="m3-font-headline-small text-base flex gap-1 items-center">
                        <Icon>arrow_back</Icon>Previous
                      </p>
                      <p className="m3-font-headline-medium">{Navigation[0][0]}</p>
                    </Button>
                  </Link>
                ) : (
                  <span />
                )}

                {Navigation[1]?.[0] ? (
                  <Link href={`${Navigation[1][1]}`} className="col-start-1 md:col-start-2">
                    <Button
                      variant="tonal"
                      shape="square"
                      size="extralarge"
                      className="w-full flex flex-col items-start md:items-end gap-0 bg-surface-container text-on-surface">
                      <p className="m3-font-headline-small text-base flex gap-1 items-center">
                        Next<Icon>arrow_forward</Icon>
                      </p>
                      <p className="m3-font-headline-medium">{Navigation[1][0]}</p>
                    </Button>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
              <Footer />
            </footer>
          </div>
        </div>
      ) : (
        <div style={{ transition: "margin 1s var(--m3-util-curve-decel)" }}>
          <div className="bg-surface z-10 relative shadow-2xl shadow-surface">{children}</div>
          <Footer />
        </div>
      )}
    </div>
  );
}

const Footer = () => (
  <>
    <Seperator className="z-10 relative" />
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 grid justify-items-center grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6 lg:gap-4 sticky bottom-0 min-h-82 py-8 bg-surface">
      <p className="m3-font-headline-small text-sm md:text-base text-on-surface col-span-1 sm:col-span-3 lg:col-span-2 text-center lg:text-left">
        <Logo className="size-8 text-on-surface mb-6 mx-auto lg:mx-0" />
        React Material is unofficial and independent port of Material Design 3. As an unofficial
        project, <b>it is not affiliated with Google.</b> All copyrights, trademarks, and
        intellectual property related to Material Design are the property of Google.
      </p>
      <div className="hidden sm:block md:block lg:block">
        <h4 className="m3-font-title-medium text-on-surface mb-4 text-center sm:text-left">
          Documentation
        </h4>
        <ul className="space-y-2">
          <li>
            <Link href="/docs/get-started/introduction">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Introduction
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/get-started/installation">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Installation
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/get-started/theming">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Theming
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/components">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Components
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="hidden sm:block md:block lg:block">
        <h4 className="m3-font-title-medium text-on-surface mb-4 text-center sm:text-left">
          Community
        </h4>
        <ul className="space-y-2">
          <li>
            <Link href="https://github.com/miukyo/react-material">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                GitHub
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://discord.gg/">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Discord
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="hidden sm:block md:block lg:block">
        <h4 className="m3-font-title-medium text-on-surface mb-4 text-center sm:text-left">
          Resources
        </h4>
        <ul className="space-y-2">
          <li>
            <Link href="https://m3.material.io/">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Material Design 3
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/contributing">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Contributing
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/changelog">
              <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm md:text-base">
                Changelog
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:hidden col-span-1">
        <Link href="/docs/get-started/introduction">
          <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm">
            Docs
          </a>
        </Link>
        <Link href="https://github.com/yourusername/react-material">
          <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm">
            GitHub
          </a>
        </Link>
        <Link href="https://discord.gg/yourinvite">
          <a className="m3-font-body-medium text-on-surface-variant hover:text-primary text-sm">
            Discord
          </a>
        </Link>
      </div>
    </div>
  </>
);
