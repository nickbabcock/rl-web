use boxcars::{
    ClassIndex, ClassNetCache, DebugInfo, HeaderProp, KeyFrame, NetworkParse, ParseError,
    ParserBuilder, TickMark,
};
use serde::{ser::SerializeMap, Serialize, Serializer};
use wasm_bindgen::prelude::*;

#[derive(Debug)]
struct ReplayImpl {
    replay: boxcars::Replay,
    network_err: Option<String>,
}

impl ReplayImpl {
    fn header_json(&self, pretty: bool) -> String {
        // Create a view of the replay that omits the network_frames field. The
        // downside is if the boxcars::Replay adds a field, this will need to be
        // updated to.
        #[derive(Serialize)]
        #[serde(remote = "boxcars::Replay")]
        struct ReplayRemoteView {
            header_size: i32,
            header_crc: u32,
            major_version: i32,
            minor_version: i32,
            net_version: Option<i32>,
            game_type: String,
            #[serde(serialize_with = "pair_vec")]
            properties: Vec<(String, HeaderProp)>,
            content_size: i32,
            content_crc: u32,
            levels: Vec<String>,
            keyframes: Vec<KeyFrame>,
            debug_info: Vec<DebugInfo>,
            tick_marks: Vec<TickMark>,
            packages: Vec<String>,
            objects: Vec<String>,
            names: Vec<String>,
            class_indices: Vec<ClassIndex>,
            net_cache: Vec<ClassNetCache>,
        }

        #[derive(Serialize)]
        #[serde(transparent)]
        struct ReplayView<'a>(#[serde(with = "ReplayRemoteView")] &'a boxcars::Replay);
        let view = ReplayView(&self.replay);

        let res = if pretty {
            serde_json::to_string_pretty(&view)
        } else {
            serde_json::to_string(&view)
        };

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
pub struct Replay(ReplayImpl);

#[wasm_bindgen]
impl Replay {
    #[wasm_bindgen]
    pub fn header_json(&self, pretty: bool) -> String {
        self.0.header_json(pretty)
    }

    #[wasm_bindgen]
    pub fn full_json(&self, pretty: bool) -> Vec<u8> {
        self.0.full_json(pretty)
    }

    #[wasm_bindgen]
    pub fn network_err(&self) -> Option<String> {
        self.0.network_err.clone()
    }
}

fn _parse(data: &[u8]) -> Result<Replay, ParseError> {
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
    Ok(Replay(ReplayImpl {
        replay: replay?,
        network_err,
    }))
}

#[wasm_bindgen]
pub fn parse(data: &[u8]) -> Result<Replay, JsError> {
    Ok(_parse(data)?)
}

fn pair_vec<K, V, S>(inp: &[(K, V)], serializer: S) -> Result<S::Ok, S::Error>
where
    K: Serialize,
    V: Serialize,
    S: Serializer,
{
    let mut state = serializer.serialize_map(Some(inp.len()))?;
    for (key, val) in inp.iter() {
        state.serialize_key(key)?;
        state.serialize_value(val)?;
    }
    state.end()
}
