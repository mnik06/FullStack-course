type TPosts = TResponse<'/api/posts/', 'get'>
type TPost = TResponse<'/api/posts/{postId}/', 'get'>
type TCreatePost = TRequestBody<'/api/posts/', 'post'>
type TUpdatePost = TRequestBody<'/api/posts/{postId}/', 'patch'>

type TPostComments = TResponse<'/api/posts/{postId}/comments/', 'get'>
type TCreatePostComment = TRequestBody<'/api/posts/{postId}/comments/', 'post'>
