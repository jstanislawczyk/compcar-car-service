import {Service} from 'typedi';
import {Country} from "../models/entities/country";
import {CreateCountryInput} from "../models/inputs/country/create-country.input";

@Service()
export class CountryMapper {

  public toEntity(createCommentInput: CreateCountryInput): Country {
    return {
      name: createCommentInput.name,
      flagPhotoUrl: createCommentInput.flagPhotoUrl,
    };
  }
}
