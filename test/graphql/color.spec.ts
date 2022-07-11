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
import {UpdateColorInput} from '../../src/models/inputs/color/update-color.input';
import {TokenUtils} from '../utils/common/token.utils';
import {UserRole} from '../../src/models/enums/user-role';

describe('Color', () => {

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () =>
    await ColorDatabaseUtils.deleteAllColors()
  );

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
    describe('should save color', () => {
      it('with 3 digit hex code', async () => {
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
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
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

      it('with 6 digit hex code', async () => {
        // Arrange
        const createColorInput: CreateColorInput = {
          name: 'green',
          hexCode: '#00fF00',
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
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
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

    describe('should throw error', () => {
      it("if token isn't provided", async () => {
        // Arrange
        const query: string = `
          mutation {
            createColor (
              createColorInput: {
                name: "green",
                hexCode: "#0F0",
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

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Given token doesn't match pattern 'Bearer token'");
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('for non admin user', async () => {
        // Arrange
        const role: UserRole = UserRole.USER;

        const query: string = `
          mutation {
            createColor (
              createColorInput: {
                name: "green",
                hexCode: "#0F0",
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
          .set('Authorization', TokenUtils.getAuthToken(role))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`User with role=${role} is not allowed to perform this action`);
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('if validation fails', async () => {
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
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
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
        expect(errors[1].constraints.isHexColor).to.be.eql('hexCode must be a hexadecimal color');
      });

      it('if color name already exists', async () => {
        // Arrange
        const colorName: string = 'green';
        const existingColor = new ColorBuilder()
          .withName(colorName)
          .withHexCode('#F00')
          .build();
        const createColorInput: CreateColorInput = {
          name: colorName,
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
            }
          }
        `;

        await ColorDatabaseUtils.saveColor(existingColor);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Value 'green' already exists");
        expect(error.extensions.code).to.be.eql('DUPLICATED_ENTRY');
      });

      it('if hex code already exists', async () => {
        // Arrange
        const hexCode: string = '#F00';
        const existingColor = new ColorBuilder()
          .withName('red')
          .withHexCode(hexCode)
          .build();
        const createColorInput: CreateColorInput = {
          name: 'green',
          hexCode,
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
            }
          }
        `;

        await ColorDatabaseUtils.saveColor(existingColor);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Value '#F00' already exists");
        expect(error.extensions.code).to.be.eql('DUPLICATED_ENTRY');
      });
    });
  });

  describe('updateColor', () => {
    describe('should update color', () => {
      it('all properties', async () => {
        // Arrange
        const existingColor: Color = new ColorBuilder()
          .withName('blue')
          .withHexCode('#00F')
          .build();
        const updateColorInput: UpdateColorInput = {
          id: 1,
          name: 'green',
          hexCode: '#0F0',
        };

        await ColorDatabaseUtils.saveColor(existingColor);

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: ${existingColor.id},
                name: "${updateColorInput.name}",
                hexCode: "${updateColorInput.hexCode}",
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
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const savedColorResponse: Color = response.body.data.updateColor as Color;
        expect(Number(savedColorResponse.id)).to.be.above(0);
        expect(savedColorResponse.name).to.be.eql('green');
        expect(savedColorResponse.hexCode).to.be.eql('#0F0');
        expect(savedColorResponse.paintings).to.be.undefined;

        const existingColorAfterUpdate: Color = await ColorDatabaseUtils.getColorByIdOrFail(Number(existingColor.id));
        expect(savedColorResponse.id).to.be.be.eql(existingColorAfterUpdate.id?.toString());
        expect(savedColorResponse.name).to.be.be.eql(existingColorAfterUpdate.name);
        expect(savedColorResponse.hexCode).to.be.be.eql(existingColorAfterUpdate.hexCode);
      });

      it('with 3 digit hex code', async () => {
        // Arrange
        const existingColor: Color = new ColorBuilder()
          .withName('blue')
          .withHexCode('#00F')
          .build();
        const updateColorInput: UpdateColorInput = {
          id: 1,
          hexCode: '#0F0',
        };

        await ColorDatabaseUtils.saveColor(existingColor);

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: ${existingColor.id},
                hexCode: "${updateColorInput.hexCode}",
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
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const savedColorResponse: Color = response.body.data.updateColor as Color;
        expect(Number(savedColorResponse.id)).to.be.above(0);
        expect(savedColorResponse.name).to.be.eql('blue');
        expect(savedColorResponse.hexCode).to.be.eql('#0F0');
        expect(savedColorResponse.paintings).to.be.undefined;

        const existingColorAfterUpdate: Color = await ColorDatabaseUtils.getColorByIdOrFail(Number(existingColor.id));
        expect(savedColorResponse.id).to.be.be.eql(existingColorAfterUpdate.id?.toString());
        expect(savedColorResponse.name).to.be.be.eql(existingColorAfterUpdate.name);
        expect(savedColorResponse.hexCode).to.be.be.eql(existingColorAfterUpdate.hexCode);
      });

      it('with 6 digit hex code', async () => {
        // Arrange
        const existingColor: Color = new ColorBuilder()
          .withName('blue')
          .withHexCode('#00F')
          .build();
        const updateColorInput: UpdateColorInput = {
          id: 1,
          hexCode: '#00Ff00',
        };

        await ColorDatabaseUtils.saveColor(existingColor);

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: ${existingColor.id},
                hexCode: "${updateColorInput.hexCode}",
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
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const savedColorResponse: Color = response.body.data.updateColor as Color;
        expect(Number(savedColorResponse.id)).to.be.above(0);
        expect(savedColorResponse.name).to.be.eql('blue');
        expect(savedColorResponse.hexCode).to.be.eql('#0F0');
        expect(savedColorResponse.paintings).to.be.undefined;

        const existingColorAfterUpdate: Color = await ColorDatabaseUtils.getColorByIdOrFail(Number(existingColor.id));
        expect(savedColorResponse.id).to.be.be.eql(existingColorAfterUpdate.id?.toString());
        expect(savedColorResponse.name).to.be.be.eql(existingColorAfterUpdate.name);
        expect(savedColorResponse.hexCode).to.be.be.eql(existingColorAfterUpdate.hexCode);
      });
    });

    describe('should throw error', () => {
      it("if token isn't provided", async () => {
        // Arrange
        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: 1,
                hexCode: "'#00F'",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Given token doesn't match pattern 'Bearer token'");
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('for non admin user', async () => {
        // Arrange
        const role: UserRole = UserRole.USER;

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: 1,
                hexCode: "'#00F'",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(role))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`User with role=${role} is not allowed to perform this action`);
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('if validation fails', async () => {
        // Arrange
        const updateColorInput: UpdateColorInput = {
          id: 1,
          name: 'g',
          hexCode: 'SomeWrongHexCode',
        };

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: 1,
                name: "${updateColorInput.name}",
                hexCode: "${updateColorInput.hexCode}",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
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
        expect(errors[1].constraints.isHexColor).to.be.eql('hexCode must be a hexadecimal color');
      });

      it('if color name already exists', async () => {
        // Arrange
        const colorName: string = 'green';
        const existingColor = new ColorBuilder()
          .withName(colorName)
          .withHexCode('#0F0')
          .build();
        const existingColorToUpdate = new ColorBuilder()
          .withName('red')
          .withHexCode('#F00')
          .build();
        const updateColorInput: UpdateColorInput = {
          id: 1,
          name: colorName,
        };

        await ColorDatabaseUtils.saveColorsList([existingColor, existingColorToUpdate]);

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: ${existingColorToUpdate.id},
                name: "${updateColorInput.name}",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Value 'green' already exists");
        expect(error.extensions.code).to.be.eql('DUPLICATED_ENTRY');
      });

      it('if hex code already exists', async () => {
        // Arrange
        const hexCode: string = '#F00';
        const existingColor = new ColorBuilder()
          .withName('red')
          .withHexCode(hexCode)
          .build();
        const existingColorToUpdate = new ColorBuilder()
          .withName('green')
          .withHexCode('#0F0')
          .build();
        const updateColorInput: UpdateColorInput = {
          id: 1,
          hexCode,
        };

        await ColorDatabaseUtils.saveColorsList([existingColor, existingColorToUpdate]);

        const query: string = `
          mutation {
            updateColor (
              updateColorInput: {
                id: ${existingColorToUpdate.id},
                hexCode: "${updateColorInput.hexCode}",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Value '#F00' already exists");
        expect(error.extensions.code).to.be.eql('DUPLICATED_ENTRY');
      });
    });
  });
});
