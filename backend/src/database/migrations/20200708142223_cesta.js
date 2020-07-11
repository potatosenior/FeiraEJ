
exports.up = function(knex) {
    knex.schema.creatTable('Cesta',function(table){
        table.increments('Id');
        table.interger('QuantidadeProduto');

        table.interger('IdProduto_fk');
        table.foreign('IdProduto_fk').references('Id').inTable('Produto');
    }) 
};

exports.down = function(knex) {
    knex.schema.dropTable('Cesta');
};
