import { Elysia, t } from "elysia";
import { registerProjectContainer } from "@/modules/project/container";
import type { ProjectRepository } from "@/modules/project/domain/Project";

export const makeProjectController = (projectRepository?: ProjectRepository) =>
  new Elysia({ prefix: "/projects" })
    .use(registerProjectContainer({ projectRepository }))
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
      },
    )
    .post(
      "/batch",
      async ({ body, status, batchUpsertProjectsUseCase }) => {
        const results = await batchUpsertProjectsUseCase(body);
        return status(200, { results });
      },
      {
        body: t.Array(
          t.Object({
            clientRef: t.String(),
            name: t.String(),
            userId: t.String(),
            updatedAt: t.String(),
          }),
        ),
      },
    )
    .get("/", ({ getProjectsUseCase }) => getProjectsUseCase())
    .get("/:id", async ({ params, getProjectUseCase, status }) => {
      try {
        return await getProjectUseCase({ value: params.id });
      } catch (error) {
        if (error instanceof Error) return status(404, error.message);
      }
    })
    .patch(
      "/:id",
      async ({ params, body, status, updateProjectUseCase }) => {
        try {
          await updateProjectUseCase({
            id: { value: params.id },
            name: body?.name,
            userId: body?.userId ? { value: body.userId } : undefined,
          });
          return new Response(null, { status: 204 });
        } catch (error) {
          if (error instanceof Error) return status(404, error.message);
        }
      },
      {
        body: t.Object({
          name: t.String(),
          userId: t.Optional(t.String()),
        }),
      },
    )
    .delete("/:id", async ({ params, status, deleteProjectUseCase }) => {
      try {
        await deleteProjectUseCase({ value: params.id });
        return new Response(null, { status: 204 });
      } catch (error) {
        if (error instanceof Error) return status(404, error.message);
      }
    })
    .post(
      "/:id/boards",
      async ({ status, params, body, addBoardToProjectUseCase }) => {
        addBoardToProjectUseCase({ value: params.id }, body.boards);
        return status(201);
      },
      {
        body: t.Object({
          boards: t.Array(t.String()),
        }),
      },
    );

export const projectController = makeProjectController();
