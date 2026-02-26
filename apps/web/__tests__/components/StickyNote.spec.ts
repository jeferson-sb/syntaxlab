import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import StickyNote from "../../src/components/blocks/StickyNote.vue";
import type { StickyBlock } from "../../src/types/block";

const createStickyBlock = (
  overrides?: Partial<StickyBlock["props"]>,
): StickyBlock => ({
  id: "sticky-1",
  type: "sticky",
  x: 10,
  y: 20,
  props: {
    title: "Ideas",
    content: "Remember to write tests",
    color: "#fff3b0",
    ...overrides,
  },
});

describe("<StickyNote />", () => {
  it("renders title and content when not editing", () => {
    const block = createStickyBlock();

    const wrapper = mount(StickyNote, {
      props: {
        block,
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
        block: createStickyBlock({ title: undefined }),
        isEditing: false,
      },
    });

    expect(wrapper.get(".title").text()).toBe("Untitled");
  });

  it("updates title and content through v-model while editing", async () => {
    const block = createStickyBlock();

    const wrapper = mount(StickyNote, {
      props: {
        block,
        isEditing: true,
      },
    });

    const titleInput = wrapper.get("input.title-input");
    const contentInput = wrapper.get("textarea");

    await titleInput.setValue("Updated title");
    await contentInput.setValue("Updated content");

    expect(block.props.title).toBe("Updated title");
    expect(block.props.content).toBe("Updated content");
  });
});
