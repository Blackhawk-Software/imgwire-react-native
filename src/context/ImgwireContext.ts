import { createContext } from "react";
import type { ImgwireClient } from "@imgwire/js";

export const ImgwireContext = createContext<ImgwireClient | null>(null);
