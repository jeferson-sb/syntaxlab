import {
  mount,
  flushPromises,
  type ComponentMountingOptions,
} from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import BookmarkDialog from "../../src/components/BookmarkDialog.vue";

type Props = ComponentMountingOptions<typeof BookmarkDialog>["props"];

describe("<BookmarkDialog />", () => {
  const mountDialog = (props: Props = {}) => {
    return mount(BookmarkDialog, {
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

  it("displays 'Add bookmark' title when in create mode", async () => {
    const wrapper = mountDialog({ mode: "create" });
    await flushPromises();

    expect(wrapper.find(".dialog-title").text()).toContain("Add bookmark");
  });

  it("displays 'Edit bookmark' title when in edit mode", async () => {
    const wrapper = mountDialog({ mode: "edit" });
    await flushPromises();

    expect(wrapper.find(".dialog-title").text()).toContain("Edit bookmark");
  });

  it("disables save button when form is empty", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    const saveButton = wrapper.find("button.save");

    expect(saveButton.attributes("disabled")).toBeDefined();
  });

  it("enables save button when both fields are filled", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#bookmark-title").setValue("React");
    await wrapper.find("#bookmark-url").setValue("https://react.dev");

    const saveButton = wrapper.find("button.save");

    expect(saveButton.attributes("disabled")).toBeUndefined();
  });

  it("emits save event with form data when save button is clicked", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#bookmark-title").setValue("Vue.js");
    await wrapper.find("#bookmark-url").setValue("https://vuejs.org");
    await wrapper.find("button.save").trigger("click");

    expect(wrapper.emitted("save")).toHaveLength(1);
    expect(wrapper.emitted("save")![0]).toEqual([
      { title: "Vue.js", url: "https://vuejs.org" },
    ]);
  });

  it("pre-fills form with initial values in edit mode", async () => {
    const wrapper = mountDialog({
      mode: "edit",
      initialTitle: "GitHub",
      initialUrl: "https://github.com",
    });
    await flushPromises();

    const titleInput = wrapper.find("#bookmark-title")
      .element as HTMLInputElement;
    const urlInput = wrapper.find("#bookmark-url").element as HTMLInputElement;

    expect(titleInput.value).toBe("GitHub");
    expect(urlInput.value).toBe("https://github.com");
  });

  it("closes dialog when save is successful", async () => {
    const wrapper = mountDialog();
    await flushPromises();

    await wrapper.find("#bookmark-title").setValue("Test");
    await wrapper.find("#bookmark-url").setValue("https://test.com");
    await wrapper.find("button.save").trigger("click");

    expect(wrapper.emitted("update:open")).toContainEqual([false]);
  });
});
