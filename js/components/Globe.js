import { html } from "./../imports.js";

export default class Globe extends React.Component {
    // WebGL Earth expects to modify the DOM on its own
    // React's shadow DOM interferes and messes things up
    // so prevent React from touching the globe in the actual DOM
    // https://preactjs.com/guide/v8/external-dom-mutations
    // https://stackoverflow.com/q/57735345 (2nd comment)
    shouldComponentUpdate() {
        return false;
    }

    // id of the html element where the globe will be rendered into
    globeElementID = "earth_div"; 

    // equivalent to the documentation's initialize() function
    componentDidMount() {
        var earth = new WE.map(this.globeElementID, {
            sky: true, // adds stars to background
        });
        WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth);

        var marker = WE.marker([51.5, -0.09]).addTo(earth);
        marker.bindPopup("<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>", {maxWidth: 150, closeButton: true}).openPopup();

        var marker2 = WE.marker([30.058056, 31.228889]).addTo(earth);
        marker2.bindPopup("<b>Cairo</b><br>Yay, you found me!", {maxWidth: 120, closeButton: false});

        earth.setView([51.505, 0], 6);


        // Start a simple rotation animation
        // http://examples.webglearth.com/#animation
        var before = null;
        requestAnimationFrame(function animate(now) {
            var c = earth.getPosition();
            var elapsed = before? now - before: 0;
            before = now;
            earth.setCenter([c[0], c[1] - 0.1*(elapsed/30)]);
            requestAnimationFrame(animate);
        });
    }

    render(props) {
        return html`
            <div id="${this.globeElementID}"></div>
        `
    }
}