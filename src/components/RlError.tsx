import { Component, h } from "preact";

interface ErrorProps {
  error: string;
}

const RlError = ({ error }: ErrorProps) => {
  return <p className="error">{`Error: ${error}`}</p>;
};

export default RlError;
