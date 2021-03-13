import { html } from "./imports.js"; // allows use of string-templated html
import Globe from "./components/Globe.js";


function App(props) {
    return html`
        <${React.Fragment}>
            <${Globe}/>
            <div>Articles Here</div>
        </${React.Fragment}>
    `;
}

ReactDOM.render(
    html`<${App}/>`,
    document.getElementById("root")
)
