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

export { GetSprint, updateSprintTicket };