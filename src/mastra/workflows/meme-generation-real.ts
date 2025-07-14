import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  findBaseMemeStep,
  extractFrustrationsClaudeStep,
  generateCaptionsClaudeStep,
  generateMemeImprovedStep,
} from './steps';

export const memeGenerationRealWorkflow = createWorkflow({
  id: 'meme-generation-real',
  description: 'Complete workflow to generate REAL memes from workplace frustrations',
  inputSchema: z.object({
    userInput: z.string().describe('Raw user input about work frustrations'),
  }),
  outputSchema: z.object({
    shareableUrl: z.string(),
    pageUrl: z.string().optional(),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  steps: [
    extractFrustrationsClaudeStep,
    findBaseMemeStep,
    generateCaptionsClaudeStep,
    generateMemeImprovedStep,
  ],
});

// Build the workflow chain with data mapping
memeGenerationRealWorkflow
  .then(extractFrustrationsClaudeStep)
  .then(findBaseMemeStep)
  .map({
    frustrations: {
      step: extractFrustrationsClaudeStep,
      path: '.',
    },
    baseTemplate: {
      step: findBaseMemeStep,
      path: 'templates.0',
    },
  })
  .then(generateCaptionsClaudeStep)
  .map({
    baseTemplate: {
      step: findBaseMemeStep,
      path: 'templates.0',
    },
    captions: {
      step: generateCaptionsClaudeStep,
      path: '.',
    },
  })
  .then(generateMemeImprovedStep)
  .map({
    shareableUrl: {
      step: generateMemeImprovedStep,
      path: 'imageUrl',
    },
    pageUrl: {
      step: generateMemeImprovedStep,
      path: 'pageUrl',
    },
    analysis: {
      step: generateMemeImprovedStep,
      path: 'analysis',
    },
  })
  .commit(); 