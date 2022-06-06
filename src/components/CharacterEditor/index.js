import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useGlobalState } from "../GlobalProvider";
import logo from "../../assets/media/logo-dark.png";
import Scene from "../Scene";
import RandomizeButton from "../Randomize";
import { apiService } from "../../services";
import "./style.scss";
import { NavLink } from "react-router-dom";
import DownloadCharacter from "../Download";
import ConnectMint from "../ConnectMint";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import LoadingOverlayCircularStatic from "../LoadingOverlays";
export default function CharacterEditor(props) {
    const { setScene, scene, setModel, setTemplateInfo, templateInfo, randomize, setRandomize, template, setLoadingModelProgress } = useGlobalState();
    const [loadingModel, setLoadingModel] = React.useState(false);
    function getLibrary(provider) {
        const library = new Web3Provider(provider);
        library.pollingInterval = 12000;
        return library;
    }
    React.useEffect(() => {
        apiService.fetchTemplate(template ?? "default").then((res) => {
            setTemplateInfo(res);
        });
    }, [template]);
    React.useEffect(() => {
        if (templateInfo?.file && templateInfo?.format) {
            setLoadingModel(true);
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            loader
                .loadAsync(templateInfo?.file, (e) => {
                setLoadingModelProgress(e.loaded * 100 / e.total);
            })
                .then((model) => {
                setLoadingModel(false);
                console.log(model.scene);
                setScene(model.scene);
                setModel(model);
            });
            /*
            threeService
              .loadModel(
                templateInfo?.file,
                templateInfo?.format
              )
              .then((model: any) => {
                if (model.scene) {
                  console.log(model.scene);
                  setScene(model.scene);
                  setModel(model);
                }
              });
              */
        }
    }, [templateInfo?.file]);
    React.useEffect(() => {
        if (scene?.children && templateInfo?.editor && randomize) {
            console.log("Randomized!!!");
            //threeService.randomizeMeshes(scene, templateInfo).then(() => {
            //setRandomize(false);
            //});
        }
    }, [randomize]);
    return (_jsxs(React.Fragment, { children: [loadingModel && _jsx(LoadingOverlayCircularStatic, {}), _jsx(RandomizeButton, {}), _jsx(DownloadCharacter, {}), _jsx(Web3ReactProvider, { getLibrary: getLibrary, children: _jsx(ConnectMint, {}) }), _jsx(NavLink, { to: "/", children: _jsx("img", { src: logo, alt: "", className: "logo" }) }), _jsx(Scene, { editor: "generator", wrapClass: "generator" })] }));
}
