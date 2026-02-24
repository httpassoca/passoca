<script lang="ts">
  import Button from "$lib/components/Base/AppButton.svelte";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Input from "$lib/components/Base/AppInput.svelte";
  import Textarea from "$lib/components/Base/AppTextarea.svelte";

  let message = "";
  let name = "";
  let contact = "";

  let status: "idle" | "sending" | "sent" | "error" = "idle";
  let errorMessage = "";

  async function sendMessage() {
    status = "sending";
    errorMessage = "";

    const api = import.meta.env.VITE_API_URL;
    if (!api) {
      status = "error";
      errorMessage = "Missing API URL (VITE_API_URL).";
      return;
    }

    try {
      const data = { message, name, contact };
      const res = await fetch(`${api}/contact`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        status = "error";
        errorMessage = txt || `Request failed (${res.status}).`;
        return;
      }

      status = "sent";
      message = "";
      name = "";
      contact = "";
    } catch {
      status = "error";
      errorMessage = "Network error. Try again.";
    }
  }
</script>

<Content page>
  <Title centered>Don't be shy! Send a message! 😄</Title>

  <form on:submit|preventDefault={sendMessage} class="flex flex-col gap-4">
    <div>
      <label class="sr-only" for="contact-message">Message</label>
      <Textarea
        placeholder="What a cool website!! Are you interested in winning a hundred million dollars?"
        bind:value={message}
        id="contact-message"
      />
    </div>

    <div class="flex gap-0 sm:gap-4 flex-col sm:flex-row">
      <div class="w-full">
        <label class="sr-only" for="contact-name">Name</label>
        <Input
          placeholder="How should I call you? Heisenberg?"
          bind:value={name}
          id="contact-name"
        />
      </div>

      <div class="w-full">
        <label class="sr-only" for="contact-handle">Contact</label>
        <Input
          placeholder="Your best contact, like t.me/httpassoca or me@passoca.dev"
          bind:value={contact}
          id="contact-handle"
        />
      </div>
    </div>

    {#if status === 'error'}
      <p class="text-red-500" role="alert">{errorMessage}</p>
    {/if}
    {#if status === 'sent'}
      <p class="text-green-500" role="status">Sent!</p>
    {/if}

    <Button disabled={status === 'sending'} type="submit">
      {status === 'sending' ? 'Sending…' : 'Send'}
    </Button>
  </form>
</Content>
