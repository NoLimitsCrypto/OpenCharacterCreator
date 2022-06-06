import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { apiService } from "../../services";
import { useGlobalState } from "../AuthContextWrap";
import PoseEditor from "./editor";
import SearchElements from "./search";
import "./style.scss";
import LeftRightSwitch from "./switch";
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `poses-tabpanel-${index}`, "aria-labelledby": `poses-tab-${index}`, ...other, children: value === index && (_jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { children: children }) })) }));
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
export default function Selector() {
    const { category, collection, setCollection, loadedMeshes, isLeft, meshType, updateMesh, search, } = useGlobalState();
    useEffect(() => {
        apiService
            .filterElements(search, collection, category.name)
            .then((res) => {
            setCollection(res.data);
        });
    }, [isLeft, search]);
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (_jsxs("div", { className: "selector-wrap", children: [_jsxs(Grid, { container: true, spacing: 2, className: "title-wrap", children: [_jsx(Grid, { item: true, xs: 8, p: "0", children: _jsxs("h2", { children: [category.sideIndicator && (isLeft ? "Left " : "Right "), category.name] }) }), _jsx(Grid, { item: true, xs: 4, p: "0", children: category && category.sideIndicator && _jsx(LeftRightSwitch, {}) }), _jsx(Grid, { item: true, xs: 12, pt: 0, className: "search-wrap", children: _jsx(SearchElements, {}) })] }), category && category.name === "pose" ? (_jsxs(React.Fragment, { children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: "divider" }, children: _jsxs(Tabs, { value: value, onChange: handleChange, "aria-label": "Pose Editor Switch", className: "tabs", children: [_jsx(Tab, { label: "Poses", ...a11yProps(0) }), _jsx(Tab, { label: "Editor", ...a11yProps(1) })] }) }), _jsxs(Scrollbars, { className: "scroll poses", children: [_jsx(TabPanel, { value: value, index: 0, children: _jsx(Grid, { container: true, spacing: 2, children: collection &&
                                        collection.map((item, index) => {
                                            return (_jsxs(Grid, { item: true, xs: 6, className: (!category.sideIndicator &&
                                                    loadedMeshes[meshType] === item.file) ||
                                                    (category.sideIndicator &&
                                                        loadedMeshes[meshType] ===
                                                            item.file[isLeft ? 0 : 1])
                                                    ? "selection-preview active"
                                                    : "selection-preview", onClick: () => updateMesh(category, item), children: [_jsx(Avatar, { alt: `${item.name}`, className: "avatar", src: item.img &&
                                                            "/img/library/" + category.name + "/" + item.img }), _jsx("span", { children: item.name })] }, index));
                                        }) }) }), _jsx(TabPanel, { value: value, index: 1, children: category && category.name === "pose" && _jsx(PoseEditor, {}) })] })] })) : (_jsx(Scrollbars, { className: "scroll", children: _jsx(Grid, { container: true, spacing: 2, className: "selection-list", children: collection &&
                        collection.map((item, index) => {
                            return (_jsxs(Grid, { item: true, xs: 6, className: (!category.sideIndicator &&
                                    loadedMeshes[meshType] === item.file) ||
                                    (category.sideIndicator &&
                                        loadedMeshes[meshType] === item.file[isLeft ? 0 : 1])
                                    ? "selection-preview active"
                                    : "selection-preview", onClick: () => updateMesh(category, item), children: [_jsx(Avatar, { alt: `${item.name}`, className: "avatar", src: item.img &&
                                            "/img/library/" + category.name + "/" + item.img }), _jsx("span", { children: item.name })] }, index));
                        }) }) }))] }));
}
