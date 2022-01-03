interface WarningBoxProps {
  message: string;
}

export const WarningBox: React.FC<WarningBoxProps> = ({ message }) => {
  return (
    <div>
      {message}
      <style jsx>{`
        div {
          background-color: var(--red-4);
          outline: 3px var(--red-6) solid;
          padding: 0.5rem 1rem;
          color: black;
        }
      `}</style>
    </div>
  );
};
