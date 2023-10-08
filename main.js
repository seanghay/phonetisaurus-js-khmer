import { initialize } from 'phonetisaurus/loader.js'
import wasmUrl from 'phonetisaurus/phonetisaurus.wasm?url'
import modelUrl from './model.fst?url';
import { split } from 'split-khmer'

const $input = document.querySelector("#input")
const $output = document.querySelector("#output")

let Phonetisaurus;
let phonemizer;

(async function () {
  const [wasmBuffer, modelBuffer] = await Promise.all([
    fetch(wasmUrl).then(res => res.arrayBuffer()),
    fetch(modelUrl).then(res => res.arrayBuffer()),
  ]);
  Phonetisaurus = await initialize(wasmBuffer);
  const buffer = new Uint8Array(modelBuffer);
  Phonetisaurus.FS.writeFile("/model.fst", buffer);
  phonemizer = new Phonetisaurus.Phonemizer('/model.fst', '');
  $input.disabled = false;
  $output.disabled = false;

  $input.addEventListener("input", () => {
    const tokens = split($input.value);
    const results = []
    for (const token of tokens) {
      const phoneme = phonemizer.phoneticize(token, 10, 500, 10, false, false, 0.0)
      results.push(phoneme[0].join(" "))
    }
    console.log(results)
    $output.value = results.join(" - ")
  })
})()