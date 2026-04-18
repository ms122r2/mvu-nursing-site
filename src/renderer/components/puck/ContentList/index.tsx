"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type ContentEntry = {
  id: string;
  title: string;
  slug: string;
  data: Record<string, unknown>;
  published_at: string | null;
};

type ContentListProps = {
  heading: string;
  contentTypeId: string;
  limit: number;
  layout: "grid" | "list" | "cards";
  columns: "2" | "3" | "4";
  showDate: boolean;
  showExcerpt: boolean;
  items?: ContentEntry[];
  puck?: { isEditing: boolean };
};

export const contentListConfig: ComponentConfig<ContentListProps> = {
  label: "Content List (CMS)",
  fields: {
    heading: { type: "text", label: "Section Heading" },
    contentTypeId: { type: "text", label: "Content Type ID" },
    limit: { type: "number", label: "Max Items", min: 1, max: 50 },
    layout: {
      type: "select",
      label: "Layout",
      options: [
        { label: "Card Grid", value: "cards" },
        { label: "Simple Grid", value: "grid" },
        { label: "List", value: "list" },
      ],
    },
    columns: {
      type: "radio",
      label: "Columns",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    showDate: {
      type: "radio",
      label: "Show Date",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showExcerpt: {
      type: "radio",
      label: "Show Excerpt",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Latest Content",
    contentTypeId: "",
    limit: 6,
    layout: "cards",
    columns: "3",
    showDate: true,
    showExcerpt: true,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  resolveData: async ({ props }) => {
    if (!props.contentTypeId || (props.items && props.items.length > 0)) {
      return { props };
    }
    try {
      const res = await fetch(
        `/api/puck/content?type_id=${props.contentTypeId}&limit=${props.limit}`
      );
      if (!res.ok) return { props };
      const items = await res.json();
      return { props: { ...props, items }, readOnly: { items: true } };
    } catch {
      return { props };
    }
  },
  render: ContentList,
};

const PLACEHOLDER_ITEMS: ContentEntry[] = [
  { id: "1", title: "Getting Started with Online Learning", slug: "/blog/online-learning", data: { excerpt: "Tips for succeeding in your online program." }, published_at: "2026-04-01T00:00:00Z" },
  { id: "2", title: "Career Paths in Human Services", slug: "/blog/career-paths", data: { excerpt: "Explore the diverse careers available with a human services degree." }, published_at: "2026-03-28T00:00:00Z" },
  { id: "3", title: "Financial Aid Guide 2026", slug: "/blog/financial-aid", data: { excerpt: "Everything you need to know about funding your education." }, published_at: "2026-03-15T00:00:00Z" },
];

const colClasses = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

export function ContentList(allProps: ContentListProps) {
  const { heading, layout, columns, showDate, showExcerpt, items, contentTypeId, puck, ...rest } = allProps;

  const entries = items && items.length > 0 ? items : puck?.isEditing ? PLACEHOLDER_ITEMS : [];

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {heading && (
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              {heading}
            </h2>
          )}

          {entries.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">
              {puck?.isEditing
                ? "Enter a Content Type ID to load dynamic content"
                : "No content available."}
            </p>
          )}

          {layout === "list" ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="border-b border-slate-100 pb-4">
                  <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                  {showExcerpt && entry.data?.excerpt != null && (
                    <p className="mt-1 text-sm text-slate-600">{String(entry.data.excerpt)}</p>
                  )}
                  {showDate && entry.published_at && (
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(entry.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${colClasses[columns]}`}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`${
                    layout === "cards"
                      ? "rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                      : ""
                  }`}
                >
                  <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                  {showExcerpt && entry.data?.excerpt != null && (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                      {String(entry.data.excerpt)}
                    </p>
                  )}
                  {showDate && entry.published_at && (
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(entry.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </StyleWrapper>
  );
}
