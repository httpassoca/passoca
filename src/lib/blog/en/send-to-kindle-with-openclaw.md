---
title: Send-to-Kindle with Openclaw
slug: send-to-kindle-with-openclaw
date: 2026-02-23
description: "Thanks AI for doing my job for me"
tags: [AI, kindle, automation]
---

<script lang="ts">
  import Link from '$lib/components/Base/AppLink.svelte';
</script>

I'm trying to make my <Link to="https://openclaw.ai"> Clawdbot </Link> send stuff to my Kindle. I was used to the <Link to="https://www.amazon.com/sendtokindle"> Send to Kindle </Link> feature from Amazon itself, but I think it's just a wrapper for sending anything to the Kindle email.

So I just need to make it send to this Kindle email, which I already got in my Amazon settings (kinda sketchy to get there because my Kindle account is Brazilian and I just use the .es website).

But to send an email, it's necessary to have one, right? I thought Clawd could create temporary emails to send it, but it can't. So I tried to create a Gmail for it because I don't wanna use my own account for this, then I got some bullshit like: "you cannot use this phone to validate this email, you already have a lot.". Thanks Google for not letting me create an email.

I tried, then, using <Link to="https://proton.me/mail"> Proton Mail </Link>. Discovered that they charge money to use IMAP/SMTP. Fine, I'll use one of my Gmail addresses.

So, now I just need to set SMTP, I guess? Asked the claw, he told me that the way is using OAuth with the Gmail API on Google Cloud. Lead the way, Clawd. Lucky me that I already had Cloud kinda configured due to my <Link to="https://github.com/httpassoca/bloodborne-sudoku"> bloodborne-sudoku </Link> project.

I had to add the email that I would use for Clawd to the whitelist in G Cloud due to my app being in the testing phase. That done, Clawd sent me a link to auth in my browser and get a code to be always authenticated. Then the mail was configured, and I was able to send emails.

Nicely done: I needed to add this Clawd email to the authorized senders for my Kindle (where I also got the email to send to). Then I got errors about the file not being compatible.

Weirdly, the filename was something like `e029cae8-a21a...`. So I thought the problem was some file converting not intended, but after some travels, Clawdbro told me that Kindle doesn't accept MOBI files anymore.

Ok, then I sent an EPUB and it worked, finally. Almost perfect! The book name was "Kindle send"... Just some orders teaching him to name it as it should, and he did it right. Next steps? Making him search books online and ask me what one is to send to Kindle.
