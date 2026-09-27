import { getFirestore } from 'firebase/firestore'
import FirebaseApp from './FirebaseApp'

const FirebaseDB = FirebaseApp ? getFirestore(FirebaseApp) : null

export default FirebaseDB

