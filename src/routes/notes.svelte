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
        <div>
          {note.user}
        </div>
      {:catch}
        <b>Error 🙃</b> <br />
        <span class="text-red-500"
          >This was not supposed to happen 😢 If you are reading this send a
          message to me@passoca.dev
        </span>
      {/await}
    </Extension>
  {/each}
</Content>
