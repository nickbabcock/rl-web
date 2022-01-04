use boxcars::{NetworkParse, ParserBuilder};
use std::cell::RefCell;
use wasm_bindgen::prelude::*;

#[derive(Debug)]
struct ReplayImpl {
    replay: boxcars::Replay,
    network_err: Option<String>,
}

impl ReplayImpl {
    fn header_json(&mut self, pretty: bool) -> String {
        let frames = self.replay.network_frames.take();

        let res = if pretty {
            serde_json::to_string_pretty(&self.replay)
        } else {
            serde_json::to_string(&self.replay)
        };

        self.replay.network_frames = frames;
        res.unwrap()
    }

    fn full_json(&self, pretty: bool) -> Vec<u8> {
        let res = if pretty {
            serde_json::to_vec_pretty(&self.replay)
        } else {
            serde_json::to_vec(&self.replay)
        };

        res.unwrap()
    }
}

#[derive(Debug)]
#[wasm_bindgen]
pub struct Replay(RefCell<ReplayImpl>);

#[wasm_bindgen]
impl Replay {
    #[wasm_bindgen]
    pub fn header_json(&self, pretty: bool) -> String {
        self.0.borrow_mut().header_json(pretty)
    }

    #[wasm_bindgen]
    pub fn full_json(&self, pretty: bool) -> Vec<u8> {
        self.0.borrow().full_json(pretty)
    }

    #[wasm_bindgen]
    pub fn network_err(&self) -> Option<String> {
        self.0.borrow().network_err.clone()
    }
}

fn _parse(data: &[u8]) -> Result<Replay, JsValue> {
    let mut replay = ParserBuilder::new(data)
        .with_network_parse(NetworkParse::Always)
        .on_error_check_crc()
        .parse();
    let mut network_err = None;

    if let Err(e) = replay {
        network_err = Some(e);
        replay = ParserBuilder::new(data)
            .with_network_parse(NetworkParse::Never)
            .on_error_check_crc()
            .parse();
    }

    let network_err = network_err.map(|x| x.to_string());
    match replay {
        Ok(replay) => Ok(Replay(RefCell::new(ReplayImpl {
            replay,
            network_err,
        }))),
        Err(e) => Err(JsValue::from_str(e.to_string().as_str())),
    }
}

#[wasm_bindgen]
pub fn parse(data: &[u8]) -> Result<Replay, JsValue> {
    _parse(data)
}
