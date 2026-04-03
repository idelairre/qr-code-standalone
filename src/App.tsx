import { Box, Container, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { BsQrCode } from "react-icons/bs";
import { Footer } from "./components/Footer";
import QRCodePage from "./components/QRCodePage";
import { ColorModeButton } from "./components/ui/color-mode";

export default function App() {
   return (
      <Box minH="100vh" bg="bg" color="fg">
         {/* Header */}
         <Box as="header" bg="bg/80">
            <Container>
               <Stack mt={{ base: 4, md: 6 }} mb={2} mx={{ base: 4, md: 8 }}>
                  <HStack justify="space-between" align="center">
                     <HStack align="center" gap={3}>
                        <Icon size="xl" color="fg">
                           <BsQrCode size={36} />
                        </Icon>
                        <VStack gap={0} align="flex-start">
                           <Text
                              fontSize={{ base: "md", md: "lg" }}
                              color="fg"
                              fontFamily="Fira Code"
                              fontWeight="semibold"
                           >
                              vCard QR Generator
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
                     display={{ base: "block", md: "none" }}
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
