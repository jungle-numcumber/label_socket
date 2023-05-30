import dotenv from 'dotenv';
import { MongoClient, UpdateResult, InsertOneResult, WithId, Collection } from 'mongodb';
import { EditorInterface } from '../interfaces/editorInterface';

dotenv.config();
const url = process.env.MONGODB_URL!;

export async function dbSearch(id: string, pdfId: string): Promise<WithId<EditorInterface> | null> {
  try {
    const conn = await MongoClient.connect(url);
    const db = conn.db('editors');
    const collection: Collection<EditorInterface> = db.collection('editor');
    const result = await collection.findOne({ id: id, pdfId: pdfId });
    await conn.close();

    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('dbSearch function has a problem.', err);
    throw err;
  }
}

export async function dbUpdate(id: string, pdfId: string, text: string): Promise<UpdateResult> {
  try {
    const conn = await MongoClient.connect(url);
    const db = conn.db('editors');
    const collection: Collection<EditorInterface> = db.collection('editor');
    const result = await collection.updateOne({ id: id, pdfId: pdfId }, { $set: { text: text } });

    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('dbUpdate function has a problem.', err);
    throw err;
  }
}

export async function dbInsert(id: string, pdfId: string, text: string): Promise<InsertOneResult<EditorInterface>> {
  try {
    const conn = await MongoClient.connect(url);
    const db = conn.db('editors');
    const collection: Collection<EditorInterface> = db.collection('editor');
    const result = collection.insertOne({ id: id, pdfId: pdfId, text: text });

    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('dbInsert function has a problem.', err);
    throw err;
  }
}
