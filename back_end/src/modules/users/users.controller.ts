import { createCrudController } from "../../shared/crud/crud.controller";
import { usersService } from "./users.service";

export const usersController = createCrudController(usersService);
