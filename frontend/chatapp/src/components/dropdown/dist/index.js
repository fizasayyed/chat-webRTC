"use client";
"use strict";
exports.__esModule = true;
var React = require("react");
var button_1 = require("@/components/ui/button");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var avatar_1 = require("../ui/avatar");
function DropdownMenuRadioGroupDemo(_a) {
    var setAvatarUrl = _a.setAvatarUrl;
    var _b = React.useState(""), position = _b[0], setPosition = _b[1];
    var handleSelect = function (value) {
        var avatarMap = {
            top: "/images/avatar-boy.jpg",
            bottom: "/images/avatar-old.jpg",
            right: "/images/avatar-girl.jpg"
        };
        setAvatarUrl(avatarMap[value] || "");
    };
    return (React.createElement(dropdown_menu_1.DropdownMenu, null,
        React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
            React.createElement(button_1.Button, { variant: "outline", size: "sm" }, "Appearance")),
        React.createElement(dropdown_menu_1.DropdownMenuContent, { className: "w-50", align: "start", sideOffset: 10 },
            React.createElement(dropdown_menu_1.DropdownMenuLabel, null, "Choose Avatar"),
            React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
            React.createElement(dropdown_menu_1.DropdownMenuRadioGroup, { value: position, onValueChange: function (value) {
                    setPosition(value);
                    handleSelect(value);
                } },
                React.createElement(dropdown_menu_1.DropdownMenuRadioItem, { value: "top" },
                    React.createElement(avatar_1.Avatar, null,
                        React.createElement(avatar_1.AvatarImage, { src: "/images/avatar-boy.jpg" }),
                        React.createElement(avatar_1.AvatarFallback, null, "AB")),
                    "\u00A0Gru"),
                React.createElement(dropdown_menu_1.DropdownMenuRadioItem, { value: "bottom" },
                    React.createElement(avatar_1.Avatar, null,
                        React.createElement(avatar_1.AvatarImage, { src: "/images/avatar-old.jpg" }),
                        React.createElement(avatar_1.AvatarFallback, null, "AO")),
                    "\u00A0Charles"),
                React.createElement(dropdown_menu_1.DropdownMenuRadioItem, { value: "right" },
                    React.createElement(avatar_1.Avatar, null,
                        React.createElement(avatar_1.AvatarImage, { src: "/images/avatar-girl.jpg" }),
                        React.createElement(avatar_1.AvatarFallback, null, "AG")),
                    "\u00A0Ayra")))));
}
exports["default"] = DropdownMenuRadioGroupDemo;
