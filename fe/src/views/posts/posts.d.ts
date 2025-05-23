interface IPostComment {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

interface IPost {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
  comments?: IPostComment[]
  commentsCount?: number
}

