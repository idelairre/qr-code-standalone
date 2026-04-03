import { Field, Input, SimpleGrid } from "@chakra-ui/react";
import React from "react";

interface SimpleQRInputsProps {
   qrType: "vcard" | "text" | "url" | "email" | "sms";
   simpleText: string;
   setSimpleText: (value: string) => void;
   simpleUrl: string;
   setSimpleUrl: (value: string) => void;
   simpleEmail: string;
   setSimpleEmail: (value: string) => void;
   simpleSms: string;
   setSimpleSms: (value: string) => void;
}

const SimpleQRInputs: React.FC<SimpleQRInputsProps> = ({
   qrType,
   simpleText,
   setSimpleText,
   simpleUrl,
   setSimpleUrl,
   simpleEmail,
   setSimpleEmail,
   simpleSms,
   setSimpleSms,
}) => {
   if (qrType === "vcard") return null;

   const field = (label: string, node: React.ReactNode) => (
      <Field.Root w="full" minW={0}>
         <Field.Label textStyle="sm">{label}</Field.Label>
         {node}
      </Field.Root>
   );

   if (qrType === "text") {
      return (
         <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={3}>
            {field(
               "Text",
               <Input
                  w="full"
                  size="sm"
                  value={simpleText}
                  onChange={(e) => setSimpleText(e.target.value)}
                  placeholder="Text to encode"
               />,
            )}
         </SimpleGrid>
      );
   }

   if (qrType === "url") {
      return (
         <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={3}>
            {field(
               "URL",
               <Input
                  w="full"
                  size="sm"
                  value={simpleUrl}
                  onChange={(e) => setSimpleUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
               />,
            )}
         </SimpleGrid>
      );
   }

   if (qrType === "email") {
      return (
         <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={3}>
            {field(
               "Email",
               <Input
                  w="full"
                  size="sm"
                  value={simpleEmail}
                  onChange={(e) => setSimpleEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
               />,
            )}
         </SimpleGrid>
      );
   }

   if (qrType === "sms") {
      return (
         <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={3}>
            {field(
               "Phone",
               <Input
                  w="full"
                  size="sm"
                  value={simpleSms}
                  onChange={(e) => setSimpleSms(e.target.value)}
                  placeholder="+1 555 0100"
                  type="tel"
               />,
            )}
         </SimpleGrid>
      );
   }

   return null;
};

export default SimpleQRInputs;
