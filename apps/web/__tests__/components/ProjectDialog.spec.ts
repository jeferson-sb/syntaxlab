import {
  mount,
  flushPromises,
  type ComponentMountingOptions,
} from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ProjectDialog from "../../src/components/ProjectDialog.vue";

type Props = ComponentMountingOptions<typeof ProjectDialog>["props"];

describe("<ProjectDialog />", () => {
  const mockProjects = [
    { id: "1", name: "Project Alpha" },
    { id: "2", name: "Project Beta" },
    { id: "3", name: "Project Gamma" },
  ];

  const mountDialog = (props: Props = {}) => {
    return mount(ProjectDialog, {
      props: {
        open: true,
        projects: mockProjects,
        currentProjectId: "1",
        ...props,
      },
      global: {
        stubs: {
          // Stub DialogPortal to render content inline (reka-ui uses DialogPortal, not native Teleport)
          DialogPortal: { template: "<slot />" },
        },
      },
    });
  };

  it("displays dialog title", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    expect(wrapper.find(".dialog-title").text()).toBe("Projects");
  });

  it("shows switch project tab by default", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    const switchTab = wrapper
      .findAll(".tabs-trigger")
      .find((el) => el.text().includes("Switch Project"));

    expect(switchTab?.attributes("data-state")).toBe("active");
  });

  it("displays all projects in the list", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    const projectItems = wrapper.findAll(".project-item");

    expect(projectItems).toHaveLength(3);
    expect(projectItems[0].text()).toContain("Project Alpha");
    expect(projectItems[1].text()).toContain("Project Beta");
    expect(projectItems[2].text()).toContain("Project Gamma");
  });

  it("highlights the current project", async () => {
    const wrapper = mountDialog({ currentProjectId: "2" });
    await flushPromises();

    const activeProject = wrapper.find(".project-item.active");

    expect(activeProject.text()).toContain("Project Beta");
  });

  it("emits select event when clicking a project", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    const projectItems = wrapper.findAll(".project-item");
    await projectItems[1].trigger("click");

    expect(wrapper.emitted("select")).toHaveLength(1);
    expect(wrapper.emitted("select")![0]).toEqual(["2"]);
  });

  it("closes dialog after selecting a project", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    const projectItems = wrapper.findAll(".project-item");
    await projectItems[1].trigger("click");

    expect(wrapper.emitted("update:open")).toContainEqual([false]);
  });

  it("shows empty state when no projects exist", async () => {
    const wrapper = mountDialog({ projects: [] });
    await flushPromises();

    expect(wrapper.find(".empty-state").text()).toContain("No projects yet");
  });
});
