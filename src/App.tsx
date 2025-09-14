import React from "react";
import { Box, HStack, VStack, Text, Icon, Container, Stack } from "@chakra-ui/react";
import QRCodePage from "./components/QRCodePage";
import { ColorModeButton } from "./components/ui/color-mode";
import { Footer } from "./components/Footer";
import { BsQrCode } from "react-icons/bs";

export default function App() {
    return (
        <Box minH="100vh" bg="bg" color="fg">
            {/* Header */}
            <Box
                as="header"
                bg="bg/80"
            >
                <Container>
                    <Stack mt={10} mx={8}>
                        {/* Brand Section */}
                        <HStack justify="space-between" align="center">
                            <HStack align="center" gap={4}>
                                <Icon size="2xl" color="fg">
                                    <BsQrCode size={48} />
                                </Icon>
                                <VStack gap={2}>
                                    <Text fontSize={{ base: 'lg', md: 'xl' }} color="fg" fontFamily="Fira Code">
                                        Embedded vCard QR Code Generator
                                    </Text>
                                </VStack>
                            </HStack>
                            <ColorModeButton />
                        </HStack>

                        {/* App Description - Mobile Only */}
                        <Text
                            fontSize="sm"
                            color="fg.muted"
                            textAlign="center"
                            display={{ base: 'block', md: 'none' }}
                        >
                            Create vCard QR codes with custom logos and icons
                        </Text>
                    </Stack>
                </Container>
            </Box>

            {/* Main Content */}
            <Box as="main">
                <QRCodePage />
            </Box>

            {/* Footer */}
            <Footer />
        </Box>
    );
}
