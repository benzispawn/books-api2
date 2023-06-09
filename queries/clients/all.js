module.exports = {
    
    all: () => {
        return {
            text: `
                SELECT
                    client.cli_name name
                    , client.cli_email email
                    , client.cli_birth birth
                    FROM api.client
                    ORDER BY client.cli_name DESC
                    LIMIT 100
            `,
            values: []
        } 
    },
    byId: () => {
        return {
            text: `
                SELECT
                        client.cli_name name
                        , client.cli_email email
                        , client.cli_birth birth
                    FROM api.client
                    WHERE client.cli_id = $1
                    ORDER BY client.cli_name DESC
                    LIMIT 100
            `,
            values: []
        }
    }
}