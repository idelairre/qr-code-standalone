import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import React from "react"
import { ColorModeProvider } from "./color-mode"

export function Provider(props: React.PropsWithChildren) {
    return (
        <ChakraProvider value={defaultSystem}>
            <ColorModeProvider>
                {props.children}
            </ColorModeProvider>
        </ChakraProvider>
    )
}
