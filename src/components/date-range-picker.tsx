"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { id as idLocale, enUS } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/features/admin/lib/format";
import { parseDateOnly, toDateOnlyString } from "@/lib/date-input";
import { cn } from "@/lib/utils";

const calendarLocaleMap = {
  en: enUS,
  id: idLocale,
} as const;

function rangeFromStrings(from: string, to: string): DateRange | undefined {
  const fromDate = parseDateOnly(from);
  const toDate = parseDateOnly(to);
  if (!fromDate && !toDate) return undefined;
  return { from: fromDate, to: toDate };
}

export interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  id,
  disabled,
  placeholder = "Pick a date range",
  className,
}: DateRangePickerProps) {
  const appLocale = useLocale();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const calendarLocale =
    calendarLocaleMap[appLocale as keyof typeof calendarLocaleMap] ?? enUS;

  useEffect(() => {
    if (open) {
      setRange(rangeFromStrings(from, to));
    }
  }, [open, from, to]);

  const label = useMemo(() => {
    const fromDate = parseDateOnly(from);
    const toDate = parseDateOnly(to);
    if (fromDate && toDate) {
      return `${formatDate(fromDate, appLocale)} – ${formatDate(toDate, appLocale)}`;
    }
    if (fromDate) return formatDate(fromDate, appLocale);
    return null;
  }, [from, to, appLocale]);

  function handleSelect(newRange: DateRange | undefined) {
    setRange(newRange);

    if (!newRange?.from) {
      onFromChange("");
      onToChange("");
      return;
    }

    onFromChange(toDateOnlyString(newRange.from));

    if (newRange.to) {
      onToChange(toDateOnlyString(newRange.to));
      setOpen(false);
    } else {
      onToChange("");
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-xl border border-[#d5c3b8] bg-[#faf9f6] px-3.5 text-left text-sm transition-colors",
            "hover:border-[#c4b0a4] focus:border-[#8b5e3c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/15",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !label && "text-[#83746b]/70",
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-[#6f4627]/80" />
          <span className="truncate">{label ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          locale={calendarLocale}
          numberOfMonths={1}
          resetOnSelect
          selected={range}
          onSelect={handleSelect}
          defaultMonth={range?.from ?? range?.to}
        />
      </PopoverContent>
    </Popover>
  );
}
