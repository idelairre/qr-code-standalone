import React from "react";
import { Button, VStack, Text, Badge, Flex, Card } from "@chakra-ui/react";
import { QrCode } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";

interface QRCodeGeneratorProps {
    value: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    color?: string;
    errorLevel?: "L" | "M" | "Q" | "H";
    fileName?: string;
    showDownload?: boolean;
    showInfo?: boolean;
    className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    value,
    size = "md",
    color = "#000000",
    errorLevel = "H",
    fileName = "qr-code.png",
    showDownload = true,
    showInfo = false,
    className,
}) => {
    // Color mode values
    const subtextColor = "gray.400";
    return (
        <VStack gap={4} className={className}>
            <Card.Root>
                <Card.Body gap={4}>
                    <QrCode.Root
                        value={value}
                        size={size}
                        encoding={{ ecc: errorLevel }}
                    >
                        <QrCode.Frame style={{ fill: color }}>
                            <QrCode.Pattern />
                        </QrCode.Frame>

                        {showDownload && (
                            <QrCode.DownloadTrigger
                                asChild
                                fileName={fileName}
                                mimeType="image/png"
                            >
                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    mt={3}
                                >
                                    <LuDownload style={{ marginRight: "8px" }} />
                                    Download
                                </Button>
                            </QrCode.DownloadTrigger>
                        )}
                    </QrCode.Root>
                </Card.Body>
            </Card.Root>

            {showInfo && (
                <VStack gap={2} align="stretch" w="full">
                    <Flex justify="space-between" align="center">
                        <Badge colorScheme="blue">
                            {value.length} characters
                        </Badge>
                        <Badge colorScheme="green">
                            Error Correction: {errorLevel}
                        </Badge>
                    </Flex>
                    <Text fontSize="xs" color={subtextColor} textAlign="center">
                        Scan with any QR code reader
                    </Text>
                </VStack>
            )}
        </VStack>
    );
};

export default QRCodeGenerator;
