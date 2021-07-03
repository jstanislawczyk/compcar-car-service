import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {TestValidationError} from '../utils/interfaces/validation-error';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ColorDatabaseUtils} from '../utils/database-utils/color.database-utils';
import {Color} from '../../src/models/entities/color';
import {ColorBuilder} from '../utils/builders/color.builder';
import {CreateColorInput} from '../../src/models/inputs/color/create-color.input';
import {ResponseError} from '../utils/interfaces/response-error';

describe('Color', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await ColorDatabaseUtils.deleteAllColors();
  });

  describe('getColors', () => {
    it('should get colors', async () => {
      // Arrange
      const colorsList: Color[] = [
        new ColorBuilder().build(),
        new ColorBuilder()
          .withName('blue')
          .withHexCode('#00F')
          .build(),
      ];
      const query: string = `
        {
          getColors {
            id,
            name,
            hexCode,
          }
        }
      `;

      await ColorDatabaseUtils.saveColorsList(colorsList);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedColors: Color[] = response.body.data.getColors as Color[];
      expect(returnedColors).to.have.length(2);

      expect(Number(returnedColors[0].id)).to.be.be.above(0);
      expect(returnedColors[0].name).to.be.be.eql('red');
      expect(returnedColors[0].hexCode).to.be.be.eql('#F00');
      expect(returnedColors[0].paintings).to.be.be.undefined;
      expect(Number(returnedColors[1].id)).to.be.be.above(0);
      expect(returnedColors[1].name).to.be.be.eql('blue');
      expect(returnedColors[1].hexCode).to.be.be.eql('#00F');
      expect(returnedColors[1].paintings).to.be.be.undefined;

      const existingColors: Color[] = await ColorDatabaseUtils.getAllColors();
      expect(existingColors).to.have.length(2);

      expect(returnedColors[0].id).to.be.be.eql(existingColors[0].id?.toString());
      expect(returnedColors[0].name).to.be.be.eql(existingColors[0].name);
      expect(returnedColors[0].hexCode).to.be.be.eql(existingColors[0].hexCode);
      expect(returnedColors[1].id).to.be.be.eql(existingColors[1].id?.toString());
      expect(returnedColors[1].name).to.be.be.eql(existingColors[1].name);
      expect(returnedColors[1].hexCode).to.be.be.eql(existingColors[1].hexCode);
    });
  });

  describe('createColor', () => {
    it('should fail validation', async () => {
      // Arrange
      const createColorInput: CreateColorInput = {
        name: 'g',
        hexCode: 'SomeWrongHexCode',
      };

      const query: string = `
        mutation {
          createColor (
            createColorInput: {
              name: "${createColorInput.name}",
              hexCode: "${createColorInput.hexCode}",
            }
          ) {
            id,
            name,
            hexCode,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const errorsBody: ResponseError = response.body.errors[0];
      expect(errorsBody.message).to.be.eql('Argument Validation Error');

      const errors: TestValidationError[] = errorsBody.extensions.exception.validationErrors;
      expect(errors).to.have.lengthOf(2);

      expect(errors[0].property).to.be.eql('name');
      expect(errors[0].value).to.be.eql('g');
      expect(errors[0].constraints.minLength).to.be.eql('name must be longer than or equal to 2 characters');
      expect(errors[1].property).to.be.eql('hexCode');
      expect(errors[1].value).to.be.eql('SomeWrongHexCode');
      expect(errors[1].constraints.matches).to.be.eql('Given string is not valid hex code');
    });

    it('should save color', async () => {
      // Arrange
      const createColorInput: CreateColorInput = {
        name: 'green',
        hexCode: '#0F0',
      };

      const query: string = `
        mutation {
          createColor (
            createColorInput: {
              name: "${createColorInput.name}",
              hexCode: "${createColorInput.hexCode}",
            }
          ) {
            id,
            name,
            hexCode,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const savedColorResponse: Color = response.body.data.createColor as Color;
      expect(Number(savedColorResponse.id)).to.be.above(0);
      expect(savedColorResponse.name).to.be.eql('green');
      expect(savedColorResponse.hexCode).to.be.eql('#0F0');
      expect(savedColorResponse.paintings).to.be.undefined;

      const existingColor: Color = await ColorDatabaseUtils.getColorByIdOrFail(Number(savedColorResponse.id));
      expect(savedColorResponse.id).to.be.be.eql(existingColor.id?.toString());
      expect(savedColorResponse.name).to.be.be.eql(existingColor.name);
      expect(savedColorResponse.hexCode).to.be.be.eql(existingColor.hexCode);
    });
  });
});
