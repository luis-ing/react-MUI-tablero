import { gql } from '@apollo/client';

const GetSprint = gql`
    query GetSprint($id_proyecto: Int!) {
        getSprint(id_proyecto: $id_proyecto) {
            id
            id_proyecto
            numer_sprint
            fecha_inicio
            fecha_fin
            fecha_completado
            es_backlog
            iniciado
            completado
            activo
            tickets {
                id
                titulo
                contenido
                fecha_creacion
                id_responsable
                id_sprint
                id_urgencia
                orden
                ColumnaTablero {
                    id
                    descripcion
                }
            }
        }
    }
`;

const updateSprintTicket = gql`
    mutation updateSprintTicket($data: String!) {
        updateSprintTicket(data: $data) {
            code
            mng
            data
        }
    }
`;

const GetBacklog = gql`
query GetBacklog($id_proyecto: Int!) {
    getBacklog(id_proyecto: $id_proyecto) {
        id
        titulo
        contenido
        fecha_creacion
        fecha_modificacion
        orden
        activo
        id_creador
        id_responsable
        id_urgencia
        id_columna_tablero
        id_sprint
        ColumnaTablero {
            id
            descripcion
        }
    }
}
`;

export { GetSprint, updateSprintTicket, GetBacklog };