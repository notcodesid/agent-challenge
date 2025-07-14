import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { frustrationsSchema, memeTemplateSchema, captionsSchema } from '../schemas';

export const generateCaptionsClaudeStep = createStep({
  id: 'generate-captions-claude',
  description: 'Generate funny captions based on frustrations and meme template using Claude',
  inputSchema: z.object({
    frustrations: frustrationsSchema,
    baseTemplate: memeTemplateSchema,
  }),
  outputSchema: captionsSchema,
  execute: async ({ inputData }) => {
    try {
      console.log(
        `🎨 Generating captions for ${inputData.baseTemplate.name} meme with Claude...`
      );

      const mainFrustration = inputData.frustrations.frustrations[0];
      const mood = inputData.frustrations.overallMood;

      const result = await generateObject({
        model: anthropic('claude-3-haiku-20240307'), // Free tier model
        schema: captionsSchema,
        prompt: `
          Create meme captions for the "${inputData.baseTemplate.name}" meme template.
          
          User's frustration: "${mainFrustration.text}"
          Category: ${mainFrustration.category}
          Mood: ${mood}
          Meme has ${inputData.baseTemplate.box_count} text boxes
          
          Generate captions that:
          - Are funny and relatable to the specific frustration
          - Match the ${mood} mood
          - Are concise and work well in meme format
          - Are workplace-appropriate but humorous
          - Directly relate to the user's actual frustration, not generic "workplace frustration"
          
          Make it personal and specific to what they're experiencing.
        `,
      });

      console.log('✅ Claude generated captions successfully');
      return result.object;
    } catch (error) {
      console.error('Error generating captions with Claude:', error);
      throw new Error('Failed to generate captions with Claude');
    }
  },
}); 