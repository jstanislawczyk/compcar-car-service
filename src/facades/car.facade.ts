import {Service} from 'typedi';
import {CarService} from '../services/car.service';
import {Car} from '../models/entities/car';
import {CarCreate} from '../models/common/create/car.create';
import {GenerationService} from '../services/generation.service';
import {Generation} from '../models/entities/generation';
import {PhotoService} from '../services/photo.service';
import {Photo} from '../models/entities/photo';

@Service()
export class CarFacade {

  constructor(
    private readonly carService: CarService,
    private readonly generationService: GenerationService,
    private readonly photoService: PhotoService,
  ) {
  }

  public findAllCars(): Promise<Car[]> {
    return this.carService.findAll();
  }

  public findCarById(id: number): Promise<Car> {
    return this.carService.findOne(id);
  }

  public async createCar(carCreate: CarCreate): Promise<Car> {
    const car: Car = await this.buildCar(carCreate);

    return this.carService.saveCar(car);
  }

  private async buildCar(carCreate: CarCreate): Promise<Car> {
    const generation: Generation = await this.generationService.findOne(carCreate.generationId);
    const photos: Photo[] | undefined = carCreate.photosIds && carCreate.photosIds.length > 0
      ? await this.photoService.findRelatedPhotosByIds(carCreate.photosIds)
      : undefined;

    return {
      description: carCreate.description,
      name: carCreate.name,
      basePrice: carCreate.basePrice,
      startYear: carCreate.startYear,
      endYear: carCreate.endYear,
      weight: carCreate.weight,
      bodyStyle: carCreate.bodyStyle,
      generation,
      photos,
    };
  }
}
