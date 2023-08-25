AFRAME.registerComponent("models", {
    init: async function () {
        var model = await this.getModel()

        var barcodes = Object.keys(model)

        barcodes.map(bcode => {
            var element = model[bcode]

            this.createModel(element)
        })
    },


    getModel: function () {
        return fetch("js/model.json")
            .then(info => info.json())
            .then(data => data)
    },
 
   createModel: async function(model) {
        var barcodeValue = model.barcode_value;
        var modelUrl = model.model_url;
        var modelName = model.model_name;

        var scene = document.querySelector("a-scene");

        var marker = document.createElement("a-marker");

        marker.setAttribute("id", `marker-${modelName}`);
        marker.setAttribute("type", "barcode");
        marker.setAttribute("modelName", modelName);
        marker.setAttribute("value", barcodeValue);
        marker.setAttribute("markerhandler", {});
        scene.appendChild(marker);

        if (barcodeValue === 0) {
            var model1 = document.createElement("a-entity")
            model1.setAttribute("id", `${modelName}`);
            model1.setAttribute("geometry", {
                primitive: "box",
                width: model.width,
                height: model.height
            });
            model1.setAttribute("position", model.position)
            model1.setAttribute("rotation", model.rotation)
            model1.setAttribute("material", {
                color: model.color
            })
            marker.appendChild(model1)
        } else {
            var model1 = document.createElement("a-entity")
            model1.setAttribute("id", `${modelName}`)
            model1.setAttribute("gltf-model", `url(${modelUrl})`)
            model1.setAttribute("scale", model.scale)
            model1.setAttribute("position", model.position)
            model.setAttribute("rotation", model.rotation)
            marker.appendChild(model1)
        }
    }})
