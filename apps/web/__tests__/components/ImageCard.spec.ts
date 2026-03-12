import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ImageCard from "../../src/components/blocks/ImageCard.vue";

describe("<ImageCard />", () => {
  it("renders image metadata title", () => {
    const wrapper = mount(ImageCard, {
      props: {
        title: "Mountains",
        src: "https://images.example.com/landscape.jpg",
      },
    });

    expect(wrapper.get(".image-card__metadata span").text()).toBe("Mountains");
  });

  it("falls back metadata title to Image when missing", () => {
    const wrapper = mount(ImageCard, {
      props: {
        title: undefined,
        src: "https://images.example.com/landscape.jpg",
      },
    });

    expect(wrapper.get(".image-card__metadata span").text()).toBe("Image");
  });

  it("renders image attributes from props", () => {
    const wrapper = mount(ImageCard, {
      props: {
        title: "Cover",
        src: "https://cdn.example.com/cover.png",
      },
    });

    const image = wrapper.get("img");

    expect(image.attributes("src")).toBe("https://cdn.example.com/cover.png");
    expect(image.attributes("alt")).toBe("Cover");
    expect(image.attributes("loading")).toBe("lazy");
  });
});
