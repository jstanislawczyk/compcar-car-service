import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonSpy} from 'sinon';
import sinonChai from 'sinon-chai';
import {Logger} from './logger';

use(sinonChai);

context('Logger', () => {

  let sandbox: SinonSandbox;
  let initLoggerSpy: SinonSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    initLoggerSpy = sandbox.spy(Logger as any, 'initLogger');
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('log', () => {
    it('should init logger if it is first call', () => {
      // Arrange
      const message: string = 'Log message';

      // Act
      Logger.log(message);

      // Assert
      expect(initLoggerSpy).to.be.calledOnce;
    });

    it('should not init logger if it is already setup', () => {
      // Arrange
      const message: string = 'Log message';

      (Logger as any).logger = {
        log: (level: string, message: string) => {
          console.log(level);
          console.log(message);
        },
      };

      // Act
      Logger.log(message);

      // Assert
      expect(initLoggerSpy).not.to.be.called;
    });
  });
});
