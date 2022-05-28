import { useState } from "react";

type Filter = "all" | "completed" | "incomplete" | "removed";

type Todo = {
  title: string;
  readonly id: number;
  completed: boolean;
  removed: boolean;
};

const App = () => {
  const [text, setText] = useState("");
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const handleOnSubmit = () => {
    if (!text) return;

    const newTodo: Todo = {
      title: text,
      id: new Date().getTime(),
      completed: false,
      removed: false,
    };

    setTodoList([newTodo, ...todoList]);
    setText("");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleOnEdit = (id: number, title: string) => {
    const deepCopy = todoList.map((todo) => ({ ...todo }));

    const newTodoList = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.title = title;
      }
      return todo;
    });

    // todoList ステート配列をチェック（あとでコメントアウト）
    // console.log("=== Original todoList ===");
    // todoList.map((todo) => console.log(`id: ${todo.id}, value: ${todo.value}`));

    setTodoList(newTodoList);
  };

  const handleOnCompleted = (id: number, completed: boolean) => {
    const deepCopy = todoList.map((todo) => ({ ...todo }));

    const newTodoList = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.completed = completed;
      }
      return todo;
    });

    setTodoList(newTodoList);
  };

  const handleOnRemove = (id: number, removed: boolean) => {
    const deepCopy = todoList.map((todo) => ({ ...todo }));

    const newTodoList = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.removed = removed;
      }
      return todo;
    });

    setTodoList(newTodoList);
  };

  const filteredTodoList = todoList.filter((todo) => {
    switch (filter) {
      case "all":
        return todo;
      case "completed":
        return todo.completed && !todo.removed;
      case "incomplete":
        return !todo.completed && !todo.removed;
      case "removed":
        return todo.removed;
      default:
        return !todo.removed;
    }
  });

  const handleOnEmpty = () => {
    const newTodoList = todoList.filter((todo) => !todo.removed);
    setTodoList(newTodoList);
  };

  return (
    <div>
      <select
        defaultValue=""
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="incomplete">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {filter === "removed" ? (
        <button
          onClick={handleOnEmpty}
          disabled={todoList.filter((todo) => todo.removed).length === 0}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        filter !== "completed" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOnSubmit();
            }}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => handleOnChange(e)}
            />
            <input type="submit" value="追加" onSubmit={handleOnSubmit} />
          </form>
        )
      )}
      <ul>
        {filteredTodoList.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.completed}
                onChange={(e) => handleOnCompleted(todo.id, !todo.completed)}
              />
              <input
                type="text"
                disabled={todo.completed || todo.removed}
                value={todo.title}
                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleOnRemove(todo.id, !todo.removed)}>
                {todo.removed ? "復元" : "削除"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
