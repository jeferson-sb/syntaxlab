import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { describe, expect, it, vi } from "vitest";

import ToolbarImageUpload from "../../src/components/toolbar/ToolbarImageUpload.vue";
import { useBlockStore } from "../../src/store/block";

describe("<ToolbarImageUpload />", () => {
  const mountComponent = () => {
    return mount(ToolbarImageUpload, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
  };

  it("renders a hidden file input", () => {
    const wrapper = mountComponent();
    const input = wrapper.find('input[type="file"]');

    expect(input.exists()).toBe(true);
    expect(input.attributes("hidden")).toBeDefined();
    expect(input.attributes("accept")).toBe("image/*");
  });

  it("exposes fileInputClick method", () => {
    const wrapper = mountComponent();

    expect(typeof wrapper.vm.fileInputClick).toBe("function");
  });

  it("triggers file input click when fileInputClick is called", () => {
    const wrapper = mountComponent();
    const input = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;

    const clickSpy = vi.spyOn(input, "click");
    const focusSpy = vi.spyOn(input, "focus");

    wrapper.vm.fileInputClick();

    expect(focusSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("does not call appendBlock when no file is selected", async () => {
    const wrapper = mountComponent();
    const blockStore = useBlockStore();
    const input = wrapper.find('input[type="file"]');

    Object.defineProperty(input.element, "files", {
      value: [],
      configurable: true,
    });

    await input.trigger("change");

    expect(blockStore.appendBlock).not.toHaveBeenCalled();
  });
});
