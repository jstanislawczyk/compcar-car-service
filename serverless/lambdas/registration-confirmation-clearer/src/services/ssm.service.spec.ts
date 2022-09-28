import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import {SsmService} from './ssm.service';
import {expect} from 'chai';
import {GetParameterResult} from 'aws-sdk/clients/ssm';

describe('SsmService', () => {

  let sandbox: SinonSandbox;
  let ssmDecryptStub: SinonStub;
  let ssmService: SsmService;

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    sandbox = sinon.createSandbox();

    ssmDecryptStub = sandbox.stub();
    AWSMock.mock('SSM', 'getParameter', ssmDecryptStub);

    ssmService = new SsmService();
  });

  afterEach(() => {
    sandbox.restore();
    AWSMock.restore();
  });

  describe('getParameter', () => {
    describe('should get parameter', () => {
      it('with decryption', async () => {
        // Arrange
        const name: string = 'test/MY_PARAMETER';
        const value: string = 'Parameter value';
        const getParameterResult: GetParameterResult = {
          Parameter: {
            Value: value,
          },
        };

        ssmDecryptStub.onFirstCall().resolves(getParameterResult);

        // Act
        const returnedValue: string | undefined = await ssmService.getParameter(name);

        // Assert
        expect(returnedValue).to.be.eql(value);
        expect(ssmDecryptStub).to.be.calledOnceWith({
          Name: name,
          WithDecryption: true,
        });
      });

      it('should get parameter without decryption', async () => {
        // Arrange
        const name: string = 'test/MY_PARAMETER';
        const value: string = 'Parameter value';
        const getParameterResult: GetParameterResult = {
          Parameter: {
            Value: value,
          },
        };

        ssmDecryptStub.onFirstCall().resolves(getParameterResult);

        // Act
        const returnedValue: string | undefined = await ssmService.getParameter(name, false);

        // Assert
        expect(returnedValue).to.be.eql(value);
        expect(ssmDecryptStub).to.be.calledOnceWith({
          Name: name,
          WithDecryption: false,
        });
      });
    });

    it('should get not existing parameter', async () => {
      // Arrange
      ssmDecryptStub.onFirstCall().resolves({});

      // Act
      const returnedValue: string | undefined = await ssmService.getParameter('test/MY_PARAMETER');

      // Assert
      expect(returnedValue).to.be.undefined;
      expect(ssmDecryptStub).to.be.calledOnce;
    });

    it('should handle error', async () => {
      // Arrange
      ssmDecryptStub.onFirstCall().rejects(new Error('Get parameter error'));

      // Act
      const result: Promise<string | undefined> = ssmService.getParameter('test/MY_PARAMETER');

      // Assert
      expect(result).to.be.eventually.rejectedWith('Get parameter error');
    });
  });
});
