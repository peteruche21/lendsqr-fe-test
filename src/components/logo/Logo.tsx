import type { ImgHTMLAttributes } from "react";

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

export function Logo({ className, ...imageProps }: LogoProps) {
  return (
    <img alt="Lendsqr" className={className} src="/logo.svg" {...imageProps} />
  );
}

export type { LogoProps };
