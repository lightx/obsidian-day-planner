<script lang="ts">
  import type { Snippet } from "svelte";

  import { getObsidianContext } from "../../context/obsidian-context";
  import { createAutoScroll, getScrollZones } from "../../util/dom";

  const {
    children,
    onscroll,
    ...rest
  }: {
    children: Snippet<[boolean]>;
    class?: string | string[];
    onscroll?: (event: Event) => void;
  } = $props();

  let isUnderCursor = $state(false);
  let el: HTMLElement | undefined = $state();

  const { startScroll, stopScroll } = createAutoScroll();

  const {
    editContext: { editOperation },
  } = getObsidianContext();

</script>

<div
  bind:this={el}
  class={["scroller", rest.class]}
  style:touch-action={$editOperation ? "none" : "auto"}
  onmouseenter={() => {
    isUnderCursor = true;
  }}
  onmouseleave={() => {
    isUnderCursor = false;
  }}
  onpointerleave={stopScroll}
  onpointermove={(event) => {
    if (!$editOperation || !el) {
      return;
    }

    const scrollZones = getScrollZones(event, el);

    if (scrollZones.isInTopScrollZone) {
      startScroll({ el, direction: "up" });
    } else if (scrollZones.isInBottomScrollZone) {
      startScroll({ el, direction: "down" });
    } else {
      stopScroll();
    }
  }}
  {onscroll}
>
  {@render children(isUnderCursor)}
</div>

<style>
  .scroller {
    display: flex;
    background-color: var(--background-primary);
  }
</style>
