export function parseAtProtoUri(uri: string) {
  const [repo, collection, rkey] = uri.replace('at://', '').split('/')

  return { repo, collection, rkey }
}

export function formatAtProtoUri({
  repo,
  collection,
  rkey,
}: {
  repo: string
  collection: string
  rkey: string
}) {
  return `at://${repo}/${collection}/${rkey}`
}
