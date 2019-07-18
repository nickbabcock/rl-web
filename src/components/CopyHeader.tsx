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
    const clsName = `clipboard ${isRTL ? "rtl-right" : "rtl-left"}`;
    return (
      <span>
        <button onClick={this.buttonClick}>Copy JSON data to Clipboard</button>
        <textarea
          className={clsName}
          ref={textElm => (this.textElm = textElm)}
          value={header}
        />
      </span>
    );
  }
}
