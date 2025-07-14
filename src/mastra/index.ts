import { Mastra } from '@mastra/core';
import { storage } from './memory';
import { memeGenerationRealWorkflow } from './workflows/meme-generation-real';
import { memeGeneratorRealAgent } from './agents/meme-generator-real';

export const mastra = new Mastra({
  storage,
  agents: {
    memeGeneratorReal: memeGeneratorRealAgent, // Chat interface that creates REAL memes
  },
  workflows: {
    'meme-generation': memeGenerationRealWorkflow, // Using REAL meme generation
  },
  telemetry: {
    enabled: true,
  },
});