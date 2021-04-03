class GLOBE_UTILITIES {

    constructor() {
        this.globe = this.INITIALIZE_GLOBE();
        this.allMarkers = [];
        this.articleCardScrollingFunction = null; // this will be assigned later after the Vue instance is created
    }

    INITIALIZE_GLOBE() {
        // equivalent to the documentation's initialize() function
        var globe = new WE.map("globe-div", {
            sky: true, // adds stars to background
        });
        //WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(globe);
        WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}').addTo(globe)

        // Zoom of 3.5 makes globe almost fill up screen, and nicely distracts from the big gap in the left side
        globe.setZoom(3.5);

        
        // Start a simple rotation animation
        // http://examples.webglearth.com/#animation
        var before = null;
        requestAnimationFrame(function animate(now) {
            var c = globe.getPosition();
            var elapsed = before? now - before: 0;
            before = now;
            globe.setCenter([c[0], c[1] - 0.1*(elapsed/30)]);
            requestAnimationFrame(animate);
        });

        return globe;
    }

    // remove all existing markers from the globe
    CLEAR_ALL_MARKERS() {
        for (const marker of this.allMarkers) {
            marker.removeFrom(this.globe);
        }
        this.allMarkers = [];
    }

    // https://github.com/pointhi/leaflet-color-markers
    // create green active and grey inactive markers
    // NEW APPROACH - only pass around locations, and generate markers and add to globe on the fly
    CREATE_MARKER(locationName, coordinates, isActive, articleURL) {
        const iconURL = 
            (isActive) 
            ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
            : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png"
            ;

        const newMarker = WE.marker(coordinates, iconURL).bindPopup(locationName, 75);

        newMarker.element.onclick = () => {
            // close the popup 2.5 seconds after the marker is clicked
            setTimeout(() => newMarker.closePopup(), 2500);

            // scroll the article card associated with the clicked marker to the top of the articles container
            // this is assigned after the Vue Instance is created
            this.articleCardScrollingFunction(articleURL);
        }

        this.allMarkers.push(newMarker);
        newMarker.addTo(this.globe);
    }

    CREATE_MARKERS_FOR_ARTICLES(activeArticles, inactiveArticles) {
        this.CLEAR_ALL_MARKERS();

        const createMarkersForLocations = (locations, isActive, articleURL) => {
            for (const locationName in locations) {
                const coordinates = locations[locationName];
                this.CREATE_MARKER(locationName, coordinates, isActive, articleURL);
            }
        }

        // render inactive first, so active markers at same location will appear above them
        inactiveArticles.forEach(a => createMarkersForLocations(a.locations, false, a.url));
        activeArticles.forEach(a => createMarkersForLocations(a.locations, true, a.url));
    }
}
