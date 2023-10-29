#! /usr/bin/env node
import axios from 'axios';
import * as CONSTANTS from './constants.js';
import ora from 'ora';
import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import terminalImage from 'terminal-image';
// const promptText = `A realistic and natural photo of a girl on a hill or mountain top watching the sunrise with her friend. In studio gibli style`;
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = yargs(hideBin(process.argv)).parse();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
import { generateFilename, saveFile } from './utils.js';
yargs(hideBin(process.argv));

async function sendRequestToOpenAI({ promptText, imageSize = 'm' }) {
  return axios.post(
    CONSTANTS.OPEN_AI_URL,
    {
      prompt: promptText,
      n: 1,
      size: CONSTANTS.IMAGE_SIZE_MAP[imageSize]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }
  );
}
function validateArgs() {
  if (!args.p) {
    throw new Error('Please provide a prompt');
  }
  if (args.s && !CONSTANTS.IMAGE_SIZE_MAP[args.s.toLowerCase()]) {
    throw new Error('Invalid option for size. Please use one of s,m,l');
  }
}
async function run() {
  validateArgs();
  const spinner = ora({ text: `${chalk.blue('Generating image(s)...')}`, spinner: 'runner' }).start();
  //const img = await sendRequestToOpenAI({ promptText: args.p, imageSize: args?.s?.toLowerCase() });
  const img = {
    data: {
      data: [
        {
          url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-KufWIfJ8Z4WYgGscteKUndaP/user-oJxtfzYQpXnOBkb11yHtKPyr/img-8isuZ0sDmIwzvEaUHitgCOur.png?st=2023-10-29T10%3A34%3A49Z&se=2023-10-29T12%3A34%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-28T23%3A53%3A01Z&ske=2023-10-29T23%3A53%3A01Z&sks=b&skv=2021-08-06&sig=UkdY1t%2BroEzSKvx6VwOyM8KOI2GItRAaYNtPB9Bi640%3D'
        }
      ]
    }
  };
  console.log(img.data.data);
  spinner.succeed('Your image is now ready');
  const imgUrl = img.data.data;
  for (const url of imgUrl) {
    const response = await axios.get(url.url, { responseType: 'arraybuffer' });
    console.log(await terminalImage.buffer(response.data, { width: '50%', height: '50%' }));
    const fileName = generateFilename(args.p, 'png', 60);
    if (args.save) {
      saveFile(fileName, response.data);
    }
  }
}

run()
  .then(res => console.log(res))
  .catch(err => console.log(err));
