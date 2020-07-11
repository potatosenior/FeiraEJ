
exports.up = function(knex) {
    knex.schema.creatTable('Carrinho',function(table){
        table.interger('Quantidade').notNullable();

        table.interger('CPF_fk');
        table.foreign('CPF_fk').references('CPF').inTable('Cliente');

        table.interger('IdProduto_fk');
        table.foreign('IdProduto_fk').references('Id').inTable('Produto');
    })
};

exports.down = function(knex) {
    knex.schema.dropTable('Carrinho');
  
};
