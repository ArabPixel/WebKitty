# PSFree Enhanced
PSFree Enhanced is a collection of webkit based exploit chains for the PS4 console.
## Features

- **Auto-detection:** Automatically detects console type and firmware version.
- **WebKit Exploits (PSFree, Bad Hoist, CSSFontFace):** Entry point via the console's web browser.
- **Kernel Exploits (Lapse, NetCtrl, Sleirsgoevy's 6.7x):** Escalates privileges to kernel level.
- **Payload Loader:** After successful kernel exploitation it loads a payload or listens for a payload on port 9020.

## Additional features
- Language switcher
- HEN flavor selector
- GoldHEN version selector
- Descriptive payload selection
- Unsuported payload loading protection
- Load payloads with GoldHEN's PayLoader through a mirrored [http host](http://psfree-enhanced.free.nf/)
- Offers more features when hosted locally on a PC or a PS4 using [PS4-Websrv](https://github.com/ArabPixel/ps4-websrv)
  - Send payloads from any smart device to the PS4 
  - Scans the network to find the PS4
- Themes
- Multiple exploit chains
  - PSFree lapse modular and bundle (7.00 - 9.60)
  - CSSFontFace lapse & netctrl (6.00 - 11.02)
  - Bad Hoist + Sleirsgoevy's kernel exploit (6.7x)
- Barebone jailbreak experience
- Using Babel for older firmwares
- Up to date

## Supported by this Repository

This table indicates firmware versions for which the _current version_ of this repository provides a functional and tested exploit chain.

|  Userland          | Kernel                 | Firmware
| :----------------  | :--------------------: | :--------------
| CSSFontFace        | lapse + netctrl        | 6.00 - 11.02
| PSFree             | lapse                  | 7.00 - 9.60
| Bad Hoist          | sleirsgoevy's kexploit | 6.70 - 6.72
| GoldHEN's PayLoader| -                      | 5.05 - latest

* 4.74 was tested and the website functions as intended, however, anything older than 5.05 has no GoldHEN support to load payloads with.

## TODO List
- [ ]  Support lower firmwares by adding other exploits

## Contribution
You can :
- look at the [languages folder](https://github.com/ArabPixel/PSFree-Enhanced/tree/main/includes/js/languages) and PR your language!
-  improve the host by modefying, updating or adding new useful features!
- Report bugs or suggest new features by opening an [issue](https://github.com/ArabPixel/PSFree-Enhanced/issues/new)!

## Copyright and Authors:

AGPL-3.0-or-later (see [LICENSE](LICENSE)). Part of this repo belongs to the group `anonymous`. We refer to anonymous contributors as "anonymous" as well.

## Credits:

- anonymous: for PS4 firmware kernel dumps.
- Al-Azif: for the modular PSFree Lapse and AIO workaround implementations.
- Feyzee61: for the PSFree lapse bundle and 6.7x exploit implementations.
- ntfargo and ufm42: for CSSFontFace userland exploit.
- uf42: for CSSFontFace NetCtrl and Lapse implementation.
- Dr.Yenyen: for intensive multi-firmware testing.
- Nazky: for being the first host I took a peek at.

Check the appropriate files for any **extra** contributors. Unless otherwise stated, everything here can also be credited to us.