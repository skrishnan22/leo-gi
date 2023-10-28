#! /usr/bin/env node
import axios from 'axios';
import * as CONSTANTS from './constants.js';
import ora from 'ora';
import chalk from 'chalk';
import { writeFile }  from 'fs/promises'
import terminalImage from 'terminal-image';
// const promptText = `A realistic and natural photo of a girl on a hill or mountain top watching the sunrise with her friend. In studio gibli style`;
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const args = yargs(hideBin(process.argv)).parse();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
  const img = await sendRequestToOpenAI({ promptText: args.p, imageSize: args?.s?.toLowerCase() });
  spinner.succeed('Your image is now ready');
  const imgUrl = img.data.data;
  for (const url of imgUrl) {
    const response = await axios.get(url.url, { responseType: 'arraybuffer' });
    console.log(await terminalImage.buffer(response.data, {width: '50%', height: '50%'}));
    await writeFile(`${args.p}.png`, response.data)
  }
}

run()
  .then(res => console.log(res))
  .catch(err => console.log(err));
