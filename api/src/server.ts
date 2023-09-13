import { fastify } from 'fastify'
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';
import { createTranscriptionRoutes } from './routes/create-transcription';
import { generationIACompletionRoute } from './routes/generate-ai-completion';

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoutes)
app.register(generationIACompletionRoute)

app.listen({
  port: 3333,
}).then(() => {
  console.log('Server HTTP está funcionando 🚀');
})