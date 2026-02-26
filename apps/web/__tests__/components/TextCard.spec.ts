import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TextCard from "../../src/components/blocks/TextCard.vue";
import type { NoteBlock } from "../../src/types/block";

const createNoteBlock = (content = "Initial content"): NoteBlock => ({
  id: "note-1",
  type: "note",
  x: 24,
  y: 48,
  props: {
    content,
    color: "#fff7cc",
    textSize: "16px",
  },
});

describe("<TextCard />", () => {
  it("renders paragraph content when not editing", () => {
    const block = createNoteBlock("Hello world");

    const wrapper = mount(TextCard, {
      props: {
        block,
        isEditing: false,
      },
    });

    expect(wrapper.find("textarea").exists()).toBe(false);
    expect(wrapper.get("p").text()).toBe("Hello world");
  });

  it("applies style variables from block props", () => {
    const wrapper = mount(TextCard, {
      props: {
        block: createNoteBlock(),
        isEditing: false,
      },
    });

    const style = wrapper.get(".text-card").attributes("style");

    expect(style).toContain("--color: #fff7cc");
    expect(style).toContain("--font-size: 16px");
  });

  it("renders textarea and updates note content with v-model while editing", async () => {
    const block = createNoteBlock("Draft note");

    const wrapper = mount(TextCard, {
      props: {
        block,
        isEditing: true,
      },
    });

    const textarea = wrapper.get("textarea");

    expect((textarea.element as HTMLTextAreaElement).value).toBe("Draft note");

    await textarea.setValue("Updated draft note");

    expect(block.props.content).toBe("Updated draft note");
  });
});
