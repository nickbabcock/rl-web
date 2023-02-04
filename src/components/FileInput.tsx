import { useRef, useId } from "react";
import { useFileDrop } from "@/hooks";
import clsx from "clsx";

type FileInputProps = {
  onChange: (file: File) => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
};

export const FileInput = ({
  onChange,
  children,
  disabled = false,
}: FileInputProps) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const { isHovering: isFileHovering } = useFileDrop({
    onFile: onChange,
    target: dropAreaRef,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0];
    if (file) {
      e.currentTarget.value = "";
      onChange(file);
    }
  };

  return (
    <div
      className="mx-auto my-5 w-full max-w-prose flex-col space-y-1"
      ref={dropAreaRef}
    >
      <input
        id={inputId}
        type="file"
        className="peer absolute opacity-0"
        disabled={disabled}
        onChange={handleChange}
      />
      <label
        htmlFor={inputId}
        className={clsx(
          "flex cursor-pointer items-center gap-1 rounded-md border-2 border-dashed border-slate-600 p-4 hover:bg-slate-300 peer-focus:border-indigo-500 peer-focus:ring-indigo-500 peer-disabled:cursor-not-allowed peer-disabled:saturate-0 hover:dark:bg-slate-800",
          !isFileHovering
            ? "bg-slate-200 dark:bg-slate-700"
            : "bg-slate-300 dark:bg-slate-800"
        )}
      >
        {children}
      </label>
    </div>
  );
};
