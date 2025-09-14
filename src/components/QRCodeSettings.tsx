import React from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Button,
    Field,
    Stack,
    Progress,
    Alert,
    ColorPicker,
    parseColor,
    Select,
    Portal,
    FileUpload,
} from "@chakra-ui/react";
import { LuFileImage, LuTrash, LuRefreshCw, LuCopy } from "react-icons/lu";
import { FaIcons } from "react-icons/fa";
import { useColorModeValue } from "./ui/color-mode";
import { createListCollection } from "@chakra-ui/react";
import IconPicker from './IconPicker';

interface QRCodeSettingsProps {
    qrSize: "sm" | "md" | "lg" | "xl" | "2xl";
    setQrSize: (size: "sm" | "md" | "lg" | "xl" | "2xl") => void;
    qrColor: string;
    setQrColor: (color: string) => void;
    errorLevel: "L" | "M" | "Q" | "H";
    setErrorLevel: (level: "L" | "M" | "Q" | "H") => void;
    showLogo: boolean;
    logoFile: File | null;
    isConverting: boolean;
    conversionProgress: number;
    conversionError: string;
    isIconPickerOpen: boolean;
    setIsIconPickerOpen: (open: boolean) => void;
    selectedIconName: string;
    selectedIconComponent: React.ComponentType<{ size?: number }> | React.ReactElement | null;
    onIconSelect: (iconName: string, iconComponent: React.ComponentType<{ size?: number }> | React.ReactElement) => void;
    onFileUpload: (file: File) => Promise<void>;
    onRemoveLogo: () => void;
    onReset: () => void;
    onCopyQRData: () => void;
    qrType: "vcard" | "text" | "url" | "email" | "sms";
    vcardVersion: "2.1" | "3.0" | "4.0" | "mecard";
}

const QRCodeSettings: React.FC<QRCodeSettingsProps> = ({
    qrSize,
    setQrSize,
    qrColor,
    setQrColor,
    errorLevel,
    setErrorLevel,
    showLogo,
    logoFile,
    isConverting,
    conversionProgress,
    conversionError,
    isIconPickerOpen,
    setIsIconPickerOpen,
    selectedIconName,
    selectedIconComponent,
    onIconSelect,
    onFileUpload,
    onRemoveLogo,
    onReset,
    onCopyQRData,
    qrType,
    vcardVersion,
}) => {
    const textColor = useColorModeValue("gray.900", "gray.50");
    const subtextColor = useColorModeValue("gray.600", "gray.300");

    const qrSizesCollection = createListCollection({
        items: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
            { label: "2X Large", value: "2xl" },
        ],
    });

    const errorLevelsCollection = createListCollection({
        items: [
            { label: "Low (7% recovery)", value: "L" },
            { label: "Medium (15% recovery)", value: "M" },
            { label: "Quartile (25% recovery)", value: "Q" },
            { label: "High (30% recovery)", value: "H" },
        ],
    });

    return (
        <Box borderColor="gray.200" pt={4}>
            <Text mb={4} fontWeight="medium" color={textColor}>QR Code Settings</Text>

            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Size</Field.Label>
                    <Select.Root
                        collection={qrSizesCollection}
                        value={[qrSize]}
                        onValueChange={(e) => setQrSize(e.value[0] as "sm" | "md" | "lg" | "xl" | "2xl")}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select size" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {qrSizesCollection.items.map((size) => (
                                        <Select.Item key={size.value} item={size}>
                                            {size.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>Color</Field.Label>
                    <ColorPicker.Root
                        value={parseColor(qrColor)}
                        onValueChange={(details) => setQrColor(details.value.toString('hex'))}
                        w="full"
                    >
                        <ColorPicker.HiddenInput />
                        <ColorPicker.Control>
                            <ColorPicker.Input />
                            <ColorPicker.Trigger />
                        </ColorPicker.Control>
                        <Portal>
                            <ColorPicker.Positioner>
                                <ColorPicker.Content>
                                    <ColorPicker.Area />
                                    <HStack>
                                        <ColorPicker.EyeDropper size="xs" variant="outline" />
                                        <ColorPicker.Sliders />
                                    </HStack>
                                </ColorPicker.Content>
                            </ColorPicker.Positioner>
                        </Portal>
                    </ColorPicker.Root>
                </Field.Root>
            </Stack>

            <Field.Root orientation="horizontal" mt={4}>
                <Field.Label>Error Correction</Field.Label>
                <Select.Root
                    collection={errorLevelsCollection}
                    value={[errorLevel]}
                    onValueChange={(e) => setErrorLevel(e.value[0] as "L" | "M" | "Q" | "H")}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select error correction" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {errorLevelsCollection.items.map((level) => (
                                    <Select.Item key={level.value} item={level}>
                                        {level.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Field.Root>

            <Box mt={4}>
                <Text mb={2} fontWeight="medium" color={textColor}>Logo Overlay</Text>
                <VStack gap={3} align="stretch">
                    <FileUpload.Root
                        accept=".svg,.png,.jpg,.jpeg"
                        maxFiles={1}
                        onFileAccept={async (details) => {
                            const file = details.files[0];
                            if (file) {
                                await onFileUpload(file);
                            }
                        }}
                    >
                        <FileUpload.HiddenInput />
                        <FileUpload.Trigger
                            as={Button}
                            w="full"
                            mb={1}
                            size="md"
                        >
                            <LuFileImage size={16} />
                            {isConverting ? "Converting..." : (showLogo ? "Change Logo" : "Upload Logo (PNG/SVG)")}
                        </FileUpload.Trigger>

                        {showLogo && logoFile && (
                            <FileUpload.ItemGroup>
                                <FileUpload.Item file={logoFile}>
                                    <FileUpload.ItemPreviewImage
                                        boxSize="8"
                                        objectFit="cover"
                                    />
                                    <FileUpload.ItemName fontSize="sm" />
                                    <FileUpload.ItemDeleteTrigger
                                        onClick={onRemoveLogo}
                                    />
                                </FileUpload.Item>
                            </FileUpload.ItemGroup>
                        )}
                    </FileUpload.Root>

                    {/* Conversion Progress */}
                    {isConverting && (
                        <Box>
                            <Text fontSize="sm" color={textColor} mb={2}>
                                Converting image to SVG...
                            </Text>
                            <Progress.Root
                                value={conversionProgress}
                                size="sm"
                                colorPalette="blue"
                            >
                                <Progress.Track>
                                    <Progress.Range />
                                </Progress.Track>
                            </Progress.Root>
                        </Box>
                    )}

                    {/* Conversion Error */}
                    {conversionError && (
                        <Alert.Root status="error" size="sm">
                            <Alert.Indicator />
                            <Alert.Content>
                                <Text fontSize="sm">{conversionError}</Text>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    <Button
                        variant="outline"
                        size="md"
                        w="full"
                        onClick={() => setIsIconPickerOpen(true)}
                    >
                        {selectedIconName && selectedIconComponent ? (
                            <HStack gap={2} align="center">
                                {typeof selectedIconComponent === 'function' ? (
                                    React.createElement(selectedIconComponent, { size: 16 })
                                ) : (
                                    selectedIconComponent
                                )}
                                <Text fontSize="sm">{selectedIconName}</Text>
                            </HStack>
                        ) : (
                            <HStack gap={2} align="center">
                                <FaIcons size={16} />
                                <Text fontSize="sm">Pick Icon</Text>
                            </HStack>
                        )}
                    </Button>

                    {showLogo && (
                        <Button
                            size="md"
                            variant="outline"
                            onClick={onRemoveLogo}
                            colorScheme="red"
                            w="full"
                        >
                            <LuTrash />
                            Remove
                        </Button>
                    )}

                    {showLogo && (
                        <Text fontSize="xs" color={subtextColor}>
                            SVG logo will be embedded in the center of the QR code.
                            High error correction (H) is recommended when using logos.
                        </Text>
                    )}
                </VStack>
            </Box>

            <VStack gap={4} mt={4} align="stretch" w="full">
                <Button
                    onClick={onReset}
                    variant="outline"
                    w="full"
                    size="md"
                >
                    <LuRefreshCw style={{ marginRight: "8px" }} />
                    Reset
                </Button>
                <Button
                    onClick={onCopyQRData}
                    variant="outline"
                    w="full"
                    size="md"
                >
                    <LuCopy style={{ marginRight: "8px" }} />
                    Copy {qrType === "vcard" ? (vcardVersion === "mecard" ? "MECARD" : `vCard ${vcardVersion}`) : "Data"}
                </Button>
            </VStack>

            {/* Icon Picker Modal */}
            {isIconPickerOpen && (
                <IconPicker
                    isOpen={isIconPickerOpen}
                    onClose={() => setIsIconPickerOpen(false)}
                    onSelectIcon={onIconSelect}
                    selectedIcon={selectedIconName}
                />
            )}
        </Box>
    );
};

export default QRCodeSettings;
