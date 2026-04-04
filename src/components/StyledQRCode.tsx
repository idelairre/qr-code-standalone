import { Box } from "@chakra-ui/react";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
   buildQrCodeStylingOptions,
   QR_SIZE_PX,
   QRCodeStyling,
   resolveLogoImageUrl,
   type DotType,
} from "../utils/qrStyling";

export type StyledQRCodeHandle = {
   download: (fileName: string, extension?: "png" | "svg" | "jpeg" | "webp") => Promise<void>;
};

export type StyledQRCodeProps = {
   value: string;
   size?: keyof typeof QR_SIZE_PX;
   /** Optional explicit render size (in px) for high-visibility previews. */
   renderSizePx?: number;
   color?: string;
   backgroundColor?: string;
   errorLevel?: "L" | "M" | "Q" | "H";
   dotsType?: DotType;
   showLogo?: boolean;
   logoSvgContent?: string;
   selectedIconComponent?: React.ComponentType<{ size?: number }> | React.ReactElement | null;
   className?: string;
   /** When true, inner SVG scales down with container width (preview). */
   responsive?: boolean;
   /** Inset around the logo inside the cleared center (SVG px). */
   logoImageMargin?: number;
};

const StyledQRCode = forwardRef<StyledQRCodeHandle, StyledQRCodeProps>(
   (
      {
         value,
         size = "md",
         renderSizePx,
         color = "#000000",
         backgroundColor = "#ffffff",
         errorLevel = "H",
         dotsType = "square",
         showLogo = false,
         logoSvgContent = "",
         selectedIconComponent = null,
         className,
         responsive = false,
         logoImageMargin,
      },
      ref,
   ) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const qrRef = useRef<QRCodeStyling | null>(null);

      const sizePx = renderSizePx ?? QR_SIZE_PX[size];

      useEffect(() => {
         const el = containerRef.current;
         if (!el) return;

         let cancelled = false;

         void (async () => {
            const image = await resolveLogoImageUrl(
               showLogo,
               logoSvgContent,
               selectedIconComponent,
            );
            if (cancelled || !containerRef.current) return;

            el.innerHTML = "";
            const options = buildQrCodeStylingOptions({
               data: value,
               sizePx,
               foreground: color,
               background: backgroundColor,
               errorLevel,
               dotsType,
               image,
               logoImageMargin,
            });
            const qr = new QRCodeStyling(options);
            qr.append(el);
            qrRef.current = qr;
         })();

         return () => {
            cancelled = true;
            el.innerHTML = "";
            qrRef.current = null;
         };
      }, [
         value,
         sizePx,
         color,
         backgroundColor,
         errorLevel,
         dotsType,
         showLogo,
         logoSvgContent,
         selectedIconComponent,
         logoImageMargin,
      ]);

      useImperativeHandle(
         ref,
         () => ({
            download: async (fileName, extension = "png") => {
               const base = fileName.replace(/\.(png|svg|jpe?g|webp)$/i, "");
               await qrRef.current?.download({
                  name: base,
                  extension,
               });
            },
         }),
         [],
      );

      return (
         <Box
            ref={containerRef}
            className={className}
            display="inline-block"
            lineHeight={0}
            maxW={responsive ? "100%" : undefined}
            css={
               responsive
                  ? {
                       "& svg": {
                          maxWidth: "100%",
                          height: "auto",
                       },
                    }
                  : undefined
            }
         />
      );
   },
);

StyledQRCode.displayName = "StyledQRCode";

export default StyledQRCode;
