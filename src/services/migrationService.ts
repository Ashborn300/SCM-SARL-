import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const migrateFromLocalToFirebase = async (localData: any) => {
  try {
    const checkCollection = async (name: string) => {
      const q = await getDocs(collection(db, name));
      return q.empty;
    };

    const collections = ['employees', 'managers', 'sites', 'attendance', 'documents'];
    const batches = [];
    
    for (const collName of collections) {
      const isEmpty = await checkCollection(collName);
      if (isEmpty && localData[collName]) {
        console.log(`Migrating ${collName}...`);
        const batch = writeBatch(db);
        localData[collName].forEach((item: any) => {
          const docRef = doc(collection(db, collName), item.id);
          batch.set(docRef, item);
        });
        batches.push(batch.commit());
      }
    }

    if (batches.length > 0) {
      await Promise.all(batches);
      console.log('Migration complete!');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
