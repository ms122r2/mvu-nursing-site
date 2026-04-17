"use client";

import { useEffect, useRef } from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import {
  StyleWrapper,
  extractStyleProps,
} from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type CodeEmbedProps = {
  html: string;
  css: string;
  hideInEditor: boolean;
  puck?: { isEditing: boolean };
};

export const codeEmbedConfig: ComponentConfig<CodeEmbedProps> = {
  label: "Custom Code",
  fields: {
    html: {
      type: "textarea",
      label: "HTML Code",
    },
    css: {
      type: "textarea",
      label: "CSS (optional)",
    },
    hideInEditor: {
      type: "radio",
      label: "Hide Preview in Editor",
      options: [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    html: "<!-- Your custom HTML here -->",
    css: "",
    hideInEditor: false,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: CodeEmbed,
};

export function CodeEmbed(allProps: CodeEmbedProps) {
  const { html, css, hideInEditor, puck, ...rest } = allProps;
  const containerRef = useRef<HTMLDivElement>(null);

  // Inject CSS as a scoped <style> tag
  useEffect(() => {
    if (!containerRef.current || !css || puck?.isEditing) return;
    const style = document.createElement("style");
    style.textContent = css;
    containerRef.current.appendChild(style);
    return () => {
      style.remove();
    };
  }, [css, puck?.isEditing]);

  if (puck?.isEditing && hideInEditor) {
    return (
      <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <div className="text-2xl mb-2">🖥️</div>
          <p className="text-sm font-medium text-slate-500">Custom Code Block</p>
          <p className="text-xs text-slate-400 mt-1">Hidden in editor — visible on published page</p>
        </div>
      </StyleWrapper>
    );
  }

  if (puck?.isEditing) {
    return (
      <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">⚠️</span>
            <span className="text-xs font-medium text-amber-700">
              Custom Code Preview (scripts disabled in editor)
            </span>
          </div>
          <div
            className="rounded bg-white p-3 border border-amber-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </StyleWrapper>
    );
  }

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
    </StyleWrapper>
  );
}
