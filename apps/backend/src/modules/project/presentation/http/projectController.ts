import { Elysia, t } from "elysia";
import { registerProjectContainer } from "@/modules/project/container";

export const projectController = new Elysia({ prefix: "/projects" })
  .use(registerProjectContainer())
  .post(
    "/",
    ({ body, status, createProjectUseCase }) => {
      createProjectUseCase(body);
      return status(201);
    },
    {
      body: t.Object({
        name: t.String(),
        userId: t.String(),
        boards: t.Array(t.Any()),
      }),
    }
  )
  .get("/", ({ getProjectsUseCase }) => getProjectsUseCase())
  .patch(
    "/:id",
    async ({ params, body, status, updateProjectUseCase }) => {
      try {
        await updateProjectUseCase({
          value: params.id,
          name: body?.name,
          userId: body?.userId ? { value: body.userId } : undefined,
        });
        return status(204);
      } catch (error) {
        if (error instanceof Error) return status(404, error.message);
      }
    },
    {
      body: t.Optional(
        t.Object({
          name: t.String(),
          userId: t.String(),
        })
      ),
    }
  )
  .delete("/:id", async ({ params, status, deleteProjectUseCase }) => {
    try {
      await deleteProjectUseCase({ value: params.id });
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
