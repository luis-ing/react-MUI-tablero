import { useEffect, useState } from 'react';
import {
    Box, Grid, Card, TextField, CardActions, CardContent, CardMedia, Button,
    Typography, Accordion, AccordionDetails, AccordionSummary,
    IconButton, InputAdornment, Avatar, FormControl, InputLabel, OutlinedInput
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GetSprint, updateSprintTicket } from './Planning.graphql';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Planning = () => {
    // const [sprintConfig, setSprintConfig] = useState([{ idSprint: 1, sprintText: 'Tablero Sprint 1', show: true },
    // { idSprint: 2, sprintText: 'Tablero Sprint 2', show: true }]);
    const [stateShowBacklog, setStateShowBacklog] = useState(true);
    const [dataSprint, setDataSprint] = useState([]);

    const queryGetSprint = useQuery(GetSprint, {
        variables: {
            id_proyecto: 5,
        },
        onCompleted: (data) => {
            setDataSprint(data.getSprint.map((item) => ({ ...item, 'openAccordion': true, 'showInputNewTicket': false })));
        }
    });

    useEffect(() => {
        if (dataSprint.length) {
            console.log('dataBacklog => ', dataSprint);
        }
    }, [dataSprint.length])

    const handleChange = (idSprint) => setDataSprint(dataSprint.map((row) => row.id === idSprint
        ? { ...row, openAccordion: !row.openAccordion }
        : row
    ));

    const handleChangeBacklog = () => setStateShowBacklog(!stateShowBacklog);

    const [SendDataTicket, { loading: load, error }] = useMutation(updateSprintTicket, {
        onCompleted: (response) => {
            if (response.updateColumnTicket?.code === 1) {
                console.log(response.updateColumnTicket?.mng);
            }
        },
        onError: (errorData) => {
            console.error(errorData);
        }
    });

    const updateSprintToTicket = (contentColumnOrden1, contentColumnOrden2, idColumnOrden1, idColumnOrden2) => {
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
        SendDataTicket({ variables: { data: JSON.stringify(newOrder) } });
    }

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (parseInt(source.droppableId.replace("sprint", "")) !== parseInt(destination.droppableId.replace("sprint", ""))) {
            console.log(dataSprint[parseInt(source.droppableId.replace("sprint", ""))]);
            const sourceColumn = dataSprint[parseInt(source.droppableId.replace("sprint", ""))];
            const destColumn = dataSprint[parseInt(destination.droppableId.replace("sprint", ""))];
            const sourceItems = [...sourceColumn.tickets];
            const destItems = [...destColumn.tickets];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            console.log(dataSprint);
            console.log(Object.values({
                ...dataSprint,
                [parseInt(source.droppableId.replace("sprint", ""))]: {
                    ...sourceColumn,
                    tickets: sourceItems
                },
                [parseInt(destination.droppableId.replace("sprint", ""))]: {
                    ...destColumn,
                    tickets: destItems
                }
            }));
            updateSprintToTicket(sourceItems, destItems, sourceColumn, destColumn);
            setDataSprint(Object.values({
                ...dataSprint,
                [parseInt(source.droppableId.replace("sprint", ""))]: {
                    ...sourceColumn,
                    tickets: sourceItems
                },
                [parseInt(destination.droppableId.replace("sprint", ""))]: {
                    ...destColumn,
                    tickets: destItems
                }
            }));

        } else {
            const column = dataSprint[parseInt(source.droppableId.replace("sprint", ""))];
            const copiedItems = [...column.tickets];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            updateSprintToTicket(copiedItems, null, column, null);
            setDataSprint(Object.values({
                ...dataSprint,
                [parseInt(source.droppableId.replace("sprint", ""))]: {
                    ...column,
                    tickets: copiedItems
                }
            }));
        }
    };

    queryGetSprint.refetch();

    const handleCreateSprint = () => {
        console.log('Hola', dataSprint);

    }

    const handleCreateTicket = (idSprint) => {
        console.log('idSprint ', idSprint);
        setDataSprint(dataSprint.map((row) => row.id === idSprint
            ? { ...row, showInputNewTicket: true }
            : row
        ));
    }

    const handleHideNewTicket = (idSprint) => {
        setDataSprint(dataSprint.map((row) => row.id === idSprint
            ? { ...row, showInputNewTicket: false }
            : row
        ))
    }

    return (
        <>
            <Card elevation={0} sx={{ borderRadius: '8px' }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Proyecto / Nombre de proyecto
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        Backlog
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                    <Grid pt={1} pb={2}
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Button variant="outlined" size="small" onClick={handleCreateSprint}>Crear sprint</Button>
                    </Grid>

                    <div>
                        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                            {
                                dataSprint && dataSprint.map((item, iterator) => (
                                    <Accordion
                                        key={item.id}
                                        expanded={item.openAccordion}
                                        onChange={(e) => handleChange(item.id)}
                                        sx={{ backgroundColor: '#bdc3d01f', borderRadius: '8px !important' }}
                                        elevation={0}
                                    >
                                        {item.es_backlog === 0 ? (
                                            <Grid container spacing={0}>
                                                <Grid item xs={9}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"

                                                    >
                                                        <Typography sx={{ flexShrink: 0 }}>
                                                            {`Tablero Sprint ${item.numer_sprint}`}
                                                        </Typography>
                                                        <Typography sx={{ width: '100%', textAlign: 'end', color: 'text.secondary' }}>
                                                            {`${moment(item.fecha_inicio)
                                                                .format('DD MMM')} – ${moment(item.fecha_fin)
                                                                    .format('DD MMM')} (${item.tickets.length} issue)`}
                                                        </Typography>
                                                    </AccordionSummary>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={3}
                                                    pt={!item.openAccordion ? 1 : 2}
                                                    pr={2}
                                                    container
                                                    direction="row"
                                                    justifyContent="flex-end"
                                                >
                                                    <Grid item>
                                                        {
                                                            item.iniciado && !item.completado ?
                                                                (
                                                                    <Button variant="outlined" size="small" sx={{ mr: '3px' }}>Completar sprint</Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        sx={{ mr: '3px' }}
                                                                        disabled={item?.tickets?.length ? false : true}
                                                                    >
                                                                        Iniciar sprint
                                                                    </Button>
                                                                )
                                                        }
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ minWidth: '40px' }}
                                                        >
                                                            <MoreHorizIcon />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel2a-content"
                                                id="panel2a-header"
                                            >
                                                <Typography sx={{ width: '10%', flexShrink: 0 }}>Backlog</Typography>
                                                <Typography sx={{ width: '75%', color: 'text.secondary' }}>
                                                    (0 issue)
                                                </Typography>
                                            </AccordionSummary>
                                        )}
                                        <Droppable droppableId={'sprint' + iterator}>
                                            {(droppableProvider) => (
                                                <AccordionDetails
                                                    {...droppableProvider.droppableProps}
                                                    ref={droppableProvider.innerRef}
                                                >
                                                    {item?.tickets?.length ? item.tickets.map((row, index) => (
                                                        <Draggable key={row.id} draggableId={'ticket' + row.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <Card elevation={2}
                                                                    {...provided.draggableProps}
                                                                    ref={provided.innerRef}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        mt: 1, mb: 1,
                                                                        borderRadius: '8px',
                                                                        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0), 0px 2px 2px 0px rgba(0,0,0,0), 0px 1px 5px 0px rgba(0,0,0,0)',
                                                                        '&:hover': {
                                                                            cursor: 'pointer',
                                                                        },
                                                                    }}
                                                                >
                                                                    <CardContent sx={{ display: 'flex' }}>
                                                                        <Box sx={{ width: '65%', flexShrink: 0 }}>
                                                                            <Typography>Project 1 {row.titulo} </Typography>
                                                                        </Box>
                                                                        <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                                                            <Typography sx={{ color: 'text.secondary' }}>
                                                                                {row.ColumnaTablero.descripcion}
                                                                            </Typography>
                                                                            <IconButton sx={{ p: 0, ml: 1 }}>
                                                                                <Avatar alt="Sin usuario" src="" sx={{ width: 24, height: 24 }} />
                                                                            </IconButton>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            )}
                                                        </Draggable>
                                                    )) :
                                                        !item.es_backlog ? (
                                                            < Box
                                                                pt={3} pb={2}
                                                                sx={{ border: 'dashed 2px rgb(145 145 145 / 58%)', borderRadius: '8px', }}
                                                            >
                                                                <Typography sx={{ color: 'text.secondary', textAlign: 'center' }} variant="caption" display="block" gutterBottom>
                                                                    Planifica un sprint arrastrando el pie de página de sprint debajo de las incidencias correspondientes o arrastrando las incidencias hasta aquí.
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Box pt={3} pb={2} sx={{ border: 'dashed 2px rgb(145 145 145 / 58%)', borderRadius: '8px', }}>
                                                                <Typography sx={{ color: 'text.secondary', textAlign: 'center' }} variant="caption" display="block" gutterBottom>
                                                                    Tu backlog está vacío.
                                                                </Typography>
                                                            </Box>
                                                        )
                                                    }
                                                    {droppableProvider.placeholder}
                                                    <Card
                                                        elevation={2}
                                                        sx={{
                                                            backgroundColor: '#9695951a',
                                                            borderRadius: '8px',
                                                            backgroundImage: 'linear-gradient(rgb(255 255 255 / 0%), rgb(255 255 255 / 0%));',
                                                            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0), 0px 2px 2px 0px rgba(0,0,0,0), 0px 1px 5px 0px rgba(0,0,0,0)',
                                                            mt: 1, mb: 1,
                                                            '&:hover': {
                                                                cursor: 'pointer',
                                                                backgroundColor: '#96959530',
                                                            },
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{
                                                                display: 'flex',
                                                                padding: '10px !important',
                                                                // paddingBottom: '16px !important'
                                                            }}
                                                        >
                                                            {!item.showInputNewTicket ? (
                                                                <Box
                                                                    sx={{
                                                                        flexShrink: 0, display: 'flex',
                                                                        width: '100%', padding: '9px'
                                                                    }}
                                                                    onClick={() => handleCreateTicket(item.id)}
                                                                >
                                                                    <AddIcon />
                                                                    <Typography>Crear incidencia </Typography>
                                                                </Box>
                                                            ) : (
                                                                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                                                    <InputLabel htmlFor="new-ticket">¿Que se debe hacer?</InputLabel>
                                                                    <OutlinedInput
                                                                        id="new-ticket"
                                                                        type="text"
                                                                        endAdornment={
                                                                            <InputAdornment position="end">
                                                                                <IconButton
                                                                                    onClick={() => handleHideNewTicket(item.id)}
                                                                                    edge="end"
                                                                                >
                                                                                    <CloseIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        }
                                                                        label="¿Que se debe hacer?"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </AccordionDetails>
                                            )}
                                        </Droppable>
                                    </Accordion>
                                ))
                            }
                            {/* <Accordion
                                key={0}
                                expanded={stateShowBacklog}
                                onChange={() => handleChangeBacklog()}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography sx={{ width: '10%', flexShrink: 0 }}>Backlog</Typography>
                                    <Typography sx={{ width: '75%', color: 'text.secondary' }}>
                                        (0 issue)
                                    </Typography>
                                </AccordionSummary>
                                <Droppable droppableId={'sprint2'}>
                                    {(droppableProvider) => (
                                        <AccordionDetails
                                            {...droppableProvider.droppableProps}
                                            ref={droppableProvider.innerRef}
                                        >
                                            {dataBacklog ? dataBacklog.map((row, index) => (
                                                <Draggable key={row.id} draggableId={'ticket' + row.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Card elevation={2}
                                                            {...provided.draggableProps}
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            sx={{
                                                                mt: 1, mb: 1,
                                                                '&:hover': {
                                                                    cursor: 'pointer'
                                                                },
                                                            }}
                                                        >
                                                            <CardContent sx={{ display: 'flex' }}>
                                                                <Box sx={{ width: '65%', flexShrink: 0 }}>
                                                                    <Typography>Project 1 {row.titulo} </Typography>
                                                                </Box>
                                                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <Typography sx={{ color: 'text.secondary' }}>
                                                                        {row.ColumnaTablero.descripcion}
                                                                    </Typography>
                                                                    <IconButton sx={{ p: 0, ml: 1 }}>
                                                                        <Avatar alt="Sin usuario" src="" sx={{ width: 24, height: 24 }} />
                                                                    </IconButton>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            )) : (
                                                <Box pt={3} pb={2} sx={{ border: 'dashed 2px rgb(145 145 145 / 58%)' }}>
                                                    <Typography sx={{ color: 'text.secondary', textAlign: 'center' }} variant="caption" display="block" gutterBottom>
                                                        Tu backlog está vacío.
                                                    </Typography>
                                                </Box>
                                            )}
                                            {droppableProvider.placeholder}
                                        </AccordionDetails>
                                    )}
                                </Droppable>
                            </Accordion> */}
                        </DragDropContext>
                        {/* <DragDropContext onDragEnd={(result) => onDragEnd(result)}> */}
                        {/* </DragDropContext> */}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Planning;