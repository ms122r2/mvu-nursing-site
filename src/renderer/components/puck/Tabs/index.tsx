"use client";

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type TabItem = {
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  alignment: "left" | "center";
  puck?: { isEditing: boolean };
};

export const tabsConfig: ComponentConfig<TabsProps> = {
  label: "Tabs",
  fields: {
    tabs: {
      type: "array",
      label: "Tabs",
      arrayFields: {
        label: { type: "text", label: "Tab Label" },
      },
      defaultItemProps: { label: "Tab" },
      min: 1,
    },
    alignment: {
      type: "radio",
      label: "Tab Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    tabs: [{ label: "Tab 1" }, { label: "Tab 2" }, { label: "Tab 3" }],
    alignment: "center",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: TabsComponent,
};

export function TabsComponent(allProps: TabsProps) {
  const { tabs, alignment, puck, ...rest } = allProps;
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const isEditing = puck?.isEditing;

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Tab buttons */}
        <div
          className={`flex gap-1 border-b border-slate-200 ${
            alignment === "center" ? "justify-center" : ""
          }`}
        >
          {(tabs ?? []).map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                i === activeIndex
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {i === activeIndex && (
                <m.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  layoutId="tab-indicator"
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }
                  }
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content — each tab is a DropZone. The outer `layout` smooths
            the container's height when switching tabs with different content
            sizes, so the rest of the page doesn't jump. */}
        <m.div
          className="mt-6"
          layout={!reduce}
          transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
        >
          {isEditing ? (
            // In editor: show all tabs' DropZones so designer can add content to any tab
            (tabs ?? []).map((tab, i) => (
              <div
                key={i}
                className={`${
                  i === activeIndex ? "" : "opacity-40 border border-dashed border-slate-200 rounded-lg mt-4"
                }`}
              >
                {i !== activeIndex && (
                  <p className="px-3 py-1 text-xs text-slate-400">
                    {tab.label} (inactive — click tab to preview)
                  </p>
                )}
                <DropZone zone={`tab-${i}`} />
              </div>
            ))
          ) : (
            // On public page: only show active tab
            <AnimatePresence mode="wait">
              <m.div
                key={activeIndex}
                initial={reduce ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <DropZone zone={`tab-${activeIndex}`} />
              </m.div>
            </AnimatePresence>
          )}
        </m.div>
      </div>
    </section>
    </StyleWrapper>
  );
}
