const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "signin.html";
}

async function loadBlogs() {
  try {
    const response = await fetch("/allBlogs");
    const blogs = await response.json();
    displayBlogs(blogs);
  } catch (error) {
    console.error(error);
    alert("Error loading blogs");
  }
}

loadBlogs();

function displayBlogs(blogs) {
  const container = document.getElementById("blogsContainer");
  container.innerHTML = "";

  blogs.forEach((blog) => {
    const blogDiv = document.createElement("div");
    blogDiv.className = "blog-card";
    blogDiv.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.description}</p>
      <p><small>By User ${blog.userId}</small></p>
      <button onclick="editBlog(${blog.id})">Edit</button>
      <button onclick="deleteBlog(${blog.id})">Delete</button>
    `;
    container.appendChild(blogDiv);
  });
}

function deleteBlog(blogId) {
  if (!confirm("Delete this blog?")) return;

  fetch(`/deleteBlog/${blogId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadBlogs();
    })
    .catch((err) => alert("Error deleting"));
}

function editBlog(blogId) {
  const title = prompt("Enter new title");
  const description = prompt("Enter new description");

  if (!title || !description) return;

  fetch(`/updateBlog/${blogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadBlogs();
    })
    .catch((err) => alert("Error updating"));
}

const createForm = document.getElementById("createBlogForm");
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("blogTitle").value;
  const description = document.getElementById("blogDescription").value;

  try {
    const response = await fetch("/createBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();
    alert(data.message);
    createForm.reset();
    loadBlogs();
  } catch (error) {
    console.error(error);
    alert("Error creating blog");
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "signin.html";
}
