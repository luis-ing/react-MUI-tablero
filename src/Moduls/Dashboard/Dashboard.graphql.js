import { gql } from '@apollo/client';

const getTablero = gql`
    query GetTablero($id_proyecto: Int!) {
        GetTablero(id_proyecto: $id_proyecto) {
            id
            descripcion
            activo
            id_proyecto
            tickets {
                id
                titulo
                contenido
                orden
                id_responsable
                id_urgencia
                id_columna_tablero
                fecha_creacion
                fecha_modificacion
            }
        }
    }
`;

const updateColumnTicket = gql`
mutation UpdateColumnTicket($data: String!) {
    updateColumnTicket(data: $data) {
        code
        mng
        data
    }
}
`;

const getProyectinfo = gql`query GetProyectinfo($id_proyecto: Int!) {
    getProyectinfo(id: $id_proyecto) {
      id
      nombre
      clave
      completado
      activo
      usuarios_id
    }
  }
  `;

export { getTablero, updateColumnTicket, getProyectinfo };