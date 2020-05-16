'use strict';

const DEBUG_MODE = false;

try {
  getTabStatus()
    .then(status => {
      const statusInfo = document.querySelector('#status');
      statusInfo.textContent = status.text;
      statusInfo.classList.add(...status.style);
      // TODO Add link to showcase in alert if status if variable is set
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
          const url = tabs[0].url;

          if (isAllowedDomain(url, domains)) {
            debug('Warning tooltips enabled for this domain', url);
            return resolve({ text: chrome.i18n.getMessage('showingTooltips'), style: ['alert', 'alert-success'] });
          } else {
            if (settings.defaultSettings) {
              debug('Using default settings!', settings);
              return resolve({ text: chrome.i18n.getMessage('usingDefaultSettings'), style: ['alert', 'alert-info'] });
            }
            debug('Warning tooltips not enabled for this domain', url);
            return resolve({ text: chrome.i18n.getMessage('notShowingTooltips'), style: ['alert', 'alert-danger'] });
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
