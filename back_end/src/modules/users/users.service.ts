import { resourceConfigs } from "../resource-config";
import { CrudService } from "../../shared/crud/crud.service";

export const usersService = new CrudService(resourceConfigs.users);
