import { useState } from 'react';
import {
  EditPencil,
  TrashSolid,
  ArrowSeparateVertical
} from "iconoir-react";
import {
  Typography,
  IconButton,
  Tooltip,
  Checkbox,
  Card,
  Button,
  Dialog,

} from "@material-tailwind/react";
import { useToDoContext } from "../context/ToDoContext";
import { ToDoDialog } from "./ToDoDialog";  // Importar el diálogo
import { ToDo } from '../models/ToDo';

const TABLE_HEAD = ["", "Name", "Priority", "Due Date", "Actions"];

export function ToDoList() {
  const { todos, markAsDone, markAsUndone, deleteTodo } = useToDoContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);


  const handleEdit = (todo: ToDo) => {
    setSelectedTodo(todo);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
      setTodoToDelete(id);
      setOpenConfirmDialog(true);
  }


  return (
    <Card>
      <div className="w-full">
        <div className="mt-4 w-full overflow-hidden rounded-lg border border-surface">
          <table className="w-full">
            <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer px-2.5 py-2 text-start font-medium"
                  >
                    <Typography
                      type="small"
                      className="flex items-center justify-between gap-2 opacity-70"
                    >
                      {head}{" "}
                      {(index === 2 || index === 3) && (
                        <ArrowSeparateVertical
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="group text-sm text-black dark:text-white">
              {todos.map(({ id, done, text, priority, dueDate }, index) => (
                <tr key={id} className="border-b border-surface last:border-0">
                  <td className="p-3">
                    <Checkbox
                      checked={done}
                      onChange={() => (done ? markAsUndone(id) : markAsDone(id))}
                    >
                      <Checkbox.Indicator />
                    </Checkbox>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Typography type="small">{text}</Typography>
                    </div>
                  </td>

                  <td className="p-3">
                    <Typography type="small">{priority}</Typography>
                  </td>

                  <td className="p-3">
                    <Typography type="small">
                      {dueDate ? new Date(dueDate).toLocaleDateString() : 'No Due Date'}
                    </Typography>
                  </td>

                  <td className="p-3">
                    <Tooltip>
                      <Tooltip.Trigger
                        as={IconButton}
                        variant="ghost"
                        color="secondary"
                        onClick={() => handleEdit({ id, text, priority, done, dueDate, creationDate: new Date() })}
                      >
                        <EditPencil className="h-4 w-4 text-black dark:text-white" />
                      </Tooltip.Trigger>

                      <Tooltip.Content>
                        Edit To Do
                        <Tooltip.Arrow />
                      </Tooltip.Content>
                    </Tooltip>
                    <Tooltip>
                      <Tooltip.Trigger 
                      as={IconButton} 
                      variant="ghost" 
                      color="secondary"
                      onClick={() => handleDelete(id)}
                      >
                        <TrashSolid className="h-4 w-4 text-red-600 dark:text-white" />
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-red-600 text-white">
                        Delete To Do
                        <Tooltip.Arrow className="fill-red-600" />
                      </Tooltip.Content>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-surface-light py-4">
          <Typography type="small">Page 1 of 10</Typography>

          <div className="flex gap-2">
            <Button variant="outline" color="secondary" size="sm">
              Previous
            </Button>

            <Button variant="outline" color="secondary" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {openDialog && selectedTodo && (
        <ToDoDialog
          isEdit={true}
          todo={selectedTodo}
          onClose={() => setOpenDialog(false)}
        />
      )}

      {openConfirmDialog && todoToDelete && (
        <Dialog size="sm" open={openConfirmDialog}>
          <Dialog.Overlay>
            <Dialog.Content className="p-8">
              <Typography type="h6" className="text-center">
                Confirm Delete
              </Typography>
              <Typography className="text-center text-foreground">
                Are you sure you want to delete this To-Do?
              </Typography>
              <div className="mt-12 flex flex-col items-center text-center">
                <TrashSolid className="mb-6 h-24 w-24 text-red-600" />
                <Typography type="h6">
                  This action cannot be undone.
                </Typography>
              </div>
              <div className="mb-1 mt-8 flex items-center justify-center gap-2">
                <Dialog.DismissTrigger as={Button} variant="ghost" color="secondary" onClick={() => setOpenConfirmDialog(false)}>
                  Cancel
                </Dialog.DismissTrigger>
                <Button
                  color='error'
                  onClick={() => {
                    if (todoToDelete) {
                      deleteTodo(todoToDelete);
                      setOpenConfirmDialog(false);
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog>
      )}

    </Card>

    
  );
}