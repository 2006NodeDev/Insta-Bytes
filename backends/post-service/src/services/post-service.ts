import { Post } from "../models/Post"
import { bucketBaseUrl } from "../daos/Cloud-Storage"
import { saveNewPost, getAllPosts, getPostById, deletePost, getPostsByUserId } from "../daos/SQL/posts-dao"
import { savePostPicture } from "../daos/Cloud-Storage/user-posts";
import { logger, errorLogger } from "../utils/loggers";
import { User } from "../models/User";
import { userServiceGetUserById } from "../remote/user-service/user-service-get-user-by-id";
import { expressEventEmitter, customExpressEvents } from "../event-listeners";

export async function getAllPostsService():Promise<Post[]>{
    return await getAllPosts()
}

export async function getPostByUserIDService(id:number):Promise<Post[]>{
    return await getPostsByUserId(id)
}

export async function getPostByIDService(id:number):Promise<Post>{
    return await getPostById(id)
}

export async function getUserByPostIDService(id:number, token:string):Promise<User>{
    return await userServiceGetUserById(id, token)
}

export async function saveNewPostService(newPost:Post):Promise<Post>{
    try{

    let base64Image = newPost.image
    let [dataType, imageBase64Data] = base64Image.split(';base64,')
    let contentType = dataType.split('/').pop()

    if(newPost.image){
        newPost.image = `${bucketBaseUrl}/posts/${newPost.userId}/${newPost.date}/new_post.${contentType}`
    }

    let savedPost = await saveNewPost(newPost)

    await savePostPicture(contentType, imageBase64Data, `posts/${newPost.userId}/${newPost.date}/new_post.${contentType}`)
    console.log("start emit")
    expressEventEmitter.emit(customExpressEvents.NEW_POST, newPost)
    console.log("finish emit")

    return savedPost
} catch(e){
    // logger.error(e)
    // errorLogger.error(e)
    logger.error(e)
    errorLogger.error(e)
    throw e
}

}

export async function deletePostService(id:number):Promise<number>{
    return await deletePost(id)
}
