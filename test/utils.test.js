const rewire = require('rewire');
const _ = require('lodash');
const utilsModule = rewire('../src/utils/utils');
const debug = utilsModule.__get__('debug');
const isAllowedDomain = utilsModule.__get__('isAllowedDomain');

describe('Debug logging', () => {
  it('should not log a debug trace to console if DEBUG_MODE = false', async () => {
    const consoleSpy = jest.spyOn(utilsModule.__get__('console'), 'log');

    utilsModule.__set__('DEBUG_MODE', false);
    debug('TEST_MESSAGE');

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should log a debug trace to console if DEBUG_MODE = true', async () => {
    const consoleSpy = jest.spyOn(utilsModule.__get__('console'), 'log');

    utilsModule.__set__('DEBUG_MODE', true);
    debug('TEST_MESSAGE');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('TEST_MESSAGE');

    debug('TEST_MESSAGE', { hello: 'world' });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith('TEST_MESSAGE', { hello: 'world' });
  });
});

describe('Allowed domain check', () => {
  beforeAll(() => {
    utilsModule.__set__('_', _);
    utilsModule.__set__('debug', (msg, data) => {
      // console.log(msg, data);
    });
  });

  it('should check if the hostname of a URL is in the list of allowed domains', async () => {
    let domains = ['google.com', 'github.com'];
    let url =
      'https://www.google.com/search?source=hp&q=warning+tooltip+chrome+extension&oq=warning+tooltip&sclient=psy-ab';
    expect(isAllowedDomain(url, domains)).toBe(true);

    url = 'https://github.com/hmartos';
    expect(isAllowedDomain(url, domains)).toBe(true);

    url = 'https://stackoverflow.com/users/5231262/hmartos';
    expect(isAllowedDomain(url, domains)).toBe(false);

    domains = ['^google.com'];
    url = 'https://www.google.com';
    expect(isAllowedDomain(url, domains)).toBe(false);

    domains = ['.*google.com$'];
    url = 'https://subdomain.www.google.com';
    expect(isAllowedDomain(url, domains)).toBe(true);
  });
});
