module.exports = {
    all: () => {
        return {
            text: `
            SELECT  
                    bk_id id
                    , bk_name name
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
                        bk_id id
                        , bk_name name
                        , bk_reg_date date
                    FROM api.books
                    WHERE books.bk_id = $1
                    ORDER BY books.bk_name DESC;
            `,
            values: []
        }
    },
    insertBook: () => {
        return {
            text: `
                INSERT INTO api.books
                    (
                        bk_name
                        , cli_id
                    )
                    VALUES ($1, $2);
            `,
            values: []
        }
    },
    updateBook: () => {
        return {
            text: `
                UPDATE api.books
                    SET bk_name=$1
                    WHERE bk_id = $2;
            `,
            values: []
        }
    },
    deleteBook: () => {
        return {
            text: `
                DELETE FROM api.books
                WHERE bk_id = $1;
            `,
            values: []
        }
    }
}