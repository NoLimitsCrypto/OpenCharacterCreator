import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useGlobalState } from "../AuthContextWrap";
import Selector from "./selector";
import "./style.scss";
export default function MeshSelector() {
    const { categories, category } = useGlobalState();
    return (_jsxs("div", { className: "mesh-selector-wrap", children: [_jsx("nav", { "aria-label": "main category selector", children: _jsx(List, { className: "categories-wrap", children: categories &&
                        categories.map((cat, index) => {
                            return (_jsx(ListItem, { className: category && category.name === cat.name
                                    ? "mesh-nav-item active"
                                    : "mesh-nav-item", children: _jsx(Avatar, { alt: `${cat.name}`, className: "icon", src: `/img/graphics_creation/${cat.imgfile}` }) }, index));
                        }) }) }), _jsx(Selector, {})] }));
}
