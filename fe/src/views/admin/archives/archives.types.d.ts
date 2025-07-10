type TArchives = TResponse<'/api/admin/archives/', 'get'>
type TArchive = TArchives[number]

type TArchiveFilters = TRequestQuery<'/api/admin/archives/', 'get'>
type TArchiveEntity = TArchive['entityType']

