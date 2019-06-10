use boxcars::{NetworkParse, ParserBuilder};
use wasm_bindgen::prelude::*;

fn parse_replay(data: &[u8], mode: NetworkParse, pretty: bool) -> String {
    let replay = ParserBuilder::new(data)
        .with_network_parse(mode)
        .on_error_check_crc()
        .parse();

    let res = replay.map_err(|e| e.to_string()).and_then(|x| {
        if pretty {
            serde_json::to_string_pretty(&x)
        } else {
            serde_json::to_string(&x)
        }
        .map_err(|e| e.to_string())
    });

    match res {
        Ok(data) => data,
        Err(ref e) => {
            let mut result = String::from(r#"{"error":""#);
            result.push_str(&e.to_string());
            result.push('"');
            result.push('}');
            result
        }
    }
}

#[wasm_bindgen]
pub fn parse_replay_header(data: &[u8]) -> String {
    parse_replay(data, NetworkParse::Never, false)
}

#[wasm_bindgen]
pub fn parse_replay_network(data: &[u8]) -> String {
    parse_replay(data, NetworkParse::Always, false)
}

#[wasm_bindgen]
pub fn parse_replay_header_pretty(data: &[u8]) -> String {
    parse_replay(data, NetworkParse::Never, true)
}

#[wasm_bindgen]
pub fn parse_replay_network_pretty(data: &[u8]) -> String {
    parse_replay(data, NetworkParse::Always, true)
}
