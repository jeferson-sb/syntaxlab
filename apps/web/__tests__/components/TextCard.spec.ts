import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import TextCard from "../../src/components/blocks/TextCard.vue";

describe("<TextCard />", () => {
  it("renders paragraph content when not editing", () => {
    const wrapper = mount(TextCard, {
      props: {
        content: "Hello world",
        isEditing: false,
      },
    });

    expect(wrapper.find("textarea").exists()).toBe(false);
    expect(wrapper.get("p").text()).toBe("Hello world");
  });

  it("renders textarea and emits update:content while editing", async () => {
    const onUpdateContent = vi.fn();

    const wrapper = mount(TextCard, {
      props: {
        content: "Draft note",
        isEditing: true,
        "onUpdate:content": onUpdateContent,
      },
    });

    const textarea = wrapper.get("textarea");

    expect((textarea.element as HTMLTextAreaElement).value).toBe("Draft note");

    await textarea.setValue("Updated draft note");

    expect(onUpdateContent).toHaveBeenCalledWith("Updated draft note");
  });
});
