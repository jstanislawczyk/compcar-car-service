import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {PaintingRepository} from '../repositories/painting.repository';
import {Painting} from '../models/entities/painting';

@Service()
export class PaintingService {

  constructor(
    @InjectRepository()
    private readonly paintingRepository: PaintingRepository,
  ) {
  }

  public savePainting(painting: Painting): Promise<Painting> {
    return this.paintingRepository.save(painting);
  }
}
