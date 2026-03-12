import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import CodeSnippet from "../../src/components/blocks/CodeSnippet.vue";

const { sanitizeMock, codeToHtmlMock } = vi.hoisted(() => ({
  sanitizeMock: vi.fn((value: string) => value),
  codeToHtmlMock: vi.fn(
    async (value: string) => `<pre><code>${value}</code></pre>`,
  ),
}));

vi.mock("dompurify", () => ({
  default: {
    sanitize: sanitizeMock,
  },
}));

vi.mock("shiki/bundle/web", () => ({
  codeToHtml: codeToHtmlMock,
}));

describe("<CodeSnippet />", () => {
  it("renders highlighted code when not editing", async () => {
    const wrapper = mount(CodeSnippet, {
      props: {
        title: "Snippet",
        inlineCode: "const a = 1;",
        isEditing: false,
      },
    });

    expect(wrapper.find("textarea").exists()).toBe(false);
    await vi.waitFor(() => {
      expect(wrapper.get(".code-snippet__body > div").html()).toContain(
        "<pre><code>const a = 1;</code></pre>",
      );
    });
  });

  it("renders editing textarea and emits update:inlineCode on blur", async () => {
    const onUpdateInlineCode = vi.fn();

    const wrapper = mount(CodeSnippet, {
      props: {
        title: "Snippet",
        inlineCode: "const oldValue = 1;",
        isEditing: true,
        "onUpdate:inlineCode": onUpdateInlineCode,
      },
    });

    const textarea = wrapper.get("textarea");

    await textarea.setValue("const nextValue = 2;");
    await textarea.trigger("blur");

    expect(onUpdateInlineCode).toHaveBeenCalledWith("const nextValue = 2;");
  });
});
