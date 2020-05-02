'use strict';

// References
//https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340#39332340
//https://stackoverflow.com/questions/39301819/how-to-change-the-html-content-as-its-loading-on-the-page/39334319#39334319
//https://stackoverflow.com/questions/2844565/is-there-a-javascript-jquery-dom-change-listener/39508954#39508954
//https://stackoverflow.com/questions/38663247/mutationobserver-only-do-something-if-nodes-added-not-removed

// TODO Popup redirect to settings https://developer.chrome.com/extensions/options#linking

const DEBUG_MODE = true;

// Error handler
window.addEventListener('unhandledrejection', function(promiseRejectionEvent) {
  console.error(
    `Something went wrong, sorry... but here is a trace that could help to fix the problem`,
    promiseRejectionEvent
  );
});

chrome.storage.sync.get(['warningTooltipOptions'], function(result) {
  try {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings', chrome.runtime.lastError.message);
      throw new Error('settings-not-loaded');
    }
    const settings = result.warningTooltipOptions;
    debug('Successfully loaded settings', settings);

    setOnPageUpdateListener(settings);

    main(settings);
  } catch (error) {
    console.error(`Something went wrong, sorry... but here is a trace that could help to fix the problem`, error);
  }
});

// On page update listener - for SPA
function setOnPageUpdateListener(settings) {
  debug('Setting page update listener for SPA routers');
  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    try {
      if (msg === 'url-update') {
        debug('URL update event triggered');

        main(settings, true);
      }
    } catch (error) {
      console.error(`Something went wrong, sorry... but here is a trace that could help to fix the problem`, error);
    }
  });
}

function main(settings, spa) {
  const domains = settings.domains;
  const selector = settings.selector.trim();
  debug('Configured domains', domains);
  debug(`Configured selector '${selector}'`);

  const pageUrl = window.location.href;
  const hostname = window.location.hostname;
  // TODO Control domains with or without www
  if (_.find(domains, domain => domain === hostname)) {
    debug(`Visited page '${pageUrl}' with hostname '${hostname}' in domain list`, domains);
    if (spa) {
      addTooltipToElements(selector, settings);
      return;
    }

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    observeRecursively(targetNode, config, selector, settings);
  } else {
    debug(`Visited page '${pageUrl}' with hostname '${hostname}' not in domain list`, domains);
  }
}

function observeRecursively(targetNode, config, selector, settings) {
  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    addTooltipToElements(selector, settings);
    observer.disconnect();

    observeRecursively(targetNode, config, selector, settings);
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function addTooltipToElements(selector, settings) {
  debug(`Selecting DOM elements by selector '${selector}'`);
  let elements = document.querySelectorAll(selector);
  let count = 0;
  elements.forEach(element => {
    if (!_.find(element.classList, elementClass => elementClass === 'hm-tooltip-warning')) {
      addTooltip(element, settings);
      count++;
    }
  });
  debug(`Added warning tooltips to ${count} DOM elenents by selector '${selector}'`);
}

// TODO Tooltips not showing i.e. google.com input[type='submit']
function addTooltip(element, settings) {
  element.classList.add('hm-tooltip-warning');

  let tooltip = document.createElement('span');
  tooltip.classList.add('hm-tooltip-warning-text');

  // Icon
  // const icon = `<span class="material-icons" style="font-size: 18px;color: red;">warning</span>`;
  // let tooltipIcon = document.createElement('span');
  // tooltipIcon.classList.add('material-icons');
  // tooltipIcon.innerText = 'warning';
  //tooltip.appendChild(tooltipIcon);

  let tooltipText = document.createElement('span');
  tooltipText.innerText = settings.tooltipText;
  tooltip.appendChild(tooltipText);

  element.appendChild(tooltip);
}
