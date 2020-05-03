'use strict';

const DEBUG_MODE = true;

getTabStatus()
  .then(status => {
    document.querySelector('#status').textContent = status;
  })
  .catch(error => {
    console.error('Error getting tab status', error);
  });

document.querySelector('#goToSettingsBtn span').textContent = chrome.i18n.getMessage('settings');
let goToSettingsBtn = document.getElementById('goToSettingsBtn');
goToSettingsBtn.onclick = function() {
  chrome.runtime.openOptionsPage();
};

function getTabStatus() {
  return new Promise((resolve, reject) => {
    // TODO Extract to utils loadSettings
    chrome.storage.sync.get(['warningTooltipOptions'], function(result) {
      try {
        if (chrome.runtime.lastError) {
          console.error('Error loading settings', chrome.runtime.lastError.message);
          throw new Error('settings-not-loaded');
        }
        const settings = result.warningTooltipOptions;
        debug('Loaded settings', settings);

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
          const hostname = new URL(tabs[0].url).hostname;
          debug('Current tab hostname', hostname);
          // TODO Extract to utils isAllowedDomain
          // TODO Control domains with or without www
          if (_.find(settings.domains, domain => domain === hostname)) {
            debug('Warning tooltips enabled for this domain', hostname);
            resolve(chrome.i18n.getMessage('showingTooltips'));
          } else {
            debug('Warning tooltips not enabled for this domain', hostname);
            resolve(chrome.i18n.getMessage('notShowingTooltips'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}
