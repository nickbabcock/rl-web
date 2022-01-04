import Head from "next/head";
import apple from "./apple-touch-icon.png";
import favicon16 from "./favicon-16x16.png";
import favicon32 from "./favicon-32x32.png";

export const RlHead: React.FC<{}> = ({ children }) => {
  return (
    <Head>
      <title>Rocket League Replay Parser</title>
      <meta
        name="Description"
        content="Online Rocket League replay parser that will ingest a replay and return statistics without the need to upload to a server"
      />
      <link rel="apple-touch-icon" sizes="180x180" href={apple.src} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon32.src} />
      <link rel="icon" type="image/png" sizes="16x16" href={favicon16.src} />
      {children}
    </Head>
  );
};
