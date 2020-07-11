
exports.up = function(knex) {
    knex.schema.creatTable('Produto',function(table){
        table.increments('Id');
        table.interger('Estoque').notNullable();
        table.string('Nome').notNullable();
        table.string('Tipo').notNullable();
        table.float('Preco'),notNullable();
    })
};

exports.down = function(knex) {
  knex.schema.dropTable('Produto');
};
