use rl_wasm::*;
use wasm_bindgen_test::*;

const REPLAY: &'static [u8] = include_bytes!("../../assets/3d07e.replay");

#[wasm_bindgen_test]
fn test_parse_header() {
    let res = parse_replay_header(&REPLAY[..]).unwrap();
    assert!(res.contains(r#""header_size":6402,"#));
}

#[wasm_bindgen_test]
fn test_parse_header_pretty() {
    let res = parse_replay_header_pretty(&REPLAY[..]).unwrap();
    assert!(res.contains(r#""header_size": 6402,"#));
}

#[wasm_bindgen_test]
fn test_parse_header_bad() {
    let err = parse_replay_header(b"lakjsdlasjdfal;")
        .unwrap_err()
        .as_string()
        .unwrap();
    assert!(err.contains("Could not decode replay header data"));
}

#[wasm_bindgen_test]
fn test_parse_network() {
    let res = parse_replay_network(&REPLAY[..])
        .map(|x| String::from_utf8(x).unwrap())
        .unwrap();
    assert!(res.contains(r#""linear_velocity":{"#));
}

#[wasm_bindgen_test]
fn test_parse_network_pretty() {
    let res = parse_replay_network_pretty(&REPLAY[..])
        .map(|x| String::from_utf8(x).unwrap())
        .unwrap();
    assert!(res.contains(r#""linear_velocity": {"#));
}

#[wasm_bindgen_test]
fn test_parse_network_bad() {
    let mut v = REPLAY.to_vec();
    for i in 20000..30000 {
        v[i] = 10;
    }

    let err = parse_replay_network(&v).unwrap_err().as_string().unwrap();
    assert!(err.contains("Error decoding frame: attribute unknown or not implemented"));
}
