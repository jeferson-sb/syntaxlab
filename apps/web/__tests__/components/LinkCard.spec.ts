import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import LinkCard from "../../src/components/blocks/LinkCard.vue";
import type { BookmarkBlock } from "../../src/types/block";

const createBookmarkBlock = (
  overrides?: Partial<BookmarkBlock["props"]>,
): BookmarkBlock => ({
  id: "bookmark-1",
  type: "bookmark",
  x: 0,
  y: 0,
  props: {
    title: "Vue",
    href: "https://vuejs.org",
    ...overrides,
  },
});

describe("<LinkCard />", () => {
  it("renders bookmark title", () => {
    const wrapper = mount(LinkCard, {
      props: {
        block: createBookmarkBlock({ title: "Docs" }),
      },
    });

    expect(wrapper.get(".bookmark-body__title").text()).toBe("Docs");
  });

  it("renders accessible external link attributes", () => {
    const url = "https://example.com/page";

    const wrapper = mount(LinkCard, {
      props: {
        block: createBookmarkBlock({ href: url }),
      },
    });

    const link = wrapper.get("a");

    expect(link.attributes("href")).toBe(url);
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.text()).toBe("Open");
  });

  it("shows static link preview label", () => {
    const wrapper = mount(LinkCard, {
      props: {
        block: createBookmarkBlock(),
      },
    });

    expect(wrapper.text()).toContain("link preview");
  });
});
