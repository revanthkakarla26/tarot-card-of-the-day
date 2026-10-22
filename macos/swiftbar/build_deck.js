#!/usr/bin/env node
// Regenerate the macOS widget's JSON copy from the canonical deck.js data.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const directory = __dirname;
const sourcePath = path.resolve(directory, "../../deck.js");
const outputPath = path.join(directory, "deck.json");
const source = fs.readFileSync(sourcePath, "utf8").replace(/^\.pragma library\s*/, "");
const cards = vm.runInNewContext(source + "\nCARDS", {});
fs.writeFileSync(outputPath, JSON.stringify(cards, null, 2) + "\n");
console.log(`Wrote ${cards.length} cards to ${outputPath}`);
