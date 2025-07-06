type TPostsResponse = TResponse<'/api/posts/', 'get'>
type TPaginationMeta = TPostsResponse['meta']

type TPosts = TPostsResponse['data']
type TPost = TResponse<'/api/posts/{postId}/', 'get'>

type TCreatePost = TRequestBody<'/api/posts/', 'post'>
type TUpdatePost = TRequestBody<'/api/posts/{postId}/', 'patch'>

type TPostsSortBy = TRequestQuery<'/api/posts/', 'get'>['sortBy']

type TPostComment = TPost['comments'][number]
type TPostComments = TResponse<'/api/posts/{postId}/comments/', 'get'>
type TCreatePostComment = TRequestBody<'/api/posts/{postId}/comments/', 'post'>

