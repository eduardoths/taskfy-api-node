import { Router } from "express";

const UserRouter = (controllerContainer, serviceContainer, authMiddleware) => {
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

  router.patch("/update", authMiddleware, async (req, res, next) => {
    const { id } = res.locals.user;
    const newInfo = req.body;
    const { ok, errors } = await userService.update(id, newInfo);
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  return router;
};

export default UserRouter;
