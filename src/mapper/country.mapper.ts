import {Service} from 'typedi';
import {Country} from "../models/entities/country";
import {CountryCreateInput} from "../models/inputs/country/country-create.input";

@Service()
export class CountryMapper {

  public toEntity(commentCreateInput: CountryCreateInput): Country {
    return {
      name: commentCreateInput.name,
      flagPhotoUrl: commentCreateInput.flagPhotoUrl,
    };
  }
}
