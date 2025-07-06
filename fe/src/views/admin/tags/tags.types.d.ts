type TTags = TResponse<'/api/admin/tags/', 'get'>
type TTagFilters = TRequestQuery<'/api/admin/tags/', 'get'>
type TCreateTag = TRequestBody<'/api/admin/tags/', 'post'>
type TUpdateTag = TRequestBody<'/api/admin/tags/{tagId}/', 'patch'>

type TTag = TTags[number]

