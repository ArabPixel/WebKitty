function load_script(src, remote = true, transfer = []) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function doCssFontFaceJailbreak() {
  await load_script("./src/cssfontface/misc.js");

  try {
    version.init();
    switch (version.console) {
      case 4:
        await load_script("./src/cssfontface/ps4/constants.js");
        await load_script("./src/cssfontface/ps4/userland.js");
        break;
      case 5:
        //TODO
        break;
      default:
        logger.info(`Unsupported console ${version.console}`);
    }

    logger.info("===USERLAND===");

    let rw = undefined;
    if (arw.master === undefined) {
      rw = await init_rw();
    }

    init_arw(rw);
    init_rop();
    init_syscalls();

    logger.info("===END===");

    await load_script("./src/cssfontface/loader.js");
    await load_script("./src/cssfontface/workers.js");

    switch (version.console) {
      case 4:
        await load_script("./src/cssfontface/ps4/kernel.js");
        break;
      case 5:
        //TODO
        break;
      default:
        logger.info(`Unsupported console ${version.console}`);
    }
    const exploitChain = localStorage.getItem('exploitChain') == 3 ? "netctrl" : "lapse";
    await load_script(`./src/cssfontface/${exploitChain}.js`);

    logger.info(`===${exploitChain.toUpperCase()}===`);

    try {
      if (exploitChain == "lapse") {
        init();
        await setup();
        await double_free_reqs2();
        leak_kaddrs();
        double_free_reqs1();
        make_karw();

        // Increase reference counts for the pipes
        inc_karw_pipe_refcnt();

        logger.info("Corrupted context cleanup started...");

        // Remove pktinfo pointers
        remove_pktinfo_from_so(pktopts_twins[0]);

        // Remove rthdr pointers
        remove_rthdr_from_so(pktopts_twins[1]);
        remove_rthdr_from_so(rthdr_twins[0]);

        logger.info("Corrupted context cleanup completed !!");
      } else {
        init();
        await setup();
        await ucred_triple_free();
        leak_kqueue();
        await make_karw();

        inc_karw_pipe_refcnt();

        logger.info("Corrupted context cleanup started...");

        // Remove rthdr pointers from triplets
        for (let i = 0; i < triplets.length; i++) {
          remove_rthdr_from_so(triplets[i]);
        }

        // Remove triple freed file from free list
        remove_uaf_file();

        logger.info("Corrupted context cleanup completed !!");
      }
    } finally {
      cleanup();
    }

    find_all_proc();

    // Avoid reapplying if already done
    if (fn.setuid.invoke(0) === -1) {
      jailbreak();

      const kpatches_rsp = await fetch(`./src/cssfontface/ps4/patches/${constants.KPATCH}`);
      const kpatches_buf = await kpatches_rsp.arrayBuffer();
      const kpatches_u8 = new Uint8Array(kpatches_buf);

      kernel_patches(kpatches_u8);

      const bin_rsp = await fetch(sessionStorage.getItem("payload_path"));
      const bin_buf = await bin_rsp.arrayBuffer();
      const bin_u8 = new Uint8Array(bin_buf);

      load_bin(bin_u8);
    }

    if (typeof jailbreakSuccess == "function"){
        jailbreakSuccess();
    }
    logger.info("===END===");
  } catch (e) {
    logger.error(e.message);
    logger.error(e.stack);
    //mem.free_all();
  }
}
