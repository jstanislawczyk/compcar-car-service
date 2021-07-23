import {Service} from 'typedi';
import {PaintingService} from '../services/painting.service';
import {ColorService} from '../services/color.service';
import {Painting} from '../models/entities/painting';

@Service()
export class PaintingColorFacade {

  constructor(
    private readonly paintingService: PaintingService,
    private readonly colorService: ColorService,
  ) {
  }

  public async savePaintingWithColor(painting: Painting, colorId: number): Promise<Painting> {
    painting.color = await this.colorService.findColorById(colorId);

    return this.paintingService.savePainting(painting);
  }
}
