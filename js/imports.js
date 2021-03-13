// Every other library is imported in the index.html file as cdn script tag links

// htm is a library that allows you to use jsx-like syntax with string templates
// it is nice because you don't need to use a build step like you would with normal jsx
// I couldn't figure out how to import it as a script tag in the html, so I'm importing it here instead
import htm from "https://unpkg.com/htm@3.0.4/dist/htm.module.js?module"
export const html = htm.bind(React.createElement);
