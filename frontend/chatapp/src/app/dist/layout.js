"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var utils_1 = require("@/lib/utils");
var inter = google_1.Inter({
    subsets: ['latin'],
    weight: '400'
});
exports.metadata = {
    title: "Chat App",
    description: "By Fiza Sayyed"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: utils_1.cn("min-h-screen bg-background antialiased", inter.className) }, children)));
}
exports["default"] = RootLayout;
