<<<<<<< HEAD
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
=======
import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { weatherAgent } from "./agents/weather-agent/weather-agent"; // This can be deleted later
import { weatherWorkflow } from "./agents/weather-agent/weather-workflow"; // This can be deleted later
import { yourAgent } from "./agents/your-agent/your-agent"; // Build your agent here

export const mastra = new Mastra({
	workflows: { weatherWorkflow }, // can be deleted later
	agents: { weatherAgent, yourAgent },
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	server: {
		port: 8080,
		timeout: 10000,
	},
});
>>>>>>> 1ed8ef35e2c5e6850154f816e7a38d421fe9aa53
