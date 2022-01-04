use rl_wasm::*;
use wasm_bindgen_test::*;

const REPLAY: &'static [u8] = include_bytes!("../../dev/sample.replay");

#[wasm_bindgen_test]
fn test_parse() {
    let replay = parse(&REPLAY[..]).unwrap();
    assert!(replay.network_err().is_none());
    assert!(replay.header_json(false).contains(r#""header_size":6402,"#));
    assert!(replay.header_json(true).contains(r#""header_size": 6402,"#));

    assert!(String::from_utf8(replay.full_json(false))
        .unwrap()
        .contains(r#""linear_velocity":{"#));
    assert!(String::from_utf8(replay.full_json(true))
        .unwrap()
        .contains(r#""linear_velocity": {"#));
}

#[wasm_bindgen_test]
fn test_parse_garbage() {
    let err = parse(b"lakjsdlasjdfal;").unwrap_err().as_string().unwrap();
    assert!(err.contains("Could not decode replay header data"));
}

#[wasm_bindgen_test]
fn test_parse_network_bad() {
    let mut v = REPLAY.to_vec();
    for i in 20000..30000 {
        v[i] = 10;
    }

    let replay = parse(&v).unwrap();
    let err = replay.network_err().unwrap();
    assert!(err.contains("Error decoding frame: attribute unknown or not implemented"));
    assert!(replay.header_json(false).contains(r#""header_size":6402,"#));
    assert!(replay.header_json(true).contains(r#""header_size": 6402,"#));
}
