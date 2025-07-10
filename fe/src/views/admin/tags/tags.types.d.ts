type TTags = TResponse<'/api/tags/', 'get'>
type TTag = TTags[number]

type TTagFilters = TRequestQuery<'/api/admin/tags/', 'get'>
type TCreateTag = TRequestBody<'/api/admin/tags/', 'post'>
type TUpdateTag = TRequestBody<'/api/admin/tags/{tagId}/', 'patch'>

