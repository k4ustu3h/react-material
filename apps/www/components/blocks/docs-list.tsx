import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Icon } from "react-material";
import metaJson from "@/utils/meta.json";
import { usePathname } from "next/navigation";

type DocItem = {
  title: string;
  description: string;
  path: string;
  group?: string;
  groupTitle?: string;
};

interface DocListProps {
  category: string;
  items: DocItem[];
  currentPath: string;
  docsIcons: Record<string, string>;
  setDocsPaths: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

function kebabToTitleCase(kebabCase: string) {
  return kebabCase
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function DocList({
  category,
  items,
  currentPath,
  docsIcons,
  setDocsPaths,
}: DocListProps) {
  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // Organize items by group
  const [organizedItems, setOrganizedItems] = useState<
    {
      type: "group" | "item";
      groupName?: string;
      groupTitle?: string;
      item?: DocItem;
      items?: DocItem[];
    }[]
  >([]);

  // Group items by their group property
  const groups: Record<string, DocItem[]> = {};

  useEffect(() => {
    const newOrganizedItems: {
      type: "group" | "item";
      groupName?: string;
      groupTitle?: string;
      item?: DocItem;
      items?: DocItem[];
    }[] = [];

    items.forEach((item) => {
      if (item.group) {
        if (!groups[item.group]) {
          groups[item.group] = [];
        }
        groups[item.group]?.push(item);
      } else {
        // Add ungrouped items directly to newOrganizedItems
        newOrganizedItems.push({
          type: "item",
          item,
        });
      }
    });

    // Add groups to newOrganizedItems
    Object.entries(groups).forEach(([groupName, groupItems]) => {
      // Sort items within each group alphabetically by title
      groupItems.sort((a, b) => a.title.localeCompare(b.title));

      const groupTitle = groupItems[0]?.groupTitle || kebabToTitleCase(groupName);
      newOrganizedItems.push({
        type: "group",
        groupName,
        groupTitle,
        items: groupItems,
      });
    });

    // Sort newOrganizedItems based on meta.json
    // Only apply alphabetical sorting for categories that don't have manual sorting in meta.json
    const hasManualSorting =
      (metaJson as any).documentOrder && (metaJson as any).documentOrder[category];

    if (!hasManualSorting) {
      // For categories without manual sorting, sort alphabetically by title
      newOrganizedItems.sort((a, b) => {
        // Get the title to sort by (either group title or item title)
        const getTitleForSorting = (item: (typeof newOrganizedItems)[0]) => {
          if (item.type === "group") return item.groupTitle || "";
          if (item.type === "item") return item.item?.title || "";
          return "";
        };

        // Always sort by title, regardless of whether it's a group or item
        const titleA = getTitleForSorting(a);
        const titleB = getTitleForSorting(b);
        return titleA.localeCompare(titleB);
      });
    }

    setOrganizedItems(newOrganizedItems);

    const paths: string[] = [];
    newOrganizedItems.forEach((item) => {
      if (item.type === "item" && item.item) {
        paths.push(item.item.path);
      } else if (item.type === "group" && item.items) {
        item.items.forEach((groupItem) => {
          paths.push(groupItem.path);
        });
      }
    });
    setDocsPaths((prev) => [...(prev || []), ...paths]);
  }, [items, category]);

  useEffect(() => {
    // Set expanded group by default based on the current path
    const currentGroup = Object.keys(groups).find((groupName) =>
      groups[groupName]?.some((item) => item.path === pathname)
    );
    if (currentGroup) {
      setExpandedGroups((prev) => ({
        ...prev,
        [currentGroup]: true, // Expand the group if it contains the current path
      }));
    }
  }, [groups]);

  // Check if a group is expanded
  const isGroupExpanded = (groupName: string) => {
    // Initialize group expansion if it's not set yet
    if (expandedGroups[groupName] === undefined) {
      const isGroupActive = groups[groupName]?.some((item) => item.path === currentPath);
      setExpandedGroups((prev) => ({
        ...prev,
        [groupName]: isGroupActive || false,
      }));
      return isGroupActive || false;
    }

    return expandedGroups[groupName];
  };

  // Toggle group expansion
  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName] || false,
    }));
  };

  return (
    <div className="mb-4">
      <h2 className="m3-font-headline-small text-lg font-semibold text-on-secondary-container mb-2 ml-4 flex gap-2">
        <Icon className="text-xl">{docsIcons[category as keyof typeof docsIcons]}</Icon>
        {kebabToTitleCase(category)}
      </h2>
      <ul className="list-none p-0 m-0">
        {organizedItems.map((item, index) => {
          if (item.type === "item" && item.item) {
            // Render a single item
            return (
              <li key={item.item.path}>
                <Link href={item.item.path}>
                  <Button
                    variant={item.item.path === currentPath ? "tonal" : "text"}
                    size="medium"
                    className="w-full justify-start">
                    {item.item.title}
                  </Button>
                </Link>
              </li>
            );
          } else if (item.type === "group" && item.groupName && item.items) {
            // Render a group with its items
            const isExpanded = isGroupExpanded(item.groupName);
            const height = 3.5 + 3.5 * item.items.length;

            return (
              <li
                key={item.groupName}
                className="transition-[height] ease-curve-decel duration-500"
                style={{ height: isExpanded ? `${height}rem` : "3.5rem" }}>
                <Button
                  variant="text"
                  size="medium"
                  className={`w-full justify-between ${currentPath.includes(`/${item.groupName}/`) ? "bg-secondary-container/50" : ""}`}
                  onClick={() => toggleGroup(item.groupName!)}>
                  <span>{item.groupTitle}</span>
                  <Icon>{isExpanded ? "expand_less" : "expand_more"}</Icon>
                </Button>

                {isExpanded && (
                  <ul className="list-none p-0 ml-4">
                    {item.items.map((groupItem) => (
                      <li key={groupItem.path} className="">
                        <Link href={groupItem.path}>
                          <Button
                            variant={groupItem.path === currentPath ? "tonal" : "text"}
                            size="medium"
                            className="w-full justify-start">
                            {groupItem.title}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
