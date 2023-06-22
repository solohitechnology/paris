import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
} from 'react-icons/fa';
import './blog.css';

const BlogCard = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [showSharingIcons, setShowSharingIcons] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/blog/blog-posts');
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleCommentSubmit = async (postId, commentData) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/blog/blog-posts/${postId}/comments`,
        { commentData }
      );
      const { newComment } = response.data;

      console.log(newComment);
      fetchBlogPosts();
      setShowCommentForm(false);
      setCurrentPostId(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleThumbUp = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/blog/blog-posts/${postId}/thumbs-up`);
      const { thumbsUpCount } = response.data;

      setBlogPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
              ...post,
              thumbsUp: post.liked ? post.thumbsUp - 1 : post.thumbsUp + 1,
              liked: !post.liked,
            }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating thumbs-up:', error);
    }
  };
  const handleThumbDown = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/blog/blog-posts/${postId}/thumbs-down`
      );
      const { thumbsDownCount } = response.data;

      setBlogPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, thumbsDown: thumbsDownCount } : post
        )
      );
    } catch (error) {
      console.error('Error updating thumbs-down:', error);
    }
  };

  const shareOnFacebook = (url) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareOnInstagram = (url) => {
    window.open(
      `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareOnTwitter = (url, text) => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareOnWhatsApp = (text) => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const handleToggleContent = (postId) => {
    setBlogPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, expanded: !post.expanded } : post
      )
    );
  };

  const handleToggleSeeLess = (postId) => {
    setBlogPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, expanded: false } : post
      )
    );
  };

  const handleCommentIconClick = (postId) => {
    setShowCommentForm(true);
    setCurrentPostId(postId);
  };

  const handleCommentFormCancel = () => {
    setShowCommentForm(false);
    setCurrentPostId(null);
  };

  const handleSharingIconClick = () => {
    setShowSharingIcons(!showSharingIcons);
  };

  return (
    <div className="parentBlog">
      <h2>Blog Posts</h2>
      {blogPosts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          {post.picture && (
            <img src={`http://localhost:4000/${post.picture.path}`} alt="Blog Post" />
          )}


          <div className="feedback-icons">
            <div className="reaction">
              <span onClick={() => handleThumbUp(post._id)}>
                <FaThumbsUp />
                <span className="feedback-count">{post.liked ? post.thumbsUp + 1 : post.thumbsUp}</span>
              </span>
              <span onClick={() => handleThumbDown(post._id)}>
                <FaThumbsDown />
                <span className="feedback-count">{post.thumbsDown}</span>
              </span>
            </div>
          </div>

          <p>{post.expanded ? post.content : post.content.substring(0, 60)}</p>
          {!post.expanded && post.content.length > 4 && (
            <button style={{ color: 'whitesmoke' }} onClick={() => handleToggleContent(post._id)}>
              See More
            </button>
          )}
          {post.expanded && (
            <div>
              <p>{post.content}</p>
              <button style={{ color: 'whitesmoke' }} onClick={() => handleToggleSeeLess(post._id)}>
                See Less
              </button>
            </div>
          )}

          <div className="share-icons">
            <div className='parentIcon'>
              <span onClick={handleSharingIconClick}>
                {showSharingIcons ? (

                  <span>Share</span>
                ) : (
                  <>
                    <span onClick={() => shareOnFacebook(window.location.href)}>
                      <FaFacebook />
                    </span>
                    <span onClick={() => shareOnInstagram(window.location.href)}>
                      <FaInstagram />
                    </span>
                    <span onClick={() => shareOnTwitter(window.location.href, post.title)}>
                      <FaTwitter />
                    </span>
                    <span onClick={() => shareOnWhatsApp(`${post.title}: ${window.location.href}`)}>
                      <FaWhatsapp />
                    </span>
                  </>
                )}
              </span>
              <span onClick={() => handleCommentIconClick(post._id)}>
                <FaComment />
              </span>
            </div>
          </div>

          <div className='comments' >

            <p> Comments</p>
            {post.comments &&
              post.comments.map((comment) => (
                <div key={comment._id}>
                  <p>{comment.content}</p>
                  <p>{comment.author}</p>
                </div>
              ))}
          </div>

          {showCommentForm && currentPostId === post._id && (
            <div className="comment-form">
              <h4>Leave a Comment</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const commentData = {
                    content: e.target.content.value,
                    author: e.target.author.value,
                  };
                  handleCommentSubmit(post._id, commentData);
                }}
              >
                <label>
                  Content:
                  <textarea name="content" rows="3" required />
                </label>
                <label>
                  Author:
                  <input type="text" name="author" required />
                </label>
                <div>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleCommentFormCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
