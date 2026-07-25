const payloadsList = [
  {
    id: "FTP",
    name: "FTP",
    author: "Scene Collective",
    description: "Enables FTP server access for file transfers.",
    specificFW: "",
    category: "tools",
    funcName: "load_FTP"
  },
  {
    id: "BinLoader",
    name: "BinLoader",
    author: "Exploit",
    description: "Launches BinLoader server on port 9020 to send bin payloads.",
    specificFW: "7.00 - 9.60",
    category: "tools",
    funcName: "load_BinLoader"
  },
  {
    id: "ElfLoader",
    name: "ElfLoader",
    author: "John T&#246;rnblom",
    description: "Launches ElfLoader server on port 9021 to send elf payloads.",
    specificFW: "",
    category: "tools",
    funcName: "load_Elfldr"
  },
  {
    id: "WebSrv",
    name: "PS4-Websrv",
    author: "ArabPixel",
    description: "Launches a web server on port 80 on the PS4 to load payloads using external devices on the fly.",
    specificFW: "",
    category: "tools",
    funcName: "load_WebSrv"
  },
  {
    id: "DisableUpdates",
    name: "Disable-Updates",
    author: "Scene Collective",
    description: "Disables automatic system software updates.",
    specificFW: "",
    category: "tools",
    funcName: "load_DisableUpdates"
  },
  {
    id: "FanThreshold",
    name: "Fan-Threshold",
    author: "Scene Collective",
    description: "Sets the cooling fan's profile on the PlayStation 4",
    specificFW: "",
    category: "tools",
    funcName: "chooseFanThreshold"
  },
  {
    id: "HistoryBlocker",
    name: "History-Blocker",
    author: "Stooged",
    description: "Blocks the browser from remembering and returning to the last opened page on start. Run again to enable/disable.",
    specificFW: "",
    category: "tools",
    funcName: "load_HistoryBlocker"
  },
  {
    id: "NpFakeSignin",
    name: "NP Fake Signin",
    author: "earthonion",
    description: "Sets PSN state to 'signed in' on PS4, use after fake activation. Useful for vue after free",
    specificFW: "",
    category: "tools",
    funcName: "load_npFakeSignin"
  },
  {
    id: "OrbisToolbox",
    name: "Orbis-Toolbox",
    author: "OSM-Made",
    description: "A modification of the playstation UI to help with launching and developing homebrew..",
    specificFW: "5.05, 6.72, 7.02, 7.55, 9.00",
    category: "tools",
    funcName: "load_Orbis"
  },
  {
    id: "BackupDB",
    name: "Backup-DB",
    author: "Stooged",
    description: "Backs up your PS4's databases, licenses, and user data. Note this may not be useful if you have to reinitalize as your keys may change.",
    specificFW: "",
    category: "tools",
    funcName: "load_BackupDB"
  },
  {
    id: "RestoreDB",
    name: "Restore-DB",
    author: "Stooged",
    description: "Restores the data saved in the 'Backup' payload.",
    specificFW: "",
    category: "tools",
    funcName: "load_RestoreDB"
  },
  {
    id: "ExitIDU",
    name: "ExitIDU",
    author: "Scene Collective",
    description: "Exits IDU mode and restarts the console.",
    specificFW: "",
    category: "tools",
    funcName: "load_ExitIDU"
  },
  {
    id: "WebRTE",
    name: "WebRTE",
    author: "Made by golden<br>updated by EchoStretch",
    description: "Web Realtime Trainer Engine",
    specificFW: "5.05, 6.72, 7.00-11.00",
    category: "tools",
    funcName: "load_WebRTE"
  },
  {
    id: "App2USB",
    name: "App2USB",
    author: "Stooged",
    description: "Unofficially Moves installed applications to an external USB drive.",
    specificFW: "",
    category: "tools",
    funcName: "load_App2USB"
  },
  {
    id: "Linux1024mb",
    name: "Linux Loader 1GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 1GB VRAM. Select for first install",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "Linux2048mb",
    name: "Linux Loader 2GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 2GB VRAM.",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "Linux3072mb",
    name: "Linux Loader 3GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 3GB VRAM.",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "Linux4096mb",
    name: "Linux Loader 4GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 4GB VRAM.",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "Linux128mb",
    name: "Linux Loader 128MB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 128MB VRAM.",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "Linux256mb",
    name: "Linux Loader 256MB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 256MB VRAM.",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "Linux512mb",
    name: "Linux Loader 512MB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 512MB VRAM.",
    specificFW: "7.00 - 13.52",
    category: "linux",
    funcName: "load_Linux"
  },
  {
    id: "PS4Debug",
    name: "PS4-Debug",
    author: "CTN & SiSTR0",
    description: "Debugging tools for PS4.",
    specificFW: "up to 12.02",
    category: "advanced",
    funcName: "load_PS4Debug"
  },
  {
    id: "PUPDecrypt",
    name: "PUP-Decrypt",
    author: "andy-man",
    description: "Payload to decrypt the contents of a firmware update file (PUP) on the PS4",
    specificFW: "",
    category: "advanced",
    funcName: "load_PUPDecrypt"
  },
  {
    id: "ModuleDumper",
    name: "Module-Dumper",
    author: "SocraticBliss",
    description: "Dumps the decrypted modules from /system, /system_ex, /update and the root of the filesystem to a USB device.",
    specificFW: "",
    category: "advanced",
    funcName: "load_ModuleDumper"
  },
  {
    id: "KernelDumper",
    name: "Kernel-Dumper",
    author: "Eversion",
    description: "Dumps the PS4 kernel.",
    specificFW: "",
    category: "advanced",
    funcName: "load_KernelDumper"
  },
  {
    id: "DisableASLR",
    name: "Disable-ASLR",
    author: "Scene Collective",
    description: "Disables the ASLR (Address space layout randomization) to make working with memory easier/repeatable.",
    specificFW: "",
    category: "advanced",
    funcName: "load_DisableASLR"
  },
  {
    id: "PermanentUART",
    name: "Permanent-UART",
    author: "JTAG7371",
    description: "Enabled hardware based UART without a kernel patch, persists though updates.",
    specificFW: "",
    category: "advanced",
    funcName: "load_PermanentUART"
  },
  {
    id: "RIFRenamer",
    name: "RIF-Renamer",
    author: "Al Azif",
    description: "Renames 'fake' RIFs to 'free' RIFs for better HEN compatibility. Use this if your PKGs only work with Mira+HEN.",
    specificFW: "",
    category: "advanced",
    funcName: "load_RIFRenamer"
  }
];