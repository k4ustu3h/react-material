import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turborepo.com/docs/guides/generating-code

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator("react-component", {
    description: "Adds a new react component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
      {
        type: "input",
        name: "category",
        message: "What is the category of the component?",
      },
      
    ],
    actions: [
      {
        type: "add",
        path: "components/{{kebabCase category}}/{{kebabCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "components/{{kebabCase category}}/{{kebabCase name}}.css",
        templateFile: "templates/css.hbs",
      },
      {
        type: "append",
        path: "./components/index.ts",
        template: 'export * from "./{{kebabCase category}}/{{kebabCase name}}";',
      },
    ],
  });
}
