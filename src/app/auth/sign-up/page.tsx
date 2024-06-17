import type { Metadata } from 'next'
import { SignUpForm } from './sign-up-form'

export const metadata: Metadata = {
  title: 'Cadastro',
}

export default function SingInPage() {
  return <SignUpForm />
}
