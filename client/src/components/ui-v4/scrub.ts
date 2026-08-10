type Listener = (progress: number) => void;

/**
 * One published value for the hero scrub.
 *
 * The HUD used to run its own animation frame reading a ref, which meant the
 * number could land a frame away from the canvas it is supposed to describe.
 * Here the scrub publishes from inside the canvas tick and every subscriber is
 * called synchronously in that same frame, so they cannot drift.
 */
export function createScrub() {
  let value = 0;
  const listeners = new Set<Listener>();

  return {
    get current() {
      return value;
    },
    /** Called by the hero scrub once per rendered frame. */
    set(progress: number) {
      value = progress;
      listeners.forEach((listener) => listener(progress));
    },
    /** Fires immediately with the current value so late mounts are correct. */
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(value);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export type Scrub = ReturnType<typeof createScrub>;
