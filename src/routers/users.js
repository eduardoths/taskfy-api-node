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

  router.patch("/update/:user_id", authMiddleware, async (req, res, next) => {
    const { user_id } = req.params;
    const newInfo = req.body;
    const { ok, errors } = await userService.update(user_id, newInfo);
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  return router;
};

export default UserRouter;
