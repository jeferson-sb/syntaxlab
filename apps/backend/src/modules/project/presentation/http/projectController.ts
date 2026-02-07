import { Elysia, t } from "elysia";
import { container } from "@/modules/container";

const { createProjectUseCase, getProjectsUseCase, deleteProjectUseCase } =
  container;

export const projectController = new Elysia({ prefix: "/projects" })
  .post("/", ({ body }) => createProjectUseCase(body), {
    body: t.Object({
      name: t.String(),
      userId: t.String(),
      boards: t.Array(t.Any()),
    }),
  })
  .get("/", () => getProjectsUseCase())
  .delete("/:id", async ({ params, status }) => {
    try {
      await deleteProjectUseCase({ value: params.id });
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
