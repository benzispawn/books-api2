module.exports = {
    getUserByEmail: () => {
        return {
            text: `
            SELECT 
                    cli_id
                    , cli_email
                    , cli_pass pass
                FROM api.client
                WHERE client.cli_email = $1;
            `,
            values: []
        }
    },
    insertClient: () => {
        return {
        text: `
            INSERT INTO api.client(
                cli_birth, cli_email, cli_name, cli_pass)
                VALUES ($1, $2, $3, crypt($4, gen_salt('bf')))
                RETURNING cli_id;
            `,
            values: []
        }
    },
    insertLog: () => {
        return {
            text: `
                INSERT INTO api.client_log(
                    cli_id)
                    VALUES ($1)
                    RETURNING clg_id;
            `,
            values: []
        }
    },
    getLog: () => {
        return {
        text: `
                SELECT clg_uuid_secret secret
                    , clg_uuid public
                    , clg_data_valid valid
                    FROM api.client_log
                    WHERE client_log.clg_id = $1 AND
                          client_log.clg_status = 0
            `,
            values: []
        }
    },
    updateLogInactive: () => {
        return {
            text: `
                UPDATE api.client_log
                    SET clg_status = 1
                    WHERE client_log.cli_id = $1 AND
                        client_log.clg_status = 0;
            `,
            values: []
        }
    },
    updateLogFailed: () => {
        return {
            text: `
                UPDATE api.client_log
                    SET clg_status = 100
                    WHERE client_log.clg_id = $1 AND
                        client_log.clg_status = 0;
            `,
            values: []
        }
    },
    blocked: () => {
        return {
            text: `
            SELECT 
                    CASE
                        WHEN tries._times > 2 AND 
                            clg_data_access + (30 * interval '1 minute') > current_timestamp
                            THEN 1
                        ELSE 0 END blocked
                FROM api.client_log
                    CROSS JOIN
                    (
                        SELECT 
                                COUNT(clg_id) _times
                            FROM api.client_log
                            WHERE client_log.cli_id = $1 AND
                    client_log.clg_status = 100
                    ) tries
                WHERE client_log.cli_id = $1 AND
                    client_log.clg_status = 100
                ORDER BY client_log.clg_data_access DESC
                LIMIT 1;
            `,
            values: []
        }
    }
}