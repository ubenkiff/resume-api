import { handleUpload } from '@vercel/blob/client';
import { Request, Response } from 'express';

export async function handleUploadRequest(req: Request, res: Response) {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req as any,
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    res.status(200).json(jsonResponse);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}