import { Router } from "express";

const UserRouter = (controllerContainer, serviceContainer) => {
  const userController = controllerContainer.UserController;
  const userService = serviceContainer.UserService;
  var router = Router();

  router.post("/signup", async (req, res, next) => {
    const { ok, errors } = await userController.signup(req.body);
    if (errors) return res.status(400).json(errors);
    return res.status(201).json({ data: ok });
  });

  router.post("/signin", async (req, res, next) => {
    const { ok, errors } = await userService.signin(req.body);
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  router.post("/update", async (req, res, next, newInfo) => {
    const { ok, errors } = await userService.update(req.body, newInfo);
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  return router;
};

export default UserRouter;
