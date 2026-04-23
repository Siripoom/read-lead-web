import { createCrudController } from "../../shared/crud/crud.controller";
import { userRolesService } from "./user-roles.service";

export const userRolesController = createCrudController(userRolesService);
