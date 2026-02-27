---
title: Using Whisper AI to learn Italian
slug: using-whisper-ai-to-learn-italian
date: 2024-01-2
description: "Using Whisper AI to sub italian dubbed anime episodes"
tags: [AI, Transcription, Languages]
personal: false
---

<script lang="ts">
  import Image from '$lib/components/Base/AppImage.svelte';
  import Link from '$lib/components/Base/AppLink.svelte';
</script>

One of my 2024’s goals is to learn how to speak, listen and write Italian. I already tried it once, or twice… I usually fell into the problem of losing interest on the language, I didn’t had nothing that keep the language on my life, on my routine. I already tried before to listen watch popular italian series or songs and it works well, but the proccess of consuming it becomes boring after a while, beucase either I enjoyed the work or I spent a lot of time trying to understand every detail. So to fix that, this time I decided to watch a easy thing, which I don’t need to get all details and it wouldn’t be bad to lost part of content quality. So I started to watch italian dubbed Dragon Ball Z 😁

Because I’m brazilian, I can understand italian with some level of facility, since they’re both latin (which I’m also learning 👀) laguages. But I still have a giant problem: since I don’t know the words, I can’t notice exactly when a word ends and the next starts. Probably the biggest listening challenge when you’re trying to learn a new language. So to help me with that, I decided to watch not only with italian dubbing, but subtitles also. Then I discovered the problem which bring us to this post! Is too hard to find Italian dubbed and subbed animes! At least for non italian natives.

After some research, attemps to manually subtitle the anime, choosing between dubbed or subbed content, trying to switch the anime… I thought _“there should be an open source project to subtitle media with AI”_ and searched “ai subtitles” at github:

<Image post="using-whisper-ai-to-learn-italian" img="github-search-results" alt="Github results for search 'ai subtitles'" maxHeight={754} maxWidth={604}/>

_Che bello!_ It remembered me about <Link to="https://github.com/openai/whisper"> Whisper AI </Link>. I already pay for the ChatGPT subscription, so I thought, because both came from <Link to="https://openai.com/"> Open AI </Link> I wouldn’t need to pay for this other service. But seems that Whisper AI is… free? Well, it is if you run it on your machine. The installation was pure simple, I already had Python installed so I just need to install some packages and rust tools, but it didn’t take more than 3 minutes to get it running:

<Image post="using-whisper-ai-to-learn-italian" img="wolves-music-subtitles" alt="whisper ai use in Wolves music" maxHeight={152} maxWidth={700}/>

It is pretty simple. You choose a file with audio (it can be a video), it will transpile and it can even translate to english. In my case, I wanted it to transpile italian videos (the Dragon Ball Z episodes) and export as a `.srt` file. It worked perfectly, at the beginning. It took some time, and it wasn’t 100% perfect, but it was fine for me. Most of the sentences were correct (I would say at least 95%). We can agree that anime voices aren’t as normal as daily conversations, it also have SFX, specific names, slangs, and musics along the voices. And somehow, it seems it gets better after each episode. But after the second episode something weird appeared:

<Image post="using-whisper-ai-to-learn-italian" img="hallucination-problem" alt="multiple random non-sense subtitles generated" maxHeight={322} maxWidth={700}/>

_Che cos'è !?_ It was detecting this weird text in the opening of the episode… This is what made me learn about <Link to="https://www.ibm.com/topics/ai-hallucinations"> AI hallucinations </Link>, which is basically when the AI brings some wrong data to the calculations and make mistakes. But I was not worried about it because most of the content was working fine... right?, those weird texts just appears when there was no voice in the scene. Then I watched that:

<Image post="using-whisper-ai-to-learn-italian" img="piccolo-error" alt="DBZ scene from Piccolo with subs 'No,no,no,no,...' fullfilling half of the screen" maxHeight={445} maxWidth={700}/>

No, no, no, no, no, no, no, no, no 😁. It made me think, maybe I can fix that? Those hallucinations usually are the same sentences or repeated subtitles. So I went back in the Whisper AI Github and saw the community leading with this problem since the launch of the product, in the beginning of 2023.

<Image post="using-whisper-ai-to-learn-italian" img="github-issues1" alt="A issue about hallucination founded at whisper-ai github" maxHeight={746} maxWidth={700}/>

<Image post="using-whisper-ai-to-learn-italian" img="github-issues2" alt="Another issue about hallucination founded at whisper-ai github" maxHeight={477} maxWidth={700}/>

So after reading some issues discussions I got it working fine with this prompt:

```bash
whisper episode.mp4 --language it -f srt --model medium --suppress_tokens "" --word_timestamps True --hallucination_silence_threshold 2
```

- --language: italian (specifies the language)
- -f: srt (specifies the format of output)
- --model: medium (specifies the AI model to use)
- --suppress_tokens: “” (Idk what it does but [I read this would fix](https://github.com/openai/whisper/discussions/928#discussioncomment-6291985))
- --word_timestamps: True (it was required for the next option)
- --hallucination_silence_threshold 2

That takes more time to run. Problably due the medium model, it takes almost an hour to transcript a 23 minutes episode. But I still was getting two problems:

<Image post="using-whisper-ai-to-learn-italian" img="musica-error" alt="error at terminal showing multiple subtitles as '[musica]'" maxHeight={962} maxWidth={620}/>

<Image post="using-whisper-ai-to-learn-italian" img="repeated-strings-error" alt="error at terminal showing repeated subtitles" maxHeight={326} maxWidth={700}/>

_Mannaggia_… Repeated subtitles and this [ambient sound] indicator. I added one specific option in the prompt to evict entire episodes with the same repeated subtitle, the `--condition_on_previous_text` as False. It cames True by default, but seems that when it catch some multiple repeated subtitles (like '[musica]' in my case), it can enter in a loop and fill every subtitle as that. But still, I didn't want those sound indicators. So I thought ok 😪, I can’t run of formatting the subtitles. So I ask ChatGPT for Python scripts to lead with this. Here are the prompts I used and the result:

- write a python script to read an srt file and remove the subtitles with the string "[Musica]"
- now I need you to make this function to read a list of files (that can have just 1 file) and do the same job
- now instead of just removing the '[Musica]' string, it should read a "blacklist strings" python file and threat each line as a string to be removed from the subtitles
- is there any way to the input files be all of the files inside a "input" folder ?
- now add logs inside the functions to report what the code is doing
- can the output files be saved on a "output" folder ?
- now add a functionality to detect when the subtitles are repeated and unify them in just one

<Image post="using-whisper-ai-to-learn-italian" img="gpt-python-code" alt="printscreen of VS Code with GPT generated code" maxHeight={384} maxWidth={700}/>

I ended up pushing it all in a <Link to="https://github.com/httpassoca/srtFormatter"> github repository </Link> for personal use, but its public. Anyway, this is the main code:

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

Now I have my dubbed and subbed italian episodes 🇮🇹

<Image post="using-whisper-ai-to-learn-italian" img="whisper-working-terminal" alt="whisper-ai-generating-correct-subtitles-in-terminal" maxHeight={444} maxWidth={700}/>

<Image post="using-whisper-ai-to-learn-italian" img="goku-sei-finito" alt="DBZ scene from Goku with correct italian subtitles" maxHeight={392} maxWidth={700}/>
