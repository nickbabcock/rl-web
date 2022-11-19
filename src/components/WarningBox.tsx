interface WarningBoxProps {
  message: string;
}

export const WarningBox = ({ message }: WarningBoxProps) => {
  return (
    <div
      className="mx-auto max-w-prose border-l-4 border-amber-700 bg-amber-50 p-4 text-amber-700"
      role="alert"
    >
      <h3 className="text-sm font-medium">{message}</h3>
    </div>
  );
};
