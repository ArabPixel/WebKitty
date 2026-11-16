const logger = {
  verbose: true, // enable for debug logs

  init() {
    this.console = document.getElementById('console');
    this.consoleElement = document.getElementById("DebugConsole") || this.console; 
  },
  info(msg) {
    this.log('[+]', `${msg}`);
  },
  error(msg) {
    this.log('[-]', `${msg}`);
  },
  debug(msg) {
    if (this.verbose) this.log('[*]', `${msg}`);
  },
  log(prefix, msg) {
    if (!this.console) return;

    this.console.append(`${prefix} ${String(msg).replace(/\n/g, `\n${prefix} `)}\n`);
    this.consoleElement.scrollTop = this.console.scrollHeight;
  },
};

window.onerror = function (message, source, line, column, error) {
  let msg = message;

  if (error && error.stack) {
    msg += `\n${error.stack}`;
  } else {
    msg += `\n@${source}:${line}:${column}`;
  }

  logger.error(msg);
  return true;
};

window.onunhandledrejection = function (event) {
  const err = event.reason;

  let msg = err && err.message ? err.message : String(err);

  if (err && err.stack) {
    msg += `\n${err.stack}`;
  }

  logger.error(msg);
};

function load_script(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
}

async function load_file(src) {
  const res = await fetch(src);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${src}`);
  }

  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

async function main() {
  await load_script('src/wobkot/misc.js');

  version.init();

  switch (version.console) {
    case 4:
      await load_script('src/wobkot/ps4/impl.js');
      break;
    default:
      throw new Error(`Unsupported console ${version.console}`);
  }

  await load_script('src/wobkot/userland.js');
  await userland_main();
  if (version.major > 12 || (version.major === 12 && version.minor > 2)) {
    logger.error("No kernel exploit has been implemented yet!");
    return;
  }
  await load_script('src/wobkot/kernel.js');
  await kernel_main();
}

logger.init();
main();
