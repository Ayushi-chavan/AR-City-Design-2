modelList = []

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var models = await this.getModels();

    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");
      modelList.push({ model_name: modelName, barcode_value: barcodeValue });

      // Changing model Visiblity
      models[barcodeValue]["models"].map(item => {
        var model = document.querySelector(`#${item.model_name}-${barcodeValue}`);
        model.setAttribute("visible", true);
      });

      // Changing Atom Visiblity
      var atom = document.querySelector(`#${modelName}-${barcodeValue}`);
      atom.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = modelList.findIndex(x => x.model_name === modelName);
      if (index > -1) {
        modelList.splice(index, 1);
      }
    });
  },

  isModelPresentInArray: function (arr, val) {
    for(var i of arr){
        if(i.model_name === val){
            return true;
        }
    }
    return false;
  },


  tick: async function () {
    if (modelList.length > 1) {

      var isBaseModelPresent = this.isModelPresentInArray(modelList,"base")
      var messageText = document.querySelector("#message-text");

      if(!isBaseModelPresent){
        messageText.setAttribute("visible",true)
      } else {
        if(models === null){
          models = await this.getModels()
        }

        messageText.setAttribute("visible", false)
        this.placeTheModel("road",models)
        this.placeTheModel("car",models)
        this.placeTheModel("building1",models)
        this.placeTheModel("building2",models)
        this.placeTheModel("building3",models)
        this.placeTheModel("tree",models)
        this.placeTheModel("sun",models)
      }
    }
  },
  
  //Calculate distance between two position markers
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  
  countOccurrences: function (arr, val) {
    return arr.reduce((a, v) => (v.model_name === val ? a + 1 : a), 0);
  },
  getModelGeometry: function(models, modelName){
    var barcodes = Object.keys(models)
    for(var barcode of barcodes){
        if(models[barcode].model_name === modelName){
            return{
                position: model[barcode]["placement_position"],
                rotation: models[barcode]["placement_rotation"],
                scale: model[barcode]["placement_scale"],
                model_url: model[barcode["model_url"]]
            }
        }
    }
  },
  placeTheModel: function(modelName,models) {
    var isListContainModel = this.isModelPresentInArray(modelList,modelName)
    if (isListContainModel){
      var distance = null
      var marker1 = document.querySelector(`#marker-base`)
      var marker2 = document.querySelector(`#marker-${modelName}`)

      distance = this.getDistance(marker1, marker2)
      if(distance < 1.25){
        var model1 = document.querySelector(`#${modelName}`)
        model1.setAttribute("visible", false)

        // Checking Model placed or not in scene
        var isModelPlaced = document.querySelector(`#model-${modelName}`)
        if(isModelPlaced === null){
          var el = document.createElement("a-entity")
          var modelGeometry = this.getModelGeometry(models, modelName)
          el.setAttribute("id",`model-${modelName}`)
          el.setAttribute("gltf-model",`url(${modelGeometry.model_url})`)
          el.setAttribute("position",modelGeometry.position)
          el.setAttribute("rotation",modelGeometry.rotation)
          el.setAttribute("scale",modelGeometry.scale)
          marker1.appendChild(el)
        }
      }

    }

  },

  

  showModel: function (model) {
    //Hide elements
    modelList.map(item => {
      var el = document.querySelector(`#${item.model_name}-${item.barcode_value}`);
      el.setAttribute("visible", false);
    });
    //Show model
    var model = document.querySelector(`#${model.name}-${model.value}`);
    model.setAttribute("visible", true);
  },
  
  getModels: function () {
    // NOTE: Use ngrok server to get json values
    return fetch("js/modelList.json")
      .then(res => res.json())
      .then(data => data);
  },
});