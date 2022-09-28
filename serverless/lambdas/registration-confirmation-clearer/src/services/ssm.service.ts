import {SSM} from 'aws-sdk';
import {Logger} from '../../../../../src/common/logger';
import {GetParameterRequest, GetParameterResult} from 'aws-sdk/clients/ssm';

export class SsmService {

  public async getParameter(name: string, withDecryption: boolean = true): Promise<string | undefined> {
    const ssm: SSM = new SSM();
    const params: GetParameterRequest = {
      Name: name,
      WithDecryption: withDecryption,
    };

    try {
      const getParameterResult: GetParameterResult = await ssm.getParameter(params).promise();

      return getParameterResult.Parameter?.Value;
    } catch (error: any) {
      Logger.log(`KMS decryption failed. Error: ${error.message}`);
      throw error;
    }
  }
}
