import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {TestValidationError} from '../utils/interfaces/validation-error';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {AddonDatabaseUtils} from '../utils/database-utils/addon.database-utils';
import {Addon} from '../../src/models/entities/addon';
import {AddonBuilder} from '../utils/builders/addon.builder';
import {CreateAddonInput} from '../../src/models/inputs/addon/create-addon.input';
import {ResponseError} from '../utils/interfaces/response-error';
import {UpdateAddonInput} from '../../src/models/inputs/addon/update-addon.input';
import {TokenUtils} from '../utils/common/token.utils';
import {UserRole} from '../../src/models/enums/user-role';

describe('Addon', () => {

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () =>
    await AddonDatabaseUtils.deleteAllAddons()
  );

  describe('getAddons', () => {
    it('should get addons', async () => {
      // Arrange
      const addonsList: Addon[] = [
        new AddonBuilder().build(),
        new AddonBuilder()
          .withName('Test addon')
          .withDescription('Test description')
          .build(),
      ];
      const query: string = `
        {
          getAddons {
            id,
            name,
            description,
          }
        }
      `;

      await AddonDatabaseUtils.saveAddonsList(addonsList);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedAddons: Addon[] = response.body.data.getAddons as Addon[];
      expect(returnedAddons).to.have.length(2);

      expect(Number(returnedAddons[0].id)).to.be.be.above(0);
      expect(returnedAddons[0].name).to.be.be.eql('Air conditioner');
      expect(returnedAddons[0].description).to.be.be.eql('Some test addon');
      expect(returnedAddons[0].carAddons).to.be.be.undefined;
      expect(Number(returnedAddons[1].id)).to.be.be.above(0);
      expect(returnedAddons[1].name).to.be.be.eql('Test addon');
      expect(returnedAddons[1].description).to.be.be.eql('Test description');
      expect(returnedAddons[1].carAddons).to.be.be.undefined;

      const existingAddons: Addon[] = await AddonDatabaseUtils.getAllAddons();
      expect(existingAddons).to.have.length(2);

      expect(returnedAddons[0].id).to.be.be.eql(existingAddons[0].id?.toString());
      expect(returnedAddons[0].name).to.be.be.eql(existingAddons[0].name);
      expect(returnedAddons[0].description).to.be.be.eql(existingAddons[0].description);
      expect(returnedAddons[1].id).to.be.be.eql(existingAddons[1].id?.toString());
      expect(returnedAddons[1].name).to.be.be.eql(existingAddons[1].name);
      expect(returnedAddons[1].description).to.be.be.eql(existingAddons[1].description);
    });
  });

  describe('createAddon', () => {
    it('should save addon', async () => {
      // Arrange
      const createAddonInput: CreateAddonInput = {
        name: 'Test addon',
        description: 'Test description',
      };

      const query: string = `
        mutation {
          createAddon (
            createAddonInput: {
              name: "${createAddonInput.name}",
              description: "${createAddonInput.description}",
            }
          ) {
            id,
            name,
            description,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
        .send({ query })
        .expect(200);

      const savedAddonResponse: Addon = response.body.data.createAddon as Addon;
      expect(Number(savedAddonResponse.id)).to.be.above(0);
      expect(savedAddonResponse.name).to.be.eql('Test addon');
      expect(savedAddonResponse.description).to.be.eql('Test description');
      expect(savedAddonResponse.carAddons).to.be.undefined;

      const existingAddon: Addon = await AddonDatabaseUtils.getAddonByIdOrFail(Number(savedAddonResponse.id));
      expect(savedAddonResponse.id).to.be.be.eql(existingAddon.id?.toString());
      expect(savedAddonResponse.name).to.be.be.eql(existingAddon.name);
      expect(savedAddonResponse.description).to.be.be.eql(existingAddon.description);
    });

    describe('should throw error', () => {
      it("if token isn't provided", async () => {
        // Arrange
        const createAddonInput: CreateAddonInput = {
          name: 'Addon name',
          description: 'Another description',
        };

        const query: string = `
          mutation {
            createAddon (
              createAddonInput: {
                name: "${createAddonInput.name}",
                description: "${createAddonInput.description}",
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
        expect(error.message).to.be.eql('jwt must be provided');
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('for non admin user', async () => {
        // Arrange
        const role: UserRole = UserRole.USER;
        const createAddonInput: CreateAddonInput = {
          name: 'Addon name',
          description: 'Another description',
        };

        const query: string = `
          mutation {
            createAddon (
              createAddonInput: {
                name: "${createAddonInput.name}",
                description: "${createAddonInput.description}",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.USER))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`User with role=${role} is not allowed to perform this action`);
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('if validation fails', async () => {
        // Arrange
        const createAddonInput: CreateAddonInput = {
          name: 'n',
          description: 'd',
        };

        const query: string = `
          mutation {
            createAddon (
              createAddonInput: {
                name: "${createAddonInput.name}",
                description: "${createAddonInput.description}",
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
        expect(errors[0].value).to.be.eql('n');
        expect(errors[0].constraints.minLength).to.be.eql('name must be longer than or equal to 2 characters');
        expect(errors[1].property).to.be.eql('description');
        expect(errors[1].value).to.be.eql('d');
        expect(errors[1].constraints.minLength).to.be.eql('description must be longer than or equal to 2 characters');
      });

      it('if addon name already exists', async () => {
        // Arrange
        const addonName: string = 'Test addon';
        const existingAddon = new AddonBuilder()
          .withName(addonName)
          .withDescription('Test description')
          .build();
        const createAddonInput: CreateAddonInput = {
          name: addonName,
          description: 'Another description',
        };

        const query: string = `
          mutation {
            createAddon (
              createAddonInput: {
                name: "${createAddonInput.name}",
                description: "${createAddonInput.description}",
              }
            ) {
              id,
            }
          }
        `;

        await AddonDatabaseUtils.saveAddon(existingAddon);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql("Value 'Test addon' already exists");
        expect(error.extensions.code).to.be.eql('DUPLICATED_ENTRY');
      });
    });
  });

  describe('updateAddon', () => {
    describe('should update addon', () => {
      it('with single property', async () => {
        // Arrange
        const existingAddon: Addon = new AddonBuilder()
          .withName('Old name')
          .withDescription('Old description')
          .build();
        const updateAddonInput: UpdateAddonInput = {
          id: 1,
          description: 'New description',
        };

        await AddonDatabaseUtils.saveAddon(existingAddon);

        const query: string = `
          mutation {
            updateAddon (
              updateAddonInput: {
                id: ${existingAddon.id},
                description: "${updateAddonInput.description}",
              }
            ) {
              id,
              name,
              description,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const savedAddonResponse: Addon = response.body.data.updateAddon as Addon;
        expect(Number(savedAddonResponse.id)).to.be.above(0);
        expect(savedAddonResponse.name).to.be.eql('Old name');
        expect(savedAddonResponse.description).to.be.eql('New description');
        expect(savedAddonResponse.carAddons).to.be.undefined;

        const existingAddonAfterUpdate: Addon = await AddonDatabaseUtils.getAddonByIdOrFail(Number(existingAddon.id));
        expect(savedAddonResponse.id).to.be.be.eql(existingAddonAfterUpdate.id?.toString());
        expect(savedAddonResponse.name).to.be.be.eql(existingAddonAfterUpdate.name);
        expect(savedAddonResponse.description).to.be.be.eql(existingAddonAfterUpdate.description);
      });

      it('with all properties', async () => {
        // Arrange
        const existingAddon: Addon = new AddonBuilder()
          .withName('Existing addon name')
          .withDescription('Old description')
          .build();
        const updateAddonInput: UpdateAddonInput = {
          id: 1,
          name: 'New addon name',
          description: 'New description',
        };

        await AddonDatabaseUtils.saveAddon(existingAddon);

        const query: string = `
          mutation {
            updateAddon (
              updateAddonInput: {
                id: ${existingAddon.id},
                name: "${updateAddonInput.name}",
                description: "${updateAddonInput.description}",
              }
            ) {
              id,
              name,
              description,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
          .send({ query })
          .expect(200);

        const savedAddonResponse: Addon = response.body.data.updateAddon as Addon;
        expect(Number(savedAddonResponse.id)).to.be.above(0);
        expect(savedAddonResponse.name).to.be.eql('New addon name');
        expect(savedAddonResponse.description).to.be.eql('New description');
        expect(savedAddonResponse.carAddons).to.be.undefined;

        const existingAddonAfterUpdate: Addon = await AddonDatabaseUtils.getAddonByIdOrFail(Number(existingAddon.id));
        expect(savedAddonResponse.id).to.be.be.eql(existingAddonAfterUpdate.id?.toString());
        expect(savedAddonResponse.name).to.be.be.eql(existingAddonAfterUpdate.name);
        expect(savedAddonResponse.description).to.be.be.eql(existingAddonAfterUpdate.description);
      });
    });

    describe('should throw error', () => {
      it("if token isn't provided", async () => {
        // Arrange
        const updateAddonInput: UpdateAddonInput = {
          id: 1,
          name: 'name',
        };

        const query: string = `
          mutation {
            updateAddon (
              updateAddonInput: {
                id: 1,
                name: "${updateAddonInput.name}",
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
        expect(error.message).to.be.eql('jwt must be provided');
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it('for non admin user', async () => {
        // Arrange
        const role: UserRole = UserRole.USER;
        const updateAddonInput: UpdateAddonInput = {
          id: 1,
          name: 'name',
        };

        const query: string = `
          mutation {
            updateAddon (
              updateAddonInput: {
                id: 1,
                name: "${updateAddonInput.name}",
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
        const updateAddonInput: UpdateAddonInput = {
          id: 1,
          name: 'n',
          description: 'd',
        };

        const query: string = `
          mutation {
            updateAddon (
              updateAddonInput: {
                id: 1,
                name: "${updateAddonInput.name}",
                description: "${updateAddonInput.description}",
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
        expect(errors[0].value).to.be.eql('n');
        expect(errors[0].constraints.minLength).to.be.eql('name must be longer than or equal to 2 characters');
        expect(errors[1].property).to.be.eql('description');
        expect(errors[1].value).to.be.eql('d');
        expect(errors[1].constraints.minLength).to.be.eql('description must be longer than or equal to 2 characters');
      });

      it('if addon name already exists', async () => {
        // Arrange
        const addonName: string = 'Existing addon';
        const existingAddon = new AddonBuilder()
          .withName(addonName)
          .withDescription('First description')
          .build();
        const existingAddonToUpdate = new AddonBuilder()
          .withName('Test addon')
          .withDescription('First description')
          .build();
        const updateAddonInput: UpdateAddonInput = {
          id: 1,
          name: addonName,
        };

        await AddonDatabaseUtils.saveAddonsList([existingAddon, existingAddonToUpdate]);

        const query: string = `
          mutation {
            updateAddon (
              updateAddonInput: {
                id: ${existingAddonToUpdate.id},
                name: "${updateAddonInput.name}",
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
        expect(error.message).to.be.eql("Value 'Existing addon' already exists");
        expect(error.extensions.code).to.be.eql('DUPLICATED_ENTRY');
      });
    });
  });
});
