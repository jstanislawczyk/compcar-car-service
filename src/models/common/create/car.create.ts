import {BodyStyle} from '../../enums/body-style';

export class CarCreate {

  public readonly name: string;
  public readonly description: string;
  public readonly basePrice: number;
  public readonly startYear: number;
  public readonly endYear?: number;
  public readonly weight: number;
  public readonly bodyStyle: BodyStyle;
  public readonly generationId: number;
  public readonly photosIds?: number[];
  public readonly carAddonsIds?: number[];
  public readonly carEnginesIds?: number[];
  public readonly paintingIds?: number[];
}
