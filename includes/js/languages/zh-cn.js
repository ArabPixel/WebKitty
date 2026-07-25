window.lang = {
    "title": "PSFree 增强版",
    "ps4FwCompatible": `PS4 固件：{ps4fw} | 兼容`,
    "ps4FwIncompatible": `PS4 固件：{ps4fw} | 不兼容`,
    "notPs4": "当前不是 PS4，平台：",
    "clickToStart": "点击开始",
    "chooseHEN": "选择你的 HEN 类型",
    "exploitStatusHeader": "Exploit 状态",
    "payloadsHeader": "Payload",
    "settingsBtnTitle": "设置",
    "aboutMenu": "关于",
    "payloadsToolsHeader": "工具",
    "payloadsGameHeader": "游戏",
    "payloadsLinuxHeader": "Linux",
    "payloadsCustomHeader": "自定义",
    "customPayloadHint": "上传自定义 payload 文件。",
    "aboutPsfreeHeader": "关于 PSFree 增强版",
    "aboutVersion": "版本：2.0",
    "aboutDescription": "一个功能丰富的网页界面，可用于破解你的PS4",
    "closeButton": "关闭",
    "settingsPsfreeHeader": "PSFree 设置",
    "ps4FirmwareSupportedHeader": "支持的 PS4 固件",
    "languageHeader": "语言",
    "warnings": {
        "note1": "首次运行 exploit 前，请先删除缓存数据",
        "note2": "请等待缓存过程完整结束，以获得更好的稳定性",
        "note3": "越狱可能需要多次尝试才能成功"
    },
    "secondHostBtn": "通过 GoldHEN 的 PayLoader 加载 Payload - 外部链接",
    "alert": "重要提示",
    "waitingUserInput": "等待用户操作",
    "cache": "正在安装缓存：",
    "ghVer": "GoldHEN 版本",
    "otherVer": "其他版本",
    "latestVer": "最新",
    "fanTitle": "风扇阈值",
    "fanDescription": "设置风扇进入高速运转时的温度阈值",
    "selectTemp": "选择温度",
    "default": "默认",
    "goldhenFirmwareSemiSupported": "* 通过 GoldHEN 的 PayLoader 加载 Payload 在所有固件上都受支持。",
    "showAdvancedPayloads": "显示高级 Payload",
    "optionsHeader": "选项",
    "advanced": "高级",
    "scanPayLoader": "扫描 GoldHEN PayLoader",
    "shutdownServerConfirm": "确定要关闭服务器吗？重新启动前需要再次注入该 Payload。",
    "shutdownServerBtn": "关闭服务器",
    "payLoaderFound": "已在以下地址找到 PayLoader 服务器：",
    "payLoaderNotFound": "未找到 PayLoader 服务器，它是否正在运行？",
    "ps4IpInvalid": "PS4 IP 地址无效",
    "ps4IpPlaceholder": "PS4 IP 地址",
    "ps4FwPlaceholder": "PS4 固件",
    // payloads.js
    "payloadOnlyWithGoldHEN": ".elf Payload 只能通过 GoldHEN 的 PayLoader 加载！",
    "busyBinLoader": "PayLoader 服务器正忙，无法加载 Payload",
    "binLoaderNotDetected": "未检测到 GoldHEN 的 PayLoader，确认已经启用？",
    "disabledBinloader": "GoldHEN 的 PayLoader 未运行，是否改为通过 exploit 加载 Payload？",
    "unsupportedFirmware": "不支持的固件 ",
    "failedToSendToPayLoader": "发送 {payload} 到 PayLoader 失败，地址：",
    "payloadSentToPayLoader": "已将 {payload} 发送到 PayLoader，地址：",
    "customPayloadLoaded": "已加载自定义 Payload：",
    "theme": "主题",
    "defaultTheme": "默认",
    "vibrantColor": "鲜艳",
    "autoJbRetryText": "自动重试越狱",
    "autoJbRetryConfirm": "现在开始越狱吗？如果失败，将自动重试直到成功。",
    "jailbreakCountDown": "{seconds} 秒后重试越狱...",
    "successRate": "成功率：",
    "clearStatsConfirm": "确定要清除越狱统计吗？此操作无法撤销！",
    "payloadCategories": {
        "tools": "工具",
        "linux": "Linux",
        "advanced": "高级"
    },
    "payloadItems": {
        "FTP": {
            "description": "启用 FTP 服务器，方便传输文件。"
        },
        "BinLoader": {
            "description": "启动 9020 端口的 BinLoader 服务器，用于发送 bin Payload。"
        },
        "ElfLoader": {
            "description": "启动 9021 端口的 ElfLoader 服务器，用于发送 elf Payload。"
        },
        "WebSrv": {
            "name": "PS4-Websrv",
            "description": "在 PS4 的 80 端口启动 Web 服务器，方便通过外部设备即时加载 Payload。"
        },
        "DisableUpdates": {
            "name": "禁用更新",
            "description": "禁用系统软件自动更新。"
        },
        "FanThreshold": {
            "name": "风扇阈值",
            "description": "设置 PlayStation 4 的散热风扇曲线。"
        },
        "HistoryBlocker": {
            "name": "历史记录屏蔽",
            "description": "阻止浏览器在启动时记住并返回上次打开的页面。再次运行可启用或禁用。"
        },
        "NpFakeSignin": {
            "name": "NP 假登录",
            "description": "将 PS4 的 PSN 状态设为“已登录”，适合在假激活后使用。"
        },
        "OrbisToolbox": {
            "name": "Orbis 工具箱",
            "description": "修改版 PlayStation UI，可辅助启动和开发 homebrew。"
        },
        "BackupDB": {
            "name": "备份数据库",
            "description": "备份 PS4 的数据库、许可证和用户数据。若需要重新初始化，密钥变化后备份可能无法使用。"
        },
        "RestoreDB": {
            "name": "恢复数据库",
            "description": "恢复“备份数据库”Payload 保存的数据。"
        },
        "ExitIDU": {
            "name": "退出 IDU",
            "description": "退出 IDU 模式并重启主机。"
        },
        "WebRTE": {
            "description": "Web 实时训练器引擎。"
        },
        "App2USB": {
            "name": "App2USB",
            "description": "将已安装应用非官方迁移到外接 USB 存储设备。"
        },
        "Linux1024mb": {
            "name": "Linux 加载器 1GB",
            "description": "适用于所有主机的 Linux 加载器，1GB VRAM。首次安装建议使用。"
        },
        "Linux2048mb": {
            "name": "Linux 加载器 2GB",
            "description": "适用于所有主机的 Linux 加载器，2GB VRAM。"
        },
        "Linux3072mb": {
            "name": "Linux 加载器 3GB",
            "description": "适用于所有主机的 Linux 加载器，3GB VRAM。"
        },
        "Linux4096mb": {
            "name": "Linux 加载器 4GB",
            "description": "适用于所有主机的 Linux 加载器，4GB VRAM。"
        },
        "Linux128mb": {
            "name": "Linux 加载器 128MB",
            "description": "适用于所有主机的 Linux 加载器，128MB VRAM。"
        },
        "Linux256mb": {
            "name": "Linux 加载器 256MB",
            "description": "适用于所有主机的 Linux 加载器，256MB VRAM。"
        },
        "Linux512mb": {
            "name": "Linux 加载器 512MB",
            "description": "适用于所有主机的 Linux 加载器，512MB VRAM。"
        },
        "PS4Debug": {
            "name": "PS4 调试",
            "description": "PS4 调试工具。"
        },
        "PUPDecrypt": {
            "name": "PUP 解密",
            "description": "用于解密 PS4 固件更新文件（PUP）内容的 Payload。"
        },
        "ModuleDumper": {
            "name": "模块导出",
            "description": "将 /system、/system_ex、/update 以及文件系统根目录中的已解密模块导出到 USB 设备。"
        },
        "KernelDumper": {
            "name": "内核导出",
            "description": "导出 PS4 内核。"
        },
        "DisableASLR": {
            "name": "禁用 ASLR",
            "description": "禁用 ASLR（地址空间布局随机化），让内存调试和复现更容易。"
        },
        "PermanentUART": {
            "name": "永久 UART",
            "description": "无需内核补丁即可启用硬件 UART，并可在系统更新后继续保留。"
        },
        "RIFRenamer": {
            "name": "RIF 重命名",
            "description": "将“fake”RIF 重命名为“free”RIF，以获得更好的 HEN 兼容性。若你的 PKG 仅在 Mira+HEN 下可用，可使用此项。"
        }
    }
}
