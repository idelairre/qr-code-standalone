import {
   Alert,
   Box,
   Button,
   ColorPicker,
   createListCollection,
   Field,
   Fieldset,
   FileUpload,
   HStack,
   parseColor,
   Portal,
   Progress,
   Select,
   SimpleGrid,
   Slider,
   Text,
   VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaIcons } from "react-icons/fa";
import { LuCopy, LuFileImage, LuRefreshCw, LuTrash } from "react-icons/lu";
import type { DotType } from "../utils/qrStyling";
import IconPicker from "./IconPicker";
import { useColorModeValue } from "./ui/color-mode";

interface QRCodeSettingsProps {
   qrSize: "sm" | "md" | "lg" | "xl" | "2xl";
   setQrSize: (size: "sm" | "md" | "lg" | "xl" | "2xl") => void;
   qrColor: string;
   setQrColor: (color: string) => void;
   dotsType: DotType;
   setDotsType: (t: DotType) => void;
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
   onIconSelect: (
      iconName: string,
      iconComponent: React.ComponentType<{ size?: number }> | React.ReactElement,
   ) => void;
   onFileUpload: (file: File) => Promise<void>;
   onRemoveLogo: () => void;
   onReset: () => void;
   onCopyQRData: () => void;
   qrType: "vcard" | "text" | "url" | "email" | "sms";
   vcardVersion: "2.1" | "3.0" | "4.0" | "mecard";
   logoImageMargin: number;
   setLogoImageMargin: (px: number) => void;
   logoImageMarginSliderMax: number;
   /** Tighter spacing and wider control grids. */
   compact?: boolean;
   /** Single-row module controls on large screens (studio layout). */
   studio?: boolean;
}

const QRCodeSettings: React.FC<QRCodeSettingsProps> = ({
   qrSize,
   setQrSize,
   qrColor,
   setQrColor,
   dotsType,
   setDotsType,
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
   logoImageMargin,
   setLogoImageMargin,
   logoImageMarginSliderMax,
   compact = false,
   studio = false,
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

   const dotsStyleCollection = createListCollection({
      items: [
         { label: "Square (classic)", value: "square" },
         { label: "Rounded", value: "rounded" },
         { label: "Dots", value: "dots" },
         { label: "Classy rounded", value: "classy-rounded" },
         { label: "Extra rounded", value: "extra-rounded" },
      ],
   });

   return (
      <Box w="full" pt={studio ? 0 : compact ? 1 : 2}>
         <Text
            mb={studio ? 2 : compact ? 2 : 3}
            fontSize={studio ? "xs" : "sm"}
            fontWeight="semibold"
            color={studio ? "fg.muted" : textColor}
            textTransform={studio ? "uppercase" : undefined}
            letterSpacing={studio ? "0.06em" : undefined}
         >
            Style & export
         </Text>

         <Fieldset.Root>
            <Fieldset.Legend fontSize="xs" fontWeight="semibold" mb={2} textTransform="uppercase">
               Module style
            </Fieldset.Legend>
            <Fieldset.Content w="full">
               <SimpleGrid
                  w="full"
                  columns={
                     studio
                        ? { base: 1, sm: 2, lg: 4 }
                        : compact
                          ? { base: 1, md: 2, xl: 3 }
                          : { base: 1, md: 2 }
                  }
                  gap={compact ? 2 : 3}
               >
                  <Field.Root w="full" minW={0}>
                     <Field.Label textStyle="sm">Size</Field.Label>
                     <Select.Root
                        w="full"
                        collection={qrSizesCollection}
                        value={[qrSize]}
                        size="sm"
                        onValueChange={(e) =>
                           setQrSize(e.value[0] as "sm" | "md" | "lg" | "xl" | "2xl")
                        }
                     >
                        <Select.HiddenSelect />
                        <Select.Control w="full">
                           <Select.Trigger w="full">
                              <Select.ValueText placeholder="Size" />
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
                  <Field.Root w="full" minW={0}>
                     <Field.Label textStyle="sm">Foreground</Field.Label>
                     <ColorPicker.Root
                        value={parseColor(qrColor)}
                        onValueChange={(details) => setQrColor(details.value.toString("hex"))}
                        w="full"
                        size="sm"
                     >
                        <ColorPicker.HiddenInput />
                        <ColorPicker.Control w="full">
                           <ColorPicker.Input w="full" />
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
                  <Field.Root w="full" minW={0}>
                     <Field.Label textStyle="sm">Dot style</Field.Label>
                     <Select.Root
                        w="full"
                        collection={dotsStyleCollection}
                        value={[dotsType]}
                        size="sm"
                        onValueChange={(e) => setDotsType(e.value[0] as DotType)}
                     >
                        <Select.HiddenSelect />
                        <Select.Control w="full">
                           <Select.Trigger w="full">
                              <Select.ValueText placeholder="Dots" />
                           </Select.Trigger>
                           <Select.IndicatorGroup>
                              <Select.Indicator />
                           </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                           <Select.Positioner>
                              <Select.Content>
                                 {dotsStyleCollection.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                       {item.label}
                                       <Select.ItemIndicator />
                                    </Select.Item>
                                 ))}
                              </Select.Content>
                           </Select.Positioner>
                        </Portal>
                     </Select.Root>
                  </Field.Root>
                  <Field.Root w="full" minW={0}>
                     <Field.Label textStyle="sm">Error correction</Field.Label>
                     <Select.Root
                        w="full"
                        collection={errorLevelsCollection}
                        value={[errorLevel]}
                        size="sm"
                        onValueChange={(e) => setErrorLevel(e.value[0] as "L" | "M" | "Q" | "H")}
                     >
                        <Select.HiddenSelect />
                        <Select.Control w="full">
                           <Select.Trigger w="full">
                              <Select.ValueText placeholder="EC level" />
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
               </SimpleGrid>
            </Fieldset.Content>
         </Fieldset.Root>

         <Box mt={compact ? 2 : 4} w="full" minW={0}>
            <Text mb={2} fontSize="sm" fontWeight="semibold" color={textColor}>
               Logo
            </Text>
            <VStack gap={compact ? 2 : 3} align="stretch" w="full" minW={0}>
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
                  <FileUpload.Trigger asChild>
                     <Button w="full" mb={1} size="sm" variant="outline">
                        <HStack gap={2}>
                           <LuFileImage size={16} />
                           <Text fontSize="sm">
                              {isConverting
                                 ? "Converting..."
                                 : showLogo
                                   ? "Change logo"
                                   : "Upload logo (PNG/SVG)"}
                           </Text>
                        </HStack>
                     </Button>
                  </FileUpload.Trigger>

                  {showLogo && logoFile && (
                     <FileUpload.ItemGroup>
                        <FileUpload.Item file={logoFile}>
                           <FileUpload.ItemPreviewImage boxSize="8" objectFit="cover" />
                           <FileUpload.ItemName fontSize="sm" />
                           <FileUpload.ItemDeleteTrigger onClick={onRemoveLogo} />
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
                     <Progress.Root value={conversionProgress} size="sm" colorPalette="blue">
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
                  size="sm"
                  w="full"
                  onClick={() => setIsIconPickerOpen(true)}
               >
                  {selectedIconName && selectedIconComponent ? (
                     <HStack gap={2} align="center">
                        {typeof selectedIconComponent === "function"
                           ? React.createElement(selectedIconComponent, { size: 16 })
                           : selectedIconComponent}
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
                  <Field.Root w="full">
                     <HStack justify="space-between" align="center" mb={1}>
                        <Field.Label fontSize="sm" fontWeight="medium" mb={0}>
                           Logo padding
                        </Field.Label>
                        <Text fontSize="sm" color={subtextColor} fontVariantNumeric="tabular-nums">
                           {logoImageMargin}px
                        </Text>
                     </HStack>
                     <Box w="full" minW={0} py={1}>
                        <Slider.Root
                           w="full"
                           minW={0}
                           orientation="horizontal"
                           colorPalette="blue"
                           variant="outline"
                           value={[
                              Math.min(
                                 logoImageMargin,
                                 Number.isFinite(logoImageMarginSliderMax)
                                    ? logoImageMarginSliderMax
                                    : 32,
                              ),
                           ]}
                           onValueChange={(d) =>
                              setLogoImageMargin(
                                 Math.min(
                                    d.value[0],
                                    Number.isFinite(logoImageMarginSliderMax)
                                       ? logoImageMarginSliderMax
                                       : 32,
                                 ),
                              )
                           }
                           min={0}
                           max={Math.max(
                              Number.isFinite(logoImageMarginSliderMax)
                                 ? logoImageMarginSliderMax
                                 : 32,
                              0,
                           )}
                           step={1}
                           size="sm"
                        >
                           <Slider.Control w="full" minW={0} flex="1">
                              <Slider.Track flex="1">
                                 <Slider.Range />
                              </Slider.Track>
                              <Slider.Thumbs />
                           </Slider.Control>
                        </Slider.Root>
                     </Box>
                     <Field.HelperText fontSize="xs">
                        Extra space around the logo inside the cleared center; the image shrinks so no
                        additional modules are hidden.
                     </Field.HelperText>
                  </Field.Root>
               )}

               {showLogo && (
                  <Button
                     size="sm"
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
                     SVG logo will be embedded in the center of the QR code. High error correction
                     (H) is recommended when using logos.
                  </Text>
               )}
            </VStack>
         </Box>

         <SimpleGrid columns={{ base: 1, md: 2 }} gap={compact ? 2 : 3} mt={compact ? 2 : 4} w="full">
            <Button onClick={onReset} variant="outline" w="full" size="sm">
               <LuRefreshCw style={{ marginRight: "8px" }} />
               Reset
            </Button>
            <Button onClick={onCopyQRData} variant="outline" w="full" size="sm">
               <LuCopy style={{ marginRight: "8px" }} />
               Copy{" "}
               {qrType === "vcard"
                  ? vcardVersion === "mecard"
                     ? "MECARD"
                     : `vCard ${vcardVersion}`
                  : "Data"}
            </Button>
         </SimpleGrid>

         {/* Keep mounted so Dialog can run close cleanup (scroll lock, focus trap, pointer guard). */}
         <IconPicker
            isOpen={isIconPickerOpen}
            onClose={() => setIsIconPickerOpen(false)}
            onSelectIcon={onIconSelect}
            selectedIcon={selectedIconName}
         />
      </Box>
   );
};

export default QRCodeSettings;
