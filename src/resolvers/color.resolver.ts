import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Color} from '../models/entities/color';
import {ColorService} from '../services/color.service';
import {ColorCreateInput} from '../models/inputs/color/color-create.input';
import {ColorMapper} from '../mapper/color.mapper';

@Service()
@Resolver(() => Color)
export class ColorResolver {

  constructor(
    private readonly colorService: ColorService,
    private readonly colorMapper: ColorMapper,
  ) {
  }

  @Query(() => [Color])
  public async getColors(): Promise<Color[]> {
    Logger.log('Fetching all comments');

    return await this.colorService.findAll();
  }

  @Mutation(() => Color)
  public async createColor(
    @Arg('colorCreateInput') colorCreateInput: ColorCreateInput,
  ): Promise<Color> {
    Logger.log(`Saving new color with name=${colorCreateInput.name}`);

    const color: Color = this.colorMapper.toEntity(colorCreateInput);

    return await this.colorService.saveColor(color);
  }

}
