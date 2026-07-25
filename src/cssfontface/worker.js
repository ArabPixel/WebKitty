importScripts("misc.js");

let marker_arr = new Uint32Array(new ArrayBuffer(0x10));

const transfer = [];
const api = {
  init(name) {
    self.name = name;

    version.init();
    switch (version.console) {
      case 4:
        importScripts("ps4/constants.js", "ps4/userland.js");
        break;
      case 5:
        //TODO
        break;
      default:
        throw new Error(`Unsupported console ${version.console}`);
    }

    arw.master = new Uint32Array(6);

    marker_arr.fill(0x41414141);
    marker_arr.leak = arw.leak;
    marker_arr.master = arw.master;
    marker_arr.victim = arw.victim;

    transfer.push(marker_arr.buffer);

    return marker_arr;
  },
  setup(leak_addr, wk_base) {
    transfer.length = 0;

    marker_arr = null;

    arw.leak_addr = new BInt(leak_addr);
    webkit_base = new BInt(wk_base);

    init_arw();
    init_rop();
    init_syscalls();

    return true;
  },
  register(name, fn) {
    if (typeof fn !== "string") {
      throw new Error(`${fn} not a string !!`);
    }

    if (name in api) {
      throw new Error(`${name} already registered !!`);
    }

    api[name] = new Function(`return (${fn})`)();

    return true;
  },
  ping() {
    return "pong";
  },
};

self.onmessage = async (e) => {
  const { id, name, args = [] } = e.data || {};

  try {
    const fn = api[name];

    if (typeof fn !== "function") {
      throw new Error(`Unknown function ${name} !!`);
    }

    const ret = await fn(...args);

    self.postMessage({ id, type: "ret", value: ret }, transfer);
  } catch (err) {
    self.postMessage({ id, type: "err", value: err });
  }
};
