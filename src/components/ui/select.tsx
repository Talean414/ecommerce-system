"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

export function Select({ children, ...props }: SelectPrimitive.SelectProps) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

export function SelectTrigger({ children, ...props }: SelectPrimitive.SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger className="border p-2 rounded-md" {...props}>
      {children}
    </SelectPrimitive.Trigger>
  );
}

export function SelectValue(props: SelectPrimitive.SelectValueProps) {
  return <SelectPrimitive.Value {...props} />;
}

export function SelectContent({ children, ...props }: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="bg-white shadow-lg rounded-md p-2" {...props}>
        {children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ children, ...props }: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
      {...props}
    >
      {children}
    </SelectPrimitive.Item>
  );
}
