import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { VRMLoader } from "three/examples/jsm/loaders/VRMLoader";
import { Buffer } from "buffer";
import html2canvas from "html2canvas";
import { VRM } from "@pixiv/three-vrm";
export const threeService = {
    loadModel,
    loadModelRandomized,
    randomize,
    randomizeMeshes,
    updatePose,
    updateMorphValue,
    getMorphValue,
    download,
    getMesh,
    setMaterialColor,
    getObjectValue,
    saveScreenShotByElementId,
    getScreenShotByElementId,
    getModelFromScene
};
async function getModelFromScene(scene, format) {
    if (format && format === 'gltf/glb') {
        const exporter = new GLTFExporter();
        var options = {
            trs: false,
            onlyVisible: true,
            truncateDrawRange: true,
            binary: true,
            forcePowerOfTwoTextures: false,
            maxTextureSize: 1024 || Infinity
        };
        const glb = await new Promise((resolve) => exporter.parse(scene, resolve, options));
        return new Blob([glb], { type: 'model/gltf-binary' });
    }
}
async function getScreenShotByElementId(id) {
    let snapShotElement = document.getElementById(id);
    return await html2canvas(snapShotElement).then(async function (canvas) {
        var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        const base64Data = Buffer.from(dataURL.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const blob = new Blob([base64Data], { type: "image/jpeg" });
        console.log("BLOB: ", blob);
        return blob;
    });
}
async function saveScreenShotByElementId(id) {
    setTimeout(() => {
        setTimeout(() => {
            getScreenShotByElementId(id).then((screenshot) => {
                const link = document.createElement("a");
                link.style.display = "none";
                document.body.appendChild(link);
                function save(blob, filename) {
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                }
                function saveArrayBuffer(buffer) {
                    save(new Blob([buffer], { type: "image/json" }), "screenshot.jpg");
                }
                saveArrayBuffer(screenshot);
            });
        }, 600);
    }, 600);
}
async function getObjectValue(target, scene, value) {
    if (target && scene) {
        const object = scene.getObjectByName(target);
        return object.material.color;
    }
}
function createTextCanvas(text) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = 11 + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#a22813";
    context.font = 18 + "px  Arial";
    context.miterLimit = 5;
    context.lineWidth = 3;
    context.strokeStyle = "white";
    context.strokeText(text, 45, 130);
    context.fillStyle = "red";
    context.fillText(text, 45, 130);
    context.clientWidth = 560;
    context.clientHeight = 560;
    context.background = "#FFFFFF";
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.flipY = false;
    return texture;
}
const addTextNew = (scene) => {
    const shirt = scene.getObjectByName("futbolka");
    const mesh = scene.getObjectByName("number");
    const random = ("0" + Math.floor(Math.random() * 99)).slice(-2);
    if (!mesh) {
        const mesh = shirt.clone();
        const material = new THREE.MeshBasicMaterial({
            map: createTextCanvas(random),
            transparent: true,
        });
        mesh.material = material;
        mesh.material.transparent = true;
        mesh.name = "number";
        scene.add(mesh);
    }
    else {
        const material = new THREE.MeshBasicMaterial({
            map: createTextCanvas(random),
            transparent: true,
        });
        mesh.material = material;
        mesh.material.transparent = true;
    }
};
async function getMesh(name, scene) {
    const object = scene.getObjectByName(name);
    return object;
}
async function setMaterialColor(scene, value, target) {
    if (scene && value) {
        const object = scene.getObjectByName(target);
        const randColor = value;
        const skinShade = new THREE.Color(`rgb(${randColor},${randColor},${randColor})`);
        object.material.color.set(skinShade);
    }
}
async function randomizeMeshes(scene, info) {
    const object = scene.getObjectByName("model");
    const randColor = Math.floor(Math.random() * 255) + 30;
    const skinShade = new THREE.Color(`rgb(${randColor},${randColor},${randColor})`);
    object.material.color.set(skinShade);
    const shirt = scene.getObjectByName("futbolka");
    const short = scene.getObjectByName("shorts001");
    //const belt = scene.getObjectByName("belt_3");
    console.log("OLD", shirt.material);
    let randItem = info.editor.textures[1].collection[Math.floor(Math.random() * info.editor.textures[1].collection.length)];
    let directory = info.directory;
    var loader = new THREE.TextureLoader();
    loader.load(directory + randItem.texture.base, function (texture) {
        texture.needsUpdate = true;
        texture.flipY = false;
        shirt.material.map = texture;
        short.material.map = texture;
        //addTextNew(scene);
        //belt.material.map = texture;
    });
    loader.load(directory + randItem.texture.normal, function (texture) {
        texture.needsUpdate = true;
        texture.flipY = false;
        shirt.material.normalMap = texture;
        short.material.normalMap = texture;
        //addTextNew(scene);
        //belt.material.map = texture;
    });
    loader.load(directory + randItem.texture.rough, function (texture) {
        texture.needsUpdate = true;
        texture.flipY = false;
        shirt.material.roughnessMap = texture;
        short.material.roughnessMap = texture;
        //addTextNew(scene);
        //belt.material.map = texture;
    });
    info.editor.meshes.map((mesh) => {
        let randItem = mesh.collection[Math.floor(Math.random() * mesh.collection.length)];
        mesh.collection.map((items) => {
            if (items?.name) {
                if (items?.target !== randItem?.target) {
                    const object = scene.getObjectByName(items.target);
                    object.visible = false;
                }
                else {
                    const object = scene.getObjectByName(items.target);
                    object.visible = true;
                }
            }
        });
    });
}
async function loadModel(file, type) {
    if (type && type === "gltf/glb" && file) {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        //dracoLoader.setDecoderPath("../node_modules/three/examples/js/libs/draco/");
        //loader.setDRACOLoader(dracoLoader);
        return loader.loadAsync(file, (e) => {
            console.log(e.loaded);
        }).then((model) => {
            return model;
        });
    }
    if (type && type === "vrm" && file) {
        const loader = new VRMLoader();
        return loader.loadAsync(file).then((model) => {
            VRM.from(model).then((vrm) => {
                console.log("VRM Model: ", vrm);
            });
            return model;
        });
    }
}
async function loadModelRandomized(file, type, variables) {
    if (file && type && variables) {
        const model = loadModel(file, type).then((mod) => {
            variables.shapes?.map((shape) => {
                shape.keys?.map((key) => {
                    const randomValue = Math.random();
                    shape.targets.map((target) => {
                        var mesh = mod.scene.getObjectByName(target);
                        const index = mesh.morphTargetDictionary[key.name];
                        if (index !== undefined) {
                            mesh.morphTargetInfluences[index] = randomValue;
                        }
                    });
                });
            });
            return mod;
        });
        return Promise.all([model]);
    }
}
async function randomize(scene, info) {
    console.log(info);
    if (scene && info) {
        info.editor?.shapes?.map((shape) => {
            shape.keys.map((key) => {
                const randomValue = Math.random();
                shape.targets.map((target) => {
                    var mesh = scene.getObjectByName(target);
                    const index = mesh.morphTargetDictionary[key.name];
                    if (index !== undefined) {
                        mesh.morphTargetInfluences[index] = randomValue;
                    }
                });
            });
        });
    }
}
async function getMorphValue(key, scene, target) {
    if (key && scene) {
        var mesh = scene.getObjectByName(target);
        const index = mesh.morphTargetDictionary[key];
        if (index !== undefined) {
            return mesh.morphTargetInfluences[index];
        }
    }
}
async function updateMorphValue(key, value, scene, targets) {
    if (key && targets && value) {
        targets.map((target) => {
            var mesh = scene.getObjectByName(target);
            const index = mesh.morphTargetDictionary[key];
            if (index !== undefined) {
                mesh.morphTargetInfluences[index] = value;
            }
        });
    }
}
async function updatePose(name, value, axis, scene) {
    var bone = scene.getObjectByName(name);
    if (bone instanceof THREE.Bone) {
        switch (axis) {
            case "x":
                bone.rotation.x = value;
                break;
            case "y":
                bone.rotation.y = value;
                break;
            case "z":
                bone.rotation.z = value;
                break;
            default:
        }
        return value;
    }
}
async function download(model, fileName, format, screenshot) {
    // We can use the SaveAs() from file-saver, but as I reviewed a few solutions for saving files,
    // this approach is more cross browser/version tested then the other solutions and doesn't require a plugin.
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    function save(blob, filename) {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
    function saveString(text, filename) {
        save(new Blob([text], { type: "text/plain" }), filename);
    }
    function saveArrayBuffer(buffer, filename) {
        save(new Blob([buffer], { type: "application/octet-stream" }), filename);
    }
    // Specifying the name of the downloadable model
    const downloadFileName = `${fileName && fileName !== "" ? fileName : "CharacterCreatorModel"}`;
    if (format && format === "gltf/glb") {
        const exporter = new GLTFExporter();
        var options = {
            trs: false,
            onlyVisible: false,
            truncateDrawRange: true,
            binary: true,
            forcePowerOfTwoTextures: false,
            maxTextureSize: 1024 || Infinity,
        };
        exporter.parse(model.scene, function (result) {
            if (result instanceof ArrayBuffer) {
                console.log(result);
                saveArrayBuffer(result, `${downloadFileName}.glb`);
            }
            else {
                var output = JSON.stringify(result, null, 2);
                saveString(output, `${downloadFileName}.gltf`);
            }
        }, options);
    }
    else if (format && format === "obj") {
        const exporter = new OBJExporter();
        saveArrayBuffer(exporter.parse(model.scene), `${downloadFileName}.obj`);
    }
    else if (format && format === "vrm") {
        model.userData.gltfExtensions = { VRM: {} };
        console.log("VRM ModelAAAAAA: ", model);
        VRM.from(model).then((vrm) => {
            console.log("VRM Model: ", vrm);
            //saveArrayBuffer(vrm, `${downloadFileName}.vrm`);
        });
    }
}
