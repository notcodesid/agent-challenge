import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { memeTemplateSchema, captionsSchema } from '../schemas';

export const generateMemeImprovedStep = createStep({
  id: 'generate-meme-improved',
  description: "Create a real meme using Imgflip's API with better error handling",
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
      console.log('🎨 Creating your REAL meme image...');

      // Use environment variables if available, otherwise try defaults
      const username = process.env.IMGFLIP_USERNAME || 'imgflip_hubot';
      const password = process.env.IMGFLIP_PASSWORD || 'imgflip_hubot';

      console.log(`📝 Using account: ${username === 'imgflip_hubot' ? 'default (limited)' : 'your account'}`);
      console.log(`🖼️ Template: ${inputData.baseTemplate.name}`);
      console.log(`📱 Top text: "${inputData.captions.topText}"`);
      console.log(`📱 Bottom text: "${inputData.captions.bottomText}"`);

      const formData = new URLSearchParams();
      formData.append('template_id', inputData.baseTemplate.id);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('text0', inputData.captions.topText);
      formData.append('text1', inputData.captions.bottomText);

      const response = await fetch('https://api.imgflip.com/caption_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        console.error('❌ Imgflip API error:', result.error_message);
        
        // Provide helpful error messages
        if (result.error_message?.includes('rate limit') || result.error_message?.includes('too many requests')) {
          throw new Error(`Rate limited! The default account is overused. Get a free Imgflip account at https://imgflip.com/signup and add IMGFLIP_USERNAME and IMGFLIP_PASSWORD to your .env file for better rate limits.`);
        } else if (result.error_message?.includes('username') || result.error_message?.includes('password')) {
          throw new Error(`Authentication failed. Check your IMGFLIP_USERNAME and IMGFLIP_PASSWORD in .env file.`);
        } else {
          throw new Error(`Imgflip API error: ${result.error_message}`);
        }
      }

      console.log('✅ REAL MEME CREATED SUCCESSFULLY! 🎉');
      console.log(`🌐 Image URL: ${result.data.url}`);
      console.log(`📄 Page URL: ${result.data.page_url}`);

      const successMessage = `
🎭 **REAL MEME CREATED!**

🖼️ **Image URL**: ${result.data.url}
📄 **Page URL**: ${result.data.page_url}

**Template**: ${inputData.baseTemplate.name}
**Top Text**: "${inputData.captions.topText}"
**Bottom Text**: "${inputData.captions.bottomText}"
**Style**: ${inputData.captions.memeStyle}
**Humor Level**: ${inputData.captions.humorLevel}

🎉 **This is a REAL meme image that you can share!** Click the image URL to see your meme!
      `;

      return {
        imageUrl: result.data.url,
        pageUrl: result.data.page_url,
        captions: {
          topText: inputData.captions.topText,
          bottomText: inputData.captions.bottomText,
        },
        baseTemplate: inputData.baseTemplate.name,
        memeStyle: inputData.captions.memeStyle,
        humorLevel: inputData.captions.humorLevel,
        analysis: {
          message: successMessage,
        },
      };
    } catch (error) {
      console.error('❌ Error generating meme:', error);
      
      // Provide helpful fallback message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate meme: ${errorMessage}\n\nTip: Get a free Imgflip account at https://imgflip.com/signup for better reliability!`);
    }
  },
}); 