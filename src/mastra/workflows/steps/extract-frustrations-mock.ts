import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { frustrationsSchema } from '../schemas';

export const extractFrustrationsMockStep = createStep({
  id: 'extract-frustrations-mock',
  description: 'Mock version - Extract and categorize user frustrations (no AI needed)',
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
      console.log('🔍 Analyzing your workplace frustrations (Mock version)...');

      // Simple keyword-based analysis - no AI required
      const input = inputData.userInput.toLowerCase();
      
      // Simple keyword matching for categories
      let category: 'meetings' | 'processes' | 'technology' | 'communication' | 'management' | 'workload' | 'other' = 'other';
      let mood: 'frustrated' | 'annoyed' | 'overwhelmed' | 'tired' | 'angry' | 'sarcastic' = 'frustrated';
      
      if (input.includes('meeting') || input.includes('standup') || input.includes('call')) {
        category = 'meetings';
      } else if (input.includes('process') || input.includes('deployment') || input.includes('workflow')) {
        category = 'processes';
      } else if (input.includes('code') || input.includes('bug') || input.includes('system') || input.includes('tech')) {
        category = 'technology';
      } else if (input.includes('email') || input.includes('slack') || input.includes('communicate')) {
        category = 'communication';
      } else if (input.includes('boss') || input.includes('manager') || input.includes('lead')) {
        category = 'management';
      } else if (input.includes('overtime') || input.includes('deadline') || input.includes('workload')) {
        category = 'workload';
      }

      // Simple mood detection
      if (input.includes('hate') || input.includes('terrible') || input.includes('worst')) {
        mood = 'angry';
      } else if (input.includes('tired') || input.includes('exhausted')) {
        mood = 'tired';
      } else if (input.includes('too much') || input.includes('overwhelmed')) {
        mood = 'overwhelmed';
      } else if (input.includes('annoying') || input.includes('irritating')) {
        mood = 'annoyed';
      } else if (input.includes('ridiculous') || input.includes('seriously')) {
        mood = 'sarcastic';
      }

      const mockResult = {
        frustrations: [{
          text: inputData.userInput,
          category,
          severity: 'moderate' as const,
          department: 'general' as const,
          keywords: input.split(' ').filter(word => word.length > 3).slice(0, 3)
        }],
        overallMood: mood,
                 suggestedMemeStyle: (category === 'meetings' ? 'meeting' : 
                          category === 'technology' ? 'developer' : 'corporate') as 'classic' | 'modern' | 'corporate' | 'developer' | 'meeting' | 'remote-work',
        analysis: {
          message: `Mock analysis: Found ${category} frustration with ${mood} mood`
        }
      };

      console.log(`✅ Mock analysis complete - ${category} frustration, ${mood} mood`);
      return mockResult;
    } catch (error) {
      console.error('Error in mock frustration analysis:', error);
      throw new Error('Failed to analyze frustrations');
    }
  },
}); 