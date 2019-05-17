use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse_replay(data: &[u8]) -> String {
    let replay = boxcars::ParserBuilder::new(data)
        .never_parse_network_data()
        .on_error_check_crc()
        .parse();

    let res = replay
        .map_err(|e| e.to_string())
        .and_then(|x| serde_json::to_string(&x).map_err(|e| e.to_string()));

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
pub fn parse_network_replay(data: &[u8]) -> String {
    let replay = boxcars::ParserBuilder::new(data)
        .must_parse_network_data()
        .on_error_check_crc()
        .parse();

    let res = replay
        .map_err(|e| e.to_string())
        .and_then(|x| serde_json::to_string(&x).map_err(|e| e.to_string()));

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
