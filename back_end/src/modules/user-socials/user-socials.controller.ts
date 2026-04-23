import { createCrudController } from "../../shared/crud/crud.controller";
import { userSocialsService } from "./user-socials.service";

export const userSocialsController = createCrudController(userSocialsService);
