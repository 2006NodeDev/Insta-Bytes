export interface Post{
    postId: number
    userId: number
    image:string
    caption?:string
    location?:string
    date: bigint
}
