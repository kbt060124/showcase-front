import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import 'swiper/css'
import { Box, Button, Modal, TextareaAutosize, Typography } from '@mui/material'

const Home = () => {
    const [posts, setPosts] = useState([])
    const [open, setOpen] = useState(null)
    const [comment, setComment] = useState('')
    const [likedPosts, setLikedPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await laravelAxios.get('api/posts')
                setPosts(response.data.post)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }, [])

    // Modalを開く関数
    const handleOpen = postId => setOpen(postId)

    // Modalを閉じる関数
    const handleClose = () => setOpen(null)

    const handleComment = e => {
        setComment(e.target.value)
    }

    const handleCommentAdd = async () => {
        handleClose()
        try {
            const response = await laravelAxios.post('api/comments', {
                text: comment,
                post_id: open,
            })
            console.log(response.data)
            setComment('') // Clear the comment input field after posting
            // 新しいコメントをpostsステートに追加する処理
            const updatedPosts = posts.map(post => {
                if (post.id === open) {
                    return {
                        ...post,
                        comments: [...post.comments, response.data],
                    }
                }
                return post
            })
            setPosts(updatedPosts)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLike = async postId => {
        const isLiked = likedPosts.includes(postId)
        try {
            let response
            if (isLiked) {
                // いいねを取り消す
                response = await laravelAxios.delete(
                    `/api/posts/${postId}/like`,
                )
                setLikedPosts(likedPosts.filter(id => id !== postId)) // いいね状態を更新
            } else {
                // いいねを追加する
                response = await laravelAxios.post(`/api/posts/${postId}/like`)
                setLikedPosts([...likedPosts, postId]) // いいね状態を更新
            }
            console.log(response.data)
            // 必要に応じて他のUIの状態を更新
            let updatedPosts
            if (!isLiked) {
                // いいねを追加する処理
                updatedPosts = posts.map(post =>
                    post.id === postId ? { ...post, liked: [{}] } : post,
                )
            } else {
                // いいねを取り消す処理
                updatedPosts = posts.map(post =>
                    post.id === postId ? { ...post, liked: [] } : post,
                )
            }
            setPosts(updatedPosts) // 更新された投稿の配列で状態を更新
        } catch (error) {
            console.error('Like action failed:', error)
        }
    }

    return (
        <AppLayout>
            <header className="bg-white">
                <div className="max-w-7xl mx-auto pt-2 px-4 sm:px-6 lg:px-8">
                    <div className="font-semibold text-xl text-gray-800 leading-tight">
                        <div className="flex justify-end">
                            <img
                                className="h-6 mr-auto"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/ShowcaseLogo.png`}
                                alt=""
                            />
                            <div className="flex">
                                <img
                                    className="mr-2 h-6"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/LikeGray.png`}
                                    alt="ハート"
                                />
                                <img
                                    className="h-6"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/MessageGray.png`}
                                    alt="紙飛行機"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Head>
                <title>home</title>
            </Head>
            <div className="mb-20">
                {posts.map(post => (
                    <div key={post.id}>
                        <div className="mx-5 mt-8 mb-2">
                            <Link href={`/profile/${post.user.id}`}>
                                <div className="flex items-center">
                                    <img
                                        className="w-10"
                                        style={{ borderRadius: '50%' }}
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/profile/${post.user.account.icon}`}
                                        alt="アイコン"
                                    />
                                    <div className="ml-2 font-bold">
                                        {post.user.name}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div key={post.id}>
                            <Link href={`/view/${post.id}`}>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/warehouse/${post.user_id}/thumbnail/${post.warehouse.thumbnail}`}
                                    alt="サムネイル"
                                />
                            </Link>
                            <div className="mx-5">
                                <div className="my-2 flex">
                                    <div className="flex mr-auto">
                                        {post.liked.length == 0 ? (
                                            <img
                                                className="h-6"
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/LikeGray.png`}
                                                alt="ハート"
                                                onClick={() =>
                                                    handleLike(post.id)
                                                }
                                            />
                                        ) : (
                                            <img
                                                className="h-6"
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/LikePink.png`}
                                                alt="ハート"
                                                onClick={() =>
                                                    handleLike(post.id)
                                                }
                                            />
                                        )}

                                        <img
                                            className="h-6 mx-2"
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/CommentGray.png`}
                                            alt="コメント"
                                            onClick={() => handleOpen(post.id)}
                                        />
                                        <img
                                            className="h-6"
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/MessageGray.png`}
                                            alt="紙飛行機"
                                        />
                                    </div>
                                    <img
                                        className="h-6"
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/FavoriteGray.png`}
                                        alt="ブックマーク"
                                    />
                                </div>
                                <p className="flex">
                                    Liked by
                                    <span className="mx-1 font-bold">
                                        Ryotaro ISHII
                                    </span>
                                    and
                                    <span className="ml-1 font-bold">
                                        Kaho TERADA
                                    </span>
                                </p>
                                <div>
                                    <span className="mr-1 font-bold">
                                        {post.user.name + ' '}
                                    </span>
                                    {post.text}
                                </div>
                                <div
                                    className="text-gray-300"
                                    onClick={() => handleOpen(post.id)}>
                                    view all comments
                                </div>
                                <div className="flex items-center">
                                    <p className="font-bold mr-1">
                                        Nijitoshi NAKAJIMA
                                    </p>
                                    <p className="mr-auto">
                                        Thanks for tagging
                                    </p>
                                    <img
                                        className="h-3"
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/LikeGray.png`}
                                        alt="ハート"
                                    />
                                </div>
                            </div>
                            <Modal
                                open={open === post.id}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description">
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 400,
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        p: 4,
                                    }}>
                                    <div
                                        id="modal-modal-title"
                                        className="flex justify-center">
                                        Comments
                                    </div>
                                    <Typography
                                        component="div"
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}>
                                        {post.comments &&
                                            Array.isArray(post.comments) &&
                                            post.comments.map(comment => (
                                                <div
                                                    className="mb-3"
                                                    key={comment.id}>
                                                    <div className="flex items-center">
                                                        <Link
                                                            className="mr-auto flex items-center"
                                                            href={`/profile/${post.user.id}`}>
                                                            <img
                                                                className="mr-2 w-10"
                                                                style={{
                                                                    borderRadius:
                                                                        '50%',
                                                                }}
                                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/profile/${comment.user.account.icon}`}
                                                                alt="アイコン"
                                                            />
                                                            <div className="font-bold mr-auto">
                                                                {
                                                                    comment.user
                                                                        .name
                                                                }
                                                            </div>
                                                        </Link>
                                                        <img
                                                            className="h-3"
                                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/icon/LikeGray.png`}
                                                            alt="ハート"
                                                        />
                                                    </div>
                                                    <div>{comment.text}</div>
                                                </div>
                                            ))}
                                    </Typography>
                                    <div className="mt-3 flex justify-items-center">
                                        <TextareaAutosize
                                            required
                                            minRows={1}
                                            placeholder="Add your comment"
                                            style={{ width: '100%' }}
                                            onChange={handleComment}
                                            value={comment}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleCommentAdd}>
                                            Post
                                        </Button>
                                    </div>
                                </Box>
                            </Modal>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    )
}

export default Home
