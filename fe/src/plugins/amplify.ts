import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplifyconfiguration.json'
// CODE REVIEW - ключі до когніто мають бути в .env файлі. Це публічні ключі тому їх можна пушити в гіт
Amplify.configure(amplifyconfig)
