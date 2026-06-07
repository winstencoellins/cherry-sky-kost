"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rdp-cherry bg-white p-3 [--cell-size:2.25rem]",
        className,
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "text-sm font-semibold text-[#1a1c1a]",
          defaultClassNames.caption_label,
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-[--cell-size] p-0 text-[#51443c] hover:bg-[#f3f0eb] hover:text-[#6f4627]",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-[--cell-size] p-0 text-[#51443c] hover:bg-[#f3f0eb] hover:text-[#6f4627]",
          defaultClassNames.button_next,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-md text-[0.75rem] font-medium uppercase tracking-wide text-[#83746b]",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          defaultClassNames.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-[--cell-size] p-0 text-sm font-normal text-[#1a1c1a] hover:bg-[#f3f0eb] hover:text-[#6f4627] aria-selected:opacity-100",
          defaultClassNames.day_button,
        ),
        selected:
          "rounded-md bg-[#6f4627] text-white hover:bg-[#805533] hover:text-white focus:bg-[#6f4627] focus:text-white",
        today: "rounded-md bg-[#f5e4d4]/60 text-[#6f4627] font-semibold",
        outside: "text-[#a89b92] aria-selected:text-[#a89b92]",
        disabled: "text-[#c4b8b0] opacity-50",
        range_middle:
          "rounded-none bg-[#f5e4d4]/50 text-[#51443c] aria-selected:bg-[#f5e4d4]/50 aria-selected:text-[#51443c]",
        range_start: "rounded-l-md rounded-r-none",
        range_end: "rounded-r-md rounded-l-none",
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("size-4", chevronClassName)} />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
