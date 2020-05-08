function debug(message, data) {
  if (DEBUG_MODE) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
}

function loadSettings() {
  const DEFAULT_SETTINGS = {
    domains: ['stackblitz.io'],
    selector: 'button.btn-show-tooltip',
    tooltipText: 'WARNING',
    defaultSettings: true,
  };

  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['warningTooltipOptions'], function(result) {
      try {
        if (chrome.runtime.lastError) {
          console.error('Error loading settings', chrome.runtime.lastError.message);
          throw new Error('settings-not-loaded');
        }
        const settings = result.warningTooltipOptions;
        if (!settings) {
          debug('Using default settings');
          resolve(DEFAULT_SETTINGS);
          return;
        }
        debug('Loaded settings', settings);
        resolve(settings);
      } catch (error) {
        console.error('Error loading settings', error);
        reject(error);
      }
    });
  });
}

function saveSettings(settings) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ warningTooltipOptions: settings }, function() {
      try {
        if (chrome.runtime.lastError) {
          console.error('Error loading settings', chrome.runtime.lastError.message);
          throw new Error('settings-not-saved');
        }
        debug('Saved settings', settings);
        resolve();
      } catch (error) {
        console.error('Error loading settings', error);
        reject(error);
      }
    });
  });
}

function isAllowedDomain(domains, hostname) {
  // TODO Allow regular expresions in domains
  if (
    _.find(domains, domain => {
      return domain === hostname || `www.${domain}` === hostname;
    })
  ) {
    debug(`Visited page with hostname '${hostname}' in domain list`, domains);
    return true;
  }

  debug(`Visited page with hostname '${hostname}' not in domain list`, domains);
  return false;
}
