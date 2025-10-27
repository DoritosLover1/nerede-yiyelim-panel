import { signOut } from "firebase/auth";
import theme from "./theme.js";
import "./CustomButtons.css";
import adminjpg from "./images/admin.jpg";
import { MdAddCircle } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiExit } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { collection, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "./Firebase.js";
import { useEffect } from "react";
import { getDocs, doc, updateDoc } from "firebase/firestore";

function AdminPage({ auth }) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const renderMainContent = () => {
    if (activePage === "add") {
      return <AddPostSection />;
    } else if (activePage === "edit") {
      return <EditPostSection />;
    } else if (activePage === "delete") {
      return <DeletePostSection />;
    } else {
      return <AddPostSection />;
    }
  };

  return (
    <>
      <div className="d-flex" style={{ fontFamily: 'Work Sans, sans-serif' }}>
        <aside className="bg-white border-end position-fixed top-0 start-0 vh-100 d-flex flex-column p-4 mx-2 mt-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-3 mb-4 px-2">
              <img 
                src={adminjpg}
                alt="Where to Eat Logo" 
                className="rounded-circle"
                style={{width: '50px', height: '50px', objectFit: 'cover'}}
              />
              <div>
                <h5 className="mb-0 fw-semibold">Where to Eat?</h5>
                <small className="text-muted">Administrator Panel</small>
              </div>
            </div>
            
            <nav className="mt-4">
              <div className="d-flex align-items-center gap-3 text-decoration-none fw-bold">
                <button
                  onClick={() => setActivePage("add")}
                  id="custom-buttons"
                  className="fs-6 pt-3 border-0 rounded-2 p-3 fw-bold"
                  style={{fontFamily: theme.fonts.primary,
                    backgroundColor: theme.colors.primary,
                    color: "white",
                  }}
                >
                  <MdAddCircle className="mx-2" size={"30px"}/>Add a Post
                </button>
              </div>
              <div className="d-flex align-items-center gap-3 text-decoration-none rounded mt-3">
                <button
                  id="custom-buttons"
                  onClick={() => setActivePage("edit")}
                  className="fs-6 pt-3 border-0 rounded-2 p-3 fw-bold"
                  style={{fontFamily: theme.fonts.primary,
                    backgroundColor: theme.colors.primary,
                    color: "white",
                  }}
                >
                  <FaRegEdit className="mx-2" size={"30px"}/>Edit a Post
                </button>
              </div>
              <div className="d-flex align-items-center gap-3 text-decoration-none rounded mt-3">
                <button
                  onClick={() => setActivePage("delete")}
                  id="custom-buttons"
                  className="fs-6 pt-3 border-0 rounded-2 p-3 fw-bold"
                  style={{fontFamily: theme.fonts.primary,
                    backgroundColor: theme.colors.primary,
                    color: "white",
                  }}
                >
                  <AiOutlineDelete className="mx-2" size={"30px"}/>Delete a Post
                </button>
              </div>
            </nav>
          </div>
          
          <div className="mt-auto">
            <button
              onClick={() => handleLogout()}
              id="custom-buttons"
              style={{
                color: "white",
                fontFamily: theme.fonts.primary,
              }}
              className="btn btn-danger d-flex align-items-center border-0 p-3 rounded-2 fw-bold"
            >
              <BiExit className="mx-2" size={"30px"}/>Log Out
            </button>
          </div>
        </aside>
        <main className="flex-grow-1" style={{ marginLeft: '280px' }}>
          <div className="p-4 p-md-5" style={{ backgroundColor: '#f8f7f6', minHeight: 'calc(100vh - 70px)' }}>
            {renderMainContent()}
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminPage;


function DashboardSection() {
  return (
    <>
      <div className="mb-5">
        <h1
          style={{fontFamily: theme.fonts.primary}}
          className="display-5 fw-bold mb-3 text-center">Welcome, Admin!</h1>
        <p 
          style={{fontFamily: theme.fonts.secondary}}
          className="text-muted lead text-center">You can manage your posts from here. Use the menu on the left to get started.</p>
      </div>
    </>
  );
}

function AddPostSection() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [github, setGithub] = useState("");
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ type: "text", content: "" });
  const [loading, setLoading] = useState(false);

  const handleAddSection = () => {
    if (!newSection.content.trim()) return alert("Content cannot be empty!");
    setSections([...sections, newSection]);
    setNewSection({ type: "text", content: "" });
  };

  const handleDeleteSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();

    if (!title || !date || !image || !sections.length) {
      return alert("Please fill in all required fields and add at least one section!");
    }

    const newPost = {
      title,
      description,
      date,
      image,
      github,
      sections,
      createdAt: serverTimestamp()
    };

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      alert("Post successfully added! ID: " + docRef.id);
      setTitle("");
      setDate("");
      setImage("");
      setGithub("");
      setDescription("");
      setSections([]);
    } catch (err) {
      console.error("Error occurred:", err);
      alert("Error adding post!");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="fw-bold mb-4">Add New Blog Post</h2>
      <form onSubmit={handleAddPost}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Short Description</label>
          <input
            type="text"
            value={description}
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter short description..."/>  
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="text"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g: January 15, 2024"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cover Image URL</label>
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">GitHub Link</label>
          <input
            type="text"
            className="form-control"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>

        <hr className="my-4" />
        <h4 className="fw-bold mb-3">Content Sections</h4>

        <div className="border rounded p-3 mb-4 bg-light">
          <div className="mb-3">
            <label className="form-label">Section Type</label>
            <select
              className="form-select"
              value={newSection.type}
              onChange={(e) =>
                setNewSection({ ...newSection, type: e.target.value })
              }
            >
              <option value="text">Text</option>
              <option value="heading">Heading</option>
              <option value="image">Image (URL)</option>
              <option value="code">Code</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="3"
              value={newSection.content}
              onChange={(e) =>
                setNewSection({ ...newSection, content: e.target.value })
              }
              placeholder="Enter content for this section..."
            ></textarea>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddSection}
          >
            Add Section
          </button>
        </div>

        {sections.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Added Sections:</h5>
            {sections.map((section, index) => (
              <div key={index} className="border p-3 rounded mb-2 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{section.type.toUpperCase()}</strong>
                    <p className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
                      {section.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteSection(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-success px-4 py-2 mt-3"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Post"}
        </button>
      </form>
    </>
  );
}


function EditPostSection() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "posts"));
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error loading posts:", err);
        alert("Error loading posts!");
      }
    };
    fetchPosts();
  }, []);

  const handleAddSection = () => {
    if (!selectedPost?.newSection?.content?.trim()) {
      return alert("Content cannot be empty!");
    }
    setSelectedPost({
      ...selectedPost,
      sections: [...(selectedPost.sections || []), selectedPost.newSection],
      newSection: { type: "text", content: "" },
    });
  };

  const handleDeleteSection = (index) => {
    const updated = (selectedPost.sections || []).filter((_, i) => i !== index);
    setSelectedPost({ ...selectedPost, sections: updated });
  };

  const handleSelectPost = (postId) => {
    if (!postId) {
      setSelectedPost(null);
      setSelectedPostId("");
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      alert("Post not found!");
      return;
    }

    setSelectedPost({
      title: post.title || "",
      description: post.description || "",
      date: post.date || "",
      image: post.image || "",
      github: post.github || "",
      sections: Array.isArray(post.sections) ? post.sections : [],
      newSection: { type: "text", content: "" },
    });
    setSelectedPostId(postId);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    if (!selectedPost) {
      return alert("Please select a post!");
    }

    if (!selectedPost.title?.trim() || !selectedPost.date?.trim()) {
      return alert("Title and date are required!");
    }

    if (!Array.isArray(selectedPost.sections) || selectedPost.sections.length === 0) {
      return alert("You must add at least one section!");
    }

    setLoading(true);
    try {
      const postRef = doc(db, "posts", selectedPostId);
      await updateDoc(postRef, {
        title: selectedPost.title,
        description: selectedPost.description || "",
        date: selectedPost.date,
        image: selectedPost.image || "",
        github: selectedPost.github || "",
        sections: selectedPost.sections,
      });
      alert("Post successfully updated!");

      setPosts(posts.map(p => 
        p.id === selectedPostId 
          ? { ...p, ...selectedPost }
          : p
      ));
    } catch (err) {
      console.error("Update error:", err);
      alert("Error during update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="fw-bold mb-4">Edit Post</h2>

      <div className="mb-4">
        <label className="form-label">Select Post</label>
        <select
          className="form-select"
          value={selectedPostId}
          onChange={(e) => handleSelectPost(e.target.value)}
        >
          <option value="">Select a post...</option>
          {posts.map(post => (
            <option key={post.id} value={post.id}>
              {post.title || "Untitled Post"}
            </option>
          ))}
        </select>
      </div>

      {selectedPost && (
        <form onSubmit={handleUpdatePost}>
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              value={selectedPost.title || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, title: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Short Description</label>
            <input
              type="text"
              className="form-control"
              value={selectedPost.description || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, description: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date *</label>
            <input
              type="text"
              className="form-control"
              value={selectedPost.date || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, date: e.target.value })
              }
              placeholder="e.g: January 15, 2024"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cover Image URL</label>
            <input
              type="text"
              className="form-control"
              value={selectedPost.image || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, image: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">GitHub Link</label>
            <input
              type="text"
              className="form-control"
              value={selectedPost.github || ""}
              onChange={(e) =>
                setSelectedPost({ ...selectedPost, github: e.target.value })
              }
              placeholder="https://github.com/..."
            />
          </div>

          <hr className="my-4" />
          <h4 className="fw-bold mb-3">Content Sections</h4>

          <div className="border rounded p-3 mb-4 bg-light">
            <div className="mb-3">
              <label className="form-label">Section Type</label>
              <select
                className="form-select"
                value={selectedPost.newSection?.type || "text"}
                onChange={(e) =>
                  setSelectedPost({
                    ...selectedPost,
                    newSection: {
                      ...selectedPost.newSection,
                      type: e.target.value,
                    },
                  })
                }
              >
                <option value="text">Text</option>
                <option value="heading">Heading</option>
                <option value="image">Image (URL)</option>
                <option value="code">Code</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows="3"
                value={selectedPost.newSection?.content || ""}
                onChange={(e) =>
                  setSelectedPost({
                    ...selectedPost,
                    newSection: {
                      ...selectedPost.newSection,
                      content: e.target.value,
                    },
                  })
                }
                placeholder="Enter content for this section..."
              ></textarea>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddSection}
            >
              Add Section
            </button>
          </div>

          {selectedPost.sections && selectedPost.sections.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Added Sections ({selectedPost.sections.length}):</h5>
              {selectedPost.sections.map((section, index) => (
                <div key={index} className="border p-3 rounded mb-2 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1 me-3">
                      <strong className="text-primary">{section.type?.toUpperCase() || "TEXT"}</strong>
                      <p className="mb-0 mt-1" style={{ whiteSpace: "pre-wrap" }}>
                        {section.content || "(Empty content)"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteSection(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success px-4 py-2 mt-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      )}
    </>
  );
}

function DeletePostSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter(post => post.id !== postId));
      alert("Post deleted!");
    } catch (err) {
      console.error(err);
      alert("Error during deletion!");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="fw-bold mb-4">Delete Post</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="list-group">
          {posts.map(post => (
            <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
              {post.title}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(post.id)}
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}