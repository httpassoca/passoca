<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Loader from "$lib/components/Base/AppLoader.svelte";
  import Extension from "$lib/components/Base/AppExtension.svelte";

  const getRandomUser = async (seed: string = "a") => {
    var response = await fetch(`https://randomuser.me/api/?seed=${seed}`);
    var result = await response.json();
    notes.filter((note) => note.seed === seed)[0].user =
      result.results[0].name.first;
    return result;
  };

  let promise;

  const notes: { user: string; seed: string; promise?: any }[] = [
    {
      user: "",
      seed: "ramon",
    },
    {
      user: "",
      seed: "dion",
    },
    {
      user: "",
      seed: "balestrin",
    },
    {
      user: "",
      seed: "julioon",
    },
    {
      user: "",
      seed: "ramoan",
    },
  ];
</script>

<Content page>
  <Title centered>Quick code notes ⚡</Title>
  {#each notes as note (note.seed)}
    <Extension
      title={note.seed}
      on:open={() => (note.promise = note.promise || getRandomUser(note.seed))}
    >
      {#await note.promise}
        <div class="flex justify-center mt-4">
          <Loader />
        </div>
      {:then}
        {note.user}
      {:catch ERROR_VAR}
        <b>Error block</b>
      {/await}
    </Extension>
  {/each}
</Content>
