const request = require("supertest");
import app from "../../../app";
import { FakeUser } from "../mock/user";

describe("Create user", () => {
  it("create new user", async () => {
    const user = FakeUser();
    const res = await request(app).post("/users/signup").send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data).toHaveProperty("token");
  });
});
