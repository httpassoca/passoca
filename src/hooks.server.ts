import type { Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { presetStyleTag } from "$lib/preset-themes";

// Paraglide middleware: handles locale detection + localized URL strategy.
export const handle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(
    event.request,
    ({ request: localizedRequest, locale }) => {
      event.request = localizedRequest;

      return resolve(event, {
        transformPageChunk: ({ html }) =>
          html.replace("%lang%", locale).replace("%presets.css%", presetStyleTag),
      });
    }
  );
