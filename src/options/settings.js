'use strict';

const DEBUG_MODE = false;

try {
  buildSettingsPage();

  loadOptions();

  //Initialize settings form
  $('#settingsForm').parsley();
} catch (error) {
  console.error(`Error initializing the settings form`, error);
}

// Avoid reload of form on submit
$('#settingsForm').on('submit', function(e) {
  debug('Form submitted');
  e.preventDefault();
});

window.Parsley.on('form:error', function() {
  debug('Form validation failed', this.$element);
});

window.Parsley.on('form:success', function() {
  debug('Form validation success', this.$element);
  try {
    saveOptions();
  } catch (error) {
    console.error('Error saving settings', error);
  }
});

function buildSettingsPage() {
  document.querySelector('#title').textContent = `${chrome.i18n.getMessage('extensionTitle')} ${chrome.i18n.getMessage(
    'settings'
  )}`;
  document.querySelector('#domainsContainer label').textContent = chrome.i18n.getMessage('domains');
  document.querySelector('#domainsContainer .hm-info').textContent = chrome.i18n.getMessage('domainsInfo');
  document.querySelector('#selectorContainer label').textContent = chrome.i18n.getMessage('selector');
  document.querySelector('#selectorContainer .hm-info').textContent = chrome.i18n.getMessage('selectorInfo');
  document.querySelector('#tooltipTextContainer label').textContent = chrome.i18n.getMessage('tooltipText');
  document.querySelector('#tooltipTextContainer .hm-info').textContent = chrome.i18n.getMessage('tooltipTextInfo');
  document.querySelector('#save').textContent = chrome.i18n.getMessage('save');
}

function loadOptions() {
  loadSettings()
    .then(settings => {
      document.getElementById('domains').value = settings.domains.join('\r\n');
      document.getElementById('selector').value = settings.selector;
      document.getElementById('tooltipText').value = settings.tooltipText;
    })
    .catch(error => {
      // TODO Show error with link to issues
      console.error('Error loading settings in options page', error);
    });
}

function saveOptions() {
  const settings = {
    domains: document
      .getElementById('domains')
      .value.trim()
      .split(/\r?\n/),
    selector: document.getElementById('selector').value.trim(),
    tooltipText: document.getElementById('tooltipText').value.trim(),
  };

  saveSettings(settings)
    .then(() => {
      var status = document.getElementById('status');
      status.textContent = chrome.i18n.getMessage('savedSettings');
      status.classList.add(['alert', 'alert-success']);
      status.removeAttribute('hidden');
      setTimeout(function() {
        status.textContent = '';
        status.classList.remove(['alert', 'alert-success']);
        status.setAttribute('hidden', true);
      }, 3000);
    })
    .catch(error => {
      // TODO Show error with link to issues
      console.error('Error loading settings in options page', error);
    });
}
