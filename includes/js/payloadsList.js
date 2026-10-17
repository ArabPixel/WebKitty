var payloadsPath = "./includes/payloads/Bins/";
var legacyPayloadsPath = "./includes/payloads/Legacy/";
var homebrewPath = "./includes/payloads/Homebrew/";
var linuxPath = "./includes/payloads/Linux/";

var payloadsList = [
  {
    id: "FTP",
    name: "FTP",
    author: "Scene Collective",
    description: "Enables FTP server access for file transfers.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-ftp.bin",
    legacySrc: legacyPayloadsPath + "ps4-ftp-legacy.bin"
    
  },
  {
    id: "BinLoader",
    name: "Bin Loader",
    author: "Exploit",
    description: "Launches BinLoader server on port 9020 to send bin payloads.",
    specificFW: "4.50 - 5.07, 7.00 - 9.60",
    category: "tools",
    src: null,
    legacySrc: null
  },
  {
    id: "ElfLoader",
    name: "Elf Loader",
    author: "John T&#246;rnblom",
    description: "Launches ElfLoader server on port 9021 to send elf payloads.",
    specificFW: "4.71 - latest",
    category: "tools",
    src: payloadsPath + "elfldr.elf"
  },
  {
    id: "DisableUpdates",
    name: "Disable Updates",
    author: "Scene Collective",
    description: "Disables automatic system software updates.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-disable-updates.bin",
    legacySrc: legacyPayloadsPath + "ps4-disable-updates-legacy.bin"
  },
  {
    id: "DBRebuilder",
    name: "Database Rebuilder",
    author: "4GAMER",
    description: "Rebuilds the PS4's FPKG database, bringing homebrew icons back to the home screen.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "db-rebuilder-v0.2.bin",
    needsPayloadLoader: true
  },
  {
    id: "DetectSouthbridge",
    name: "Detect Southbridge",
    author: "ArabPixel",
    description: "Detects your PS4's Southbridge. Useful for setting up PS4 Linux.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-southbridge-detector.bin"
  },
  {
    id: "EnableBrowser",
    name: "PS4 Enable Browser",
    author: "Scene Collective",
    description: "Permenently activates the browser without needing to sign into PSN.",
    specificFW: "4.50 - 5.07",
    category: "tools",
    legacySrc: legacyPayloadsPath + "ps4-enable-browser-legacy.bin"
  },
  {
    id: "FanThreshold",
    name: "Fan Threshold",
    author: "Scene Collective",
    description: "Sets the cooling fan's profile on the PlayStation 4",
    specificFW: "4.73 - latest",
    category: "tools",
    src: null
  },
  {
    id: "WebSrv",
    name: "PS4 Websrv",
    author: "ArabPixel",
    description: "Launches a web server on port 80 on the PS4 to load payloads using external devices on the fly.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-websrv.bin",
    needsPayloadLoader: true,
  },
  {
    id: "NpFakeSignin",
    name: "NP Fake Signin",
    author: "earthonion",
    description: "Sets PSN state to 'signed in' on PS4, use after fake activation. Useful for vue after free",
    specificFW: "4.71 - latest",
    category: "tools",
    src: payloadsPath + "np-fake-signin-ps4.elf",
    needsPayloadLoader: true
  },
  {
    id: "BackupDB",
    name: "Backup DB",
    author: "Stooged",
    description: "Backs up your PS4's databases, licenses, and user data. Note this may not be useful if you have to reinitalize as your keys may change.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-backup.bin"
  },
  {
    id: "RestoreDB",
    name: "Restore DB",
    author: "Stooged",
    description: "Restores the data saved in the 'Backup' payload.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-restore.bin"
  },
  {
    id: "ExitIDU",
    name: "Exit IDU",
    author: "Scene Collective",
    description: "Exits IDU mode and restarts the console.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-exit-idu.bin"
  },
  {
    id: "WebRTE",
    name: "WebRTE",
    author: "Made by golden<br>updated by EchoStretch",
    description: "Web Realtime Trainer Engine",
    specificFW: "5.05, 6.72, 7.00 - 11.00",
    category: "tools",
    src: payloadsPath + "WebRTE.bin"
  },
  {
    id: "HistoryBlocker",
    name: "History Blocker",
    author: "Stooged",
    description: "Blocks the browser from remembering and returning to the last opened page on start. Run again to enable/disable.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-history-blocker.bin"
  },
  {
    id: "App2USB",
    name: "App2USB",
    author: "Stooged",
    description: "Unofficially Moves installed applications to an external USB drive.",
    specificFW: "4.73 - latest",
    category: "tools",
    src: payloadsPath + "ps4-app2usb.bin"
  },
  {
    id: "Linux1024mb",
    name: "Linux Loader 1GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 1GB VRAM. Select for first install",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-1024mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "Linux2048mb",
    name: "Linux Loader 2GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 2GB VRAM.",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-2048mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "Linux3072mb",
    name: "Linux Loader 3GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 3GB VRAM.",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-3072mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "Linux4096mb",
    name: "Linux Loader 4GB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 4GB VRAM.",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-4096mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "Linux128mb",
    name: "Linux Loader 128MB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 128MB VRAM.",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-128mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "Linux256mb",
    name: "Linux Loader 256MB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 256MB VRAM.",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-256mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "Linux512mb",
    name: "Linux Loader 512MB",
    author: "ps4boot<br>ArabPixel, rmux",
    description: "Linux Loader for all consoles. 512MB VRAM.",
    specificFW: "5.05, 6.72 - latest",
    category: "linux",
    src: linuxPath + "linux-512mb.elf",
    needsPayloadLoader: true
  },
  {
    id: "PS4DebugNG",
    name: "PS4Debug-NG",
    author: "golden, Pharaoh2k",
    description: "Next-Gen version of ps4debug for PlayStation 4",
    specificFW: "5.05 - latest",
    category: "advanced",
    src: payloadsPath + "ps4debug-ng_v1.3.2.bin"
  },
  {
    id: "PUPDecrypt",
    name: "PUP Decrypt",
    author: "andy-man",
    description: "Payload to decrypt the contents of a firmware update file (PUP) on the PS4",
    specificFW: "4.73 - latest",
    category: "advanced",
    src: payloadsPath + "ps4-pup-decrypt.bin"
  },
  {
    id: "ModuleDumper",
    name: "Module Dumper",
    author: "SocraticBliss",
    description: "Dumps the decrypted modules from /system, /system_ex, /update and the root of the filesystem to a USB device.",
    specificFW: "4.73 - latest",
    category: "advanced",
    src: payloadsPath + "ps4-module-dumper.bin"
  },
  {
    id: "KernelDumper",
    name: "Kernel Dumper",
    author: "Eversion",
    description: "Dumps the PS4 kernel.",
    specificFW: "4.73 - latest",
    category: "advanced",
    src: payloadsPath + "ps4-kernel-dumper.bin"
  },
  {
    id: "DisableASLR",
    name: "Disable ASLR",
    author: "Scene Collective",
    description: "Disables the ASLR (Address space layout randomization) to make working with memory easier/repeatable.",
    specificFW: "4.73 - latest",
    category: "advanced",
    src: payloadsPath + "ps4-disable-aslr.bin"
  },
  {
    id: "PermanentUART",
    name: "Permanent UART",
    author: "JTAG7371",
    description: "Enabled hardware based UART without a kernel patch, persists though updates.",
    specificFW: "4.73 - latest",
    category: "advanced",
    src: payloadsPath + "ps4-permanent-uart.bin"
  },
  {
    id: "RIFRenamer",
    name: "RIF Renamer",
    author: "Al Azif",
    description: "Renames 'fake' RIFs to 'free' RIFs for better HEN compatibility. Use this if your PKGs only work with Mira+HEN.",
    specificFW: "4.73 - latest",
    category: "advanced",
    src: payloadsPath + "ps4-rif-renamer.bin"
  },
  {
    id: "PSVue",
    name: "PlayStation Vue v1.24",
    author: "Sorny",
    description: "For setting up PlayStation Vue exploit. <br>You need an internet connection to use this payload.<br><strong>This does NOT install and setup download0 nor the save file!</strong>",
    specificFW: "4.73 - latest",
    category: "homebrew",
    src: homebrewPath + "PlayStationVue-base-installer.bin",
    needsPayloadLoader: true
  },
  {
    id: "OnlineStoreInstall",
    name: "Homebrew Store",
    author: "LightningMods",
    description: "Online Installer for the PS4 Homebrew Store.<br>You need an internet connection to use this payload.",
    specificFW: "4.73 - latest",
    category: "homebrew",
    src: homebrewPath + "online-store-installer.bin",
    needsPayloadLoader: true
  },
  {
    id: "ApolloSaveTool",
    name: "Apollo Save Tool",
    author: "Bucanero",
    description: "Apollo Save Tool is an application to manage save-game files on the PlayStation 4.<br>You need an internet connection to use this payload.",
    specificFW: "4.73 - latest",
    category: "homebrew",
    src: homebrewPath + "ApolloSaveToolv232.bin",
    needsPayloadLoader: true
  },
  {
    id: "Itemzflow",
    name: "Itemzflow Installer",
    author: "LightningMods",
    description: "Itemzflow is a Free and Open source PS4 home menu alternative Itemzflow expands the beyond limits of Sony's ShellUI.<br>You need an internet connection to use this payload.",
    specificFW: "4.73 - latest",
    category: "homebrew",
    src: homebrewPath + "PS4-Itemzflow-v108.bin",
    needsPayloadLoader: true
  },
  {
    id: "PS4Xplorer2.0",
    name: "File Xplorer 2.0",
    author: "Lapy",
    description: "A File Manager for the PlayStation 4 console.<br>You need an internet connection to use this payload.",
    specificFW: "4.73 - latest",
    category: "homebrew",
    src: homebrewPath + "PS4-Xplorer-208.bin",
    needsPayloadLoader: true
  }
];