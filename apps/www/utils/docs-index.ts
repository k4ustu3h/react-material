// This file is auto-generated. Do not edit manually.
// Generated on 2025-06-25T07:33:48.895Z

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
  ],
  "components": [
    {
      title: "Accordion",
      description: "A vertically stacked set of interactive headings that each reveal a section of content when clicked.",
      path: "/docs/components/accordion",
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
      description: "A component that groups multiple buttons together for better organization and user interaction.",
      path: "/docs/components/buttons/button-group",
      group: "buttons",
      groupTitle: "Buttons",
    },
    {
      title: "Card",
      description: "A flexible and extensible content container that can be used to display information in a structured format.",
      path: "/docs/components/card",
    },
    {
      title: "Carousel",
      description: "A component for displaying a series of images or content in a sliding format.",
      path: "/docs/components/carousel",
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
      title: "Dialog",
      description: "A modal dialog component that displays content in a focused overlay, allowing users to interact with it without navigating away from the current page.",
      path: "/docs/components/dialog",
    },
    {
      title: "FAB",
      description: "A Floating Action Button (FAB) is a circular button that represents the primary action on a page.",
      path: "/docs/components/buttons/fab",
      group: "buttons",
      groupTitle: "Buttons",
    },
    {
      title: "Loading",
      description: "A component for displaying loading indicators to inform users of ongoing processes.",
      path: "/docs/components/loading",
    },
    {
      title: "Menu",
      description: "A component that provides a list of options or actions for users to choose from, typically displayed in a dropdown or sidebar format.",
      path: "/docs/components/menu",
    },
    {
      title: "Progress",
      description: "A component for displaying the progress of a task or operation.",
      path: "/docs/components/progress",
    },
    {
      title: "Radio",
      description: "A component that allows users to select one option from a set of choices, ensuring only one selection at a time.",
      path: "/docs/components/inputs/radio",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Slider",
      description: "A component for selecting a value from a range, allowing users to adjust settings or preferences.",
      path: "/docs/components/inputs/slider",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Snackbar",
      description: "A brief message that appears temporarily to provide feedback or information to the user.",
      path: "/docs/components/snackbar",
    },
    {
      title: "Switch",
      description: "A toggle switch component for binary choices, allowing users to turn settings on or off.",
      path: "/docs/components/inputs/switch",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Tabs",
      description: "A component for organizing content into separate views, allowing users to switch between them easily.",
      path: "/docs/components/tabs",
    },
    {
      title: "Text Field",
      description: "A versatile input component for capturing user text input.",
      path: "/docs/components/inputs/text-field",
      group: "inputs",
      groupTitle: "Inputs",
    },
    {
      title: "Toolbar",
      description: "A component for displaying a set of actions or navigation options in a horizontal layout.",
      path: "/docs/components/toolbar",
    },
  ],
};

export default docsIndex;
