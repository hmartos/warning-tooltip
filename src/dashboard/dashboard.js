'use strict';

// References
//https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340#39332340
//https://stackoverflow.com/questions/39301819/how-to-change-the-html-content-as-its-loading-on-the-page/39334319#39334319
//https://stackoverflow.com/questions/2844565/is-there-a-javascript-jquery-dom-change-listener/39508954#39508954

const DEBUG_MODE = true;

// TODO Extract variables to extension configuration
const domains = ['stackoverflow.com', 'rrhh.tramitapp.com', 'angular.io'];
const selector = 'button';

// Error handler
window.addEventListener('unhandledrejection', function(promiseRejectionEvent) {
  console.error(
    `Something went wrong, sorry... but here is a trace that could help to fix the problem`,
    promiseRejectionEvent
  );
});

// On page update listener - for SPA
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  try {
    if (msg === 'url-update') {
      debug('URL update event triggered');
      const pageUrl = window.location.href;
      debug(`Visited page: '${pageUrl}'`);
      const hostname = window.location.hostname;
      if (_.find(domains, domain => domain === hostname)) {
        debug(`Visited page '${pageUrl}' in domain list`, domains);
        main();
      } else {
        debug(`Visited page '${pageUrl}' not in domain list`, domains);
      }
    }
  } catch (error) {
    console.error(`Something went wrong, sorry... but here is a trace that could help to fix the problem`, error);
  }
});

try {
  const pageUrl = window.location.href;
  const hostname = window.location.hostname;
  if (_.find(domains, domain => domain === hostname)) {
    debug(`Visited page '${pageUrl}' in domain list`, domains);
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    observeRecursively(config, targetNode);
  } else {
    debug(`Visited page '${pageUrl}' not in domain list`, domains);
  }
} catch (error) {
  console.error(`Something went wrong, sorry... but here is a trace that could help to fix the problem`, error);
}

function observeRecursively(config, targetNode) {
  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    main();
    observer.disconnect();

    //TODO setTimeout 0 to delay observer?
    observeRecursively(config, targetNode);
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// FUNCTIONS
//TODO Add selector
function main() {
  let elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    addTooltip(element);
  });
}

function addTooltip(element) {
  const icon = `<span class="material-icons" style="font-size: 18px;color: red;">warning</span>`;
  console.log('Element found!!!', element);

  // Tooltip
  element.classList.add('hm-tooltip-warning');

  let tooltip = document.createElement('span');
  tooltip.classList.add('hm-tooltip-warning-text');

  // Icon
  // let tooltipIcon = document.createElement('span');
  // tooltipIcon.classList.add('material-icons');
  // tooltipIcon.innerText = 'warning';
  //tooltip.appendChild(tooltipIcon);

  let tooltipText = document.createElement('span');
  //TODO Extract variable to extension configuration
  tooltipText.innerText = 'PRODUCCION!';
  tooltip.appendChild(tooltipText);

  element.appendChild(tooltip);
}
