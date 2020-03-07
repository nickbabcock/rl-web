use boxcars::{NetworkParse, ParserBuilder};
use wasm_bindgen::prelude::*;

fn parse_header(data: &[u8], pretty: bool) -> Result<String, JsValue> {
    let replay = ParserBuilder::new(data)
        .with_network_parse(NetworkParse::Never)
        .on_error_check_crc()
        .parse();

    replay
        .map_err(|e| JsValue::from_str(e.to_string().as_str()))
        .and_then(|x| {
            let res = if pretty {
                serde_json::to_string_pretty(&x)
            } else {
                serde_json::to_string(&x)
            };

            res.map_err(|e| JsValue::from_str(e.to_string().as_str()))
        })
}

fn parse_network(data: &[u8], pretty: bool) -> Result<Vec<u8>, JsValue> {
    let replay = ParserBuilder::new(data)
        .with_network_parse(NetworkParse::Always)
        .on_error_check_crc()
        .parse();

    replay
        .map_err(|e| JsValue::from_str(e.to_string().as_str()))
        .and_then(|x| {
            let res = if pretty {
                serde_json::to_vec_pretty(&x)
            } else {
                serde_json::to_vec(&x)
            };

            res.map_err(|e| JsValue::from_str(e.to_string().as_str()))
        })
}

#[wasm_bindgen]
pub fn parse_replay_header(data: &[u8]) -> Result<String, JsValue> {
    parse_header(data, false)
}

#[wasm_bindgen]
pub fn parse_replay_header_pretty(data: &[u8]) -> Result<String, JsValue> {
    parse_header(data, true)
}

#[wasm_bindgen]
pub fn parse_replay_network(data: &[u8]) -> Result<Vec<u8>, JsValue> {
    parse_network(data, false)
}

#[wasm_bindgen]
pub fn parse_replay_network_pretty(data: &[u8]) -> Result<Vec<u8>, JsValue> {
    parse_network(data, true)
}
