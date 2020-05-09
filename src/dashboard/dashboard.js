'use strict';

// References
//https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340#39332340
//https://stackoverflow.com/questions/39301819/how-to-change-the-html-content-as-its-loading-on-the-page/39334319#39334319
//https://stackoverflow.com/questions/2844565/is-there-a-javascript-jquery-dom-change-listener/39508954#39508954
//https://stackoverflow.com/questions/38663247/mutationobserver-only-do-something-if-nodes-added-not-removed

const DEBUG_MODE = true;

// Error handler
window.addEventListener('unhandledrejection', function(promiseRejectionEvent) {
  console.error(
    `Something went wrong, sorry... but here is a trace that could help to fix the problem`,
    promiseRejectionEvent
  );
});

try {
  loadSettings().then(settings => {
    setOnPageUpdateListener(settings);

    main(settings);
  });
} catch (error) {
  console.error(`Something went wrong, sorry... but here is a trace that could help to fix the problem`, error);
}

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

  if (isAllowedDomain(window.location, domains)) {
    if (spa) {
      addTooltipToElements(selector, settings);
      return;
    }

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    observeRecursively(targetNode, config, selector, settings);
  }
}

function observeRecursively(targetNode, config, selector, settings) {
  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    if (addedNodes(mutationsList)) {
      addTooltipToElements(selector, settings);
    }

    observer.disconnect();

    observeRecursively(targetNode, config, selector, settings);
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function addedNodes(mutations) {
  let hasUpdates = false;

  for (let index = 0; index < mutations.length; index++) {
    const mutation = mutations[index];

    if (mutation.type === 'childList' && mutation.addedNodes.length) {
      hasUpdates = true;
      break;
    }
  }

  return hasUpdates;
}

function addTooltipToElements(selector, settings) {
  let elements = document.querySelectorAll(selector);
  let count = 0;
  elements.forEach(element => {
    if (!_.find(element.classList, elementClass => elementClass === 'hm-tooltip-warning')) {
      addEvent(element, settings);
      count++;
    }
  });
  debug(`Added warning tooltips to ${count} of ${elements.length} DOM elenents found by selector '${selector}'`);
}

function addEvent(element, settings) {
  element.onmouseover = function() {
    console.log('Oh yeah! You are over element', element, settings);
    addTooltip(element, settings);
  };

  element.onmouseleave = function() {
    console.log('Oh yeah! You leave the element', element, settings);
    removeTooltip(element, settings);
  };
}

function addTooltip(element, settings) {
  if (!element.hasChildNodes()) {
    addTooltipElement(element, settings);
  } else {
    let hasTooltipElement = false;
    for (let i = 0; i < element.childNodes.length; i++) {
      if (_.find(element.childNodes[i].classList, elementClass => elementClass === 'hm-tooltip-warning-text')) {
        hasTooltipElement = true;
      }
    }

    if (!hasTooltipElement) {
      addTooltipElement(element, settings);
    }
  }
}

// TODO Tooltips not showing i.e. google.com input[type='submit']
function addTooltipElement(element, settings) {
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

function removeTooltip(element, settings) {
  console.log('Should remove tooltip', element);
  if (element.hasChildNodes()) {
    for (let i = 0; i < element.childNodes.length; i++) {
      if (_.find(element.childNodes[i].classList, elementClass => elementClass === 'hm-tooltip-warning-text')) {
        element.removeChild(element.childNodes[i]);
      }
    }
  }
}
