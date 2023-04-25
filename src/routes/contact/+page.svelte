<script lang="ts">
  import Button from "$lib/components/Base/AppButton.svelte";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Input from "$lib/components/Base/AppInput.svelte";
  import Textarea from "$lib/components/Base/AppTextarea.svelte";

  let message = "";
  let name = "";
  let contact = "";

  async function sendMessage() {
    const data = { message, name, contact };
    await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    message = "";
    name = "";
    contact = "";
  }
</script>

<Content page>
  <Title centered>Don't be shy! Send a message! 😄</Title>
  <Textarea
    placeholder="What a cool website!! Are you interested in winning a hundred million dollars?"
    bind:value={message}
  />
  <div class="flex gap-0 sm:gap-4 flex-col sm:flex-row">
    <Input placeholder="How should I call you? Heisenberg?" bind:value={name} />
    <Input
      placeholder="Your best contact, like t.me/httpassoca or me@passoca.dev"
      bind:value={contact}
    />
  </div>
  <Button on:click={sendMessage}>Send</Button>
</Content>
