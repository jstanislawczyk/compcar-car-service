import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Color} from '../models/entities/color';
import {ColorService} from '../services/color.service';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
import {ColorMapper} from '../mapper/color.mapper';
import {UpdateColorInput} from '../models/inputs/color/update-color.input';
import {ColorUpdate} from '../models/common/update/color-update';

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
    Logger.log('Fetching all colors');

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

  @Mutation(() => Color)
  public async updateColor(
    @Arg('updateColorInput') updateColorInput: UpdateColorInput,
  ): Promise<Color> {
    Logger.log(`Updating color with id=${updateColorInput.id}`);

    const color: ColorUpdate = this.colorMapper.toUpdateModel(updateColorInput);

    return await this.colorService.updateColor(color);
  }
}
