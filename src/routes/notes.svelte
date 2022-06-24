<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Extension from "$lib/components/Base/AppExtension.svelte";
  import { theme } from "$lib/stores/theme.store";

  const getRandomUser = async () => {
    var response = await fetch("https://randomuser.me/api/");
    var result = await response.json();
    return result;
  };

  let promise;
</script>

<Content page>
  <Title centered>Quick code notes ⚡</Title>
  <Extension
    title="How to install sass on Svelte (with Vite)"
    on:open={() => (promise = getRandomUser())}
  >
    {#await promise}
      <div class="flex justify-center mt-4">
        <lottie-player
          src={`/lottie/${$theme === "coffee" ? "coffee" : "dark"}.json`}
          style="width: 40px; height: 35px; transform: scale(2.2)"
          loop
          autoplay
        />
      </div>
    {:then users}
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
      <b>{users?.results[0].name.first}</b><br />
    {:catch ERROR_VAR}
      <b>Error block</b>
    {/await}
  </Extension>

  <Extension
    ><div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, voluptatum
      ipsum! Esse, optio! Sint inventore saepe dolorem ipsam nihil corrupti hic,
      dolor nemo iusto officia quod sit, placeat impedit tempore!
    </div></Extension
  >
</Content>
