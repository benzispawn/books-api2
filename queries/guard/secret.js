module.exports = {
    getLog: () => {
        return {
            text: `
                SELECT client_log.clg_uuid_secret secret
                       , client_log.cli_id client
                    FROM api.client_log 
                    WHERE client_log.clg_uuid = $1 AND
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
                    WHERE client_log.clg_uuid = $1 AND
                        client_log.clg_status = 0;
            `,
            values: []
        }
    },
}