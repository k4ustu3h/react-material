declare module '*.module.css?raw' {
    const content: Record<string, string>;
    export default content;
}