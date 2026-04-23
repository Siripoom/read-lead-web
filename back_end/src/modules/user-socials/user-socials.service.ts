import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const userSocialsService = new CrudService(resourceConfigs.userSocials);
