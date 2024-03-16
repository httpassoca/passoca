<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";
  import type { PageData } from "./$types";

  type Metadata = {
    title: string;
    slug: string;
    date: string;
    description: string;
    tags: string[];
  };

  export let data: PageData;
  let { page, metadata } = data;
</script>

<svelte:head>
  <title>{metadata.title} | Passoca</title>
  <meta name="title" content={`${metadata.title} | Passoca`} />
  <meta name="description" content={metadata.description} />

  <meta name="og:url" content={`https://passoca.dev/blog/${metadata.slug}`} />
  <meta name="og:title" content={`${metadata.title} | Passoca"`} />
  <meta name="og:description" content={metadata.description} />

  <meta
    name="twitter:url"
    content={`https://passoca.dev/blog/${metadata.slug}`}
  />
  <meta name="twitter:title" content={`${metadata.title} | Passoca"`} />
  <meta name="twitter:description" content={metadata.description} />
</svelte:head>

<h1>{metadata.title}</h1>
<div class="info">{formatDate(metadata.date, true)}</div>
<!-- Here we'll load the component of the blog post page itself -->
<svelte:component this={page} />
