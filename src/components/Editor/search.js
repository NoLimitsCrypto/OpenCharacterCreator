import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SearchIcon from "@mui/icons-material/Search";
import { useGlobalState } from "../AuthContextWrap";
export default function SearchElements() {
    const { search, setSearch } = useGlobalState();
    return (_jsxs("div", { children: [_jsx(SearchIcon, { className: "search-icon" }), _jsx("input", { type: "text", placeholder: "Search", value: search, onChange: (e) => setSearch(e.target.value) })] }));
}
