import {Arg, Mutation, Resolver} from 'type-graphql';
import {Painting} from '../models/entities/painting';
import {Service} from 'typedi';
import {PaintingCreateInput} from '../models/inputs/painting/painting-create.input';
import {PaintingMapper} from '../mapper/painting.mapper';
import {PaintingColorFacade} from '../facades/painting-color.facade';

@Service()
@Resolver(() => Painting)
export class PaintingResolver {

  constructor(
    private readonly paintingColorFacade: PaintingColorFacade,
    private readonly paintingMapper: PaintingMapper,
  ) {
  }

  @Mutation(() => Painting)
  public async createPainting(
    @Arg('colorId') colorId: number,
    @Arg('paintingCreateInput') paintingCreateInput: PaintingCreateInput,
  ): Promise<Painting> {
    const painting: Painting = this.paintingMapper.toEntity(paintingCreateInput);

    return await this.paintingColorFacade.savePaintingWithColor(painting, colorId);
  }
}
