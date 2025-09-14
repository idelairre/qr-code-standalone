import React from "react";
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Badge,
    Flex,
    Separator,
    Card,
} from "@chakra-ui/react";
import { QrCode } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
import { useColorModeValue } from "./ui/color-mode";
import LogoComponent from "./LogoComponent";

interface QRCodePreviewProps {
    qrData: string;
    qrSize: "sm" | "md" | "lg" | "xl" | "2xl";
    qrColor: string;
    errorLevel: "L" | "M" | "Q" | "H";
    showLogo: boolean;
    logoSvgContent: string;
    selectedIconComponent: React.ComponentType<{ size?: number }> | React.ReactElement | null;
    qrType: "vcard" | "text" | "url" | "email" | "sms";
    vcardVersion: "2.1" | "3.0" | "4.0" | "mecard";
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
    qrData,
    qrSize,
    qrColor,
    errorLevel,
    showLogo,
    logoSvgContent,
    selectedIconComponent,
    qrType,
    vcardVersion,
}) => {
    const textColor = useColorModeValue("gray.900", "gray.50");
    const previewBg = useColorModeValue("gray.25", "gray.800");
    const previewBorder = useColorModeValue("gray.300", "gray.600");
    const previewTextColor = useColorModeValue("gray.800", "gray.100");
    const previewKeywordColor = useColorModeValue("blue.600", "blue.300");
    const previewValueColor = useColorModeValue("green.700", "green.300");
    const cardBorder = useColorModeValue("gray.200", "gray.700");

    return (
        <Card.Root
            bg="bg"
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="md"
            p={6}
        >
            <Card.Header>
                <Heading size="lg" textAlign="center" mb={2}>QR Code Preview</Heading>
            </Card.Header>
            <Card.Body>
                <VStack gap={6} align="center" w="full">
                    <Box position="relative" display="inline-block">
                        <QrCode.Root
                            value={qrData}
                            size={qrSize}
                            encoding={{ ecc: errorLevel }}
                            maxWidth="100%"
                        >
                            <QrCode.Frame
                                style={{
                                    fill: qrColor,
                                    backgroundColor: "white"
                                }}
                            >
                                <QrCode.Pattern />
                            </QrCode.Frame>

                            {showLogo && (logoSvgContent || selectedIconComponent) && (
                                <QrCode.Overlay bg="white">
                                    <LogoComponent
                                        svgContent={logoSvgContent}
                                        iconComponent={selectedIconComponent || undefined}
                                        color={qrColor}
                                    />
                                </QrCode.Overlay>
                            )}
                        </QrCode.Root>

                        <Button
                            colorScheme="blue"
                            size="md"
                            w="full"
                            mt={4}
                            onClick={() => {
                                // Trigger the hidden download
                                const hiddenTrigger = document.getElementById('hidden-download-trigger');
                                if (hiddenTrigger) {
                                    hiddenTrigger.click();
                                }
                            }}
                        >
                            <LuDownload style={{ marginRight: "8px" }} />
                            Download QR Code
                        </Button>

                        {/* Hidden QR code for download */}
                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                            <QrCode.Root
                                value={qrData}
                                size={qrSize}
                                encoding={{ ecc: errorLevel }}
                            >
                                <QrCode.Frame
                                    style={{
                                        fill: qrColor,
                                        backgroundColor: "white"
                                    }}
                                >
                                    <QrCode.Pattern />
                                </QrCode.Frame>
                                {showLogo && (logoSvgContent || selectedIconComponent) && (
                                    <QrCode.Overlay bg="white">
                                        <LogoComponent
                                            svgContent={logoSvgContent}
                                            iconComponent={selectedIconComponent || undefined}
                                            color={qrColor}
                                        />
                                    </QrCode.Overlay>
                                )}
                                <QrCode.DownloadTrigger
                                    fileName={`${qrType === "vcard" ? `${vcardVersion}-${qrType}` : qrType}-qr.png`}
                                    mimeType="image/png"
                                >
                                    <div id="hidden-download-trigger" />
                                </QrCode.DownloadTrigger>
                            </QrCode.Root>
                        </div>
                    </Box>

                    <VStack gap={4} align="stretch" w="full">
                        <HStack alignSelf="stretch">
                            <Separator flex="1" />
                            <Text fontWeight="medium" textStyle="sm" color={textColor}>
                                {qrType === "vcard"
                                    ? `${vcardVersion === "mecard" ? "MECARD" : `vCard ${vcardVersion}`} Data Preview`
                                    : "QR Code Data Preview"}
                            </Text>
                            <Separator flex="1" />
                        </HStack>
                        <Box
                            p={4}
                            bg={previewBg}
                            mx={-4}
                            fontSize="sm"
                            overflowY="auto"
                            border="1px solid"
                            borderColor={previewBorder}
                            borderRadius="md"
                            lineHeight="1.5"
                            fontFamily="Fira Code"
                        >
                            {qrType === "vcard" ? (
                                <Box as="pre" fontFamily="Fira Code" fontSize="inherit" whiteSpace="pre-wrap" color={previewTextColor}>
                                    {qrData.split('\n').map((line, index) => {
                                        if (line.startsWith('BEGIN:') || line.startsWith('END:')) {
                                            return (
                                                <Box key={index} as="span" color={previewKeywordColor} fontWeight="semibold">
                                                    {line}
                                                </Box>
                                            );
                                        } else if (line.includes(':')) {
                                            const [key, ...valueParts] = line.split(':');
                                            const value = valueParts.join(':');
                                            return (
                                                <Box key={index} as="span">
                                                    <Box as="span" color={previewKeywordColor} fontWeight="medium">
                                                        {key}:
                                                    </Box>
                                                    <Box as="span" color={previewValueColor}>
                                                        {value}
                                                    </Box>
                                                </Box>
                                            );
                                        }
                                        return (
                                            <Box key={index} as="span" color={previewTextColor}>
                                                {line}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Box as="pre" whiteSpace="pre-wrap" color={previewTextColor}>
                                    {qrData}
                                </Box>
                            )}
                        </Box>
                        <Flex justify="space-between" align="center" gap={2}>
                            <Badge colorScheme="blue" variant="subtle">
                                {qrData.length} characters
                            </Badge>
                            <Badge colorScheme="green" variant="subtle">
                                Error Correction: {errorLevel}
                            </Badge>
                        </Flex>
                    </VStack>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default QRCodePreview;
