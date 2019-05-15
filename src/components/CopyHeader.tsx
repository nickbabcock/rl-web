import { h, Component } from "preact";

interface CopyHeaderProps {
  header: string;
}

export default class CopyHeader extends Component<CopyHeaderProps, {}> {
  textElm: HTMLInputElement | null = null;

  buttonClick = (e: Event) => {
    if (this.textElm === null) {
      throw new Error("Did not expect the text element to be null");
    }

    this.textElm.select();
    document.execCommand("copy");
    (e.target as HTMLButtonElement).focus();
  };

  render({ header }: CopyHeaderProps) {
    const isRTL = document.documentElement.getAttribute("dir") == "rtl";

    // styling stolen from clipboard.js
    const style = {
      fontSize: "12pt",
      border: "0",
      padding: "0",
      margin: "0",
      position: "absolute",
      [isRTL ? "right" : "left"]: "-9999px",
      top: `${window.pageYOffset || document.documentElement.scrollTop}px`
    };

    return (
      <div>
        <button onClick={this.buttonClick}>Copy JSON data to Clipyboard</button>
        <textarea
          style={style}
          ref={textElm => (this.textElm = textElm)}
          value={header}
        />
      </div>
    );
  }
}
