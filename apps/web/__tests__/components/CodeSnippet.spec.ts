import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import CodeSnippet from "../../src/components/blocks/CodeSnippet.vue";
import type { CodeBlock } from "../../src/types/block";

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

const createCodeBlock = (
  overrides?: Partial<CodeBlock["props"]>,
): CodeBlock => ({
  id: "code-1",
  type: "code",
  x: 0,
  y: 0,
  props: {
    title: "Snippet",
    inlineCode: "const a = 1;",
    lang: "ts",
    ...overrides,
  },
});

describe("<CodeSnippet />", () => {
  it("renders highlighted code when not editing", async () => {
    const wrapper = mount(CodeSnippet, {
      props: {
        block: createCodeBlock(),
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

  it("renders editing textarea and commits value on blur", async () => {
    const block = createCodeBlock({ inlineCode: "const oldValue = 1;" });

    const wrapper = mount(CodeSnippet, {
      props: {
        block,
        isEditing: true,
      },
    });

    const textarea = wrapper.get("textarea");

    await textarea.setValue("const nextValue = 2;");
    await textarea.trigger("blur");

    expect(block.props.inlineCode).toBe("const nextValue = 2;");

    await wrapper.setProps({ isEditing: false });
    await vi.waitFor(() => {
      expect(wrapper.get(".code-snippet__body > div").html()).toContain(
        "<pre><code>const nextValue = 2;</code></pre>",
      );
    });
  });
});
