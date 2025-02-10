import { clientMetadata } from '@/utils/oAuth'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(clientMetadata)
}
