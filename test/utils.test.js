const rewire = require('rewire');
const utilsModule = rewire('../src/utils/utils');
const debug = utilsModule.__get__('debug');

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
