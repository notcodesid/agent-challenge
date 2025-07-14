import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { frustrationsSchema } from '../schemas';

export const extractFrustrationsClaudeStep = createStep({
  id: 'extract-frustrations-claude',
  description: 'Extract and categorize user frustrations from raw input using Claude',
  inputSchema: z.object({
    userInput: z.string().describe('Raw user input about work frustrations'),
  }),
  outputSchema: frustrationsSchema.extend({
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log('🔍 Analyzing your workplace frustrations with Claude...');

      const result = await generateObject({
        model: anthropic('claude-3-haiku-20240307'), // Free tier model
        schema: frustrationsSchema,
        prompt: `
          Analyze this workplace frustration and extract structured information:
          
          "${inputData.userInput}"
          
          Extract:
          - Individual frustrations with categories (meetings, processes, technology, communication, management, workload, other)
          - Overall mood (frustrated, annoyed, overwhelmed, tired, angry, sarcastic)
          - Keywords for each frustration
          - Suggested meme style
          
          Keep analysis concise and focused.
        `,
      });

      const frustrations = result.object;

      console.log(
        `✅ Found ${frustrations.frustrations.length} frustrations, mood: ${frustrations.overallMood}`,
      );

      return {
        ...frustrations,
        analysis: {
          message: `Claude analyzed your frustrations - main issue: ${frustrations.frustrations[0]?.category} (${frustrations.overallMood} mood)`,
        },
      };
    } catch (error) {
      console.error('Error extracting frustrations with Claude:', error);
      throw new Error('Failed to analyze frustrations with Claude');
    }
  },
}); 