import React, { useState } from "react";
import {
    Container,
    Heading,
    Text,
    VStack,
    Box,
    Select,
    Portal,
} from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { createListCollection } from "@chakra-ui/react";
import { ContactInfo, generateQRData } from "../utils/vcardUtils";
import SimpleQRInputs from "./SimpleQRInputs";
import ContactForm from "./ContactForm";
import QRCodeSettings from "./QRCodeSettings";
import QRCodePreview from "./QRCodePreview";
import potrace from 'potrace';

const QRCodePage: React.FC = () => {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        firstName: "Ian",
        lastName: "Delairre",
        middleName: "",
        prefix: "",
        suffix: "",
        organization: "Legacy Immortal",
        orgUnit: "",
        title: "CTO",
        phone: "+639178888888",
        phoneType: "CELL",
        email: "ian@legacyimmortal.com",
        emailType: "WORK",
        url: "https://legacyimmortal.com",
        note: "Scan to connect!",
        // Address fields
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        // Additional vCard 4.0 fields
        birthday: "",
        gender: "",
        anniversary: "",
    });

    const [qrType, setQrType] = useState<"vcard" | "text" | "url" | "email" | "sms">("vcard");
    const [vcardVersion, setVcardVersion] = useState<"2.1" | "3.0" | "4.0" | "mecard">("3.0");
    const [showV4Warning, setShowV4Warning] = useState(false);
    const [v4WarningDismissed, setV4WarningDismissed] = useState(false);
    const [qrSize, setQrSize] = useState<"sm" | "md" | "lg" | "xl" | "2xl">("2xl");
    const [qrColor, setQrColor] = useState("#000000");
    const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
    const [showLogo, setShowLogo] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoSvgContent, setLogoSvgContent] = useState<string>("");

    // PNG to SVG conversion state
    const [isConverting, setIsConverting] = useState(false);
    const [conversionProgress, setConversionProgress] = useState(0);
    const [conversionError, setConversionError] = useState<string>("");
    // Simple QR code data
    const [simpleText, setSimpleText] = useState("Hello, scan me!");
    const [simpleUrl, setSimpleUrl] = useState("https://legacyimmortal.com");
    const [simpleEmail, setSimpleEmail] = useState("ian@legacyimmortal.com");
    const [simpleSms, setSimpleSms] = useState("+639178888888");

    // MECARD specific fields
    const [mecardNickname, setMecardNickname] = useState("");
    const [mecardBirthday, setMecardBirthday] = useState("");

    // Icon picker state
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [selectedIconName, setSelectedIconName] = useState<string>("");
    const [selectedIconComponent, setSelectedIconComponent] = useState<React.ComponentType<{ size?: number }> | React.ReactElement | null>(null);

    // Color mode values
    const textColor = useColorModeValue("gray.900", "gray.50");

    // Select collections
    const qrTypesCollection = createListCollection({
        items: [
            { label: "vCard (Contact Info)", value: "vcard" },
            { label: "Plain Text", value: "text" },
            { label: "Website URL", value: "url" },
            { label: "Email Address", value: "email" },
            { label: "SMS Message", value: "sms" },
        ],
    });

    const qrData = generateQRData(
        qrType,
        contactInfo,
        vcardVersion,
        simpleText,
        simpleUrl,
        simpleEmail,
        simpleSms
    );

    const handleInputChange = (field: keyof ContactInfo, value: string) => {
        setContactInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleVcardVersionChange = (version: string) => {
        setVcardVersion(version as "2.1" | "3.0" | "4.0" | "mecard");
        if (version === "4.0") {
            setShowV4Warning(true);
            setV4WarningDismissed(false);
        } else {
            setShowV4Warning(false);
        }
    };

    const handleCloseV4Warning = () => {
        setV4WarningDismissed(true);
        setShowV4Warning(false);
    };

    const handleReset = () => {
        setContactInfo({
            firstName: "Ian",
            lastName: "Delairre",
            middleName: "",
            prefix: "",
            suffix: "",
            organization: "Legacy Immortal",
            orgUnit: "",
            title: "CTO",
            phone: "+639178888888",
            phoneType: "CELL",
            email: "ian@legacyimmortal.com",
            emailType: "WORK",
            url: "https://legacyimmortal.com",
            note: "Scan to connect!",
            // Address fields
            streetAddress: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            // Additional vCard 4.0 fields
            birthday: "",
            gender: "",
            anniversary: "",
        });
        setQrType("vcard");
        setVcardVersion("3.0");
        setShowV4Warning(false);
        setV4WarningDismissed(false);
        setQrSize("2xl");
        setQrColor("#000000");
        setErrorLevel("H");
        setSimpleText("Hello, scan me!");
        setSimpleUrl("https://legacyimmortal.com");
        setSimpleEmail("ian@legacyimmortal.com");
        setSimpleSms("+639178888888");
        setMecardNickname("");
        setMecardBirthday("");
        setSelectedIconName("");
        setSelectedIconComponent(null);
        removeLogo();
    };

    const copyQRData = () => {
        navigator.clipboard.writeText(qrData);
        // Simple alert since useToast is not available
        alert("QR code data copied to clipboard!");
    };

    const handleIconSelect = (iconName: string, iconComponent: React.ComponentType<{ size?: number }> | React.ReactElement) => {
        setSelectedIconName(iconName);
        setSelectedIconComponent(iconComponent);
        setShowLogo(true); // Show logo overlay when icon is selected
        setIsIconPickerOpen(false);

        // Clear SVG logo when icon is selected
        setLogoFile(null);
        setLogoSvgContent("");
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoSvgContent("");
        setShowLogo(false);
        setSelectedIconName("");
        setSelectedIconComponent(null);
    };

    // PNG to SVG conversion function
    const convertPngToSvg = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            setIsConverting(true);
            setConversionProgress(0);
            setConversionError("");

            const reader = new FileReader();

            reader.onload = (e) => {
                const buffer = e.target?.result as ArrayBuffer;
                if (!buffer) {
                    reject(new Error("Failed to read file"));
                    return;
                }

                // Convert ArrayBuffer to Buffer for potrace
                const nodeBuffer = Buffer.from(buffer);

                setConversionProgress(25);

                potrace.trace(nodeBuffer, {
                    threshold: 128,
                    color: '#000000',
                    background: 'transparent',
                    optCurve: true,
                    optTolerance: 0.4,
                    turdSize: 2,
                }, (err, svg) => {
                    setConversionProgress(100);
                    setIsConverting(false);

                    if (err) {
                        setConversionError(`Conversion failed: ${err.message}`);
                        reject(err);
                    } else {
                        resolve(svg);
                    }
                });
            };

            reader.onerror = () => {
                setIsConverting(false);
                setConversionError("Failed to read file");
                reject(new Error("Failed to read file"));
            };

            reader.readAsArrayBuffer(file);
        });
    };

    // Handle file upload with conversion
    const handleFileUpload = async (file: File) => {
        setLogoFile(file);

        if (file.type === 'image/svg+xml') {
            // Direct SVG upload
            const svgText = await file.text();
            setLogoSvgContent(svgText);
            setShowLogo(true);
            setSelectedIconName("");
            setSelectedIconComponent(null);
        } else if (file.type.startsWith('image/')) {
            // Convert PNG/JPG to SVG
            try {
                const svgContent = await convertPngToSvg(file);
                setLogoSvgContent(svgContent);
                setShowLogo(true);
                setSelectedIconName("");
                setSelectedIconComponent(null);
            } catch (error) {
                console.error('Conversion failed:', error);
            }
        }
    };

    return (
        <Container maxW="container.xl" py={8} px={{ base: 8, md: 10, lg: 12 }}>
            <VStack gap={8} align="stretch">
                <VStack gap={{ base: 6, lg: 8 }} align="stretch">
                    {/* Form Section */}
                    <VStack gap={6} align="stretch">
                        <Heading size="lg" mb={2}>Contact Information</Heading>
                        {/* QR Type Selection */}
                        <Box>
                            <Text mb={2} fontWeight="medium" color={textColor}>QR Code Type</Text>
                            <Select.Root
                                collection={qrTypesCollection}
                                value={[qrType]}
                                onValueChange={(e) => setQrType(e.value[0] as "vcard" | "text" | "url" | "email" | "sms")}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select QR code type" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {qrTypesCollection.items.map((type) => (
                                                <Select.Item key={type.value} item={type}>
                                                    {type.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Box>

                        {/* Simple QR Code Inputs */}
                        <SimpleQRInputs
                            qrType={qrType}
                            simpleText={simpleText}
                            setSimpleText={setSimpleText}
                            simpleUrl={simpleUrl}
                            setSimpleUrl={setSimpleUrl}
                            simpleEmail={simpleEmail}
                            setSimpleEmail={setSimpleEmail}
                            simpleSms={simpleSms}
                            setSimpleSms={setSimpleSms}
                        />

                        {/* vCard Form - Only show when vCard is selected */}
                        {qrType === "vcard" && (
                            <ContactForm
                                contactInfo={contactInfo}
                                onInputChange={handleInputChange}
                                vcardVersion={vcardVersion}
                                onVcardVersionChange={handleVcardVersionChange}
                                showV4Warning={showV4Warning && !v4WarningDismissed}
                                onCloseV4Warning={handleCloseV4Warning}
                                mecardNickname={mecardNickname}
                                setMecardNickname={setMecardNickname}
                                mecardBirthday={mecardBirthday}
                                setMecardBirthday={setMecardBirthday}
                            />
                        )}

                        {/* QR Code Settings - Always visible */}
                        <QRCodeSettings
                            qrSize={qrSize}
                            setQrSize={setQrSize}
                            qrColor={qrColor}
                            setQrColor={setQrColor}
                            errorLevel={errorLevel}
                            setErrorLevel={setErrorLevel}
                            showLogo={showLogo}
                            logoFile={logoFile}
                            isConverting={isConverting}
                            conversionProgress={conversionProgress}
                            conversionError={conversionError}
                            isIconPickerOpen={isIconPickerOpen}
                            setIsIconPickerOpen={setIsIconPickerOpen}
                            selectedIconName={selectedIconName}
                            selectedIconComponent={selectedIconComponent}
                            onIconSelect={handleIconSelect}
                            onFileUpload={handleFileUpload}
                            onRemoveLogo={removeLogo}
                            onReset={handleReset}
                            onCopyQRData={copyQRData}
                            qrType={qrType}
                            vcardVersion={vcardVersion}
                        />
                    </VStack>

                    {/* QR Code Preview Section */}
                    <QRCodePreview
                        qrData={qrData}
                        qrSize={qrSize}
                        qrColor={qrColor}
                        errorLevel={errorLevel}
                        showLogo={showLogo}
                        logoSvgContent={logoSvgContent}
                        selectedIconComponent={selectedIconComponent}
                        qrType={qrType}
                        vcardVersion={vcardVersion}
                    />
                </VStack>
            </VStack>
        </Container>
    );
};

export default QRCodePage;
