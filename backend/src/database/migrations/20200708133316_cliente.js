
exports.up = function(knex) {
  knex.schema.creatTable('Cliente',function(table){
      table.string('Nome').notNullable();
      table.integer('CPF',11).notNullable().primary();
      table.string('Email').notNullable();
      table.string('Senha').notNullable();
      table.string('Endereco').notNullable();
      table.integer('Celular').notNullable();
  })
};

exports.down = function(knex) {
    knex.schema.dropTable('Cliente');
};
