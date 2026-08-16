<div align="center">

# WebKitty

<img src="includes/assets/icons/webkitty.svg" width="220" alt="WebKitty Logo">

**WebKitty is a collection of WebKit-based exploit chains for the PS4 console.**

(Formerly known as PSFree Enhanced)

</div>

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
- Unsupported payload loading protection
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
- Firmware-Based Caching
- Up to date

## Supported by this Repository

This table indicates firmware versions for which the _current version_ of this repository provides a functional and tested exploit chain.

| Userland | Kernel | Firmware |
| :--- | :---: | :--- |
| CSSFontFace | lapse + netctrl | 9.00 - 11.02 |
| PSFree | lapse | 7.00 - 9.60 |
| Bad Hoist | sleirsgoevy's kexploit | 6.70 - 6.72 |
| GoldHEN's PayLoader | - | 5.05 - latest |

## TODO List
- [ ] Support lower firmwares by adding other exploits

## Screenshots

<details>
<summary><b>📸 Click here to view Screenshots & Previews</b></summary>
<br>

<table align="center" style="border: none;">
  <tr>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/default-layout-1.png" width="350" alt="Default Layout: Initial Screen">
      <br>
      <b>Default Layout: Initial Screen</b>
    </td>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/default-layout-2.png" width="350" alt="Default Layout: Exploit Screen">
      <br>
      <b>Default Layout: Exploit Screen</b>
    </td>
  </tr>
  <tr>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/compact-layout.png" width="350" alt="Compact Layout (Combined)">
      <br>
      <b>Compact Layout (Combined)</b>
    </td>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/compact-layout-vibrant.png" width="350" alt="Compact Layout (Combined, Vibrant)">
      <br>
      <b>Compact Layout (Vibrant)</b>
    </td>
  </tr>
  <tr>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/settings-vibrant.png" width="350" alt="Settings">
      <br>
      <b>Settings</b>
    </td>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/about-vibrant.png" width="350" alt="About">
      <br>
      <b>About</b>
    </td>
  </tr>
  <tr>
  <td align="center" style="border: none;">
      <img src="includes/assets/showcase/customization-vibrant.png" width="350" alt="Customization">
      <br>
      <b>Customization</b>
    </td>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/about-catppuccino.png" width="350" alt="About Catppuccino">
      <br>
      <b>About Catppuccino</b>
    </td>
  </tr>
  <tr>
  <td align="center" style="border: none;">
      <img src="includes/assets/showcase/catppuccino-layout-1.png" width="350" alt="Catppuccino">
      <br>
      <b>Catppuccino: Initial Screen</b>
    </td>
    <td align="center" style="border: none;">
      <img src="includes/assets/showcase/catppuccino-layout-2.png" width="350" alt="Catppuccino">
      <br>
      <b>Catppuccino: Exploit Screen</b>
    </td>
  </tr>
</table>

- **Independent colors per layout**
- **Multiple languages**
</details>


## Contribution
You can:
- Look at the [languages folder](https://github.com/ArabPixel/WebKitty/tree/main/includes/js/languages) and PR your language!
- Improve the host by modifying, updating, or adding new useful features!
- Report bugs or suggest new features by opening an [issue](https://github.com/ArabPixel/WebKitty/issues/new)!

- In case your PR includes a new file, don't forget to add it to the respective firmware-based manifest files!

## Copyright and Authors

AGPL-3.0-or-later (see [LICENSE](LICENSE)). Part of this repo belongs to the group `anonymous`. We refer to anonymous contributors as "anonymous" as well.

## Credits

- anonymous: for PS4 firmware kernel dumps.
- Al-Azif: for the modular PSFree Lapse and AIO workaround implementations.
- Feyzee61: for the PSFree lapse bundle and 6.7x exploit implementations.
- ntfargo and ufm42: for CSSFontFace userland exploit.
- ufm42: for CSSFontFace NetCtrl and Lapse implementation.
- Dr.Yenyen: for intensive multi-firmware testing.
- Nazky: for being the first host I took a peek at.
- GattoDev: for the WebKitty logo.
- Payload developers: for their payloads.

Check the appropriate files for any **extra** contributors. Unless otherwise stated, everything here can also be credited to us.
