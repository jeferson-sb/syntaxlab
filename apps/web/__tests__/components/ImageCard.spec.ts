import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ImageCard from "../../src/components/blocks/ImageCard.vue";
import type { ImageBlock } from "../../src/types/block";

const createImageBlock = (
  overrides?: Partial<ImageBlock["props"]>,
): ImageBlock => ({
  id: "image-1",
  type: "image",
  x: 0,
  y: 0,
  props: {
    title: "Landscape",
    href: "https://images.example.com/landscape.jpg",
    ...overrides,
  },
});

describe("<ImageCard />", () => {
  it("renders image metadata title", () => {
    const wrapper = mount(ImageCard, {
      props: {
        block: createImageBlock({ title: "Mountains" }),
      },
    });

    expect(wrapper.get(".image-card__metadata span").text()).toBe("Mountains");
  });

  it("falls back metadata title to Image when missing", () => {
    const wrapper = mount(ImageCard, {
      props: {
        block: createImageBlock({ title: undefined }),
      },
    });

    expect(wrapper.get(".image-card__metadata span").text()).toBe("Image");
  });

  it("renders image attributes from props", () => {
    const wrapper = mount(ImageCard, {
      props: {
        block: createImageBlock({
          title: "Cover",
          href: "https://cdn.example.com/cover.png",
        }),
      },
    });

    const image = wrapper.get("img");

    expect(image.attributes("src")).toBe("https://cdn.example.com/cover.png");
    expect(image.attributes("alt")).toBe("Cover");
    expect(image.attributes("loading")).toBe("lazy");
  });
});
