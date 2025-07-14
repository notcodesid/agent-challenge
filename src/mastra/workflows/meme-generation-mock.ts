import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  findBaseMemeStep,
  generateCaptionsClaudeStep,
} from './steps';
import { extractFrustrationsMockStep } from './steps/extract-frustrations-mock';
import { generateMemeMockStep } from './steps/generate-meme-mock';

export const memeGenerationMockWorkflow = createWorkflow({
  id: 'meme-generation-mock',
  description: 'Mock workflow to generate memes from workplace frustrations (no OpenAI needed)',
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
    extractFrustrationsMockStep,
    findBaseMemeStep,
    generateCaptionsClaudeStep,
    generateMemeMockStep,
  ],
});

// Build the workflow chain with data mapping
memeGenerationMockWorkflow
  .then(extractFrustrationsMockStep)
  .then(findBaseMemeStep)
  .map({
    frustrations: {
      step: extractFrustrationsMockStep,
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
  .then(generateMemeMockStep)
  .map({
    shareableUrl: {
      step: generateMemeMockStep,
      path: 'imageUrl',
    },
    pageUrl: {
      step: generateMemeMockStep,
      path: 'pageUrl',
    },
    analysis: {
      step: generateMemeMockStep,
      path: 'analysis',
    },
  })
  .commit(); 