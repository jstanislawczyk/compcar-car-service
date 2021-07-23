import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {PaintingDatabaseUtils} from '../utils/database-utils/painting.database-utils';
import {ColorDatabaseUtils} from '../utils/database-utils/color.database-utils';
import {PaintingCreateInput} from '../../src/models/inputs/painting/painting-create.input';
import {Color} from '../../src/models/entities/color';
import {ColorBuilder} from '../utils/builders/color.builder';
import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {Painting} from '../../src/models/entities/painting';
import {expect} from 'chai';
import {ResponseError} from '../utils/interfaces/response-error';
import {TestValidationError} from '../utils/interfaces/validation-error';

describe('Painting', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await PaintingDatabaseUtils.deleteAllPaintings();
    await ColorDatabaseUtils.deleteAllColors();
  });

  describe('createPainting', () => {
    it('should save painting', async () => {
      // Arrange
      const paintingCreateInput: PaintingCreateInput = {
        price: 123.45,
      };
      const color: Color = new ColorBuilder().build();
      const savedColor: Color = await ColorDatabaseUtils.saveColor(color);

      const query: string = `
        mutation {
          createPainting (
            colorId: ${savedColor.id},
            paintingCreateInput: {
              price: ${paintingCreateInput.price},
            },
          ) {
            id,
            price,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedPaintingResponse: Painting = response.body.data.createPainting as Painting;
      expect(Number(returnedPaintingResponse.id)).to.be.above(0);
      expect(returnedPaintingResponse.price).to.be.eql(123.45);
      expect(returnedPaintingResponse.color).to.be.undefined;
      expect(returnedPaintingResponse.cars).to.be.undefined;

      const savedPainting: Painting = await PaintingDatabaseUtils.getPaintingByIdOrFail(Number(returnedPaintingResponse.id));
      expect(returnedPaintingResponse.id).to.be.be.eql(savedPainting.id?.toString());
      expect(returnedPaintingResponse.price).to.be.be.eql(savedPainting.price);
    });

    describe('should return error', () => {
      it('if validation fails', async () => {
        // Arrange
        const paintingCreateInput: PaintingCreateInput = {
          price: -12.34,
        };

        const query: string = `
          mutation {
            createPainting (
              colorId: 1,
              paintingCreateInput: {
                price: ${paintingCreateInput.price},
              },
            ) {
              id,
              price,
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
        expect(errors).to.have.length(1);

        expect(errors[0].property).to.be.eql('price');
        expect(errors[0].value).to.be.eql(-12.34);
        expect(errors[0].constraints.isPositive).to.be.eql('price must be a positive number');
      });

      it("if color doesn't exist", async () => {
        // Arrange
        const paintingCreateInput: PaintingCreateInput = {
          price: 123.45,
        };
        const notExistingColorId: number = 0;

        const query: string = `
          mutation {
            createPainting (
              colorId: ${notExistingColorId},
              paintingCreateInput: {
                price: ${paintingCreateInput.price},
              },
            ) {
              id,
              price,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`Color with id=${notExistingColorId} not found`);
        expect(error.extensions.code).to.be.eql('NOT_FOUND');
      });
    });
  });
});
