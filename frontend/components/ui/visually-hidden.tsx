import * as React from "react";

export const VisuallyHidden = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
      {...props}
    >
      {children}
    </span>
  );
};
