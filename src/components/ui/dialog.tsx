"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export function Dialog({ children, ...props }: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({
  children,
  ...props
}: DialogPrimitive.DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}

export function DialogContent({
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 bg-black bg-opacity-50"
        {...props} // ✅ Explicitly spread props here to prevent the warning
      />
      <DialogPrimitive.Content className="fixed bg-white p-6 rounded-lg shadow-lg">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
