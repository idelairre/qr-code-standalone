import {
   Box,
   Container,
   createListCollection,
   Grid,
   GridItem,
   Heading,
   HStack,
   Portal,
   Select,
   Text,
   useBreakpointValue,
   VStack,
} from "@chakra-ui/react";
import potrace from "potrace";
import React, { useState } from "react";
import type { DotType } from "../utils/qrStyling";
import { ContactInfo, createEmptyContactInfo, generateQRData } from "../utils/vcardUtils";
import ContactForm, { FormPanel } from "./ContactForm";
import QRCodePreview from "./QRCodePreview";
import QRCodeSettings from "./QRCodeSettings";
import SimpleQRInputs from "./SimpleQRInputs";
import { useColorModeValue } from "./ui/color-mode";

const QRCodePage: React.FC = () => {
   const [contactInfo, setContactInfo] = useState<ContactInfo>(createEmptyContactInfo);

   const [qrType, setQrType] = useState<"vcard" | "text" | "url" | "email" | "sms">("vcard");
   const [vcardVersion, setVcardVersion] = useState<"2.1" | "3.0" | "4.0" | "mecard">("2.1");
   const [showV4Warning, setShowV4Warning] = useState(false);
   const [v4WarningDismissed, setV4WarningDismissed] = useState(false);
   const [qrSize, setQrSize] = useState<"sm" | "md" | "lg" | "xl" | "2xl">("md");
   const [qrColor, setQrColor] = useState("#000000");
   const [dotsType, setDotsType] = useState<DotType>("square");
   const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
   const [showLogo, setShowLogo] = useState(false);
   const [logoFile, setLogoFile] = useState<File | null>(null);
   const [logoSvgContent, setLogoSvgContent] = useState<string>("");

   const [isConverting, setIsConverting] = useState(false);
   const [conversionProgress, setConversionProgress] = useState(0);
   const [conversionError, setConversionError] = useState<string>("");
   const [simpleText, setSimpleText] = useState("");
   const [simpleUrl, setSimpleUrl] = useState("");
   const [simpleEmail, setSimpleEmail] = useState("");
   const [simpleSms, setSimpleSms] = useState("");

   const [mecardNickname, setMecardNickname] = useState("");
   const [mecardBirthday, setMecardBirthday] = useState("");

   const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
   const [selectedIconName, setSelectedIconName] = useState<string>("");
   const [selectedIconComponent, setSelectedIconComponent] = useState<
      React.ComponentType<{ size?: number }> | React.ReactElement | null
   >(null);

   const stickyBg = useColorModeValue("bg", "bg");
   const canvasBg = useColorModeValue("gray.50", "gray.950");
   const canvasBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
   const canvasShadow = useColorModeValue("sm", "none");
   const toolbarBorder = useColorModeValue("blackAlpha.80", "whiteAlpha.80");

   const studioLayout = useBreakpointValue({ base: false, lg: true }) ?? false;
   const qrPreviewLayout = useBreakpointValue<"studio" | "default" | "compact">({
      base: "compact",
      md: "default",
      lg: "studio",
   }) ?? "compact";

   const qrTypesCollection = createListCollection({
      items: [
         { label: "vCard (contact)", value: "vcard" },
         { label: "Plain text", value: "text" },
         { label: "URL", value: "url" },
         { label: "Email", value: "email" },
         { label: "SMS", value: "sms" },
      ],
   });

   const qrData = generateQRData(
      qrType,
      contactInfo,
      vcardVersion,
      simpleText,
      simpleUrl,
      simpleEmail,
      simpleSms,
      mecardNickname,
      mecardBirthday,
   );

   const handleInputChange = (field: keyof ContactInfo, value: string) => {
      setContactInfo((prev) => ({ ...prev, [field]: value }));
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
      setContactInfo(createEmptyContactInfo());
      setQrType("vcard");
      setVcardVersion("2.1");
      setShowV4Warning(false);
      setV4WarningDismissed(false);
      setQrSize("md");
      setQrColor("#000000");
      setDotsType("square");
      setErrorLevel("H");
      setSimpleText("");
      setSimpleUrl("");
      setSimpleEmail("");
      setSimpleSms("");
      setMecardNickname("");
      setMecardBirthday("");
      setSelectedIconName("");
      setSelectedIconComponent(null);
      removeLogo();
   };

   const copyQRData = () => {
      navigator.clipboard.writeText(qrData);
      alert("QR code data copied to clipboard!");
   };

   const handleIconSelect = (
      iconName: string,
      iconComponent: React.ComponentType<{ size?: number }> | React.ReactElement,
   ) => {
      setSelectedIconName(iconName);
      setSelectedIconComponent(iconComponent);
      setShowLogo(true);
      setIsIconPickerOpen(false);
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

            const nodeBuffer = Buffer.from(buffer);
            setConversionProgress(25);

            potrace.trace(
               nodeBuffer,
               {
                  threshold: 128,
                  color: "#000000",
                  background: "transparent",
                  optCurve: true,
                  optTolerance: 0.4,
                  turdSize: 2,
               },
               (err, svg) => {
                  setConversionProgress(100);
                  setIsConverting(false);

                  if (err) {
                     setConversionError(`Conversion failed: ${err.message}`);
                     reject(err);
                  } else {
                     resolve(svg);
                  }
               },
            );
         };

         reader.onerror = () => {
            setIsConverting(false);
            setConversionError("Failed to read file");
            reject(new Error("Failed to read file"));
         };

         reader.readAsArrayBuffer(file);
      });
   };

   const handleFileUpload = async (file: File) => {
      setLogoFile(file);

      if (file.type === "image/svg+xml") {
         const svgText = await file.text();
         setLogoSvgContent(svgText);
         setShowLogo(true);
         setSelectedIconName("");
         setSelectedIconComponent(null);
      } else if (file.type.startsWith("image/")) {
         try {
            const svgContent = await convertPngToSvg(file);
            setLogoSvgContent(svgContent);
            setShowLogo(true);
            setSelectedIconName("");
            setSelectedIconComponent(null);
         } catch (error) {
            console.error("Conversion failed:", error);
         }
      }
   };

   const previewProps = {
      qrData,
      qrSize,
      qrColor,
      errorLevel,
      dotsType,
      showLogo,
      logoSvgContent,
      selectedIconComponent,
      qrType,
      vcardVersion,
   } as const;

   const formBody = (
      <VStack gap={studioLayout ? 4 : 5} align="stretch" minW={0}>
         <HStack
            flexWrap="wrap"
            align={{ base: "stretch", sm: "flex-end" }}
            justify="space-between"
            gap={{ base: 3, md: 4 }}
            rowGap={3}
            pb={5}
            borderBottomWidth="1px"
            borderColor={toolbarBorder}
         >
            <VStack align="flex-start" gap={1} minW="min(100%, 200px)" flex="1">
               <Heading size="sm" fontWeight="semibold" letterSpacing="-0.02em">
                  Build your QR code
               </Heading>
               <Text fontSize="xs" color="fg.muted" lineHeight="1.45" maxW="md">
                  Choose what to encode; the preview on the left updates as you edit.
               </Text>
            </VStack>
            <HStack flexWrap="wrap" gap={2} align="flex-end" minW="min(100%, 240px)">
               <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  display={{ base: "none", sm: "block" }}
               >
                  Payload
               </Text>
               <Box flex="1" minW="min(100%, 220px)" maxW="320px">
                  <Select.Root
                     collection={qrTypesCollection}
                     value={[qrType]}
                     size="sm"
                     onValueChange={(e) =>
                        setQrType(e.value[0] as "vcard" | "text" | "url" | "email" | "sms")
                     }
                  >
                     <Select.HiddenSelect />
                     <Select.Control>
                        <Select.Trigger w="full">
                           <Select.ValueText placeholder="Type" />
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
            </HStack>
         </HStack>

         {qrType !== "vcard" && (
            <FormPanel title="Payload" compact={studioLayout}>
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
            </FormPanel>
         )}

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
               density={studioLayout ? "compact" : "default"}
               panelLayout={studioLayout ? "bento" : "linear"}
            />
         )}

         <QRCodeSettings
            qrSize={qrSize}
            setQrSize={setQrSize}
            qrColor={qrColor}
            setQrColor={setQrColor}
            dotsType={dotsType}
            setDotsType={setDotsType}
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
            compact={studioLayout}
            studio={studioLayout}
         />
      </VStack>
   );

   return (
      <Container maxW="1600px" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
         <Box
            maxH={{ base: "none", lg: "calc(100dvh - 8.5rem)" }}
            overflowY={{ base: "visible", lg: "auto" }}
            overflowX="hidden"
            css={{ scrollbarGutter: "stable" }}
         >
            <Grid
               templateColumns={{
                  base: "1fr",
                  lg: "minmax(268px, 300px) minmax(0, 1fr)",
               }}
               gap={{ base: 6, lg: 8 }}
               alignItems="start"
            >
               <GridItem>
                  <Box
                     position={{ lg: "sticky" }}
                     top={{ lg: 4 }}
                     zIndex={2}
                     bg={{ lg: stickyBg }}
                     borderRadius={{ lg: "2xl" }}
                     pb={{ base: 0, lg: 1 }}
                  >
                     <QRCodePreview layout={qrPreviewLayout} {...previewProps} />
                  </Box>
               </GridItem>

               <GridItem minW={0}>
                  <Box
                     borderRadius="2xl"
                     borderWidth="1px"
                     borderColor={canvasBorder}
                     bg={canvasBg}
                     p={{ base: 4, lg: 6 }}
                     boxShadow={canvasShadow}
                  >
                     {formBody}
                  </Box>
               </GridItem>
            </Grid>
         </Box>
      </Container>
   );
};

export default QRCodePage;
