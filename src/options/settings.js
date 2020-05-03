'use strict';

const DEBUG_MODE = true;

try {
  loadOptions();

  //Initialize settings form
  $('#settingsForm').parsley();
} catch (error) {
  console.log(`Error initializing the settings form`, error);
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

function loadOptions() {
  loadSettings()
    .then(settings => {
      document.getElementById('domains').value = settings.domains.join('\r\n');
      document.getElementById('selector').value = settings.selector;
      document.getElementById('tooltipText').value = settings.tooltipText;
    })
    .catch(error => {
      // TODO Show error
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

  chrome.storage.sync.set({ warningTooltipOptions: settings }, function() {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings', chrome.runtime.lastError.message);
      throw new Error('settings-not-saved');
    }
    debug('Saved settings', settings);

    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}
