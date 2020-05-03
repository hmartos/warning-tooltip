<p style="text-align:center" align="center">
  <img src="./src/images/logo48.png" alt="logo">

  <h1 align="center">Warning Tooltip</h1>

  <h4 align="center">Shows a tooltip with a warning over selected DOM elements of allowed domains</h4>
</p>

<p align="center">
  <a href="https://github.com/hmartos/warning-tooltip/actions"><img alt="GitHub Actions status" src="https://github.com/hmartos/warning-tooltip/workflows/Node%20CI/badge.svg"></a>
  <a href="https://github.com/hmartos/warning-tooltip/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/hmartos/warning-tooltip"></a>
</p>

This Chrome extension allows you to show a warning tooltip over specific DOM elements selected with a querySelector. This can be useful to warn a developer of the interaction with a production site, and avoid making undesired or destructive actions on live systems.

![Screenshot](./screenshots/screenshot1_1280x800.png)
![Screenshot](./screenshots/screenshot2_1280x800.png)
![Screenshot](./screenshots/screenshot3_1280x800.png)

## Requirements

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)

## Getting Started

1. Clone the repository `git clone https://github.com/hmartos/warning-tooltip.git`.
2. Open Google Chrome Extension Management page navigating to [chrome://extensions](chrome://extensions).
   The Extension Management page can also be opened by clicking on the Chrome menu, hovering over `More Tools` then selecting `Extensions`.
3. Enable `Developer Mode` by clicking the toggle switch next to Developer mode in the top right corner.
4. Click the `Load Unpacked` button and select the folder `src` inside the cloned repository.

## Running Tests

Execute `npm test` to run unit tests.

## Build

You can generate a zip file with the extension ready to be uploaded to [Google Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)

Just execute `npm run build` and a zip called `warning-tooltip.zip` will be generated.

## License

Copyright 2020 Héctor Martos. Code released under the [MIT License](./LICENSE).
