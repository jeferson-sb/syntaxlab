import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { describe, expect, it, vi } from "vitest";

import BlockRenderer from "../../src/components/BlockRenderer.vue";
import type { AnyBlock } from "../../src/types/block";

describe("<BlockRenderer />", () => {
  const createBlock = (
    type: AnyBlock["type"],
    props: Partial<AnyBlock["props"]> = {},
  ): AnyBlock => ({
    id: "block-1",
    type,
    x: 100,
    y: 200,
    props,
  });

  const mountBlock = (
    block: AnyBlock,
    options: Partial<Parameters<typeof mount>[1]> = {},
  ) => {
    return mount(BlockRenderer, {
      props: {
        block,
        selected: false,
        ...options.props,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          StickyNote: { template: '<div class="sticky-note-stub" />' },
          CodeSnippet: { template: '<div class="code-snippet-stub" />' },
          LinkCard: { template: '<div class="link-card-stub" />' },
          TextCard: { template: '<div class="text-card-stub" />' },
          ImageCard: { template: '<div class="image-card-stub" />' },
        },
      },
    });
  };

  describe("renders correct component for block type", () => {
    it("renders StickyNote for sticky blocks", () => {
      const block = createBlock("sticky", { title: "Hello", content: "World" });
      const wrapper = mountBlock(block);

      expect(wrapper.find(".sticky-note-stub").exists()).toBe(true);
    });

    it("renders CodeSnippet for code blocks", () => {
      const block = createBlock("code", {
        title: "example.ts",
        inlineCode: "const x = 1",
      });
      const wrapper = mountBlock(block);

      expect(wrapper.find(".code-snippet-stub").exists()).toBe(true);
    });

    it("renders LinkCard for bookmark blocks", () => {
      const block = createBlock("bookmark", {
        title: "GitHub",
        href: "https://github.com",
      });
      const wrapper = mountBlock(block);

      expect(wrapper.find(".link-card-stub").exists()).toBe(true);
    });

    it("renders TextCard for note blocks", () => {
      const block = createBlock("note", { content: "My note" });
      const wrapper = mountBlock(block);

      expect(wrapper.find(".text-card-stub").exists()).toBe(true);
    });

    it("renders ImageCard for image blocks", () => {
      const block = createBlock("image", {
        title: "image.png",
        href: "data:image/png",
      });
      const wrapper = mountBlock(block);

      expect(wrapper.find(".image-card-stub").exists()).toBe(true);
    });
  });

  describe("selection and editing", () => {
    it("emits selectBlock on single click", async () => {
      const block = createBlock("sticky");
      const wrapper = mountBlock(block);

      await wrapper.trigger("click");

      expect(wrapper.emitted("selectBlock")).toHaveLength(1);
    });

    it("applies selected class when selected prop is true", () => {
      const block = createBlock("sticky");
      const wrapper = mountBlock(block, {
        props: { block, selected: true },
      });

      expect(wrapper.find(".selected").exists()).toBe(true);
    });

    it("applies link source styling when isLinkSource is true", () => {
      const block = createBlock("sticky");
      const wrapper = mountBlock(block, {
        props: { block, selected: false, isLinkSource: true },
      });

      expect(wrapper.find(".is-link-source").exists()).toBe(true);
    });
  });

  describe("positioning", () => {
    it("positions block at specified coordinates via style", () => {
      const block = createBlock("sticky");
      block.x = 150;
      block.y = 250;

      const wrapper = mountBlock(block);
      const style = wrapper.get(".block").attributes("style");

      expect(style).toContain("left: 150px");
      expect(style).toContain("top: 250px");
    });
  });
});
