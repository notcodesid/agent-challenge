import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { memeTemplateSchema, captionsSchema } from '../schemas';

export const generateMemeMockStep = createStep({
  id: 'generate-meme-mock',
  description: "Mock version - Create a meme (no actual API call)",
  inputSchema: z.object({
    baseTemplate: memeTemplateSchema,
    captions: captionsSchema,
  }),
  outputSchema: z.object({
    imageUrl: z.string(),
    pageUrl: z.string().optional(),
    captions: z.object({
      topText: z.string(),
      bottomText: z.string(),
    }),
    baseTemplate: z.string(),
    memeStyle: z.string(),
    humorLevel: z.string(),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log('🎨 Creating your meme (Mock version)...');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create a placeholder meme image URL that shows the text
      const topText = encodeURIComponent(inputData.captions.topText);
      const bottomText = encodeURIComponent(inputData.captions.bottomText);
      
      // Use placeholder service to create a visual meme representation
      const mockImageUrl = `https://via.placeholder.com/600x400/ffffff/000000?text=${topText}%0A%0A${bottomText}`;
      
      console.log('✅ Mock meme created successfully!');
      console.log('📝 MEME PREVIEW:');
      console.log('┌─────────────────────────────────────────┐');
      console.log(`│ ${inputData.captions.topText.padEnd(39)} │`);
      console.log('│                                         │');
      console.log(`│ Template: ${inputData.baseTemplate.name.padEnd(29)} │`);
      console.log('│                                         │');
      console.log(`│ ${inputData.captions.bottomText.padEnd(39)} │`);
      console.log('└─────────────────────────────────────────┘');

      const memeDescription = `
🎭 **MEME CREATED!**

**Template:** ${inputData.baseTemplate.name}  
**Top Text:** "${inputData.captions.topText}"  
**Bottom Text:** "${inputData.captions.bottomText}"  
**Style:** ${inputData.captions.memeStyle}  
**Humor Level:** ${inputData.captions.humorLevel}  

*In a real implementation, this would be an actual meme image! The mock version shows you the structure and captions that would be used.*

**Preview:**
┌─────────────────────────────────────────┐
│ ${inputData.captions.topText.padEnd(39)} │
│                                         │
│ [${inputData.baseTemplate.name} Template]${''.padEnd(20)} │
│                                         │
│ ${inputData.captions.bottomText.padEnd(39)} │
└─────────────────────────────────────────┘
      `;

      return {
        imageUrl: mockImageUrl,
        pageUrl: `https://imgflip.com/i/mock-meme-${Date.now()}`,
        captions: {
          topText: inputData.captions.topText,
          bottomText: inputData.captions.bottomText,
        },
        baseTemplate: inputData.baseTemplate.name,
        memeStyle: inputData.captions.memeStyle,
        humorLevel: inputData.captions.humorLevel,
        analysis: {
          message: memeDescription,
        },
      };
    } catch (error) {
      console.error('Error generating mock meme:', error);
      throw new Error('Failed to generate mock meme');
    }
  },
}); 