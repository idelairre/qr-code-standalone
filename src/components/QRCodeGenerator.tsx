import { Badge, Button, Card, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useRef } from "react";
import { LuDownload } from "react-icons/lu";
import StyledQRCode, { type StyledQRCodeHandle } from "./StyledQRCode";

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
   const subtextColor = "gray.400";
   const qrRef = useRef<StyledQRCodeHandle>(null);

   return (
      <VStack gap={4} className={className}>
         <Card.Root>
            <Card.Body gap={4}>
               <StyledQRCode
                  ref={qrRef}
                  value={value}
                  size={size}
                  color={color}
                  backgroundColor="#ffffff"
                  errorLevel={errorLevel}
               />

               {showDownload && (
                  <Button
                     colorScheme="blue"
                     size="sm"
                     mt={3}
                     onClick={() => {
                        void qrRef.current?.download(fileName, "png");
                     }}
                  >
                     <LuDownload style={{ marginRight: "8px" }} />
                     Download
                  </Button>
               )}
            </Card.Body>
         </Card.Root>

         {showInfo && (
            <VStack gap={2} align="stretch" w="full">
               <Flex justify="space-between" align="center">
                  <Badge colorScheme="blue">{value.length} characters</Badge>
                  <Badge colorScheme="green">Error Correction: {errorLevel}</Badge>
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
