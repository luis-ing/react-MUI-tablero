import { gql } from '@apollo/client';

const getPermissionUser = gql`
    query Query($idUser: Int) {
        getPermissionUser(idUser: $idUser) {
            usuario_id
            activo
            herramientas_id
            herramienta {
                id
                nombre
                path
            }
        }
    }
`;

export default getPermissionUser;