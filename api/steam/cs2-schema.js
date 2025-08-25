import { getSchema } from './_steam.js'

export default async function handler(req, res) {
  try {
    const data = await getSchema()
    res.status(200).json(data?.game || {})
  } catch (e) {
    console.error('[CS2 SCHEMA ERROR]', e.message)
    res.status(500).json({ error: 'Failed to fetch CS2 schema' })
  }
}
