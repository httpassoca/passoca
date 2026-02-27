---
title: Send-to-Kindle with Openclaw
slug: send-to-kindle-with-openclaw
date: 2026-02-23
description: "Thanks AI for doing my job for me"
tags: [AI, kindle, automation]
---

_[Esse artigo foi traduzido pelo gpt]_

<script lang="ts">
  import Link from '$lib/components/Base/AppLink.svelte';
</script>

Eu estou tentando fazer meu <Link to="https://openclaw.ai"> Clawdbot </Link> mandar coisas para o meu Kindle. Eu estava acostumado com a feature <Link to="https://www.amazon.com/sendtokindle"> Send to Kindle </Link> da própria Amazon, mas eu acho que no fim é só um wrapper para enviar qualquer coisa para o e-mail do Kindle.

Então eu só preciso fazer ele enviar para esse e-mail do Kindle, que eu já peguei nas configurações da Amazon (meio sketchy de chegar lá porque minha conta do Kindle é brasileira e eu só uso o site .es).

Mas para mandar um e-mail, é preciso ter um, né? Eu pensei que o Clawd poderia criar e-mails temporários para enviar, mas não pode. Então eu tentei criar um Gmail para isso, porque eu não quero usar minha conta pessoal. Aí eu levei um "you cannot use this phone to validate this email, you already have a lot.". Valeu, Google, por não me deixar criar um e-mail.

Então eu tentei usar o <Link to="https://proton.me/mail"> Proton Mail </Link>. Descobri que eles cobram para usar IMAP/SMTP. Beleza, vou usar um dos meus endereços do Gmail.

Agora eu só preciso configurar SMTP, eu acho? Eu perguntei para o claw e ele me disse que o caminho é usar OAuth com a Gmail API no Google Cloud. Mostra o caminho, Clawd. Ainda bem que eu já tinha o Cloud meio configurado por causa do meu projeto <Link to="https://github.com/httpassoca/bloodborne-sudoku"> bloodborne-sudoku </Link>.

Eu tive que adicionar o e-mail que eu ia usar para o Clawd na whitelist do G Cloud porque meu app estava em fase de testing. Feito isso, o Clawd me mandou um link para autenticar no browser e pegar um código para ficar sempre autenticado. Aí o e-mail ficou configurado e eu consegui enviar.

Bem feito: eu precisei adicionar esse e-mail do Clawd como remetente autorizado no meu Kindle (onde eu também peguei o e-mail para enviar). Aí eu comecei a receber erros sobre o arquivo não ser compatível.

Estranhamente, o nome do arquivo era algo como `e029cae8-a21a...`. Então eu achei que o problema era alguma conversão não intencional, mas depois de algumas voltas, o Clawdbro me disse que o Kindle não aceita mais arquivos MOBI.

Ok: aí eu enviei um EPUB e funcionou, finalmente. Quase perfeito! O nome do livro estava como "Kindle send"... Só precisei dar umas ordens ensinando ele a nomear como deveria, e ele fez certo.

Próximos passos? Fazer ele procurar livros online e me perguntar qual deles é para mandar para o Kindle.
