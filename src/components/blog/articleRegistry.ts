import { ComponentType } from "react";
import AndroidStartup from "./articles/AndroidStartup";

export const articleRegistry: Record<string, ComponentType> = {
  "android-startup-mechanism": AndroidStartup,
};
