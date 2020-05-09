'use strict';

const DEBUG_MODE = false;

try {
  getTabStatus()
    .then(status => {
      document.querySelector('#status').textContent = status;
    })
    .catch(error => {
      console.error('Error getting tab status', error);
    });

  document.querySelector('#goToSettingsBtn').textContent = chrome.i18n.getMessage('settings');
  let goToSettingsBtn = document.getElementById('goToSettingsBtn');
  goToSettingsBtn.onclick = function() {
    chrome.runtime.openOptionsPage();
  };
} catch (error) {
  console.error('Error in popup', error);
}

function getTabStatus() {
  return new Promise((resolve, reject) => {
    loadSettings()
      .then(settings => {
        if (settings.defaultSettings) {
          debug('Using default settings!', settings);
          resolve(chrome.i18n.getMessage('usingDefaultSettings'));
          return;
        }

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
          const domains = settings.domains;
          const url = tabs[0].url;

          if (isAllowedDomain(url, domains)) {
            debug('Warning tooltips enabled for this domain', url);
            resolve(chrome.i18n.getMessage('showingTooltips'));
          } else {
            debug('Warning tooltips not enabled for this domain', url);
            resolve(chrome.i18n.getMessage('notShowingTooltips'));
          }
        });
      })
      .catch(error => {
        // TODO Show error with link to issues
        console.error('Error loading settings in options page', error);
        reject(error);
      });
  });
}
