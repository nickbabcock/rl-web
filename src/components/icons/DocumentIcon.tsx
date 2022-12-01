import { SVGProps } from "react";

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        className="fill-neutral-500"
        d="M6 2h6v6c0 1.1.9 2 2 2h6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"
      />
      <polygon className="fill-neutral-900" points="14 2 20 8 14 8" />
    </svg>
  );
};
