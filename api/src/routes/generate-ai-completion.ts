import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function generationIACompletionRoute(app: FastifyInstance){
  app.post('/ai/complete', async (req) => {

    const bodySchema = z.object({
      videoID: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5)
    })

    const { videoID, template, temperature } = bodySchema.parse(req.body)

    return {
      videoID, 
      template, 
      temperature,
    }
  })
}