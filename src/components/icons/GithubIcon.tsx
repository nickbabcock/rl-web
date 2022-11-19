import light from "./GitHub-Mark-Light-32px.png";
import dark from "./GitHub-Mark-32px.png";
import { ImgHTMLAttributes } from "react";

interface RequiredAlt {
  alt: string;
}

export const GithubIcon = ({
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & RequiredAlt) => {
  return (
    <picture>
      <source srcSet={light.src} media="(prefers-color-scheme: dark)" />
      <img
        width={dark.width}
        height={dark.height}
        src={dark.src}
        alt={alt}
        {...props}
      />
    </picture>
  );
};
