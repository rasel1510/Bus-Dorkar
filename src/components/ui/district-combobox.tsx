"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { divisions, allDistricts, District } from "@/lib/data/districts";
import { useLanguage } from "@/context/language-context";

interface DistrictComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabledDistrictId?: string;
  id?: string;
}

export function DistrictCombobox({
  value,
  onChange,
  placeholder,
  disabledDistrictId,
  id,
}: DistrictComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { language } = useLanguage();

  const defaultPlaceholder = language === "bn" ? "জেলা নির্বাচন করুন" : "Select District";
  const displayPlaceholder = placeholder || defaultPlaceholder;

  const selectedDistrict = allDistricts.find((d) => d.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-slate-50 border-slate-300 text-left font-semibold text-slate-900 hover:bg-slate-100 hover:border-teal-600 h-12 rounded-xl transition-all"
          />
        }
      >
        <div className="flex items-center gap-2.5 truncate">
          <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
          {selectedDistrict ? (
            <span className="truncate text-slate-900 font-bold">
              {language === "bn" ? (
                <>
                  {selectedDistrict.nameBn}{" "}
                  <span className="text-xs text-slate-500 font-medium">({selectedDistrict.name})</span>
                </>
              ) : (
                <span>{selectedDistrict.name}</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 font-normal">{displayPlaceholder}</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-slate-500" />
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-32px)] sm:w-[320px] max-w-sm p-0 bg-white border-slate-200 text-slate-900 shadow-2xl z-50 rounded-2xl overflow-hidden">
        <Command className="bg-white">
          <CommandInput
            placeholder={
              language === "bn"
                ? "জেলা সার্চ করুন (যেমন: ঢাকা, কক্সবাজার)..."
                : "Search district (e.g. Dhaka, Cox's Bazar)..."
            }
            className="h-11 border-b border-slate-200 text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <CommandList className="max-h-[300px] overflow-y-auto p-1">
            <CommandEmpty className="py-6 text-center text-sm text-slate-500 font-medium">
              {language === "bn" ? "কোনো জেলা পাওয়া যায়নি।" : "No district found."}
            </CommandEmpty>
            {divisions.map((div) => (
              <CommandGroup
                key={div.name}
                heading={
                  language === "bn"
                    ? `${div.nameBn} বিভাগ (${div.name})`
                    : `${div.name} Division`
                }
                className="text-xs font-bold text-teal-700 px-2 py-1.5"
              >
                {div.districts.map((district) => {
                  const isDisabled = district.id === disabledDistrictId;
                  return (
                    <CommandItem
                      key={district.id}
                      value={`${district.name} ${district.nameBn} ${district.division}`}
                      disabled={isDisabled}
                      onSelect={() => {
                        onChange(district.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors text-slate-800 hover:bg-slate-100 hover:text-teal-700",
                        value === district.id && "bg-teal-50 text-teal-700 font-bold",
                        isDisabled && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {language === "bn" ? district.nameBn : district.name}
                        </span>
                        {language === "bn" && (
                          <span className="text-xs text-slate-500 font-normal">
                            {district.name}
                          </span>
                        )}
                      </div>
                      {value === district.id && <Check className="h-4 w-4 text-teal-600" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
