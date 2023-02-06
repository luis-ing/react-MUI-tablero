import { gql } from '@apollo/client';

const LoginUsuario = gql`
    query LoginUsuario($username: String, $password: String) {
        LoginUsuario(username: $username, password: $password) {
        code
        mng
        data
        }
    }
`;

export default LoginUsuario;