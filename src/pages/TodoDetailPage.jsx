import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { asyncDetailTodo, asyncEditTodo } from "../states/todos/action";
import TodoDetail from "../components/TodoDetail";

function TodoDetailPage() {
  const { id } = useParams();

  const { detailTodo } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(asyncDetailTodo(id));
    }
  }, [id, dispatch]);

  const handleEditTodo = (id, title, description, is_finished) => {
    dispatch(asyncEditTodo(id, title, description, is_finished));

    Swal.fire({
      icon: "success",
      title: "Berhasil mengedit todo!",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  return (
    <section>
      <div className="container pt-1">
        {detailTodo != null ? (
          <TodoDetail todo={detailTodo} onEditTodo={handleEditTodo} />
        ) : null}
      </div>
    </section>
  );
}

export default TodoDetailPage;
