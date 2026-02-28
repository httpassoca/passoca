---
title: Migrando para o Obsidian
slug: moving-to-obsidian
description: Notion é bloated. IAs precisam ler todas as minhas inforamção. Velocidade é o papo.
date: 2026-02-28
tags: [productivity]
---

<script lang="ts">
  import Image from '$lib/components/Base/AppImage.svelte';
</script>

## Table of Contents

##  Motivação
Não vou mentir, eu não queria isso. Eu tentei, múltiplas vezes, migrar pro Obsidian antes. A velocidade e leveza dele sempre me chamaram atenção, enquanto eu esperava meu Notion carregar o database. Mas nesses tempos, o Obsidian ainda não tinha databases (bases). Um dos problemas. O outro? A solução pra este, plugins. Todo obsidianerd que eu via na internet tinha milhares de configs e extensões. Eu já corro perigo usando Linux, onde preciso me afastar dos ricings pra não perder tempo reconfigurando e resolvendo problemas só pra ter uma interface lindíssima que faz todo mundo achar que eu sei o que estou fazendo. Eu não preciso de outras tentações.

Bom, coisas mudaram. E não estou falando das bases (que, honestamente, são horríveis em comparação ao Notion), mas de IA e peso. Com o tempo, meu Notion estava ficando overloaded. Eu passei a sentir mais necessidade de anotar, não gerenciar. Considero que pra maioria desses apps de "information handling", só precisam de três coisas, mas nenhum tem todas as três:
1. Note taking. Escrever, salvar, ver. Notion tem isso? tem, claro, mas vai colocar num banco de dados, vai precisar carregar, vai ter propriedades não setadas, etc. Bloated.
2. Tasks. Como fazer isso no Obsidian? E Notion? Aprenda. Pesquise, compare, teste, perca seu tempo (inclusive é onde estou agora). Não tem built-in, vai ter que fazer seu sistema. Calendário? Ambos tem soluções, mas ruins. Não se compara com qualquer software próprio pra tasks ou calendário.
3. Velocidade. Aqui é onde o Obsidian brilha, e todo resto chora. 

>Há quem resolva tudo? Sim, se você quiser pagar aqueles softwares pra empresa (Atlassian, Microsoft shit, Clikup, etc), mas a maioria eu chamo de company slop. São ferramentas muito pesadas e caras, só valem a pena pra empresas (porque sai mais barato) e raramente são leves.

Porque, então, Obsidian? Eu poderia ter continuado no meu Notion, com meu PARA system, bonitinho, automatizado, integrado com minha própria API. AI. IA. Agents. LLM. Openclaw. Sim, minha IA, meu agente (atualmente nomeado Gepeto, mas possivelmente o futuro Passclaw, Clawssoca, algo assim), tem acesso ao meu Obsidian. Dessa forma eu consigo controlar muito mais facilmente. Com o Notion, eu precisava entrar no app, setar props toda vez que eu quisesse criar uma tarefa, ou registrar um gasto. Agora consigo mandar audio pro meu telegram dizendo "Cerveja com RSF próxima quinta feira a noite". "Analise meus filmes assistidos nesse ano e me recomende o próximo". Por aí vai. 

A filosofia do Obsidian ([File over app](https://stephango.com/file-over-app)) integra muito bem com IAs. Integra muito bem com velocidade. Com GIT. Só não fica bom no celular, mas ter acesso ao Agent (IA) pelo celular resolve o problema.

Além disso, o Obsidian é grátis. A comunidade é melhor, a empresa incentiva a colaboração com os usuários. Há vários plugins bem documentados e fáceis de usar. Git? Não preciso nem comentar. Os caras cobram pra syncar os arquivos e ensinam no próprio site como fazer grátis. Infelizmente, não deixam o código aberto. Mas não faz diferença, é grátis e incentivam a comunidade. [Ofereceram 5K dol pra quem implementasse a função de importar databases do Notion](https://github.com/obsidianmd/obsidian-importer/issues/421). 

##  Processo

Não tinha ideia de como começar a migração. Mais de 4 anos de dados em Notion. Sei que há ferramentas como o Importer, que até faz um ótimo trabalho (tinha testado um longo tempo atrás), mas quis aproveitar pra mover só o essencial.

Bom, já sabendo que deixaria tudo syncado por um private repo no Github, resolvi começar pelos meus documentos. Fácil, fui baixando e joguei tudo numa pasta. O Obsidian, se você tem zero conhecimento sobre, funciona com pastas. Se você desinstalar, ainda vai conseguir acessar tudo e ler tudo por uma pasta (que você mesmo definiu).

Depois? Bom, no meu Notion eu tinha umas databases com vários dados, porque eu gosto de metricar algumas coisas. Livros, Citações, Pessoas (como autores, santos, filósofos), Filmes e Posts. Basicamente propriedades de outras tabelas. Comecei pelo que pensei que fosse mais difícil, Livros e Quotes. Não foi fácil, porque as propriedades são bem chatas de migrar, manualmente. Então o que fiz foi exportar pra CSV e importar pelo Importer. Mas as propriedades não ficavam linkadas, com backlinks (acho que é esse o nome). Fui descobrindo como funcionava, e após uma hora, com ajuda do Clawdssoca, estavam ambas tabelas migradas. Ok, vai ser uma bosta de migrar tudo na mão.

>O Obsidian é muito ruim pra alterar vários arquivos ao mesmo tempo. Eu também não gosto do fato das propriedades serem globais. Por exemplo, eu tenho tags de filmes, tags de posts, tags de livros e etc. Então quando adiciono um filme e vou taggar como "Aventura" aparecem recomendações do gênero "AI", "Personal", que são tags dos meus blog posts. Mas é o tipo de problema que parece significar que eu estou usando a ferramenta de maneira errada. Como vou resolver isso? Não sei, mas vou no futuro.

Passado isso, resolvi importar do meu Notion o que faltava. Seria mais rápido do que ficar fazendo manualmente e selecionando. Importei tudo pelo Importer (uns 500 arquivos btw), numa pasta "Notion", e fui cortando o que já tinha feito ou considerava inútil. Assisti alguns vídeos pra entender como organizar. Resultado: 
<Image post="moving-to-obsidian" img="obsidian-result" alt="screenshot from my obsidian" maxHeight={602} maxWidth={700}/>

##  Ricing?
Plugins (fora genéricos) que estou aprendendo a usar:
- calendar
- keep-the-rhythm
- templater-obsidian
- quickadd
- horizontal-blocks
- slash-complete
- obsidian-icon-folder
- make-md
- settings-search
Pra ser sincero, não acho o obsidian muito bonito. Com certeza vou ter o meu todo cheio de firulagem, mas ainda não é a hora. Precisei adicionar o `.obsidian/workspace.json` ao `.gitignore`, aliás, porque gerava muitos conflitos.

##  Fase atual
Agora estou tentando adaptar meu gerenciamento de projetos e tarefas. O que é um saco, porque não existem tasks aqui. O que chamam de tasks são os checkboxes (faz certo sentido). Na verdade, muitas coisas são diferentes e ainda estou me adaptando. Mas fato seja, é rápido. E meu mano Passclaw sabe tudo. Me ajuda com tudo. Inclusive, mandei ele se "salvar" dentro do meu próprio vault. Ou seja, caso ele exploda, eu só preciso mandar o outro ler minha vault e ele vai saber se comportar exatamente como o Agente antigo. 

##  Next steps
Deixar bonito. Organizar as imagens. Utilizar as propriedades como deveria. Tomar mais notas. 
