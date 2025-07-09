// This file is auto-generated. Do not edit manually.
// Generated on 2025-07-09T16:24:57.175Z

/**
 * Documentation index structure with categories and their documents
 */
interface DocItem {
  title: string;
  description: string;
  path: string;
  group?: string;
  groupTitle?: string;
}

type DocIndex = Record<string, DocItem[]>;

const docsIndex: DocIndex = {
  "get-started": [
    {
      title: "Introduction",
      description: "Learn about React Material.",
      path: "/docs/get-started/introduction",
    },
    {
      title: "Installation",
      description: "A guide to installing and setting up the necessary components for your project.",
      path: "/docs/get-started/installation",
    },
    {
      title: "Theming",
      description: "Learn how to customize and apply themes to your React Material application.",
      path: "/docs/get-started/theming",
    },
    {
      title: "Tailwind",
      description: "Learn how to integrate React Material with Tailwind CSS for a complete design system.",
      path: "/docs/get-started/tailwind",
    },
  ],
  "components": [
    {
      title: "All Components",
      description: "Explore the various components available in React Material.",
      path: "/docs/components/components",
    },
    {
      title: "Button",
      description: "A versatile component for triggering actions or navigating users.",
      path: "/docs/components/buttons/button",
      group: "buttons",
      groupTitle: "Buttons",
    },
    {
      title: "Button Group",
      description: "A component for grouping buttons together, allowing for better organization and user interaction.",
      path: "/docs/components/buttons/button-group",
      group: "buttons",
      groupTitle: "Buttons",
    },
    {
      title: "Checkbox",
      description: "A versatile component for toggling options or settings.",
      path: "/docs/components/inputs/checkbox",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Chip",
      description: "A compact component for displaying information or actions in a small, interactive format.",
      path: "/docs/components/buttons/chip",
      group: "buttons",
      groupTitle: "Buttons",
    },
    {
      title: "FAB",
      description: "A Floating Action Button (FAB) is a button that represents the primary action on a page.",
      path: "/docs/components/buttons/fab",
      group: "buttons",
      groupTitle: "Buttons",
    },
    {
      title: "Icon",
      description: "A versatile component for displaying Material Design icons using Google",
      path: "/docs/components/miscellaneous/icon",
      group: "miscellaneous",
      groupTitle: "Miscellaneous",
    },
    {
      title: "Loading",
      description: "A component designed to provides visual feedback to users during processes that take time.",
      path: "/docs/components/informatives/loading",
      group: "informatives",
      groupTitle: "Informatives",
    },
    {
      title: "Progress",
      description: "A component used to visually indicate the progress of a task or operation.",
      path: "/docs/components/informatives/progress",
      group: "informatives",
      groupTitle: "Informatives",
    },
    {
      title: "Radio",
      description: "A radio buttons that allows users to select one option from a set of choices, ensuring only one selection at a time.",
      path: "/docs/components/inputs/radio",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Shape",
      description: "A versatile UI component for adding premade shapes to your interface.",
      path: "/docs/components/miscellaneous/shape",
      group: "miscellaneous",
      groupTitle: "Miscellaneous",
    },
    {
      title: "Slider",
      description: "A versatile UI element that allows users to select a value from a predefined range.",
      path: "/docs/components/inputs/slider",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Snackbar",
      description: "A brief message that appears temporarily to provide feedback or information to the user.",
      path: "/docs/components/informatives/snackbar",
      group: "informatives",
      groupTitle: "Informatives",
    },
    {
      title: "Switch",
      description: "A toggle switch component for binary choices, allowing users to turn settings on or off.",
      path: "/docs/components/inputs/switch",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Text Field",
      description: "A versatile input component for capturing user text input.",
      path: "/docs/components/inputs/text-field",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Tooltip",
      description: "A small pop-up box that appears when a user hovers over an element, providing additional information or context.",
      path: "/docs/components/informatives/tooltip",
      group: "informatives",
      groupTitle: "Informatives",
    },
  ],
};

export default docsIndex;
