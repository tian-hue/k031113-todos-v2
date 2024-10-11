import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { todoItemShape } from "./TodoItem";
import { postedAt } from "../utils/tools";
import { FaClock, FaPenToSquare, FaUpload } from "react-icons/fa6";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { asyncDetailTodo } from "../states/todos/action";
import { useParams } from "react-router-dom";

function TodoDetail({ todo, onEditTodo }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    todo?.description || ""
  );
  const [editedStatus, setEditedStatus] = useState(todo?.is_finished || 0);
  const [previewCover, setPreviewCover] = useState(todo?.cover || null); // Default to existing cover
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(asyncDetailTodo(id)); // Fetch the current todo details
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (todo) {
      setEditedTitle(todo.title);
      setEditedDescription(todo.description);
      setEditedStatus(todo.is_finished);
      setPreviewCover(todo.cover); // Set the existing cover if available
    }
  }, [todo]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewCover(previewURL); // Show the preview immediately
      handleCoverUpload(file); // Upload the cover
    }
  };

  const handleCoverUpload = async (file) => {
    setIsUploading(true);
    try {
      const message = await api.postChangeCoverTodo({
        id: todo.id,
        cover: file,
      });
      console.log("Cover updated:", message);
      dispatch(asyncDetailTodo(todo.id)); // Refresh the todo after upload
    } catch (error) {
      console.error("Failed to upload cover:", error.message);
    }
    setIsUploading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = () => {
    onEditTodo(todo.id, editedTitle, editedDescription, editedStatus);
    setIsEditing(false);
  };

  let badgeStatus = todo.is_finished
    ? "badge bg-success text-white ms-3"
    : "badge bg-warning text-dark ms-3";
  let badgeLabel = todo.is_finished ? "Selesai" : "Belum Selesai";

  return (
    <div className="card mt-3">
      <div className="card-body">
        {/* Cover Image */}
        <div
          style={{
            width: "100%",
            height: "300px",
            position: "relative",
            backgroundColor: "#f0f0f1",
            marginBottom: "5px",
            overflow: "hidden",
          }}
        >
          {previewCover ? (
            <img
              src={previewCover}
              alt="Cover"
              style={{
                borderRadius: "6px",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            />
          ) : (
            <p>No cover image</p>
          )}
        </div>

        {/* Todo Details */}
        <div className="row align-items-center">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0">{todo.title}</h5>
                <span className={`${badgeStatus} ms-2`}>{badgeLabel}</span>
              </div>

              <div>
                {/* Update Cover Button */}
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={handleUploadClick}
                >
                  <FaUpload /> {isUploading ? "Uploading..." : "Update Cover"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {/* "Edit" Button */}
                <button
                  type="button"
                  onClick={() => setIsEditing((prevState) => !prevState)}
                  className="btn btn-sm btn-outline-warning"
                >
                  <FaPenToSquare /> {isEditing ? "Cancel Edit" : "Edit"}
                </button>
              </div>
            </div>

            <div className="col-12">
              <div className="text-sm op-5">
                <FaClock />
                <span className="ps-2">{postedAt(todo.created_at)}</span>
              </div>
            </div>

            <hr />

            <div className="col-12 mt-3">
              {isEditing ? (
                <div>
                  <div className="mb-3">
                    <label htmlFor="editTitle" className="form-label">
                      Edit Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editTitle"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">
                      Edit Description
                    </label>
                    <textarea
                      className="form-control"
                      id="editDescription"
                      rows="3"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="editStatus" className="form-label">
                      Edit Status
                    </label>
                    <select
                      className="form-select"
                      id="editStatus"
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(Number(e.target.value))}
                    >
                      <option value={1}>Selesai</option>
                      <option value={0}>Belum Selesai</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveChanges}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>{todo.description}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TodoDetail.propTypes = {
  todo: PropTypes.shape(todoItemShape).isRequired,
  onEditTodo: PropTypes.func.isRequired,
};

export default TodoDetail;
