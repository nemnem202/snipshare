import type { ServerResponse } from "../types/general/response";
import { toast } from "sonner";

export default class Toaster {
  static toastServer(res: ServerResponse) {
    if (res.success) {
      toast.success(res.message, {
        style: {
          background: "var(--background)",
          color: "var(--success)",
          fontWeight: 600,
        },
      });
    } else {
      toast.error(res.message, {
        style: {
          background: "var(--background)",
          color: "var(--error)",
          fontWeight: 600,
        },
      });
    }
  }
}
