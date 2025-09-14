import React from "react";
import { Box } from "@chakra-ui/react";

interface LogoComponentProps {
    svgContent?: string;
    iconComponent?: React.ComponentType<{ size?: number }> | React.ReactElement;
    color: string;
}

const LogoComponent: React.FC<LogoComponentProps> = ({ svgContent, iconComponent, color }) => {
    // If we have an icon component, render it
    if (iconComponent) {
        try {
            // Check if iconComponent is a function (component) or a JSX element
            if (typeof iconComponent === 'function') {
                return (
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={color}
                        fontSize="2xl"
                    >
                        {React.createElement(iconComponent, { size: 24 })}
                    </Box>
                );
            } else {
                // If it's a JSX element, render it directly
                return (
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={color}
                        fontSize="2xl"
                    >
                        {iconComponent}
                    </Box>
                );
            }
        } catch (error) {
            console.error('Error rendering icon component:', error);
            return null;
        }
    }

    // Otherwise, parse the SVG content to extract the path data
    if (!svgContent) return null;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');

    if (!svgElement) return null;

    // Get viewBox or create default
    const viewBox = svgElement.getAttribute('viewBox') || '0 0 40 40';

    // Find the first path element
    const pathElement = svgElement.querySelector('path');
    if (!pathElement) return null;

    const pathData = pathElement.getAttribute('d');
    if (!pathData) return null;

    return (
        <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="40px"
            height="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="white"
            p={1}
        >
            <svg
                className="qr-logo-svg"
                width="24"
                height="24"
                viewBox={viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    color: color,
                }}
            >
                <path
                    d={pathData}
                    fill="currentColor"
                />
            </svg>
        </Box>
    );
};

export default LogoComponent;
