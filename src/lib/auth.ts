import { auth, currentUser } from '@clerk/nextjs/server'

const ADMIN_EMAILS = [
  'nick@printguys.ca',
  'admin@printguys.ca',
]

export async function isAdmin() {
  const user = await currentUser()
  if (!user) return false
  return ADMIN_EMAILS.includes(user.emailAddresses?.[0]?.emailAddress || '')
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }
}
