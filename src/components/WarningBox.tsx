interface WarningBoxProps {
  message: string;
}

export const WarningBox = ({ message }: WarningBoxProps) => {
  return (
    <div
      className="max-w-prose mx-auto p-4 border-l-4 text-amber-700 bg-amber-50 border-amber-700"
      role="alert"
    >
      <h3 className="text-sm font-medium">{message}</h3>
    </div>
  );
};
