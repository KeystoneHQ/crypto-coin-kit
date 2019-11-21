import BTC from "./BTC";
import { DCR } from "./DCR";
import {ETC} from "./ETC";
import { ETH } from "./ETH";
import KeyProvider from "./keyProvider";
import NEO from "./NEO";
import * as utils from "./utils";
import { XRP } from "./XRP";
import { XZC } from "./XZC";

export default {
  coins: {
    XRP,
    NEO,
    XZC,
    DCR,
    ETH,
    BTC,
    ETC
  },
  KeyProvider,
  utils
};
