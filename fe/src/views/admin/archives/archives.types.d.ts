type TArchives = TResponse<'/api/admin/archives/', 'get'>
type TArchive = TArchives[number]

type TArchiveFilters = TRequestQuery<'/api/admin/archives/', 'get'>
type TArchiveEntity = TArchive['entityType']

type TSoftDeletedPost = TResponse<'/api/admin/archives/soft/posts/', 'get'>[number]
type TSoftDeletedUser = TResponse<'/api/admin/archives/soft/users/', 'get'>[number]
type TSoftDeletedComment = TResponse<'/api/admin/archives/soft/comments/', 'get'>[number]

interface IUnifiedArchive extends TArchive {
  isSoft?: boolean
}
