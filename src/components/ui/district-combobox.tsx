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
  placeholder = "Select District",
  disabledDistrictId,
  id,
}: DistrictComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDistrict = allDistricts.find((d) => d.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-bd-navy-900/80 border-white/10 text-left font-normal text-foreground hover:bg-bd-navy-800 hover:border-bd-teal-500/50 h-12 rounded-xl transition-all"
        >
          <div className="flex items-center gap-2.5 truncate">
            <MapPin className="h-4 w-4 text-bd-teal-400 shrink-0" />
            {selectedDistrict ? (
              <span className="truncate">
                {selectedDistrict.name}{" "}
                <span className="text-xs text-muted-foreground">({selectedDistrict.nameBn})</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-bd-navy-900 border-white/10 text-foreground shadow-2xl z-50">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search district (e.g. Dhaka, Cox's Bazar)..."
            className="h-11 border-b border-white/10 text-foreground placeholder:text-muted-foreground"
          />
          <CommandList className="max-h-[300px] overflow-y-auto p-1">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No district found.
            </CommandEmpty>
            {divisions.map((div) => (
              <CommandGroup
                key={div.name}
                heading={`${div.name} Division (${div.nameBn})`}
                className="text-xs font-semibold text-bd-teal-400/80 px-2 py-1.5"
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
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors text-foreground hover:bg-bd-navy-800 hover:text-bd-teal-400",
                        value === district.id && "bg-bd-teal-500/10 text-bd-teal-400 font-medium",
                        isDisabled && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className="flex flex-col">
                        <span>{district.name}</span>
                        <span className="text-xs text-muted-foreground">{district.nameBn}</span>
                      </div>
                      {value === district.id && <Check className="h-4 w-4 text-bd-teal-400" />}
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
