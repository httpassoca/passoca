<script lang="ts">
  import Button from "$lib/components/Base/AppButton.svelte";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Input from "$lib/components/Base/AppInput.svelte";
  import Textarea from "$lib/components/Base/AppTextarea.svelte";
  import { m } from "$lib/paraglide/messages";

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
      errorMessage = m.contact_missing_api();
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
        errorMessage = txt || m.contact_request_failed({ status: String(res.status) });
        return;
      }

      status = "sent";
      message = "";
      name = "";
      contact = "";
    } catch {
      status = "error";
      errorMessage = m.contact_network_error();
    }
  }
</script>

<Content page>
  <Title centered>{m.contact_title()}</Title>

  <form on:submit|preventDefault={sendMessage} class="flex flex-col gap-4">
    <div>
      <label class="sr-only" for="contact-message">{m.contact_message()}</label>
      <Textarea
        placeholder={m.contact_placeholder_message()}
        bind:value={message}
        id="contact-message"
      />
    </div>

    <div class="flex gap-0 sm:gap-4 flex-col sm:flex-row">
      <div class="w-full">
        <label class="sr-only" for="contact-name">{m.contact_name()}</label>
        <Input
          placeholder={m.contact_placeholder_name()}
          bind:value={name}
          id="contact-name"
        />
      </div>

      <div class="w-full">
        <label class="sr-only" for="contact-handle">{m.contact_contact()}</label>
        <Input
          placeholder={m.contact_placeholder_contact()}
          bind:value={contact}
          id="contact-handle"
        />
      </div>
    </div>

    {#if status === 'error'}
      <p class="text-red-500" role="alert">{errorMessage}</p>
    {/if}
    {#if status === 'sent'}
      <p class="text-green-500" role="status">{m.contact_sent()}</p>
    {/if}

    <Button disabled={status === 'sending'} type="submit">
      {status === 'sending' ? m.contact_sending() : m.contact_send()}
    </Button>
  </form>
</Content>
