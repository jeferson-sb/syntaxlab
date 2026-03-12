import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import StickyNote from "../../src/components/blocks/StickyNote.vue";

describe("<StickyNote />", () => {
  it("renders title and content when not editing", () => {
    const wrapper = mount(StickyNote, {
      props: {
        title: "Ideas",
        content: "Remember to write tests",
        color: "#fff3b0",
        isEditing: false,
      },
    });

    expect(wrapper.find("input").exists()).toBe(false);
    expect(wrapper.find("textarea").exists()).toBe(false);
    expect(wrapper.get(".title").text()).toBe("Ideas");
    expect(wrapper.get("p").text()).toBe("Remember to write tests");
  });

  it("renders fallback title when title is missing", () => {
    const wrapper = mount(StickyNote, {
      props: {
        title: undefined,
        content: "Some content",
        isEditing: false,
      },
    });

    expect(wrapper.get(".title").text()).toBe("Untitled");
  });

  it("updates title and content through v-model while editing", async () => {
    const onUpdateTitle = vi.fn();
    const onUpdateContent = vi.fn();

    const wrapper = mount(StickyNote, {
      props: {
        title: "Ideas",
        content: "Remember to write tests",
        color: "#fff3b0",
        isEditing: true,
        "onUpdate:title": onUpdateTitle,
        "onUpdate:content": onUpdateContent,
      },
    });

    const titleInput = wrapper.get("input.title-input");
    const contentInput = wrapper.get("textarea");

    await titleInput.setValue("Updated title");
    await contentInput.setValue("Updated content");

    expect(onUpdateTitle).toHaveBeenCalledWith("Updated title");
    expect(onUpdateContent).toHaveBeenCalledWith("Updated content");
  });
});
