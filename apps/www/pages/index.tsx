import Iridescence from "@/components/blocks/iridescence";
import Link from "next/link";
import { Button, Ripple } from "react-material";

export default function Index() {
  return (
    <div className="w-full min-h-screen">
      <section className="p-1">
        <div className="h-200 bg-surface-container-highest rounded-xl grid place-items-center relative overflow-hidden">
          <div className="absolute inset-0 blur-xl scale-120 opacity-50">
            <Iridescence mouseReact={false} speed={2} resolution={0.1} />
          </div>
          <div className="absolute inset-0 z-10 dark:bg-[#000] w-full h-full opacity-30 backdrop-blur-xl"></div>
          <div className="z-10 flex items-center justify-center flex-col">
            <h1 className="m3-font-display-large text-8xl text-on-surface font-semibold">
              React Material
            </h1>
            <p className="m3-font-headline-small text-on-surface">
              Google's Material Design Implementation in React
            </p>
            <Link href="/docs/get-started/introduction">
              <Button size="large" className="mt-8 font-dmsans font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
