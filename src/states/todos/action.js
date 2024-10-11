import { hideLoading, showLoading } from "react-redux-loading-bar";
import api from "../../utils/api";
import { showErrorDialog } from "../../utils/tools";

const ActionType = {
  GET_TODOS: "GET_TODOS",
  ADD_TODO: "ADD_TODO",
  DELETE_TODO: "DELETE_TODO",
  DETAIL_TODO: "DETAIL_TODO",
  EDIT_TODO: "EDIT_TODO",
};

function getTodosActionCreator(todos) {
  return {
    type: ActionType.GET_TODOS,
    payload: {
      todos,
    },
  };
}

function addTodoActionCreator(status) {
  return {
    type: ActionType.ADD_TODO,
    payload: {
      status,
    },
  };
}

function deleteTodoActionCreator(status) {
  return {
    type: ActionType.DELETE_TODO,
    payload: {
      status,
    },
  };
}

function editTodoActionCreator(status) {
  return {
    type: ActionType.EDIT_TODO,
    payload: {
      todo,
    },
  };
}

function detailTodoActionCreator(todo) {
  return {
    type: ActionType.DETAIL_TODO,
    payload: {
      todo,
    },
  };
}

function changeCoverTodoActionCreator(todo) {
  return {
    type: ActionType.DETAIL_TODO,
    payload: {
      todo,
    },
  };
}

function asyncChangeCoverTodo({ id, cover }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const updatedTodo = await api.postChangeCoverTodo({ id, cover });
      dispatch(changeCoverTodoActionCreator(updatedTodo));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncGetTodos(is_finished) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todos = await api.getAllTodos(is_finished);
      dispatch(getTodosActionCreator(todos));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncAddTodo({ title, description }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.postAddTodo({ title, description });
      dispatch(addTodoActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncDeleteTodo(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.deleteTodo(id);
      dispatch(deleteTodoActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncEditTodo(id, title, description, is_finished) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.putUpdateTodo({ id, title, description, is_finished });

      const updatedTodo = await api.getDetailTodo(id);

      dispatch(detailTodoActionCreator(updatedTodo));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncDetailTodo(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todo = await api.getDetailTodo(id);
      dispatch(detailTodoActionCreator(todo));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export {
  ActionType,
  getTodosActionCreator,
  asyncGetTodos,
  addTodoActionCreator,
  asyncAddTodo,
  deleteTodoActionCreator,
  asyncDeleteTodo,
  editTodoActionCreator,
  asyncEditTodo,
  detailTodoActionCreator,
  asyncDetailTodo,
  changeCoverTodoActionCreator,
  asyncChangeCoverTodo,
};
