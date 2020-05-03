'use strict';

const DEBUG_MODE = true;

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
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
          const domains = settings.domains;
          const hostname = new URL(tabs[0].url).hostname;

          if (isAllowedDomain(domains, hostname)) {
            debug('Warning tooltips enabled for this domain', hostname);
            resolve(chrome.i18n.getMessage('showingTooltips'));
          } else {
            debug('Warning tooltips not enabled for this domain', hostname);
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
