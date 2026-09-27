import { getAuth } from 'firebase/auth'
import FirebaseApp from './FirebaseApp'

const FirebaseAuth = FirebaseApp ? getAuth(FirebaseApp) : null

export default FirebaseAuth

