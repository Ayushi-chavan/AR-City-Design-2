AFRAME.registerComponent("atoms", {
    init: async function () {
        var compounds = await this.getCompounds()

        var barcodes = Object.keys(compounds)

        barcodes.map(bcode => {
            var element = compounds[bcode]

            this.createAtoms(element)
        })
    },


    getCompounds: function () {
        return fetch("js/compoundList.json")
            .then(info => info.json())
            .then(data => data)
    },


    getElementsColor: function () {
        return fetch("js/elementColors.json")
            .then(info => info.json())
            .then(data => data)
    },


    createAtoms: async function (element) {
        var elementName = element.element_name
        var barcodeValue = element.barcode_value
        var numOfElectrons = element.number_of_electron

        var colors = await this.getElementsColor()

        var scene = document.querySelector("a-scene")

        var marker = document.createElement("a-marker")

        marker.setAttribute("id", `marker-${barcodeValue}`)
        marker.setAttribute("type", "barcode")
        marker.setAttribute("element_name", elementName)
        marker.setAttribute("value", barcodeValue)

        scene.appendChild(marker)

        var atom = document.createElement("a-entity")
        atom.setAttribute("id", `${elementName}-${barcodeValue}`)
        marker.appendChild(atom)

        var cards = document.createElement("a-entity")
        cards.setAttribute("id", `card-${elementName}`)
        cards.setAttribute(
            "geometry", {
            primitive: "plane",
            width: 1,
            height: 1
        }
        )
        cards.setAttribute(
            "material", { src: `./assets/atom_cards/card_${elementName}.png` }
        )
        cards.setAttribute("position", { x: 0, y: 0, z: 0 })
        cards.setAttribute("rotation", { x: -90, y: 0, z: 0 })
        atom.appendChild(cards)


        // creating nucleus
        var nucleusRadius = 0.2;
        var nucleus = document.createElement("a-entity");
        nucleus.setAttribute("id", `nucleus-${elementName}`);
        nucleus.setAttribute("geometry", {
            primitive: "sphere",
            radius: nucleusRadius
        });

        nucleus.setAttribute("material", "color", colors[elementName]);
        nucleus.setAttribute("position", { x: 0, y: 1, z: 0 });

        nucleus.setAttribute("rotation", { x: 0, y: 0, z: 0 });

        var nucleusName = document.createElement("a-entity");
        nucleusName.setAttribute("id", `nucleus-name-${elementName}`);
        nucleusName.setAttribute("position", { x: 0, y: 0.21, z: -0.06 });
        nucleusName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        nucleusName.setAttribute("text", {
            font: "monoid",
            width: 3,
            color: "black",
            align: "center",
            value: elementName
        });

        nucleus.appendChild(nucleusName);

        atom.appendChild(nucleus);

        // creating the orbital path where the electrons will revolve
        var orbitAngle = -180
        var electronAngle = 30

        for (var num = 1; num <= numOfElectrons; num++) {
            var orbit = document.createElement("a-entity")
            orbit.setAttribute(
                "geometry", {
                primitive: "torus",
                arc: 360,
                radius: 0.28,
                radiusTabular: 0.001
            })

            orbit.setAttribute("material", {
                color: "#ff9e80",
                opacity: 0.3
            });

            orbit.setAttribute("position", {
                x: 0,
                y: 1,
                z: 0
            });

            orbit.setAttribute("rotation", {
                x: 0,
                y: orbitAngle,
                z: 0
            });

            orbitAngle += 45;

            atom.appendChild(orbit);

            // creating the group of electrons
            var electronGroup = document.createElement("a-entity");
            electronGroup.setAttribute("id", `electron-group-${elementName}`);
            electronGroup.setAttribute("rotation", {
                x: 0,
                y: 0,
                z: electronAngle
            });

            electronAngle += 65;

            electronGroup.setAttribute("animation", {
                property: "rotation",
                to: `0 0 -360`,
                loop: "true",
                dur: 3500,
                easing: "linear"
            });

            orbit.appendChild(electronGroup);

            //Create electron
            var electron = document.createElement("a-entity");
            electron.setAttribute("id", `electron-${elementName}`);
            electron.setAttribute("geometry", {
                primitive: "sphere",
                radius: 0.02
            });

            electron.setAttribute("material", { color: "#0d47a1", opacity: 0.6 });
            electron.setAttribute("position", {
                x: 0.2,
                y: 0.2,
                z: 0
            });

            electronGroup.appendChild(electron);


        }
    }
});