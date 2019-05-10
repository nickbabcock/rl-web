import { h, Component } from "preact";

interface TeamPlayerProps {
  ClassName: string;
  OnlineID: string;
  Name: string;
}

const TeamPlayer = ({ ClassName, OnlineID, Name }: TeamPlayerProps) => {
  if (OnlineID && OnlineID !== "0") {
    return (
      <span>
        <a
          target="_blank"
          className={ClassName}
          href={`https://calculated.gg/players/${OnlineID}/overview`}
        >
          {Name}
        </a>
      </span>
    );
  } else {
    return <span className={ClassName}>{Name}</span>;
  }
};

export default TeamPlayer;
