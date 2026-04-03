import {
   Badge,
   Box,
   Button,
   Card,
   Flex,
   Heading,
   HStack,
   Separator,
   Text,
   VStack,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { LuDownload } from "react-icons/lu";
import type { DotType } from "../utils/qrStyling";
import StyledQRCode, { type StyledQRCodeHandle } from "./StyledQRCode";
import { useColorModeValue } from "./ui/color-mode";

interface QRCodePreviewProps {
   qrData: string;
   qrSize: "sm" | "md" | "lg" | "xl" | "2xl";
   qrColor: string;
   errorLevel: "L" | "M" | "Q" | "H";
   dotsType: DotType;
   showLogo: boolean;
   logoSvgContent: string;
   selectedIconComponent: React.ComponentType<{ size?: number }> | React.ReactElement | null;
   qrType: "vcard" | "text" | "url" | "email" | "sms";
   vcardVersion: "2.1" | "3.0" | "4.0" | "mecard";
   /** default: large; compact: mobile; wrapped: dense sidebar; studio: sticky rail + minimal chrome */
   layout?: "default" | "compact" | "wrapped" | "studio";
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
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
   layout = "default",
}) => {
   const textColor = useColorModeValue("gray.900", "gray.50");
   const previewBg = useColorModeValue("gray.25", "gray.800");
   const previewBorder = useColorModeValue("gray.300", "gray.600");
   const previewTextColor = useColorModeValue("gray.800", "gray.100");
   const previewKeywordColor = useColorModeValue("blue.600", "blue.300");
   const previewValueColor = useColorModeValue("green.700", "green.300");
   const cardBorder = useColorModeValue("gray.200", "gray.700");

   const qrRef = useRef<StyledQRCodeHandle>(null);
   const fileStem =
      qrType === "vcard"
         ? `${vcardVersion === "mecard" ? "mecard" : `vcard-${vcardVersion}`}`
         : qrType;

   const compact = layout === "compact";
   const wrapped = layout === "wrapped";
   const studio = layout === "studio";
   const tight = compact || wrapped || studio;
   const qrValue = qrData.trim() ? qrData : " ";
   const previewSizeMap = studio
      ? { sm: 168, md: 208, lg: 248, xl: 288, "2xl": 328 }
      : wrapped
        ? { sm: 160, md: 200, lg: 240, xl: 280, "2xl": 320 }
        : compact
          ? { sm: 140, md: 180, lg: 220, xl: 260, "2xl": 300 }
          : { sm: 260, md: 320, lg: 380, xl: 440, "2xl": 500 };
   const previewSizePx = previewSizeMap[qrSize];

   return (
      <Card.Root
         bg="bg"
         border="1px solid"
         borderColor={cardBorder}
         borderRadius={studio ? "2xl" : "lg"}
         p={tight ? 3 : 5}
         shadow={tight ? (studio ? "md" : "sm") : undefined}
      >
         <Card.Header pb={tight ? 2 : undefined}>
            <Heading size={studio || wrapped ? "sm" : compact ? "sm" : "lg"} textAlign="center">
               {studio ? "Preview" : wrapped ? "Live QR" : compact ? "Live QR" : "QR Code Preview"}
            </Heading>
         </Card.Header>
         <Card.Body pt={tight ? 2 : undefined}>
            <VStack gap={tight ? 3 : 6} align="center" w="full">
               <Box
                  position="relative"
                  display="inline-block"
                  w="full"
                  maxW={
                     studio || wrapped
                        ? "min(100%, 320px)"
                        : compact
                          ? "min(100%, 320px)"
                          : "min(100%, 560px)"
                  }
               >
                  <StyledQRCode
                     ref={qrRef}
                     value={qrValue}
                     size={qrSize}
                     renderSizePx={previewSizePx}
                     color={qrColor}
                     backgroundColor="#ffffff"
                     errorLevel={errorLevel}
                     dotsType={dotsType}
                     showLogo={showLogo}
                     logoSvgContent={logoSvgContent}
                     selectedIconComponent={selectedIconComponent}
                     responsive
                  />

                  <Button
                     colorScheme="blue"
                     size={tight ? "sm" : "md"}
                     w="full"
                     mt={tight ? 2 : 4}
                     onClick={() => {
                        void qrRef.current?.download(`${fileStem}-qr`, "png");
                     }}
                  >
                     <LuDownload style={{ marginRight: "8px" }} />
                     Download
                  </Button>
               </Box>

               <VStack gap={tight ? 2 : 4} align="stretch" w="full">
                  <HStack alignSelf="stretch">
                     <Separator flex="1" />
                     <Text fontWeight="medium" textStyle={tight ? "xs" : "sm"} color={textColor}>
                        {qrType === "vcard"
                           ? `${vcardVersion === "mecard" ? "MECARD" : `vCard ${vcardVersion}`} payload`
                           : "Encoded data"}
                     </Text>
                     <Separator flex="1" />
                  </HStack>
                  <Box
                     p={tight ? 2 : 4}
                     bg={previewBg}
                     mx={tight ? 0 : -4}
                     fontSize={tight ? "xs" : "sm"}
                     overflowY="auto"
                     maxH={
                        studio
                           ? "min(16vh, 96px)"
                           : wrapped
                             ? "min(20vh, 120px)"
                             : compact
                               ? "min(32vh, 200px)"
                               : "min(38vh, 360px)"
                     }
                     border="1px solid"
                     borderColor={previewBorder}
                     borderRadius="md"
                     lineHeight="1.5"
                     fontFamily="Fira Code"
                  >
                     {qrType === "vcard" ? (
                        <Box
                           as="pre"
                           fontFamily="Fira Code"
                           fontSize="inherit"
                           whiteSpace="pre-wrap"
                           color={previewTextColor}
                        >
                           {qrData.split("\n").map((line, index) => {
                              if (line.startsWith("BEGIN:") || line.startsWith("END:")) {
                                 return (
                                    <Box
                                       key={index}
                                       as="span"
                                       color={previewKeywordColor}
                                       fontWeight="semibold"
                                    >
                                       {line}
                                    </Box>
                                 );
                              }
                              if (line.includes(":")) {
                                 const [key, ...valueParts] = line.split(":");
                                 const value = valueParts.join(":");
                                 return (
                                    <Box key={index} as="span">
                                       <Box
                                          as="span"
                                          color={previewKeywordColor}
                                          fontWeight="medium"
                                       >
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
                  <Flex justify="space-between" align="center" gap={2} flexWrap="wrap">
                     <Badge colorScheme="blue" variant="subtle">
                        {qrData.length} chars
                     </Badge>
                     <Badge colorScheme="green" variant="subtle">
                        EC: {errorLevel}
                     </Badge>
                  </Flex>
               </VStack>
            </VStack>
         </Card.Body>
      </Card.Root>
   );
};

export default QRCodePreview;
