import { Component, h } from "preact";

interface ErrorProps {
  error: Error | null;
}

const RlError = ({ error }: ErrorProps) => {
  if (error) {
    return <p className="error">{`Error: ${error.message}`}</p>;
  } else {
    return null;
  }
};

export default RlError;
