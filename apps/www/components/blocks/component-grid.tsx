import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ComponentItem {
  name: string;
  image: string;
  href: string;
  badge?: string;
  status?: "new" | "updated" | "no-guidelines";
}

interface ComponentGridProps {
  components: ComponentItem[];
}

const ComponentGrid: React.FC<ComponentGridProps> = ({ components }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "new":
        return "bg-primary text-on-primary";
      case "updated":
        return "bg-tertiary text-on-tertiary";
      case "no-guidelines":
        return "bg-error text-white";
      default:
        return "bg-primary text-on-primary";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "new":
        return "New";
      case "updated":
        return "Updated";
      case "no-guidelines":
        return "No guidelines";
      default:
        return "";
    }
  };

  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
        {components.map((component, index) => (
          <Link key={index} href={component.href} className="block group">
            <div className="bg-surface-container rounded-md overflow-hidden hover:bg-surface-container-high transition-colors duration-200">
              <div className="aspect-[4/3] flex items-center justify-center relative">
                <Image
                  src={component.image}
                  alt={component.name}
                  width={252}
                  height={189}
                  quality={100}
                  className="w-full z-10 h-full object-cover group-hover:scale-120 transition-transform duration-200"
                />
                <Image
                  src="/images/HeaderBackground.jpg"
                  alt="Background"
                  width={252}
                  height={189}
                  className="blur-lg absolute inset-0 w-full h-full object-cover scale-120"
                />
              </div>
              <div className="p-4 bg-surface-container-high z-20 relative flex justify-between items-center">
                <h3 className="font-semibold text-white mb-1">{component.name}</h3>
                {component.status && (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(component.status)}`}>
                    {getStatusText(component.status)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ComponentGrid;
