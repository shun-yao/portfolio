import { ComponentType } from "react";
import AndroidStartup from "./articles/AndroidStartup";
import HiltInjectionReference from "./articles/HiltInjectionReference";

export const articleRegistry: Record<string, ComponentType> = {
  "android-startup-mechanism": AndroidStartup,
  "hilt-injection-reference": HiltInjectionReference,
};
