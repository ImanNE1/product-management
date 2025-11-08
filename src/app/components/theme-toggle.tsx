"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center rounded-lg border bg-background p-1">
        <div className="h-8 w-8" />
        <div className="h-8 w-8" />
        <div className="h-8 w-8" />
      </div>
    );
  }

  const active = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="flex items-center rounded-lg border bg-background p-1">
      <Button
        variant={active === "light" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="h-8 w-8 p-0"
        title="Light"
        aria-pressed={active === "light"}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="h-8 w-8 p-0"
        title="System"
        aria-pressed={theme === "system"}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={active === "dark" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="h-8 w-8 p-0"
        title="Dark"
        aria-pressed={active === "dark"}
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );
}