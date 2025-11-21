/**
 * Index Screen - Entry Point
 * Redirige a la pantalla de login
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/auth/login" />;
}