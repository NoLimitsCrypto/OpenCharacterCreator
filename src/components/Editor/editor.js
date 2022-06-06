import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import "./style.scss";
import { useGlobalState } from "../AuthContextWrap";
export default function PoseEditor() {
    const { bones, rotationParameters } = useGlobalState();
    console.log("ROTATIONS: ", rotationParameters && rotationParameters);
    // Round the rotation parameter number to 2 decimals
    const roundNumber = (number) => {
        return Math.round(number * 100) / 100;
    };
    return (_jsx("div", { children: _jsx(Grid, { container: true, className: "pose-editor-wrap", children: bones && rotationParameters &&
                bones.map((bone, index) => {
                    return (_jsxs(Grid, { item: true, xs: 12, className: "pose-wrap", children: [_jsx(Typography, { variant: "h4", children: bone.name }), _jsxs("div", { className: "slider", children: [_jsx(Typography, { variant: "h5", className: "geo", children: "X:" }), _jsx(Slider, { size: "small", defaultValue: roundNumber(rotationParameters[bone.bone].x), min: -3.1, max: 3.1, step: 0.1, valueLabelDisplay: "auto", onChange: (e) => {
                                            window.changeRotation(bone.bone, e.target.value, "x");
                                        } })] }), _jsxs("div", { className: "slider", children: [_jsx(Typography, { variant: "h5", className: "geo", children: "Y:" }), _jsx(Slider, { size: "small", defaultValue: roundNumber(rotationParameters[bone.bone].y), min: -3.1, max: 3.1, step: 0.1, "aria-label": "Small", valueLabelDisplay: "auto", onChange: (e) => {
                                            window.changeRotation(bone.bone, e.target.value, "y");
                                        } })] }), _jsxs("div", { className: "slider", children: [_jsx(Typography, { variant: "h5", className: "geo", children: "Z:" }), _jsx(Slider, { size: "small", defaultValue: roundNumber(rotationParameters[bone.bone].z), min: -3.1, max: 3.1, step: 0.1, "aria-label": "Small", valueLabelDisplay: "auto", onChange: (e) => {
                                            window.changeRotation(bone.bone, e.target.value, "z");
                                        } })] })] }, index));
                }) }) }));
}
