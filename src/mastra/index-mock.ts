import { Mastra } from '@mastra/core';
import { storage } from './memory';
import { memeGenerationMockWorkflow } from './workflows/meme-generation-mock';

export const mastra = new Mastra({
  storage,
  agents: {
    // Note: Mock agent removed for now since it needs proper model setup
    // memeGeneratorMock: memeGeneratorMockAgent,
  },
  workflows: {
    'meme-generation-mock': memeGenerationMockWorkflow,
  },
  telemetry: {
    enabled: true,
  },
}); 