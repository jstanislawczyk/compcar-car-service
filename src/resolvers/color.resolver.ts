import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Color} from '../models/entities/color';
import {ColorService} from '../services/color.service';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
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
    @Arg('createColorInput') createColorInput: CreateColorInput,
  ): Promise<Color> {
    Logger.log(`Saving new color with name=${createColorInput.name}`);

    const color: Color = this.colorMapper.toEntity(createColorInput);

    return await this.colorService.saveColor(color);
  }

}
