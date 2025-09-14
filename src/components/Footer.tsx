import { Container, HStack, Icon, Link, Stack, Text } from '@chakra-ui/react';
import { SiGithub, SiX } from 'react-icons/si';
import { Copyright } from './Copyright';
import { GiNautilusShell } from 'react-icons/gi';

export const Footer = () => (
    <Container as="footer" py={{ base: '10', md: '12' }}>
        <Stack gap="5" mx="2">
            <Stack direction="row" justify="space-between">
                <HStack align="start" gap="4">
                    <Icon size="2xl">
                        <GiNautilusShell />
                    </Icon>
                    <Text fontSize="xl" color="fg">Legacy Immortal</Text>
                </HStack>
                <HStack gap="4">
                    {socialLinks.map(({ href, icon }, index) => (
                        <Link key={index} href={href} colorPalette="gray" target="_blank" rel="noopener noreferrer">
                            <Icon size="md">{icon}</Icon>
                        </Link>
                    ))}
                </HStack>
            </Stack>
            <Copyright />
        </Stack>
    </Container>
)

const socialLinks = [
    { href: 'https://x.com', icon: <SiX /> },
    { href: 'https://github.com', icon: <SiGithub /> },
]
