module.exports = {
    all: () => {
        return {
            text: `
            SELECT 
                    bk_name name
                    , bk_reg_date date
                FROM api.books
                ORDER BY bk_name DESC
                LIMIT 100
            `,
            values: []
        } 
    },
    byId: () => {
        return {
            text: `
                SELECT 
                        bk_name name
                        , bk_reg_date date
                    FROM api.books
                    WHERE books.bk_id = $1
                    ORDER BY books.bk_name DESC;
            `,
            values: []
        }
    }
}