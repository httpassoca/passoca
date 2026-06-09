---
title: Using Whisper AI to learn Italian
slug: using-whisper-ai-to-learn-italian
date: 2024-01-2
description: "Using Whisper AI to sub italian dubbed anime episodes"
tags: [AI, Transcription, Languages]
personal: false
---

_[Esse artigo foi traduzido pelo gpt]_

<script lang="ts">
  import Image from '$lib/components/Base/AppImage.svelte';
  import Link from '$lib/components/Base/AppLink.svelte';
</script>

Um dos meus objetivos de 2024 é aprender a falar, ouvir e escrever em italiano. Eu já tentei uma vez — ou duas… Eu normalmente caio no problema de perder o interesse na língua: eu não tinha nada que mantivesse o idioma presente na minha vida, na minha rotina.

Eu já tentei antes assistir séries italianas populares ou ouvir músicas, e funciona bem, mas o processo de consumir isso fica chato depois de um tempo, porque ou eu não curti a obra, ou eu gastava muito tempo tentando entender cada detalhe.

Então, para resolver isso, dessa vez eu decidi assistir algo fácil: algo em que eu não preciso pegar todos os detalhes e em que não seria tão ruim perder parte da qualidade do conteúdo. Então eu comecei a assistir Dragon Ball Z dublado em italiano 😁

Como eu sou brasileiro, eu consigo entender italiano com certa facilidade, já que ambos são línguas latinas (e eu também estou aprendendo latim 👀). Mas eu ainda tenho um problema enorme: como eu não conheço as palavras, eu não consigo perceber exatamente onde uma palavra termina e a próxima começa. Provavelmente o maior desafio de listening quando você está tentando aprender uma língua nova.

Para me ajudar com isso, eu decidi assistir não só com dublagem em italiano, mas também com legendas. Aí eu descobri o problema que traz a gente para este post: é difícil demais achar animes dublados em italiano _e_ legendados em italiano! Pelo menos para quem não é nativo.

Depois de pesquisar, tentar legendar manualmente o anime, escolher entre conteúdo dublado ou legendado, tentar trocar o anime… eu pensei: _“deve existir um projeto open source para legendar mídia com AI”_ e pesquisei “ai subtitles” no GitHub:

<Image post="using-whisper-ai-to-learn-italian" img="github-search-results" alt="Github results for search 'ai subtitles'" maxHeight={754} maxWidth={604}/>

_Che bello!_ Isso me lembrou do <Link to="https://github.com/openai/whisper"> Whisper AI </Link>. Eu já pago a assinatura do ChatGPT, então eu pensei que, como os dois são da <Link to="https://openai.com/"> Open AI </Link>, eu não precisaria pagar por esse outro serviço. Mas parece que o Whisper AI é… grátis?

Bom: é grátis se você rodar na sua máquina.

A instalação foi bem simples. Eu já tinha Python instalado, então eu só precisei instalar alguns pacotes e ferramentas de rust, mas não levou mais do que 3 minutos para ficar funcionando:

<Image post="using-whisper-ai-to-learn-italian" img="wolves-music-subtitles" alt="whisper ai use in Wolves music" maxHeight={152} maxWidth={700}/>

É bem simples: você escolhe um arquivo com áudio (pode ser um vídeo), ele vai transcrever e ele pode até traduzir para inglês.

No meu caso, eu queria transcrever vídeos em italiano (os episódios de Dragon Ball Z) e exportar como um arquivo `.srt`. Funcionou perfeitamente, no começo. Levou um tempo e não ficou 100% perfeito, mas para mim estava ótimo. A maioria das frases estava correta (eu diria pelo menos 95%).

A gente pode concordar que vozes de anime não são tão “normais” quanto conversas do dia a dia: também tem SFX, nomes específicos, gírias e músicas junto com as falas. E, de alguma forma, parece que fica melhor a cada episódio.

Mas depois do segundo episódio apareceu uma coisa estranha:

<Image post="using-whisper-ai-to-learn-italian" img="hallucination-problem" alt="multiple random non-sense subtitles generated" maxHeight={322} maxWidth={700}/>

_Che cos'è !?_ Ele estava detectando esse texto estranho na abertura do episódio… Foi aí que eu aprendi sobre <Link to="https://www.ibm.com/topics/ai-hallucinations"> AI hallucinations </Link>, que basicamente é quando a AI coloca dados errados nos cálculos e comete erros.

Mas eu não fiquei muito preocupado porque a maior parte do conteúdo estava funcionando bem… certo? Esses textos esquisitos só apareciam quando não tinha voz na cena.

Até eu assistir isso:

<Image post="using-whisper-ai-to-learn-italian" img="piccolo-error" alt="DBZ scene from Piccolo with subs 'No,no,no,no,...' fullfilling half of the screen" maxHeight={445} maxWidth={700}/>

Não, não, não, não, não, não, não, não, não 😁.

Isso me fez pensar: talvez eu consiga consertar isso? Essas alucinações normalmente são as mesmas frases ou legendas repetidas.

Então eu voltei no GitHub do Whisper AI e vi a comunidade lidando com esse problema desde o lançamento do produto, no começo de 2023.

<Image post="using-whisper-ai-to-learn-italian" img="github-issues1" alt="A issue about hallucination founded at whisper-ai github" maxHeight={746} maxWidth={700}/>

<Image post="using-whisper-ai-to-learn-italian" img="github-issues2" alt="Another issue about hallucination founded at whisper-ai github" maxHeight={477} maxWidth={700}/>

Então, depois de ler algumas discussões nas issues, eu consegui fazer funcionar bem com este comando:

```bash
whisper episode.mp4 --language it -f srt --model medium --suppress_tokens "" --word_timestamps True --hallucination_silence_threshold 2
```

- --language: italiano (especifica o idioma)
- -f: srt (especifica o formato de saída)
- --model: medium (especifica o modelo de AI)
- --suppress_tokens: "" (eu não sei o que faz, mas [li que isso resolve](https://github.com/openai/whisper/discussions/928#discussioncomment-6291985))
- --word_timestamps: True (foi necessário para a próxima opção)
- --hallucination_silence_threshold 2

Isso demora mais para rodar. Provavelmente por causa do modelo medium: leva quase uma hora para transcrever um episódio de 23 minutos.

Mas eu ainda estava com dois problemas:

<Image post="using-whisper-ai-to-learn-italian" img="musica-error" alt="error at terminal showing multiple subtitles as '[musica]'" maxHeight={962} maxWidth={620}/>

<Image post="using-whisper-ai-to-learn-italian" img="repeated-strings-error" alt="error at terminal showing repeated subtitles" maxHeight={326} maxWidth={700}/>

_Mannaggia_… Legendas repetidas e esse indicador de [ambient sound].

Eu adicionei uma opção específica no comando para evitar episódios inteiros com a mesma legenda repetida: `--condition_on_previous_text` como False. Ele vem como True por padrão, mas parece que quando ele pega várias legendas repetidas (como '[musica]' no meu caso), ele pode entrar em loop e preencher tudo com aquilo.

Mas eu ainda não queria esses indicadores de som. Então eu pensei: ok 😪, eu não vou escapar de formatar as legendas. Aí eu pedi para o ChatGPT gerar scripts em Python para lidar com isso.

Aqui estão os prompts que eu usei e o resultado:

- escreva um script em python para ler um arquivo srt e remover as legendas com a string "[Musica]"
- agora eu preciso que essa função leia uma lista de arquivos (que pode ter só 1 arquivo) e faça a mesma coisa
- agora, em vez de só remover a string '[Musica]', ele deve ler um arquivo python de "blacklist strings" e tratar cada linha como uma string para ser removida das legendas
- existe alguma forma de os arquivos de entrada serem todos os arquivos dentro de uma pasta "input"?
- agora adicione logs dentro das funções para reportar o que o código está fazendo
- dá para salvar os arquivos de saída em uma pasta "output"?
- agora adicione uma funcionalidade para detectar quando as legendas são repetidas e unificar elas em apenas uma

<Image post="using-whisper-ai-to-learn-italian" img="gpt-python-code" alt="printscreen of VS Code with GPT generated code" maxHeight={384} maxWidth={700}/>

No fim, eu joguei tudo em um <Link to="https://github.com/httpassoca/srtFormatter"> repositório no GitHub </Link> para uso pessoal, mas ele é público. Enfim, este é o código principal:

```python
import os
import glob
import logging
from blacklist_strings import BLACKLIST_STRINGS

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def remove_blacklisted_subtitles(input_directory, output_directory):
    def process_file(input_file, output_file):
        logging.info(f'Start processing file: {input_file}')
        with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
            subtitle_block = []
            last_text = None
            last_block_start = None
            skip_block = False

            for line in infile:
                if line.strip().isdigit():
                    if not skip_block and subtitle_block:
                        if last_text is not None and subtitle_block[-1].strip() == last_text:
                            # Modify the time range of the last block instead of writing a new one
                            modified_block = subtitle_block[:-1] + [last_block_start + ' --> ' + subtitle_block[1].split(' --> ')[1]] + subtitle_block[-1:]
                            outfile.write(''.join(modified_block) + '\n')
                        else:
                            outfile.write(''.join(subtitle_block) + '\n')

                    subtitle_block = [line]
                    skip_block = False
                elif line.strip() and '-->' in line:
                    last_block_start = line.split(' --> ')[0]
                    subtitle_block.append(line)
                elif any(blacklist_string in line for blacklist_string in BLACKLIST_STRINGS):
                    skip_block = True
                    logging.info(f'Blacklisted string found, skipping block in file: {input_file}')
                else:
                    subtitle_block.append(line)
                    last_text = line.strip()

            if not skip_block and subtitle_block:
                outfile.write(''.join(subtitle_block))

        logging.info(f'Finished processing file: {input_file} -> {output_file}')

    # Ensure output directory exists
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
        logging.info(f'Created output directory: {output_directory}')

    # Find all SRT files in the input directory
    srt_files = glob.glob(os.path.join(input_directory, '*.srt'))

    if not srt_files:
        logging.warning(f'No SRT files found in directory: {input_directory}')
        return

    for file_path in srt_files:
        file_name = os.path.basename(file_path)
        output_file_path = os.path.join(output_directory, file_name.rsplit('.', 1)[0] + '.srt')
        process_file(file_path, output_file_path)

# Example usage
remove_blacklisted_subtitles('input', 'output')
```

Agora eu tenho meus episódios dublados e legendados em italiano 🇮🇹

<Image post="using-whisper-ai-to-learn-italian" img="whisper-working-terminal" alt="whisper-ai-generating-correct-subtitles-in-terminal" maxHeight={444} maxWidth={700}/>

<Image post="using-whisper-ai-to-learn-italian" img="goku-sei-finito" alt="DBZ scene from Goku with correct italian subtitles" maxHeight={392} maxWidth={700}/>
