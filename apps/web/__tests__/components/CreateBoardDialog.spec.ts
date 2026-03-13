import {
  mount,
  flushPromises,
  type ComponentMountingOptions,
} from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import CreateBoardDialog from "../../src/components/CreateBoardDialog.vue";

type Props = ComponentMountingOptions<typeof CreateBoardDialog>["props"];

describe("<CreateBoardDialog />", () => {
  const mountDialog = (props: Props = {}) => {
    return mount(CreateBoardDialog, {
      props: {
        open: true,
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

    expect(wrapper.find(".dialog-title").text()).toContain("Create new canvas");
  });

  it("disables create button when name is empty", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    expect(wrapper.find(".btn-create").attributes("disabled")).toBeDefined();
  });

  it("enables create button when name is provided", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#board-name").setValue("My Board");

    expect(wrapper.find(".btn-create").attributes("disabled")).toBeUndefined();
  });

  it("defaults to private visibility", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    const selectedLabel = wrapper.find(
      '[data-selected="true"] .visibility-label',
    );

    expect(selectedLabel.text()).toBe("Private");
  });

  it("allows switching visibility to public", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find('[value="public"]').trigger("click");

    const selectedLabel = wrapper.find(
      '[data-selected="true"] .visibility-label',
    );

    expect(selectedLabel.text()).toBe("Public");
  });

  it("emits create event with name and visibility on submit", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#board-name").setValue("Project Alpha");
    await wrapper.find(".btn-create").trigger("click");

    expect(wrapper.emitted("create")).toHaveLength(1);
    expect(wrapper.emitted("create")![0]).toEqual([
      { name: "Project Alpha", visibility: "private" },
    ]);
  });

  it("closes dialog after successful creation", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#board-name").setValue("Test Board");
    await wrapper.find(".btn-create").trigger("click");

    expect(wrapper.emitted("update:open")).toContainEqual([false]);
  });

  it("trims whitespace from board name", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#board-name").setValue("  Padded Name  ");
    await wrapper.find(".btn-create").trigger("click");

    expect(wrapper.emitted("create")![0]).toEqual([
      { name: "Padded Name", visibility: "private" },
    ]);
  });
});
