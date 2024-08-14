import { useApiRequest } from '../api/useApiRequest'

const metaRoute = '/hapi/fhir'
export const useMeta = () => {
  const { post } = useApiRequest()

  const deleteTags = async (resource, tags) => {
    const url = `${metaRoute}/${resource}/$meta-delete`
    const payload = {
      resourceType: 'Parameters',
      parameter: [
        {
          name: 'meta',
          valueMeta: {
            tag: tags,
          },
        },
      ],
    }

    return await post(url, payload)
  }

  return { deleteTags }
}
