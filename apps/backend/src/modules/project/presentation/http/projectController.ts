import { Elysia, t } from "elysia";
import { registerProjectContainer } from "@/modules/project/container";

export const projectController = new Elysia({ prefix: "/projects" })
  .use(registerProjectContainer())
  .post("/", ({ body, createProjectUseCase }) => createProjectUseCase(body), {
    body: t.Object({
      name: t.String(),
      userId: t.String(),
      boards: t.Array(t.Any()),
    }),
  })
  .get("/", ({ getProjectsUseCase }) => getProjectsUseCase())
  .delete("/:id", async ({ params, status, deleteProjectUseCase }) => {
    try {
      await deleteProjectUseCase({ value: params.id });
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
