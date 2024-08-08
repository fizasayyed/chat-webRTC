"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

function DropdownMenuRadioGroupDemo({ setAvatarUrl }) {
    const [position, setPosition] = React.useState("")
    const handleSelect = (value) => {
        const avatarMap = {
            top: "/images/avatar-boy.jpg",
            bottom: "/images/avatar-old.jpg",
            right: "/images/avatar-girl.jpg"
        };
        setAvatarUrl(avatarMap[value] || "");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Appearance</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50" align="start" sideOffset={10}>
                <DropdownMenuLabel>Choose Avatar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={(value) => {
                    setPosition(value);
                    handleSelect(value);
                }}>
                    <DropdownMenuRadioItem value="top">
                        <Avatar>
                            <AvatarImage src={"/images/avatar-boy.jpg"} />
                            <AvatarFallback>AB</AvatarFallback>
                        </Avatar>&nbsp;Gru
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">
                        <Avatar>
                            <AvatarImage src={"/images/avatar-old.jpg"} />
                            <AvatarFallback>AO</AvatarFallback>
                        </Avatar>&nbsp;Charles
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">
                        <Avatar>
                            <AvatarImage src={"/images/avatar-girl.jpg"} />
                            <AvatarFallback>AG</AvatarFallback>
                        </Avatar>&nbsp;Ayra
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownMenuRadioGroupDemo;