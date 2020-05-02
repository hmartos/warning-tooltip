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
    console.error('Error saving options', error);
  }
});

function loadOptions() {
  chrome.storage.sync.get(['warningTooltipOptions'], function(result) {
    if (chrome.runtime.lastError) {
      console.error('Error loading options', chrome.runtime.lastError.message);
      throw new Error('options-not-loaded');
    }
    const options = result.warningTooltipOptions;
    debug('Loaded options', options);
    document.getElementById('domains').value = options.domains.join('\r\n');
    document.getElementById('selector').value = options.selector;
    document.getElementById('tooltipText').value = options.tooltipText;
  });
}

function saveOptions() {
  const options = {
    domains: document
      .getElementById('domains')
      .value.trim()
      .split(/\r?\n/),
    selector: document.getElementById('selector').value.trim(),
    tooltipText: document.getElementById('tooltipText').value.trim(),
  };

  chrome.storage.sync.set({ warningTooltipOptions: options }, function() {
    if (chrome.runtime.lastError) {
      console.error('Error loading options', chrome.runtime.lastError.message);
      throw new Error('options-not-saved');
    }
    debug('Saved options', options);

    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}
