import Logo from "@/components/misc/logo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Seperator from "../misc/seperator";
import DocsIndex from "@/utils/docs-index";
import { Button, Icon } from "react-material";
import DocsListComp from "../blocks/docs-list";

import metaJson from "@/utils/meta.json";

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

  const contentContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const isDocsPage = router.pathname.startsWith("/docs");
  const btnClass = isDocsPage
    ? "bg-surface-container hover:bg-surface-containerest"
    : "bg-[white]/20 hover:bg-[white]/10";

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
  }, [router.asPath]);

  return (
    <div>
      <nav className="absolute z-50 w-full flex justify-center items-center top-4 left-0 right-0 gap-0.5 px-5 text-on-primary-container">
        <Link href="/" className="absolute left-0 gap-0.5 px-5">
          <Logo className="size-8 " />
        </Link>
        <div className="absolute right-8 gap-0.5 m3-font-body-small font-dmsans">v0.0.1rc</div>
        <div className="flex gap-0.5">
          <Link href="/docs/get-started/introduction">
            <button
              className={`${btnClass} cursor-pointer m3-font-headline-small text-base transition-all ease-fast text-on-primary-container rounded-l-lg rounded-r-sm px-4 py-2`}>
              Docs
            </button>
          </Link>
          <Link href="/">
            <button
              className={`${btnClass} cursor-pointer m3-font-headline-small text-base transition-all ease-fast text-on-primary-container rounded-sm px-4 py-2`}>
              Components
            </button>
          </Link>
          <Link href="/">
            <button
              className={`${btnClass} cursor-pointer m3-font-headline-small text-base transition-all ease-fast text-on-primary-container rounded-l-sm rounded-r-lg px-4 py-2`}>
              Themes
            </button>
          </Link>
        </div>
      </nav>
      {isDocsPage ? (
        <div
          className="mt-18 flex px-2 gap-2 h-[calc(100vh-5rem)]"
          style={{ transition: "margin 1s var(--m3-util-curve-decel)" }}>
          <div className="rounded-xl overflow-hidden w-80 shrink-0">
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
          <div ref={contentContainerRef} className="grow rounded-xl px-2 overflow-y-auto relative">
            <article className="prose w-200 mx-auto mt-140 animation-fade-in">{children}</article>
            <footer>
              <div className="grid grid-cols-2 p-20 gap-2 bg-surface shadow-2xl shadow-surface">
                {Navigation[0]?.[0] && (
                  <Link href={`${Navigation[0][1]}`} className="col-start-1">
                    <Button
                      color="tonal"
                      shape="square"
                      size="extralarge"
                      className="w-full flex flex-col items-start gap-0 bg-surface-container">
                      <p className="m3-font-headline-small text-base flex gap-1 items-center">
                        <Icon>arrow_back</Icon>Previous
                      </p>
                      <p className="m3-font-headline-large">{Navigation[0][0]}</p>
                    </Button>
                  </Link>
                )}

                {Navigation[1]?.[0] && (
                  <Link href={`${Navigation[1][1]}`} className="col-start-2">
                    <Button
                      color="tonal"
                      shape="square"
                      size="extralarge"
                      className="w-full flex flex-col items-end gap-0 bg-surface-container">
                      <p className="m3-font-headline-small text-base flex gap-1 items-center">
                        Next<Icon>arrow_forward</Icon>
                      </p>
                      <p className="m3-font-headline-large">{Navigation[1][0]}</p>
                    </Button>
                  </Link>
                )}
              </div>
              <Seperator />
              <div className="px-20 grid place-items-center grid-cols-2 gap-4 sticky bottom-0 h-82 -z-10">
                <p className="m3-font-headline-small text-base text-on-surface">
                  <Logo className="size-8 text-on-surface mb-6" />
                  React Material is unofficial and independent port of Material Design 3. As an
                  unofficial project, <b>it is not affiliated with Google.</b> All copyrights,
                  trademarks, and intellectual property related to Material Design are the property
                  of Google.
                </p>
                <div className="flex items-center justify-center gap-8 grow h-full place-items-center">
                  <p className="m3-font-headline-small text-lg text-primary underline">Github</p>
                  <p className="m3-font-headline-small text-lg text-primary underline">Discord</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        <div style={{ transition: "margin 1s var(--m3-util-curve-decel)" }}>{children}</div>
      )}
    </div>
  );
}
