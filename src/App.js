// import React, { useState, useEffect } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Container from '@mui/material/Container';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });

// const initialColumns = {
//   todo: {
//     name: 'To Do',
//     items: [],
//   },
//   inProgress: {
//     name: 'In Progress',
//     items: [],
//   },
//   done: {
//     name: 'Done',
//     items: [],
//   },
// };

// function App() {
//   const [columns, setColumns] = useState(() => {
//     const savedColumns = sessionStorage.getItem('taskColumns');
//     return savedColumns ? JSON.parse(savedColumns) : initialColumns;
//   });

//   const [newTask, setNewTask] = useState('');

//   useEffect(() => {
//     sessionStorage.setItem('taskColumns', JSON.stringify(columns));
//   }, [columns]);

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const { source, destination } = result;

//     if (source.droppableId !== destination.droppableId) {
//       const sourceColumn = columns[source.droppableId];
//       const destColumn = columns[destination.droppableId];
//       const sourceItems = [...sourceColumn.items];
//       const destItems = [...destColumn.items];
//       const [removed] = sourceItems.splice(source.index, 1);
//       destItems.splice(destination.index, 0, removed);
//       setColumns({
//         ...columns,
//         [source.droppableId]: {
//           ...sourceColumn,
//           items: sourceItems,
//         },
//         [destination.droppableId]: {
//           ...destColumn,
//           items: destItems,
//         },
//       });
//     } else {
//       const column = columns[source.droppableId];
//       const copiedItems = [...column.items];
//       const [removed] = copiedItems.splice(source.index, 1);
//       copiedItems.splice(destination.index, 0, removed);
//       setColumns({
//         ...columns,
//         [source.droppableId]: {
//           ...column,
//           items: copiedItems,
//         },
//       });
//     }
//   };

//   const addNewTask = () => {
//     if (newTask.trim() !== '') {
//       setColumns((prev) => ({
//         ...prev,
//         todo: {
//           ...prev.todo,
//           items: [...prev.todo.items, { id: Date.now().toString(), content: newTask }],
//         },
//       }));
//       setNewTask('');
//     }
//   };

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <Container maxWidth="lg">
//         <Typography variant="h4" component="h1" gutterBottom>
//           Task Management Dashboard
//         </Typography>
//         <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={9}>
//               <TextField
//                 fullWidth
//                 label="New Task"
//                 variant="outlined"
//                 value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={3}>
//               <Button fullWidth variant="contained" color="primary" onClick={addNewTask}>
//                 Add Task
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Grid container spacing={3}>
//             {Object.entries(columns).map(([columnId, column]) => (
//               <Grid item xs={12} md={4} key={columnId}>
//                 <Paper elevation={3} style={{ padding: '10px' }}>
//                   <Typography variant="h6" gutterBottom>
//                     {column.name}
//                   </Typography>
//                   <Droppable droppableId={columnId}>
//                     {(provided, snapshot) => (
//                       <div
//                         {...provided.droppableProps}
//                         ref={provided.innerRef}
//                         style={{
//                           background: snapshot.isDraggingOver ? '#424242' : '#303030',
//                           padding: 4,
//                           minHeight: 500,
//                         }}
//                       >
//                         {column.items.map((item, index) => (
//                           <Draggable key={item.id} draggableId={item.id} index={index}>
//                             {(provided, snapshot) => (
//                               <Paper
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 elevation={3}
//                                 style={{
//                                   userSelect: 'none',
//                                   padding: 16,
//                                   margin: '0 0 8px 0',
//                                   minHeight: '50px',
//                                   backgroundColor: snapshot.isDragging ? '#1e1e1e' : '#2c2c2c',
//                                   color: 'white',
//                                   ...provided.draggableProps.style,
//                                 }}
//                               >
//                                 {item.content}
//                               </Paper>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </DragDropContext>
//       </Container>
//     </ThemeProvider>
//   );
// }

// export default App;

