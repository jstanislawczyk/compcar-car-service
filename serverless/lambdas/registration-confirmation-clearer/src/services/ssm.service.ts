import {SSM} from 'aws-sdk';
import {GetParameterRequest, GetParameterResult} from 'aws-sdk/clients/ssm';

export class SsmService {

  constructor(
    private readonly ssm: SSM = new SSM(),
  ) {
  }

  public async getParameter(name: string, withDecryption: boolean = true): Promise<string | undefined> {
    const params: GetParameterRequest = {
      Name: name,
      WithDecryption: withDecryption,
    };

    try {
      const getParameterResult: GetParameterResult = await this.ssm.getParameter(params).promise();

      return getParameterResult.Parameter?.Value;
    } catch (error: any) {
      console.log(`KMS decryption failed. Error: ${error.message}`);
      throw error;
    }
  }
}
