 // App.tsx
 import React, { useEffect, useState } from "react";
 import axios from "axios";
 import "./App.css";
 import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
 } from "@mui/material";
 import moment from "moment";

 interface Post {
  id?: number;
  content: string;
  imageUrl: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
 }

 export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Post>({
  content: "",
  imageUrl: "",
  author: "", // Initialize author as empty
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const apiUrl = "https://final-api-pf8l.onrender.com/basilio/posts";

  useEffect(() => {
  fetchPosts();
  }, []);

  const fetchPosts = async () => {
  try {
  const response = await axios.get<Post[]>(apiUrl);
  setPosts(
  response.data.sort(
  (a, b) =>
  new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  )
  );
  } catch (error) {
  console.error("Error fetching posts:", error);
  }
  };

  const handleOpenDialog = (post?: Post) => {
  if (post) {
  setSelectedPost({ ...post });
  setEditMode(true);
  } else {
  setSelectedPost({ content: "", imageUrl: "", author: "" }); // Initialize author for new post dialog
  setNewPost({ content: "", imageUrl: "", author: "" }); // Reset newPost state
  setEditMode(false);
  }
  setOpenDialog(true);
  };

  const handleCloseDialog = () => {
  setOpenDialog(false);
  setSelectedPost(null);
  };

  const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
  const { name, value } = event.target;
  setNewPost({ ...newPost, [name]: value });
  };

  const handleCreatePost = async () => {
  try {
  await axios.post(apiUrl, newPost);
  setSnackbarMessage("Post created successfully!");
  setNewPost({ content: "", imageUrl: "", author: "" }); // Reset newPost after successful creation
  fetchPosts();
  handleCloseDialog();
  } catch (error) {
  console.error("Error creating post:", error);
  setSnackbarMessage("Failed to create post.");
  }
  };

  const handleUpdatePost = async () => {
  if (selectedPost?.id) {
  try {
  await axios.put(`${apiUrl}/${selectedPost.id}`, selectedPost);
  setSnackbarMessage("Post updated successfully!");
  fetchPosts();
  handleCloseDialog();
  } catch (error) {
  console.error("Error updating post:", error);
  setSnackbarMessage("Failed to update post.");
  }
  }
  };

  const handleDeletePost = async (id: number) => {
  try {
  await axios.delete(`${apiUrl}/${id}`);
  setSnackbarMessage("Post deleted successfully!");
  fetchPosts();
  } catch (error) {
  console.error("Error deleting post:", error);
  setSnackbarMessage("Failed to delete post.");
  }
  };

  const handleEditInputChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
  const { name, value } = event.target;
  setSelectedPost((prevPost) =>
  prevPost ? { ...prevPost, [name]: value } : null
  );
  };

  return (
  <Box
  sx={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: "100vh",
  padding: (theme) => theme.spacing(2),
  bgcolor: "#f0f2f5",
  }}
  >
  <Container maxWidth="md">
  <Typography variant="h3" gutterBottom align="center" color="primary">
  News Feed
  </Typography>

  <Button
  variant="contained"
  color="primary"
  onClick={() => handleOpenDialog()}
  sx={{ marginBottom: 2, display: "block", marginX: "auto" }}
  >
  Create New Post
  </Button>

  {/* Posts Container */}
  <div className="posts-container">
  {posts.map((post) => (
  <Card key={post.id} className="post-card">
  <CardContent sx={{ paddingBottom: 0 }}>
  <Typography variant="subtitle1" fontWeight="bold" gutterBottom align="left">
  {post.author}
  </Typography>
  <Typography variant="body1" gutterBottom align="left">
  {post.content}
  </Typography>
  </CardContent>
  {post.imageUrl && (
  <CardMedia
  component="img"
  height="auto"
  image={post.imageUrl}
  alt="Post Image"
  className="post-image"
  />
  )}
  <CardContent sx={{ paddingTop: 1 }}>
  <Typography
  variant="caption"
  color="textSecondary"
  align="left"
  >
  {post.updatedAt && post.updatedAt !== post.createdAt
  ? `Post updated on ${moment(post.updatedAt).format("MMMM D, h:mm A")}`
  : `Posted on ${moment(post.createdAt).format("MMMM D, h:mm A")}`}
  </Typography>
  </CardContent>
  <CardActions sx={{ justifyContent: "space-between" }}>
  <div>
  <Button
  size="small"
  color="primary"
  onClick={() => handleOpenDialog(post)}
  >
  Edit
  </Button>
  <Button
  size="small"
  color="secondary"
  onClick={() => handleDeletePost(post.id!)}
  >
  Delete
  </Button>
  </div>
  </CardActions>
  </Card>
  ))}
  </div>

  {/* Create/Edit Post Dialog */}
  <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
  <DialogTitle align="center">{editMode ? "Edit Post" : "Create New Post"}</DialogTitle>
  <DialogContent>
  {editMode && selectedPost ? (
  <>
  <TextField
  label="Content"
  name="content"
  multiline
  rows={4}
  fullWidth
  margin="dense"
  value={selectedPost.content}
  onChange={handleEditInputChange}
  />
  <TextField
  label="Image URL"
  name="imageUrl"
  fullWidth
  margin="dense"
  value={selectedPost.imageUrl}
  onChange={handleEditInputChange}
  />
  </>
  ) : (
  <>
  <TextField
  label="Content"
  name="content"
  multiline
  rows={4}
  fullWidth
  margin="dense"
  value={newPost.content}
  onChange={handleInputChange}
  />
  <TextField
  label="Image URL"
  name="imageUrl"
  fullWidth
  margin="dense"
  value={newPost.imageUrl}
  onChange={handleInputChange}
  />
  <TextField
  label="Author"
  name="author"
  fullWidth
  margin="dense"
  value={newPost.author}
  onChange={handleInputChange}
  />
  </>
  )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center" }}>
  <Button onClick={handleCloseDialog}>Cancel</Button>
  <Button
  onClick={editMode ? handleUpdatePost : handleCreatePost}
  variant="contained"
  color="primary"
  >
  {editMode ? "Update Post" : "Post"}
  </Button>
  </DialogActions>
  </Dialog>

  <Snackbar
  open={!!snackbarMessage}
  autoHideDuration={3000}
  onClose={() => setSnackbarMessage(null)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
  <Alert
  severity={snackbarMessage?.includes("success") ? "success" : "error"}
  onClose={() => setSnackbarMessage(null)}
  >
  {snackbarMessage}
  </Alert>
  </Snackbar>
  </Container>
  </Box>
  );
 }
