<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
  export let { quote } = data;
</script>

<div class="text-base">
  <i>{quote.quote}</i>
  <br />
  <span class="text-gray-500">
    - {quote.author}
    {quote.book && `| ${quote.book}`}
  </span>
</div>
