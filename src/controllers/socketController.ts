import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { dbSearch, dbUpdate, dbInsert } from '../model/socketModel';
import express from 'express';
import { EditorInterface } from '../interfaces/editorInterface';

export async function getSingedUrl(req: express.Request, res: express.Response): Promise<void> {
  const client = new S3Client({ region: 'ap-northeast-2' });
  const command = new PutObjectCommand({ Bucket: 'label-editor', Key: req.body.fileName, ContentType: 'image/png', ACL: 'public-read' });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  res.json({ signedUrl });
}

export async function findDefaultPage(userId: string | string[] | undefined, pdfId: string | string[] | undefined): Promise<string> {
  if (userId === undefined || pdfId === undefined || Array.isArray(userId) || Array.isArray(pdfId)) {
    return '';
  }

  const result = await dbSearch(userId, pdfId);
  let defaultPage = '';
  if (result !== null) {
    defaultPage = result['text'];
  }

  return defaultPage;
}

export async function updateEditor(value: EditorInterface): Promise<void> {
  const result = await dbSearch(value.id, value.pdfId);

  if (result === null) {
    await dbInsert(value.id, value.pdfId, value.text);
  } else {
    await dbUpdate(value.id, value.pdfId, value.text);
  }
}
