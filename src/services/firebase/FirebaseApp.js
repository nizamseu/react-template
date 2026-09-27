import { initializeApp, getApps } from 'firebase/app'
import firebaseConfig from '@/configs/firebase.config'

const FirebaseApp = firebaseConfig?.apiKey
    ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
    : null

export default FirebaseApp

