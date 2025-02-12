
import { z } from "zod";

export const messageSchema = z.object({
  content: z.string()
    .min(1, "Le message ne peut pas être vide")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  receiver_id: z.string().uuid("ID de destinataire invalide").or(z.literal('assistant')),
  metadata: z.record(z.any()).optional(),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;
