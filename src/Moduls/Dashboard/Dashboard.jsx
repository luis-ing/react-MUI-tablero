import { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography,
    IconButton, Avatar
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import { NavLink } from 'react-router-dom';
import ResponsiveDialog from '../../Components/Dialog';
import { useQuery, useMutation } from '@apollo/client';
import { getProyectinfo, getTablero, updateColumnTicket } from './Dashboard.graphql';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Dashboard = () => {
    const [infoProyect, setInfoProyect] = useState({});
    const [tablero, setTablero] = useState([]);
    const onClickShowTicket = (a) => {
        const openDialog = true;
        console.log(a);
        return <ResponsiveDialog openDialog={openDialog} />
    }

    useQuery(getProyectinfo, {
        variables: {
            id_proyecto: 5,
        },
        onCompleted: (data) => {
            console.log('data ===> ', data.getProyectinfo);
            // setInfoProyect(data);
        }
    })

    const { loading: loa, error: err, refetch } = useQuery(getTablero, {
        variables: {
            id_proyecto: 5,
        },
        onCompleted: (data) => {
            setTablero(data.GetTablero);
        }
    });

    const [SendDataTicket, { loading, error }] = useMutation(updateColumnTicket, {
        onCompleted: (response) => {
            if (response.updateColumnTicket?.code === 1) {
                console.log(response.updateColumnTicket?.mng);
            }
        },
        onError: (errorData) => {
            console.error(errorData);
        }
    });

    const updateColumnToTicket = (contentColumnOrden1, contentColumnOrden2, idColumnOrden1, idColumnOrden2) => {
        const newOrder = [
            {
                idColumnOrigin: idColumnOrden1.id,
                task: contentColumnOrden1.map((item, index) => {
                    return {
                        idTarea: item.id,
                        orden: index + 1,
                    };
                })
            },
            contentColumnOrden2 ? {
                idColumnOrigin: idColumnOrden2.id,
                task: contentColumnOrden2.map((item, index) => {
                    return {
                        idTarea: item.id,
                        orden: index + 1,
                    };
                })
            } : ''
        ];
        SendDataTicket({ variables: { data: JSON.stringify(newOrder) } })
    }

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (parseInt(source.droppableId.replace("column", "")) !== parseInt(destination.droppableId.replace("column", ""))) {
            const sourceColumn = tablero[parseInt(source.droppableId.replace("column", ""))];
            const destColumn = tablero[parseInt(destination.droppableId.replace("column", ""))];
            const sourceItems = [...sourceColumn.tickets];
            const destItems = [...destColumn.tickets];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            updateColumnToTicket(sourceItems, destItems, sourceColumn, destColumn);
            setTablero(Object.values({
                ...tablero,
                [parseInt(source.droppableId.replace("column", ""))]: {
                    ...sourceColumn,
                    tickets: sourceItems
                },
                [parseInt(destination.droppableId.replace("column", ""))]: {
                    ...destColumn,
                    tickets: destItems
                }
            }));

        } else {
            const column = tablero[parseInt(source.droppableId.replace("column", ""))];
            const copiedItems = [...column.tickets];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            updateColumnToTicket(copiedItems, null, column, null);
            setTablero(Object.values({
                ...tablero,
                [parseInt(source.droppableId.replace("column", ""))]: {
                    ...column,
                    tickets: copiedItems
                }
            }));
        }
    };
    refetch();

    return (
        <>
            <Grid>
                <Typography variant="body2" color="text.secondary">
                    Proyecto / Nombre de proyecto
                </Typography>
                <Typography gutterBottom variant="h5" component="div" sx={{ mb: 4 }}>
                    Tablero Sprint 1
                </Typography>
            </Grid>
            <Grid container spacing={2}>
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                    {tablero && tablero.map((row, iterator) => (
                        <Grid item xs={3} key={row.id}>
                            <Card elevation={0}
                                sx={{
                                    backgroundColor: '#bdc3d01f',
                                    borderRadius: '8px',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {row.descripcion}
                                    </Typography>
                                    <Droppable droppableId={'column' + iterator}>
                                        {(droppableProvider) => (
                                            <Box
                                                {...droppableProvider.droppableProps}
                                                ref={droppableProvider.innerRef}
                                            >
                                                {row.tickets && row.tickets.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={'ticket' + item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <Card
                                                                {...provided.draggableProps}
                                                                ref={provided.innerRef}
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    mt: 1, mb: 1,
                                                                    borderRadius: '8px',
                                                                    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0), 0px 2px 2px 0px rgba(0,0,0,0), 0px 1px 5px 0px rgba(0,0,0,0)',
                                                                    '&:hover': {
                                                                        cursor: 'pointer'
                                                                    },
                                                                }}
                                                                onClick={() => onClickShowTicket(1)}
                                                            >
                                                                <CardContent>
                                                                    <Grid container>
                                                                        <Grid item xs={9}>
                                                                            {item.titulo}
                                                                        </Grid>
                                                                        <Grid item xs={3}>
                                                                            <IconButton sx={{ p: '3px', ml: 1 }}>
                                                                                <MoreHorizIcon />
                                                                            </IconButton>
                                                                        </Grid>
                                                                        <Grid item xs={9}>
                                                                            <Typography color="text.secondary">
                                                                                {item.id}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                            <IconButton sx={{ p: '3px', ml: 1 }}>
                                                                                <Avatar alt="Sin usuario" src="" sx={{ width: 24, height: 24 }} />
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                        }
                                                    </Draggable>
                                                ))}
                                                {droppableProvider.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                    }
                </DragDropContext>
            </Grid>
        </>
    )
}

export default Dashboard;