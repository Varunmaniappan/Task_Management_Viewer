import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline, Container, Paper, Typography, TextField, Button, Grid, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const initialColumns = {
  todo: {
    name: 'To Do',
    items: [],
  },
  inProgress: {
    name: 'In Progress',
    items: [],
  },
  done: {
    name: 'Done',
    items: [],
  },
};

function App() {
  const [columns, setColumns] = useState(() => {
    const savedColumns = sessionStorage.getItem('taskColumns');
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  });
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deletedTask, setDeletedTask] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('taskColumns', JSON.stringify(columns));
  }, [columns]);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const { source, destination } = result;

    if (destination.droppableId === 'dustbin') {
      const sourceColumn = columns[source.droppableId];
      const sourceItems = [...sourceColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      setDeletedTask({ item: removed, sourceColumnId: source.droppableId });
      setOpenSnackbar(true);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const addNewTask = () => {
    if (newTask.trim() !== '') {
      setColumns((prev) => ({
        ...prev,
        todo: {
          ...prev.todo,
          items: [...prev.todo.items, { id: Date.now().toString(), content: newTask }],
        },
      }));
      setNewTask('');
    }
  };

  const deleteTask = (columnId, taskId) => {
    const taskToDelete = columns[columnId].items.find((item) => item.id === taskId);
    setDeletedTask({ item: taskToDelete, sourceColumnId: columnId });
    setOpenSnackbar(true);

    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.filter((item) => item.id !== taskId),
      },
    }));
  };

  const undoDeleteTask = () => {
    if (deletedTask) {
      const { item, sourceColumnId } = deletedTask;
      setColumns((prev) => ({
        ...prev,
        [sourceColumnId]: {
          ...prev[sourceColumnId],
          items: [...prev[sourceColumnId].items, item],
        },
      }));
      setDeletedTask(null);
      setOpenSnackbar(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingTask(null);
    setIsEditDialogOpen(false);
  };

  const updateTask = () => {
    if (editingTask && editingTask.content.trim() !== '') {
      setColumns((prev) => {
        const newColumns = { ...prev };
        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId].items = newColumns[columnId].items.map((item) =>
            item.id === editingTask.id ? { ...item, content: editingTask.content } : item
          );
        });
        return newColumns;
      });
      closeEditDialog();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management Dashboard
        </Typography>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="New Task"
                variant="outlined"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addNewTask();
                  }
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" color="primary" onClick={addNewTask}>
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Grid container spacing={3}>
            {Object.entries(columns).map(([columnId, column]) => (
              <Grid item xs={12} md={4} key={columnId}>
                <Paper elevation={3} style={{ padding: '10px' }}>
                  <Typography variant="h6" gutterBottom>
                    {column.name}
                  </Typography>
                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? '#424242' : '#303030',
                          padding: 4,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                elevation={3}
                                style={{
                                  userSelect: 'none',
                                  padding: 16,
                                  margin: '0 0 8px 0',
                                  minHeight: '50px',
                                  backgroundColor: snapshot.isDragging ? '#1e1e1e' : '#2c2c2c',
                                  color: 'white',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {item.content}
                                <div>
                                  <IconButton onClick={() => openEditDialog(item)} color="primary">
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => deleteTask(columnId, item.id)}
                                    color="secondary"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Paper>
              </Grid>
            ))}
            <Droppable droppableId="dustbin">
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  elevation={3}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? '#b71c1c' : '#d32f2f',
                    color: 'white',
                    padding: 16,
                    minHeight: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  {isDragging ? 'Release to Delete' : <DeleteForeverIcon/>}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          </Grid>
        </DragDropContext>
      </Container>
      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={editingTask ? editingTask.content : ''}
            onChange={(e) => setEditingTask({ ...editingTask, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={updateTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={
          <Button color="inherit" size="small" onClick={undoDeleteTask}>
            UNDO
          </Button>
        }
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          Task deleted!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
